import { useTranslation } from "react-i18next";
import { useEffect, useRef } from "react";
import SweetAlert from "react-bootstrap-sweetalert";
import * as yup from 'yup';
import { loadApprovalWorkflows } from "../ApprovalWorkflowList/ApprovalWorkflowList.slice";
import { CreateApprovalWorkflowState, initializeApprovalWorkflowCreate, toggleInformationModalStatus, updateErrors, updateField } from "./ApprovalWorkflowCreate.slice";
import { useStore } from "../../../../state/storeHooks";
import { store } from "../../../../state/store";
import { startPreloader, stopPreloader } from "../../../Preloader/Preloader.slice";
import { convertBackEndErrorsToValidationErrors } from "../../../../helpers/formats";
import { createApprovalWorkflow, getApprovalWorkflowList } from "../../../../services/approvalWorkflow";
import { checkForPermission } from "../../../../helpers/permissions";
import { ContainerPage } from "../../../ContainerPage/ContainerPage";
import { ValidationErrorComp } from "../../../ValidationErrors/ValidationError";

export const ApprovalWorkflowCreate = () => {
    const { t } = useTranslation();
    const modalRef = useRef<HTMLButtonElement>(null);
    const {
        approvalworkflowcreate: { approvalWorkflow, displayInformationModal, errors },
    } = useStore(({ approvalworkflowcreate, app }) => ({ approvalworkflowcreate, app }));

    useEffect(() => {
        store.dispatch(initializeApprovalWorkflowCreate())
    }, [])

    const onUpdateField = (ev: any) => {
        var { name, value } = ev.target
        store.dispatch(updateField({ name: name as keyof CreateApprovalWorkflowState['approvalWorkflow'], value }));
    }

    const onSubmit = async () => {
        store.dispatch(updateErrors({}))
        try {
            await validationSchema.validate(approvalWorkflow, { abortEarly: false });
        } catch (error: any) {
            const errors = error.inner.reduce((allErrors: any, currentError: any) => {
                return { ...allErrors, [currentError.path as string]: currentError.message };
            }, {});
            store.dispatch(updateErrors(errors))
            if (errors)
                return;
        }
        store.dispatch(startPreloader());
        const result = await createApprovalWorkflow(approvalWorkflow)
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
            <SweetAlert success title="Success" onConfirm={updateWorkflowList}>
                {t('approvalworkflowcreate_success_message')}
            </SweetAlert>
        );
    }

    const updateWorkflowList = async () => {
        store.dispatch(toggleInformationModalStatus());
        const workflows = await getApprovalWorkflowList('');
        store.dispatch(loadApprovalWorkflows(workflows));
        modalRef.current?.click()
    }

    const onModalClose = () => {
        store.dispatch(initializeApprovalWorkflowCreate())
    }
    const validationSchema = yup.object().shape({
        Name: yup.string().required(t('validation_error_approvalworkflowcreate_name_required') ?? '').max(16, ('validation_error_approvalworkflowcreate_groupname_max') ?? ''),
        Description: yup.string().required(t('validation_error_approvalworkflowcreate_description_required') ?? '').max(256, ('validation_error_approvalworkflowcreate_groupdescription_max') ?? ''),
    });
    return (
        <>
            <div
                className="modal fade"
                id='CreateApprovalWorkflow'
                data-bs-backdrop='static'
                data-bs-keyboard='false'
                aria-hidden='true'
            >
                <div className="modal-dialog modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header mx-2">
                            <h5 className="modal-title">{t('approvalworkflowcreate_title')}</h5>
                            <button
                                type='button'
                                className="btn-close"
                                data-bs-dismiss='modal'
                                id='closeApprovalWorkflowModal'
                                aria-label='Close'
                                onClick={onModalClose}
                                ref={modalRef}
                            ></button>
                        </div>
                        {checkForPermission("APPROVALWORKFLOW_MANAGE") &&
                            <div className="modal-body">
                                {errors && <ValidationErrorComp errors={errors} />}
                                <div className=''>
                                    <div className='row mb-1'>
                                        <div className='col-md-12'>
                                            <label className="mt-2 red-asterisk">{t('approvalworkflowcreate_input_name')}</label>
                                            <input name='Name' onChange={onUpdateField} type='text'
                                                value={approvalWorkflow.Name ?? ''}
                                                className={`form-control  ${errors["Name"] ? "is-invalid" : ""}`}
                                            ></input>
                                            <div className="invalid-feedback"> {t(errors['Name'])}</div>
                                        </div>
                                        <div className='col-md-12'>
                                            <label className="mt-2 red-asterisk">{t('approvalworkflowcreate_input_description')}</label>
                                            <textarea name='Description' onChange={onUpdateField}
                                                value={approvalWorkflow.Description ?? ''}
                                                className={`form-control  ${errors["Description"] ? "is-invalid" : ""}`}
                                            ></textarea>
                                            <div className="invalid-feedback"> {t(errors['Description'])}</div>
                                        </div>
                                        <div className="col-md-12 mt-2">
                                            <button type='button' className='btn float-end app-primary-bg-color text-white mt-2' onClick={onSubmit}>
                                                {t('approvalworkflowcreate_button')}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {displayInformationModal ? <InformationModal /> : ""}
                            </div>
                        }
                    </div>
                </div>
            </div>
        </>
    );
}