import { useStoreWithInitializer } from '../../../../../state/storeHooks';
import { ContainerPage } from '../../../../ContainerPage/ContainerPage';
import { useTranslation } from 'react-i18next';
import { checkForPermission } from '../../../../../helpers/permissions';
import { convertBackEndErrorsToValidationErrors, formatDateTime, formatSelectInput } from '../../../../../helpers/formats';
import * as yup from 'yup';
import Select from 'react-select';
import { store } from '../../../../../state/store';
import { BulkEngineerAssignErrorList, CreateAssignEngineerState, loadAssigneeDetails, loadServiceEngineers, toggleInformationModalStatus, updateErrorList, updateErrors, updateField } from './CallCordinatorTableView.slice';
import { getRegionWiseServiceEngineers } from '../../../../../services/users';
import { BulkEngineersAssign } from '../../../../../services/assignEngineer';
import { startPreloader, stopPreloader } from '../../../../Preloader/Preloader.slice';
import SweetAlert from "react-bootstrap-sweetalert";
import { getCallCordinatorServiceRequestCounts, getCallCordinatorServiceRequestList } from '../../../../../services/serviceRequest';
import { loadServiceRequestCounts, loadServiceRequests } from '../CallCordinatorManagement.slice';
import { AssignEngineerCreate } from '../CallCordinatorView/Submenu/AssignEngineer/AssignEngineerCreate/AssignEngineerCreate';
import { setServiceRequestId } from '../CallCordinatorView/Submenu/AssignEngineer/AssignEngineerCreate/AssignEngineerCreate.slice';
import { useEffect } from 'react';

