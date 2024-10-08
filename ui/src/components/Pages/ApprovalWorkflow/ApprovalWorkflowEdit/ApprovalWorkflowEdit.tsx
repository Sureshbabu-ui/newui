import { useTranslation } from "react-i18next";
import { useRef } from "react";
import SweetAlert from "react-bootstrap-sweetalert";
import * as yup from 'yup';
import { useStore } from "../../../../state/storeHooks";
import { store } from "../../../../state/store";
import { EditApprovalWorkflowState, initializeApprovalWorkflowEdit, toggleInformationModalStatus, updateErrors, updateField } from "./ApprovalWorkflowEdit.slice";
import { startPreloader, stopPreloader } from "../../../Preloader/Preloader.slice";
import { approvalWorkflowEdit, getApprovalWorkflowList } from "../../../../services/approvalWorkflow";
import { loadApprovalWorkflows } from "../ApprovalWorkflowList/ApprovalWorkflowList.slice";
import { checkForPermission } from "../../../../helpers/permissions";
import { ValidationErrorComp } from "../../../ValidationErrors/ValidationError";
import { convertBackEndErrorsToValidationErrors } from "../../../../helpers/formats";

export const ApprovalWorkflowEdit = () => {
    const { t } = useTranslation();
    const modalRef = useRef<HTMLButtonElement>(null);
    const { selectedWorkflow, displayInformationModal, errors } = useStore(({ approvalworkflowedit }) => approvalworkflowedit);

    const onUpdateField = (ev: any) => {
        var name = ev.target.name;
        var value = name == 'IsActive' ? ev.target.checked : ev.target.value;
        value =(value==="")?null:value;
        store.dispatch(updateField({ name: name as keyof EditApprovalWorkflowState['selectedWorkflow'], value }));
    }

    const onSubmit = async () => {
        store.dispatch(updateErrors({}))
        try {
            await validationSchema.validate(selectedWorkflow, { abortEarly: false });
        } catch (error: any) {
            const errors = error.inner.reduce((allErrors: any, currentError: any) => {
                return { ...allErrors, [currentError.path as string]: currentError.message };
            }, {});
            store.dispatch(updateErrors(errors))
            if (errors)
                return;
        }
        store.dispatch(startPreloader());
        const result = await approvalWorkflowEdit(selectedWorkflow)
        result.match({
            ok: () => {
                store.dispatch(toggleInformationModalStatus());
            },
            err: (e) => {
                const errorMessages = convertBackEndErrorsToValidationErrors(e)
                store.dispatch(updateErrors(errorMessages));
            },
        });
        store.dispatch(stopPreloader());
    }

    const InformationModal = () => {
        const { t } = useTranslation();
        return (
            <SweetAlert success title="Success" onConfirm={updateApprovalWorkflow}>
                {t('approvalworkflow_edit_success_message')}
            </SweetAlert>
        );
    }

    const updateApprovalWorkflow = async () => {
        store.dispatch(toggleInformationModalStatus());
        const ApprovalWorkflows = await getApprovalWorkflowList(store.getState().approvalworkflowlist.search);
        store.dispatch(loadApprovalWorkflows(ApprovalWorkflows));
        modalRef.current?.click()
    }
    const onModalClose = async () => {
        store.dispatch(initializeApprovalWorkflowEdit());
    }

    const validationSchema = yup.object().shape({
        Name: yup.string().required('validation_error_approvalworkflow_edit_name_required'),
        Description: yup.string().required('validation_error_approvalworkflow_edit_description_required'),
    });

    return (
        <>
            <div
                className="modal fade"
                id='EditApprovalWorkflow'
                data-bs-backdrop='static'
                data-bs-keyboard='false'
                aria-hidden='true'
            >
                <div className="modal-dialog ">
                    <div className="modal-content">
                        <div className="modal-header mx-2">
                            <h5 className="modal-title app-primary-color">{t('approvalworkflow_edit_title')}</h5>
                            <button
                                type='button'
                                className="btn-close"
                                data-bs-dismiss='modal'
                                id='closeEditApprovalWorkflowModal'
                                aria-label='Close'
                                onClick={onModalClose}
                                ref={modalRef}
                            ></button>
                        </div>
                        <div className="modal-body">
                            {checkForPermission("APPROVALWORKFLOW_MANAGE") &&
                                <>
                                    {errors && <ValidationErrorComp errors={errors} />}
                                    <div className=''>
                                        <div className='row mb-1'>

                                            <div className='col-md-12'>
                                                <label className="red-asterisk">{t('approvalworkflow_edit_input_name')}</label>
                                                <input name='Name'
                                                    value={selectedWorkflow.Name ?? ''}
                                                    className={`form-control  ${errors["Name"] ? "is-invalid" : ""}`}
                                                    onChange={onUpdateField} type='text' ></input>
                                                <div className="invalid-feedback"> {t(errors['Name'])}</div>
                                            </div>
                                            <div className='col-md-12'>
                                                <label className="mt-2 red-asterisk">{t('approvalworkflow_edit_input_description')}</label>
                                                <textarea name='Description'
                                                    value={selectedWorkflow.Description ?? ''}
                                                    className={`form-control  ${errors["Description"] ? "is-invalid" : ""}`}
                                                    onChange={onUpdateField} rows={4} ></textarea>
                                                <div className="invalid-feedback"> {t(errors['Description'])}</div>
                                            </div>
                                            <div className='col-md-12 ps-3'>
                                                <div className="mt-2 form-check form-switch">
                                                    <label className="form-check-label" htmlFor="flexSwitchCheckDefault">
                                                        {t('approvalworkflow_edit_label_status')}
                                                        <input
                                                            className="form-check-input switch-input-lg "
                                                            type="checkbox"
                                                            name="IsActive"
                                                            id="flexSwitchCheckDefault"
                                                            checked={selectedWorkflow.IsActive?.valueOf()}
                                                            value={selectedWorkflow.IsActive?.toString() ?? ''}
                                                            onChange={onUpdateField}
                                                        />
                                                    </label>
                                                    <div className="form-text">
                                                        {t('approvalworkflow_edit_label_status_help_text')}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-12 mt-4">
                                                <button type='button' className='btn  app-primary-bg-color text-white mt-2 float-end' onClick={onSubmit}>
                                                    {t('approvalworkflow_edit_submit_button')}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            }
                            {displayInformationModal ? <InformationModal /> : ""}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}