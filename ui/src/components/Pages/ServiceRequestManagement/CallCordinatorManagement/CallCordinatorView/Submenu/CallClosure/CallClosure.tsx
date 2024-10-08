import { useTranslation } from "react-i18next";
import { ContainerPage } from "../../../../../../ContainerPage/ContainerPage";
import { ValidationErrorComp } from "../../../../../../ValidationErrors/ValidationError";
import { dispatchOnCall, store } from "../../../../../../../state/store";
import { useRef } from "react";
import SweetAlert from "react-bootstrap-sweetalert";
import * as yup from 'yup';
import Select from 'react-select';
import { convertBackEndErrorsToValidationErrors } from "../../../../../../../helpers/formats";
import { useStoreWithInitializer } from "../../../../../../../state/storeHooks";
import { startPreloader, stopPreloader } from "../../../../../../Preloader/Preloader.slice";
import { CallClosureState, initializeCallClosure, toggleInformationModalStatus, updateErrors, updateField } from "./CallClosure.slice";
import { ServiceRequestClose, getCallCordinatorServiceRequestCounts, getCallCordinatorServiceRequestList } from "../../../../../../../services/serviceRequest";
import { checkForPermission } from "../../../../../../../helpers/permissions";
import { initializeCallCordinatorManagement, loadServiceRequestCounts, loadServiceRequests, setActiveTab } from "../../../CallCordinatorManagement.slice";