export function CallCordinatorTableView() {
    const { t } = useTranslation();
    const onLoad = async () => {
        try {
            const { ServiceEngineers } = await getRegionWiseServiceEngineers();
            const filteredEngineers = await (formatSelectInput(ServiceEngineers, "FullName", "Id"))
            store.dispatch(loadServiceEngineers({ Select: filteredEngineers }));
            const ServiceRequests = await getCallCordinatorServiceRequestList("UNASSIGNED", currentPage);
            store.dispatch(loadServiceRequests(ServiceRequests));
            const serviceRequestCounts = await getCallCordinatorServiceRequestCounts("UNASSIGNED")
            store.dispatch(loadServiceRequestCounts(serviceRequestCounts));

        } catch (error) {
            return
        }
    }
    const { callcordinatormanagement: { serviceRequests, selectedStatus, currentPage }, callcordinatortableview: { EngineersList, assignengineer, errors, displayInformationModal, errorlist } } = useStoreWithInitializer(({ callcordinatormanagement, callcordinatortableview }) => ({ callcordinatormanagement, callcordinatortableview }), onLoad);

    useEffect(() => {
        serviceRequests.unwrap().length > 0 && (
            store.dispatch(loadAssigneeDetails(serviceRequests.unwrap().map(({ serviceRequest }) => ({
                AssigneeId: 0,
                StartsFrom: "",
                Remarks: null,
                ServiceRequestId: serviceRequest.Id,
                IsChecked: false
            })))))
    }, [])

    const onUpdateField = (ev: any, Id: number) => {
        var name = ev.target.name;
        var value = ev.target.value;
        store.dispatch(updateField({ name: name as keyof CreateAssignEngineerState['assignengineer'], value, Id }));
    }

    const onSelectChange = (selectedOption: any, Name: any, Id: number) => {
        var value = selectedOption.value
        var name = Name
        store.dispatch(updateField({ name: name as keyof CreateAssignEngineerState['assignengineer'], value, Id }));
    }

    const validationToAssignEngineerSchema = yup.object().shape({
        AssigneeId: yup.number().positive(('validation_error_assign_engineer_create_assignee_required') ?? 'validation_error_assign_engineer_create_assignee_required'),
        StartsFrom: yup.string().required(('validation_error_assign_engineer_create_startsfrom_required') ?? 'validation_error_assign_engineer_create_startsfrom_required'),
    });

    const onAssignEngineerSubmit = async () => {
        store.dispatch(updateErrors({}))
        store.dispatch(startPreloader());
        const assignEngineerDetails = assignengineer.filter((assignDetails) => assignDetails.IsChecked == true)
        if (assignEngineerDetails.length == 0) {
            store.dispatch(updateErrors({ "AssignWarning": t('validation_error_bulkassign_engineer_create') }))
        } else {
            try {
                const allErrors: BulkEngineerAssignErrorList[] = [];
                await Promise.all(assignEngineerDetails.map(async (assignee, index) => {
                    try {
                        await validationToAssignEngineerSchema.validate(assignee, { abortEarly: false });
                    } catch (error: any) {
                        const errors: BulkEngineerAssignErrorList = { Id: assignee.ServiceRequestId, AssigneeId: "", StartsFrom: "" };
                        error.inner.forEach((currentError: any) => {
                            switch (currentError.path) {
                                case 'AssigneeId':
                                    errors.AssigneeId = currentError.message;
                                    break;
                                case 'StartsFrom':
                                    errors.StartsFrom = currentError.message;
                                    break;
                                default:
                                    break;
                            }
                        });
                        allErrors.push(errors);
                    }
                }));
                store.dispatch(updateErrorList(allErrors));
                if (allErrors.length === 0) {
                    const result = await BulkEngineersAssign(assignEngineerDetails)
                    result.match({
                        ok: () => {
                            store.dispatch(toggleInformationModalStatus());
                        },
                        err: (e) => {
                            const formattedErrors = convertBackEndErrorsToValidationErrors(e)
                            store.dispatch(updateErrors(formattedErrors))
                        },
                    });
                }
            } catch (error: any) {
                return;
            }
        }
        store.dispatch(stopPreloader());
    }

    function getErrorForFieldId(fieldId: number, fieldName: string): string | undefined {
        const errorItem = errorlist.find(item => item.Id == fieldId);
        if (errorItem) {
            return errorItem[fieldName];
        }
        return undefined;
    }

    const toggleRowSelection = (event: React.ChangeEvent<HTMLInputElement>, Id: number) => {
        const { checked, name } = event.target;
        store.dispatch(updateField({ name: name as keyof CreateAssignEngineerState['assignengineer'], value: checked, Id }));
    };

    const InformationModal = () => {
        const { t } = useTranslation();
        return (
            <SweetAlert success title="Success" onConfirm={updateServiceRequestList}>
                {t('assign_engineer_create_success_message')}
            </SweetAlert>
        );
    }

    const updateServiceRequestList = async () => {
        store.dispatch(toggleInformationModalStatus())
        try {
            const CurrentPage = store.getState().callcordinatormanagement.currentPage;
            if (checkForPermission("SERVICEREQUEST_CALLCORDINATOR_VIEW")) {
                const ServiceRequests = await getCallCordinatorServiceRequestList("UNASSIGNED", CurrentPage);
                store.dispatch(loadServiceRequests(ServiceRequests));
                const serviceRequestCounts = await getCallCordinatorServiceRequestCounts("UNASSIGNED")
                store.dispatch(loadServiceRequestCounts(serviceRequestCounts));
            }
        } catch (error) {
            console.error(error);
        }
    }

    const passServiceRequestId = async (Id: number) => {
        store.dispatch(setServiceRequestId(Id));
    }

    return (
        <>
            {checkForPermission("SERVICEREQUEST_CALLCORDINATOR_VIEW") && (
                serviceRequests.match({
                    none: () => <>{t('service_request_list_loading')}</>,
                    some: (ServiceRequests) => (
                        <div>
                            {checkForPermission("SERVICEREQUEST_CALLCORDINATOR_VIEW") && <>
                                <ContainerPage>
                                    <div className="text-danger">{t(errors['AssignWarning'])}</div>
                                    <div className="mb-2">
                                        <div className="row mt-3 px-2">
                                            {ServiceRequests.length > 0 ? (
                                                <div className='ps-0 table-responsive overflow-auto pe-0'>
                                                    <table className="table table-bordered text-nowrap">
                                                        <thead>
                                                            <tr>
                                                                {selectedStatus === "UNASSIGNED" && (
                                                                    <th scope='col'></th>
                                                                )}
                                                                <th scope='col'>{t('callcordinator_calldetails_slno')}</th>
                                                                <th scope='col'>{t('callcordinator_calldetails_wono')}</th>
                                                                <th scope='col'>{t('callcordinator_calldetails_wonocreatedon')}</th>
                                                                <th scope='col'>{t('callcordinator_calldetails_customerrepissue')}</th>
                                                                <th scope='col'>{t('callcordinator_calldetails_customername')}</th>
                                                                <th scope='col'>{t('callcordinator_calldetails_callstatus')}</th>
                                                                {selectedStatus === "UNASSIGNED" ? (
                                                                    <>
                                                                        <th scope='col'>{t('assign_engineer_select_engineer')}</th>
                                                                        <th scope='col'>{t('assign_engineer_startsfrom')}</th>
                                                                    </>
                                                                ) : selectedStatus === "ASSIGNED" ? (
                                                                    <>
                                                                        <th scope='col'>{t('assign_engineer_hyperlink_modal')}</th>
                                                                    </>
                                                                ) : null}
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {ServiceRequests.map(({ serviceRequest }, index) => (
                                                                <tr key={index}>
                                                                    {selectedStatus === "UNASSIGNED" && (
                                                                        <td>
                                                                            <input
                                                                                type="checkbox"
                                                                                name='IsChecked'
                                                                                checked={assignengineer.find((assigneeDetails) => assigneeDetails.ServiceRequestId == serviceRequest.Id)?.IsChecked == true}
                                                                                onChange={(event) => toggleRowSelection(event, index)}
                                                                            />
                                                                        </td>
                                                                    )}
                                                                    <th scope='row'>{(index + 1)}</th>
                                                                    <td>{serviceRequest.WorkOrderNumber}</td>
                                                                    <td>{formatDateTime(serviceRequest.WorkOrderCreatedOn)}</td>
                                                                    <td>{serviceRequest.CustomerReportedIssue}</td>
                                                                    <td>{serviceRequest.CustomerName}</td>
                                                                    <td>{serviceRequest.Status}</td>
                                                                    {selectedStatus === "UNASSIGNED" ? (
                                                                        <>
                                                                            <td>
                                                                                {(serviceRequest.StatusCode && serviceRequest.StatusCode !== 'SRS_CLSD' && serviceRequest.StatusCode !== 'SRS_RCLD' && serviceRequest.WorkOrderNumber !== null) && (
                                                                                    <div>
                                                                                        <Select
                                                                                            options={EngineersList}
                                                                                            value={(EngineersList) && EngineersList.find(option => option.value == assignengineer.find(assigneeDetails => assigneeDetails.ServiceRequestId == serviceRequest.Id)?.AssigneeId) || null}
                                                                                            onChange={(selectedOption) => onSelectChange(selectedOption, "AssigneeId", index)}
                                                                                            isSearchable
                                                                                            classNames={{ control: (state) => getErrorForFieldId(serviceRequest.Id, 'AssigneeId') ? "border-danger" : "" }}
                                                                                            name="AssigneeId"
                                                                                            placeholder="Select"
                                                                                            menuPosition='fixed'
                                                                                        />
                                                                                        {getErrorForFieldId(serviceRequest.Id, 'AssigneeId') && (
                                                                                            <div className="text-danger form-text">
                                                                                                {t(getErrorForFieldId(serviceRequest.Id, 'AssigneeId') || '')}
                                                                                            </div>
                                                                                        )}
                                                                                    </div>
                                                                                )}
                                                                            </td>
                                                                            <td>
                                                                                {(serviceRequest.StatusCode && serviceRequest.StatusCode !== 'SRS_CLSD' && serviceRequest.StatusCode !== 'SRS_RCLD' && serviceRequest.WorkOrderNumber !== null) && (
                                                                                    <div>
                                                                                        <input
                                                                                            className={`form-control  ${getErrorForFieldId(serviceRequest.Id, 'StartsFrom') ? "is-invalid" : ""}`}
                                                                                            name="StartsFrom"
                                                                                            type="datetime-local"
                                                                                            value={assignengineer.find((assigneeDetails) => assigneeDetails.ServiceRequestId == serviceRequest.Id)?.StartsFrom}
                                                                                            onChange={(ev) => onUpdateField(ev, index)}
                                                                                        ></input>
                                                                                        {getErrorForFieldId(serviceRequest.Id, 'StartsFrom') && (
                                                                                            <div className="text-danger form-text">
                                                                                                {t(getErrorForFieldId(serviceRequest.Id, 'StartsFrom') || '')}
                                                                                            </div>
                                                                                        )}
                                                                                    </div>
                                                                                )}
                                                                            </td>
                                                                        </>
                                                                    ) : selectedStatus === "ASSIGNED" ? (
                                                                        <td>
                                                                            Assigned
                                                                        </td>
                                                                    ) : null}


                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                    {selectedStatus === "UNASSIGNED" && (
                                                        <button className="btn app-primary-bg-color text-white" type="button" onClick={() => onAssignEngineerSubmit()}>
                                                            {t('assign_engineer_submitbutton')}
                                                        </button>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="text-muted p-0">{t('callcordinator_calldetails_no_sr_found')}</div>
                                            )}
                                        </div>
                                    </div>
                                </ContainerPage>
                            </>}
                        </div>
                    ),
                }))}
            {displayInformationModal ? <InformationModal /> : ""}
            <AssignEngineerCreate />
        </>
    )
}