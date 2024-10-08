import { useEffect } from 'react';
import { useStore } from '../../../../state/storeHooks';
import { useTranslation } from 'react-i18next';
import { checkForPermission } from '../../../../helpers/permissions';
import Select from 'react-select';
import * as yup from 'yup';
import { startPreloader, stopPreloader } from '../../../Preloader/Preloader.slice';
import { useParams } from 'react-router-dom';
import SweetAlert from 'react-bootstrap-sweetalert';
import { useRef } from 'react'
import { ValidationErrorComp } from '../../../ValidationErrors/ValidationError';
import { clearWorkflowDetail, EditApprovalWorkFlowState, initializeApprovalWorkFlowEdit, loadMasterData, toggleInformationModalStatus, updateErrors, updateField } from './ApprovalWorkflowDetailEdit.slice';
import { store } from '../../../../state/store';
import { getRoleTitles } from '../../../../services/roles';
import { convertBackEndErrorsToValidationErrors, formatSelectInput } from '../../../../helpers/formats';
import { editApprovalWorkflowDetail, getApprovalWorkflowView } from '../../../../services/approvalWorkflowDetail';
import { loadApprovalWorkflowDetails } from '../ApprovalWorkflowView/ApprovalWorkflowView.slice';
import { getUsersNames } from '../../../../services/users';

