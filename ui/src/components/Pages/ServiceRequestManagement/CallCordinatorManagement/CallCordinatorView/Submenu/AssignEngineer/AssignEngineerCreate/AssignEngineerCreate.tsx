import { useTranslation } from "react-i18next";
import { useEffect, useRef, useState } from "react";
import SweetAlert from "react-bootstrap-sweetalert";
import * as yup from 'yup';
import { CreateAssignEngineerState, ShedulesExist, initializeTAssignEngineerCreate, loadServiceEngineers, toggleInformationModalStatus, updateErrors, updateField } from "./AssignEngineerCreate.slice";
import Select from 'react-select';
import { loadAssignees } from "../AssignEngineer.slice";
import { useStoreWithInitializer } from "../../../../../../../../state/storeHooks";
import { store } from "../../../../../../../../state/store";
import { convertBackEndErrorsToValidationErrors, formatSelectInput } from "../../../../../../../../helpers/formats";
import { startPreloader, stopPreloader } from "../../../../../../../Preloader/Preloader.slice";
import { AssignEngineerForCall, AssignEngineersCreate, assigneesList, checkShedulesExists } from "../../../../../../../../services/assignEngineer";
import { ContainerPage } from "../../../../../../../ContainerPage/ContainerPage";
import { ValidationErrorComp } from "../../../../../../../ValidationErrors/ValidationError";
import { getRegionWiseServiceEngineers } from "../../../../../../../../services/users";