export const CallClosure = () => {
    const { t } = useTranslation();
    const modalRef = useRef<HTMLButtonElement>(null);
    const { servicereqclosure, errors, displayInformationModal } = useStoreWithInitializer(({ callclosure }) => callclosure, dispatchOnCall(initializeCallClosure));
    const validationTAssignEngineerSchema = yup.object().shape({
        CaseStatusCode: yup.string().required('validation_error_callclosure_required'),
        HoursSpent: yup.string().required(t('validation_error_hoursspend_required') ?? 'validation_error_hoursspend_required'),
        ClosureRemarks: yup.string().required(t('validation_error_closureremarks_required') ?? 'validation_error_closureremarks_required'),
        SlaBreachedReason: yup.string().when('IsSlaBreached', (IsSlaBreached, schema) =>
            servicereqclosure.IsSlaBreached == true
                ? schema.required('validation_error_sla_breached_reason_required')
                : schema.nullable()
        ),
    });

    const onUpdateField = (ev: any) => {
        var { name, value, checked } = ev.target
        if (name == "IsSlaBreached") {
            value = checked ? true : false;
        }
        store.dispatch(updateField({ name: name as keyof CallClosureState['servicereqclosure'], value }));
    }

    const onSubmit = async () => {
        store.dispatch(updateErrors({}))
        try {
            await validationTAssignEngineerSchema.validate(servicereqclosure, { abortEarly: false });
        } catch (error: any) {
            const errors = error.inner.reduce((allErrors: any, currentError: any) => {
                return { ...allErrors, [currentError.path as string]: currentError.message };
            }, {});
            store.dispatch(updateErrors(errors))
            if (errors)
                return;
        }
        store.dispatch(startPreloader());
        const result = await ServiceRequestClose(servicereqclosure)
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
                {t('callclosure_success_message')}
            </SweetAlert>
        );
    }

    const updateAssignEngineer = async () => {
        store.dispatch(toggleInformationModalStatus());
        store.dispatch(initializeCallCordinatorManagement())
        store.dispatch(setActiveTab(0))
        try {
            if (checkForPermission("SERVICEREQUEST_CALLCORDINATOR_VIEW")) {
                const ServiceRequests = await getCallCordinatorServiceRequestList("UNASSIGNED", 1);
                store.dispatch(loadServiceRequests(ServiceRequests));
                const serviceRequestCounts = await getCallCordinatorServiceRequestCounts('UNASSIGNED')
                store.dispatch(loadServiceRequestCounts(serviceRequestCounts));
            }
        } catch (error) {
            console.error(error);
        }
        modalRef.current?.click()
    }

    const onModalClose = async () => {
        store.dispatch(initializeCallClosure())
    }

    const onSelectChange = (selectedOption: any, Name: any) => {
        var value = selectedOption.value
        var name = Name
        store.dispatch(updateField({ name: name as keyof CallClosureState['servicereqclosure'], value }));
    }

    const options = [
        { value: '', label: 'Select' },
        { value: 'SRS_CLSD', label: 'Closed' },
        { value: 'SRS_RCLD', label: 'Remotely Closed' },
    ]

    return (
        <>
            <div
                className="modal fade"
                id='CallClosure'
                data-bs-backdrop='static'
                data-bs-keyboard='false'
                aria-hidden='true'
            >
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header mx-3">
                            <h5 className="modal-title app-primary-color">{t('callclosure_modal_title')}</h5>
                            <button
                                type='button'
                                className="btn-close"
                                data-bs-dismiss='modal'
                                id='closeCallClosureModal'
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
                                        <div className="row m-0 p-0 mt-2" >
                                            <label className="red-asterisk">{t('callclosure_label_callstatus')}</label>
                                            <Select
                                                options={options}
                                                onChange={(selectedOption) => onSelectChange(selectedOption, "CaseStatusCode")}
                                                placeholder="Select Filter"
                                                defaultValue={options ? options[0] : null}
                                                isSearchable
                                                name="CaseStatusCode"
                                                classNamePrefix="react-select"
                                            />
                                            <div className="small text-danger"> {t(errors['CaseStatusCode'])}</div>
                                        </div>
                                        <div>
                                            <label className='mt-2 red-asterisk'>{t('callclosure_label_hoursspend')}</label>
                                            <input
                                                value={servicereqclosure.HoursSpent ?? ""}
                                                className={`form-control  ${errors["HoursSpent"] ? "is-invalid" : ""}`}
                                                name="HoursSpent"
                                                onChange={onUpdateField}
                                            ></input>
                                            <div className="invalid-feedback">{errors['HoursSpent']}</div>
                                        </div >
                                        <div className="mb-1 mt-2">
                                            <label className="red-asterisk">{t('callclosure_label_closureremarks')}</label>
                                            <textarea onChange={onUpdateField} name="ClosureRemarks" value={servicereqclosure.ClosureRemarks}
                                                className={`form-control  ${errors["ClosureRemarks"] ? "is-invalid" : ""}`}
                                            />
                                            <div className="invalid-feedback">{t(errors['ClosureRemarks'])}</div>
                                        </div>
                                        <div className="mb-1 ms-3 mt-2 form-check form-switch">
                                            <label className="form-check-label" htmlFor="flexSwitchCheckDefault">
                                                {t('callclosure_label_closurer_isslabreached')}
                                                <input
                                                    className="form-check-input switch-input-lg"
                                                    type="checkbox"
                                                    name="IsSlaBreached"
                                                    id="flexSwitchCheckDefault"
                                                    checked={servicereqclosure.IsSlaBreached.valueOf()}
                                                    value={servicereqclosure.IsSlaBreached.toString()}
                                                    onChange={onUpdateField}
                                                />
                                            </label>
                                        </div>
                                        {servicereqclosure.IsSlaBreached && (
                                            <div className="mb-1 mt-2">
                                                <label className="red-asterisk">{t('callclosure_label_closurer_sla_breachedreason')}</label>
                                                <textarea onChange={onUpdateField} name="SlaBreachedReason" value={servicereqclosure.SlaBreachedReason}
                                                    className={`form-control  ${errors["SlaBreachedReason"] ? "is-invalid" : ""}`}
                                                />
                                                <div className="invalid-feedback">{t(errors['SlaBreachedReason'])}</div>
                                            </div>
                                        )}
                                        <div className="d-grid gap-2 mt-3">
                                            <button className="btn app-primary-bg-color text-white" type="button" onClick={onSubmit}>
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