export const ApprovalWorkflowDetailEdit = () => {
    const { t } = useTranslation();
    const { ApprovalWorkflowId } = useParams<{ ApprovalWorkflowId: string }>();
    const modalRef = useRef<HTMLButtonElement>(null);
    const {
        approvalworkflowdetailedit: { approvalWorkflow, displayInformationModal, errors, masterDataList },
    } = useStore(({ approvalworkflowdetailedit, app }) => ({ approvalworkflowdetailedit, app }));

    useEffect(() => {
        if (checkForPermission("APPROVALWORKFLOW_MANAGE")) {
            onLoad();
        }
    }, []);

    const onLoad = async () => {
        store.dispatch(initializeApprovalWorkFlowEdit());
        try {
            const roleList = await getRoleTitles();
            const formattedRoleList = (formatSelectInput(roleList.RoleTitles, "RoleName", "Id"))
            store.dispatch(loadMasterData({ name: 'Roles', value: { MasterData: formattedRoleList } }))
            const users = await getUsersNames();
            const formattedUsers = formatSelectInput(users.UsersNames, "FullName", "Id")
            store.dispatch(loadMasterData({ name: 'Users', value: { MasterData: formattedUsers } }))
        } catch (error) {
            return;
        }
    }

    const onSelectChange = (selectedOption: any, actionMeta: any) => {
        const name = actionMeta;
        const value = selectedOption?.value??null;
        store.dispatch(updateField({ name: name as keyof EditApprovalWorkFlowState['approvalWorkflow'], value }));
    }

    const onUpdateField = (ev: any) => {
        const name = ev.target.name;
        let value = (name == 'IsActive') ? ev.target.checked : ev.target.value;
        value = (value === "") ? null : value;
        store.dispatch(updateField({ name: name as keyof EditApprovalWorkFlowState['approvalWorkflow'], value }));
    }

    const validationSchema = yup.object().shape({
        ApproverType: yup.string().required(),
        ApproverRoleId: yup.string().when('ApproverType', (ApproverType, schema) =>
            approvalWorkflow.ApproverType == 'role'
                ? schema.required(('validation_error_approvalworkflowdetailedit_role_required'))
                : schema.nullable()
        ),
        ApproverUserId: yup.string().when('ApproverType', (ApproverType, schema) =>
            approvalWorkflow.ApproverType == 'user'
                ? schema.required(('validation_error_approvalworkflowdetailedit_user_required'))
                : schema.nullable()
        ),
        Sequence: yup.number().required('validation_error_approvalworkflowdetailedit_sequence_required')
            .positive('validation_error_approvalworkflowdetailedit_sequence_error')
            .typeError('validation_error_approvalworkflowdetailedit_sequence_error')
            .integer('validation_error_approvalworkflowdetailedit_sequence_error')
            .test({
                name: 'max-value',
                test: (value) => {
                    const parsedValue = Number(value);
                    return isNaN(parsedValue) || parsedValue <= store.getState().approvalworkflowview.LastSequence + 1;
                },
                message: `${t('validation_error_approvalworkflowdetailedit_sequence_error')}`,
            }),
    });

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
        const result = await editApprovalWorkflowDetail(approvalWorkflow);
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
            <SweetAlert success title="Success" onConfirm={handleReload}>
                {t('approvalworkflowdetailedit_success_message')}
            </SweetAlert>
        );
    }

    const handleReload = async () => {
        const approvalWorkFlows = await getApprovalWorkflowView(ApprovalWorkflowId);
        store.dispatch(loadApprovalWorkflowDetails(approvalWorkFlows));
        store.dispatch(toggleInformationModalStatus());
        modalRef.current?.click();
    }

    const onModalClose = () => {
        store.dispatch(clearWorkflowDetail())
    }

    return (
        <>
            <div
                className="modal fade modal-lg"
                id='ApprovalWorkflowDetailEdit'
                data-bs-backdrop='static'
                data-bs-keyboard='false'
                aria-hidden='true'
            >
                <div className="modal-dialog ">
                    <div className="modal-content">
                        <div className="modal-header mx-2">
                            <h5 className="modal-title">{t('approvalworkflowdetailedit_title')}</h5>
                            <button
                                type='button'
                                className="btn-close"
                                data-bs-dismiss='modal'
                                id='closeApprovalWorkflowDetailEditModal'
                                aria-label='Close'
                                onClick={onModalClose}
                                ref={modalRef}
                            ></button>
                        </div>
                        {checkForPermission("APPROVALWORKFLOW_MANAGE") &&
                            <>
                                <div className="modal-body">
                                    <ValidationErrorComp errors={errors} />
                                    <>
                                        <div>
                                            <div className='col-md-12'>
                                                <label className="red-asterisk">{t('approvalworkflowdetailedit_input_sequence')}</label>
                                                <input name='Sequence'
                                                    value={approvalWorkflow.Sequence ?? ''}
                                                    className={`form-control  ${errors["Sequence"] ? "is-invalid" : ""}`}
                                                    onChange={onUpdateField} type='text' ></input>
                                                <div className="invalid-feedback"> {t(errors['Sequence'])}</div>
                                            </div>
                                            <div className="col-md-12 mt-3">
                                                <div className="form-check form-check-inline">
                                                    <input className="form-check-input"
                                                        type="radio"
                                                        name="ApproverType"
                                                        id="approvalTypeRole" 
                                                        value="role"
                                                         checked={approvalWorkflow.ApproverType == "role"}
                                                        onChange={onUpdateField}
                                                    />
                                                    <label className="form-check-label" htmlFor="approvalTypeRole">{t('approvalworkflowdetailedit_radio_role')}</label>
                                                </div>
                                                <div className="form-check form-check-inline">
                                                    <input className="form-check-input"
                                                        type="radio"
                                                        checked={approvalWorkflow.ApproverType == "user"}
                                                        name="ApproverType"
                                                        id="approvalTypeUser"
                                                        onChange={onUpdateField}
                                                        value="user"
                                                    />
                                                    <label className="form-check-label" htmlFor="approvalTypeUser">{t('approvalworkflowdetailedit_radio_user')}</label>
                                                </div>
                                            </div>
                                            {approvalWorkflow.ApproverType == "role" && <div className='col-md-12'>
                                                <label className="mt-2 red-asterisk">{t('approvalworkflowdetailedit_input_roleid')}</label>
                                                <Select
                                                    options={masterDataList.Roles}
                                                    value={masterDataList.Roles && masterDataList.Roles.find(option => option.value == approvalWorkflow.ApproverRoleId) || null}
                                                    onChange={(selectedOption) => onSelectChange(selectedOption, "ApproverRoleId")}
                                                    isSearchable
                                                    isClearable
                                                    name="ApproverRoleId"
                                                    placeholder={t('approvalworkflowdetailedit_select_role_placeholder')}
                                                />
                                                <div className="small text-danger"> {t(errors['ApproverRoleId'])}</div>
                                            </div>}
                                            {approvalWorkflow.ApproverType == "user" && <div className='col-md-12 mb-3'>
                                                <label className="mt-2 red-asterisk">{t('approvalworkflowdetailedit_input_userid')}</label>
                                                <Select
                                                    options={masterDataList.Users}
                                                    value={masterDataList.Users && masterDataList.Users.find(option => option.value == approvalWorkflow.ApproverUserId) || null}
                                                    onChange={(selectedOption) => onSelectChange(selectedOption, "ApproverUserId")}
                                                    isSearchable
                                                    isClearable
                                                    name="ApproverUserId"
                                                    placeholder={t('approvalworkflowdetailedit_select_user_placeholder')}
                                                />
                                                <div className="small text-danger"> {t(errors['ApproverUserId'])}</div>
                                            </div>}

                                            <div className='col-md-12 ps-3'>
                                                <div className="mt-2 form-check form-switch">
                                                    <label className="form-check-label" htmlFor="flexSwitchCheckDefault">
                                                        {t('approvalworkflowdetail_edit_label_status')}
                                                        <input
                                                            className="form-check-input switch-input-lg "
                                                            type="checkbox"
                                                            name="IsActive"
                                                            id="flexSwitchCheckDefault"
                                                            checked={approvalWorkflow.IsActive?.valueOf()}
                                                            value={approvalWorkflow.IsActive?.toString() ?? ''}
                                                            onChange={onUpdateField}
                                                        />
                                                    </label>
                                                    <div className="form-text">
                                                        {t('approvalworkflowdetail_edit_label_status_help_text')}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-12 mt-4">
                                                <button type='button' className='btn  app-primary-bg-color text-white mt-2 float-end' onClick={onSubmit}>
                                                    {t('approvalworkflowdetailedit_submit_button')}
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                    {displayInformationModal ? <InformationModal /> : ""}
                                </div>
                            </>
                        }
                    </div>
                </div>
            </div >
        </>
    )
} 