export const AssignEngineerCreate = () => {
    const { t } = useTranslation();
    const modalRef = useRef<HTMLButtonElement>(null);
    const year: Intl.DateTimeFormatOptions = { month: 'short', year: '2-digit' };
    const weekday: Intl.DateTimeFormatOptions = { weekday: 'short' };
    const {
        EngineersList, assignengineer, errors, displayInformationModal, existingShedules,
    } = useStoreWithInitializer(({ assignengineercreate }) => assignengineercreate, GetMasterDataItems);

    const [selectEngineersList, setEngineersList] = useState<any>(null)
    const [selectAssignees, setSelectAssignees] = useState<any>([])

    useEffect(() => {
        GetMasterDataItems()
    }, [store.getState().assigneeslist.totalRows])

    useEffect(() => {
        setEngineersList(formatSelectInput(EngineersList, "FullName", "Id",));
    }, [EngineersList, store.getState().assigneeslist.totalRows])

    const onUpdateField = (ev: any) => {
        var name = ev.target.name;
        var value = ev.target.value;
        store.dispatch(updateField({ name: name as keyof CreateAssignEngineerState['assignengineer'], value }));
    }

    const validationTAssignEngineerSchema = yup.object().shape({
        AssigneeId: yup.string().required('validation_error_assign_engineer_create_assignee_required'),
        StartsFrom: yup.string().required(('validation_error_assign_engineer_create_startsfrom_required') ?? 'validation_error_assign_engineer_create_startsfrom_required'),

    });

    const onAssignEngineerSubmit = async () => {
        store.dispatch(updateErrors({}))
        try {
            await validationTAssignEngineerSchema.validate(assignengineer, { abortEarly: false });
        } catch (error: any) {
            const errors = error.inner.reduce((allErrors: any, currentError: any) => {
                return { ...allErrors, [currentError.path as string]: currentError.message };
            }, {});
            store.dispatch(updateErrors(errors))
            if (errors)
                return;
        }
        store.dispatch(startPreloader());
        const result = await AssignEngineerForCall(assignengineer)
        result.match({
            ok: () => {
                store.dispatch(toggleInformationModalStatus());
            },
            err: (e) => {
                const formattedErrors = convertBackEndErrorsToValidationErrors(e)
                store.dispatch(updateErrors(formattedErrors))
            },
        });
        store.dispatch(stopPreloader());
    }

    const InformationModal = () => {
        const { t } = useTranslation();
        return (
            <SweetAlert success title="Success" onConfirm={updateAssignEngineer}>
                {t('assign_engineer_create_success_message')}
            </SweetAlert>
        );
    }

    const updateAssignEngineer = async () => {
        store.dispatch(toggleInformationModalStatus());
        const result = await assigneesList(Number(store.getState().assignengineercreate.assignengineer.ServiceRequestId));
        store.dispatch(loadAssignees(result));
        const ServiceEngineers = await getRegionWiseServiceEngineers();
        store.dispatch(loadServiceEngineers(ServiceEngineers));
        modalRef.current?.click()
    }

    useEffect(() => {
        if (assignengineer.AssigneeId) {
            (async () => {
                const result = await checkShedulesExists(assignengineer.StartsFrom, assignengineer.AssigneeId.toString());
                store.dispatch(ShedulesExist(result));
            })();
        }
    }, [assignengineer.AssigneeId]);

    const onModalClose = async () => {
        store.dispatch(initializeTAssignEngineerCreate())
        GetMasterDataItems()
        setSelectAssignees([])
    }

    const onSelectChange = (selectedOption: any) => {
        setSelectAssignees(selectedOption)
        const AssigneeId = [...selectedOption.map((selectAssignees) => (selectAssignees.value))].join(",")
        store.dispatch(updateField({ name: 'AssigneeId', value: AssigneeId }))
    }

    async function GetMasterDataItems() {
        try {
            if (store.getState().assigneeslist.totalRows > 0) {
                store.dispatch(initializeTAssignEngineerCreate());
                const { ServiceEngineers } = await getRegionWiseServiceEngineers();
                const filteredArray = ServiceEngineers.filter(obj => obj.Id != store.getState().assigneeslist.Assignees.unwrap()[0].Assignee.AssigneeId);
                store.dispatch(loadServiceEngineers({ ServiceEngineers: filteredArray }));
            }
            else {
                const { ServiceEngineers } = await getRegionWiseServiceEngineers();
                store.dispatch(loadServiceEngineers({ ServiceEngineers: ServiceEngineers }));
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <>
            <div
                className="modal fade"
                id='AssignEngineer'
                data-bs-backdrop='static'
                data-bs-keyboard='false'
                aria-hidden='true'
            >
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header mx-3">
                            <h5 className="modal-title app-primary-color">{t('assign_engineer_create_main_modal_heading')}</h5>
                            <button
                                type='button'
                                className="btn-close"
                                data-bs-dismiss='modal'
                                id='closeAssignEngineerModal'
                                onClick={onModalClose}
                                aria-label='Close'
                                ref={modalRef}
                            ></button>
                        </div>
                        <div className="modal-body">
                            <ContainerPage>
                                <ValidationErrorComp errors={errors} />
                                <div className=''>
                                    <div className='row mb-1'>
                                        <div className="col-md-12">
                                            <label className="mt-2 red-asterisk">{t('assign_engineer_select_engineer')}</label>
                                            <Select
                                                options={selectEngineersList}
                                                isMulti={true}
                                                value={selectAssignees}
                                                onChange={onSelectChange}
                                                isSearchable
                                                classNamePrefix="react-select"
                                                name="AssigneeId"
                                                placeholder="Select"
                                            />
                                            <div className="small text-danger"> {t(errors['AssigneeId'])}</div>
                                            {existingShedules.length > 0 && (
                                                <div>
                                                    <label className="ms-0 mt-1">{t('assign_engineer_agenda')}</label>
                                                    {existingShedules.map((field) => (<>
                                                        <div className="row pt-1 me-0 ms-0 mb-2">
                                                            <div className="calender col-md-1 rounded border bg-light app-primary-color pb-2">
                                                                <div className="text-center fs-5 fw-bold">{new Date(field.existingShedules.StartsFrom).getDate()}</div>
                                                                <div className="text-size-11 text-start">{new Intl.DateTimeFormat('en-US', year).format(new Date(field.existingShedules.StartsFrom))}</div>
                                                            </div>
                                                            <div className="col-11 mb-1">
                                                                <h6 className="fw-bold">{field.existingShedules.Assignee} <small className="text-size-12">({field.existingShedules.WorkOrderNumber})</small></h6>
                                                                <div>{field.existingShedules.CustomerReportedIssue}</div>
                                                            </div>
                                                        </div>
                                                    </>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <div className="mb-1 mt-2">
                                            <label className="form-label mb-0 red-asterisk">{t('assign_engineer_startsfrom')}</label>
                                            <input
                                                className={`form-control  ${errors["StartsFrom"] ? "is-invalid" : ""}`}
                                                name="StartsFrom"
                                                type="datetime-local"
                                                value={assignengineer.StartsFrom ? assignengineer.StartsFrom : ""}
                                                onChange={onUpdateField}
                                            ></input>
                                            <div className="small text-danger"> {t(errors['StartsFrom'])}</div>
                                        </div>
                                        <div className="mb-1 mt-2">
                                            <label>{t('assign_engineer_remarks')}</label>
                                            <textarea onChange={onUpdateField} name="Remarks" value={assignengineer.Remarks} className="form-control" />
                                        </div>
                                        <div className="d-grid gap-2 mt-2">
                                            <button className="btn app-primary-bg-color text-white" type="button" onClick={onAssignEngineerSubmit}>
                                                {t('tenant_office_create_btn_submit')}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </ContainerPage>
                            {displayInformationModal ? <InformationModal /> : ""}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}