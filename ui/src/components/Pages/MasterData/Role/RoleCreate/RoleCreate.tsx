import { useTranslation } from "react-i18next";
import { ContainerPage } from "../../../../ContainerPage/ContainerPage";
import { ValidationErrorComp } from "../../../../ValidationErrors/ValidationError";
import { CreateRoleState, initializeRoleCreate, toggleInformationModalStatus, updateErrors, updateField } from "./RoleCreate.slice";
import { store } from "../../../../../state/store";
import { startPreloader, stopPreloader } from "../../../../Preloader/Preloader.slice";
import { useStore } from '../../../../../state/storeHooks';
import { useEffect, useRef } from "react";
import SweetAlert from "react-bootstrap-sweetalert";
import { loadRoles } from "../RoleList/RoleList.slice";
import { convertBackEndErrorsToValidationErrors } from "../../../../../helpers/formats";
import * as yup from 'yup';
import { getRoleList, roleCreate } from "../../../../../services/roles";
import { checkForPermission } from "../../../../../helpers/permissions";

export const RoleCreate = () => {
    const { t } = useTranslation();
    const modalRef = useRef<HTMLButtonElement>(null);
    const {
        rolecreate: { role, displayInformationModal, errors },
    } = useStore(({ rolecreate, app }) => ({ rolecreate, app }));

    useEffect(() => {
        store.dispatch(initializeRoleCreate())
    }, [])

    const onUpdateField = (ev: any) => {
        const name = ev.target.name;
        const value = ev.target.value;
        store.dispatch(updateField({ name: name as keyof CreateRoleState['role'], value }));
    }

    const onSubmit = async () => {
        store.dispatch(updateErrors({}))
        try {
            await validationSchema.validate(role, { abortEarly: false });
        } catch (error: any) {
            const errors = error.inner.reduce((allErrors: any, currentError: any) => {
                return { ...allErrors, [currentError.path as string]: currentError.message };
            }, {});
            store.dispatch(updateErrors(errors))
            if (errors)
                return;
        }
        store.dispatch(startPreloader());
        const result = await roleCreate(role)
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
            <SweetAlert success title="Success" onConfirm={updateRole}>
                {t('role_create_success_message')}
            </SweetAlert>
        );
    }

    const updateRole = async () => {
        store.dispatch(toggleInformationModalStatus());
        const Roles = await getRoleList(store.getState().rolelist.search, 1);
        store.dispatch(loadRoles(Roles));
        modalRef.current?.click()
    }
    const onModalClose = () => {
        store.dispatch(initializeRoleCreate())
    }
    const validationSchema = yup.object().shape({
        Name: yup.string().required('validation_error_role_create_name_required').max(64, 'validation_error_role_create_name_max'),
        Code: yup.string().required('validation_error_role_create_code_required').max(16, 'validation_error_role_create_code_max')

    });
    return (
        <>
         {checkForPermission("ROLE_MANAGE") &&
            <div
                className="modal fade"
                id='CreateRole'
                data-bs-backdrop='static'
                data-bs-keyboard='false'
                aria-hidden='true'
            >
                <div className="modal-dialog ">
                    <div className="modal-content">
                        <div className="modal-header mx-2">
                            <h5 className="modal-title">{t('role_create_title')}</h5>
                            <button
                                type='button'
                                className="btn-close"
                                data-bs-dismiss='modal'
                                id='closeCreateRoleModal'
                                aria-label='Close'
                                onClick={onModalClose}
                                ref={modalRef}
                            ></button>
                        </div>
                        <div className="modal-body">
                            <ContainerPage>
                                <ValidationErrorComp errors={errors} />
                                <div className=''>
                                    <div className='row mb-1'>
                                        <div className='col-md-12'>
                                            <label className="mt-2 red-asterisk">{t('role_create_input_name')}</label>
                                            <input name='Name' onChange={onUpdateField} type='text'
                                                value={role.Name}
                                                className={`form-control  ${errors["Name"] ? "is-invalid" : ""}`}
                                            ></input>
                                            <div className="invalid-feedback"> {t(errors['Name'])}</div>
                                        </div>
                                            <div className='col-md-12'>
                                                <label className="mt-2 red-asterisk">{t('role_create_input_code')}</label>
                                                <input name='Code' maxLength={16} onChange={onUpdateField} type='text'
                                                    value={role.Code}
                                                    className={`form-control  ${errors["Code"] ? "is-invalid" : ""}`}
                                                ></input>
                                                <div className="invalid-feedback"> {t(errors['Code'])}</div>
                                            </div>
                                        <div className="col-md-12">
                                            <label className="mt-2 red-asterisk">{t('role_create_label_status')}</label>
                                            <select name="IsActive" onChange={onUpdateField} className="form-select">
                                                <option value="1">{t('role_create_select_option_1')}</option>
                                                <option value="0">{t('role_create_select_option_0')}</option>
                                            </select>
                                        </div>
                                        <div className="col-md-12 mt-4 ">
                                            <button type='button' className='btn  app-primary-bg-color text-white mt-2 float-end' onClick={onSubmit}>
                                                {t('role_create_button')}
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
         }
        </>
    );
}