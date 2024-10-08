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
import { clearWorkflowDetail, CreateApprovalWorkFlowState, initializeApprovalWorkFlowCreate, loadMasterData, toggleInformationModalStatus, updateErrors, updateField } from './ApprovalWorkflowDetailCreate.slice';
import { store } from '../../../../state/store';
import { getRoleTitles } from '../../../../services/roles';
import { convertBackEndErrorsToValidationErrors, formatSelectInput } from '../../../../helpers/formats';
import { createApprovalWorkflowDetail, getApprovalWorkflowView } from '../../../../services/approvalWorkflowDetail';
import { loadApprovalWorkflowDetails } from '../ApprovalWorkflowView/ApprovalWorkflowView.slice';
import { getUsersNames } from '../../../../services/users';
export const ApprovalWorkflowDetailCreate = () => {
    const { t } = useTranslation();
    const { ApprovalWorkflowId } = useParams<{ ApprovalWorkflowId: string }>();

    const modalRef = useRef<HTMLButtonElement>(null);
    const {
        approvalworkflowdetailcreate: { approvalWorkflow, displayInformationModal, errors, masterDataList },
    } = useStore(({ approvalworkflowdetailcreate, app }) => ({ approvalworkflowdetailcreate, app }));

    useEffect(() => {
        if (checkForPermission("APPROVALWORKFLOW_MANAGE")) {
            onLoad();
        }
    }, [ApprovalWorkflowId]);

    useEffect(() => {
        store.dispatch(updateField({ name: 'Sequence', value: store.getState().approvalworkflowview.LastSequence + 1 }));
    }, [store.getState().approvalworkflowview.LastSequence]);

    const onLoad = async () => {
        store.dispatch(initializeApprovalWorkFlowCreate());
        try {
            store.dispatch(updateField({ name: 'ApprovalWorkflowId', value: ApprovalWorkflowId }));
            const roleList = await getRoleTitles();
            const formattedRoleList = (formatSelectInput(roleList.RoleTitles, "RoleName", "Id"))
            store.dispatch(loadMasterData({ name: 'Roles', value: { MasterData: formattedRoleList } }))
            const users = await getUsersNames();
            const formattedUserList = formatSelectInput(users.UsersNames, "FullName", "Id")
            store.dispatch(loadMasterData({ name: 'Users', value: { MasterData: formattedUserList } }))
        } catch (error) {
            return;
        }
    }

    const onSelectChange = (selectedOption: any, actionMeta: any) => {
        const name = actionMeta;
        const value = selectedOption?.value??null;
        store.dispatch(updateField({ name: name as keyof CreateApprovalWorkFlowState['approvalWorkflow'], value }));
    }

    const onUpdateField = (ev: any) => {
        const name = ev.target.name;
        let value = (name == 'IsActive') ? ev.target.checked : ev.target.value;
        value = (value === "") ? null : value;
        store.dispatch(updateField({ name: name as keyof CreateApprovalWorkFlowState['approvalWorkflow'], value }));
    }

    const validationSchema = yup.object().shape({
        ApproverRoleId: yup.string().when('ApprovalType', (ApprovalType, schema) =>
            approvalWorkflow.ApprovalType == 'role'
                ? schema.required(('validation_error_approvalworkflowdetailcreate_role_required'))
                : schema.nullable()
        ),
        ApproverUserId: yup.string().when('ApprovalType', (ApprovalType, schema) =>
            approvalWorkflow.ApprovalType == 'user'
                ? schema.required(('validation_error_approvalworkflowdetailcreate_user_required'))
                : schema.nullable()
        ), Sequence: yup.number().required('validation_error_approvalworkflowdetailcreate_sequence_required')
            .typeError('validation_error_approvalworkflowdetailcreate_sequence_error')
            .integer('validation_error_approvalworkflowdetailcreate_sequence_error')
            .positive('validation_error_approvalworkflowdetailcreate_sequence_error')
            .test({
                name: 'max-value',
                test: (value) => {
                    const parsedValue = Number(value);
                    return isNaN(parsedValue) || parsedValue <= store.getState().approvalworkflowview.LastSequence + 1;
                },
                message: `${t('validation_error_approvalworkflowdetailcreate_sequence_error')}`,
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
        const result = await createApprovalWorkflowDetail(approvalWorkflow);
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
                {t('approvalworkflowdetailcreate_success_message')}
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
        store.dispatch(updateField({ name: 'Sequence', value: Number(store.getState().approvalworkflowview.LastSequence) + 1 }));
    }
    return (
        <>
            <div
                className="modal fade modal-lg"
                id='ApprovalWorkflowDetailCreate'
                data-bs-backdrop='static'
                data-bs-keyboard='false'
                aria-hidden='true'
            >
                <div className="modal-dialog ">
                    <div className="modal-content">
                        <div className="modal-header mx-2">
                            <h5 className="modal-title">{t('approvalworkflowdetailcreate_title')}</h5>
                            <button
                                type='button'
                                className="btn-close"
                                data-bs-dismiss='modal'
                                id='closeApprovalWorkflowDetailCreateModal'
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
                                                <label className="red-asterisk">{t('approvalworkflowdetailcreate_input_sequence')}</label>
                                                <input name='Sequence'
                                                    value={approvalWorkflow.Sequence ?? ''}
                                                    className={`form-control  ${errors["Sequence"] ? "is-invalid" : ""}`}
                                                    onChange={(e)=>onUpdateField(e)} type='text'
                                                ></input>
                                                <div className="invalid-feedback"> {t(errors['Sequence'])}</div>
                                            </div>
                                            <div className="col-md-12 mt-3">
                                                <div className="form-check form-check-inline">
                                                    <input className="form-check-input"
                                                        type="radio"
                                                        name="ApprovalType"
                                                        id="Role"
                                                         value="role"
                                                         checked={approvalWorkflow.ApprovalType == "role"}
                                                        onChange={onUpdateField}
                                                    />
                                                    <label className="form-check-label" htmlFor="Role">{t('approvalworkflowdetailcreate_radio_role')}</label>
                                                </div>
                                                <div className="form-check form-check-inline">
                                                    <input className="form-check-input"
                                                        type="radio"
                                                      checked  = {approvalWorkflow.ApprovalType == "user"}
                                                        name="ApprovalType"
                                                        id="User"
                                                        onChange={onUpdateField}
                                                        value="user" 
                                                    />
                                                    <label className="form-check-label" htmlFor="User">{t('approvalworkflowdetailcreate_radio_user')}</label>
                                                </div>
                                            </div>
                                            {approvalWorkflow.ApprovalType == "role" && <div className='col-md-12'>
                                                <label className="mt-2 red-asterisk">{t('approvalworkflowdetailcreate_input_roleid')}</label>
                                                <Select
                                                    options={masterDataList.Roles}
                                                    value={masterDataList.Roles && masterDataList.Roles.find(option => option.value == approvalWorkflow.ApproverRoleId) || null}
                                                    onChange={(selectedOption) => onSelectChange(selectedOption, "ApproverRoleId")}
                                                    isSearchable
                                                    isClearable
                                                    name="ApproverRoleId"
                                                    placeholder={t('approvalworkflowdetailcreate_select_role_placeholder')}
                                                />
                                                <div className="small text-danger"> {t(errors['ApproverRoleId'])}</div>
                                            </div>}
                                            {approvalWorkflow.ApprovalType == "user" && <div className='col-md-12 mb-3'>
                                                <label className="mt-2 red-asterisk">{t('approvalworkflowdetailcreate_input_userid')}</label>
                                                <Select
                                                    options={masterDataList.Users}
                                                    value={masterDataList.Users && masterDataList.Users.find(option => option.value == approvalWorkflow.ApproverUserId) || null}
                                                    onChange={(selectedOption) => onSelectChange(selectedOption, "ApproverUserId")}
                                                    isSearchable
                                                    isClearable
                                                    name="ApproverUserId"
                                                    placeholder={t('approvalworkflowdetailcreate_select_user_placeholder')}
                                                />
                                                <div className="small text-danger"> {t(errors['ApproverUserId'])}</div>
                                            </div>}
                                            <div className="col-md-12 mt-4">
                                                <button type='button' className='btn  app-primary-bg-color text-white mt-2 float-end' onClick={onSubmit}>
                                                    {t('approvalworkflowdetailcreate_submit_button')}
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