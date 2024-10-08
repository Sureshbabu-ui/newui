import { useTranslation } from "react-i18next";
import { ContainerPage } from "../../../../ContainerPage/ContainerPage";
import { ValidationErrorComp } from "../../../../ValidationErrors/ValidationError";
import { EditRoleState, initializeRoleEdit, toggleInformationModalStatus, updateErrors, updateField } from "./RoleEdit.slice";
import { store } from "../../../../../state/store";
import { startPreloader, stopPreloader } from "../../../../Preloader/Preloader.slice";
import { useStore } from '../../../../../state/storeHooks';
import { useEffect, useRef } from "react";
import SweetAlert from "react-bootstrap-sweetalert";
import { loadRoles } from "../RoleList/RoleList.slice";
import { convertBackEndErrorsToValidationErrors } from "../../../../../helpers/formats";
import * as yup from 'yup';
import { getRoleList, roleEdit } from "../../../../../services/roles";
import { checkForPermission } from "../../../../../helpers/permissions";

export const EditRole = () => {
    const { t } = useTranslation();
    const modalRef = useRef<HTMLButtonElement>(null);
    const {
        roleedit: { role, displayInformationModal, errors },
    } = useStore(({ roleedit }) => ({ roleedit }));

    useEffect(() => {
        store.dispatch(initializeRoleEdit())
    }, [])

    const onUpdateField = (ev: any) => {
        var name = ev.target.name;
        var value = ev.target.value;
        if (name == "IsActive") {
            value = ev.target.checked ? true : false;
        }
        store.dispatch(updateField({ name: name as keyof EditRoleState['role'], value }));
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
        const result = await roleEdit(role)
        result.match({
            ok: ({ IsRoleUpdated }) => {
                IsRoleUpdated == true ? store.dispatch(toggleInformationModalStatus()) : store.dispatch(updateErrors({ "Message": t('validation_error_role_edit_warning') }))
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
                {t('role_edit_success_message')}
            </SweetAlert>
        );
    }

    const updateRole = async () => {
        store.dispatch(toggleInformationModalStatus());
        const searchSubmit = store.getState().rolelist.searchSubmit;
        const currentPage = store.getState().rolelist.currentPage;
        const search = store.getState().rolelist.search;
        const Roles = await getRoleList(searchSubmit ? search : "", currentPage);
        store.dispatch(loadRoles(Roles));
        modalRef.current?.click()
    }
    
    const onModalClose = () => {
        store.dispatch(initializeRoleEdit())
    }
    const validationSchema = yup.object().shape({
        Name: yup.string().required('validation_error_role_edit_name_required').max(64,'validation_error_role_edit_name_max'),
    });
    return (
        <>
            <div
                className="modal fade"
                id='EditRole'
                data-bs-backdrop='static'
                data-bs-keyboard='false'
                aria-hidden='true'
            >
                <div className="modal-dialog ">
                    <div className="modal-content">
                        <div className="modal-header mx-2">
                            <h5 className="modal-title">{t('role_edit_title')}</h5>
                            <button
                                type='button'
                                className="btn-close"
                                data-bs-dismiss='modal'
                                id='closeEditRoleModal'
                                aria-label='Close'
                                onClick={onModalClose}
                                ref={modalRef}
                            ></button>
                        </div>
                        {checkForPermission("ROLE_MANAGE") &&
                        <div className="modal-body">
                            <ContainerPage>
                                <ValidationErrorComp errors={errors} />
                                <div className=''>
                                    <div className='row mb-1'>
                                        <div className='col-md-12'>
                                            <label className="mt-2 red-asterisk">{t('role_edit_input_name')}</label>
                                            <input name='Name' onChange={onUpdateField} type='text'
                                                value={role.Name}
                                                className={`form-control  ${errors["Name"] ? "is-invalid" : ""}`}
                                            ></input>
                                            <div className="invalid-feedback"> {t(errors['Name'])}</div>
                                        </div>
                                        <div className="col-md-12">
                                            <div className="mt-2 form-check form-switch">
                                                <label className="form-check-label" htmlFor="flexSwitchCheckDefault">
                                                    {t('role_edit_label_status')}
                                                    <input
                                                        className="form-check-input switch-input-lg"
                                                        type="checkbox"
                                                        name="IsActive"
                                                        id="flexSwitchCheckDefault"
                                                        checked={role.IsActive.valueOf()}
                                                        value={role.IsActive.toString()}
                                                        onChange={onUpdateField}
                                                    /> 
                                                </label>
                                                <div className="form-text">
                                                    {t('role_edit_label_status_help_text')}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-12 mt-4 ">
                                            <button type='button' className='btn  app-primary-bg-color text-white mt-2 float-end' onClick={onSubmit}>
                                                {t('role_edit_button')}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </ContainerPage>
                            {displayInformationModal ? <InformationModal /> : ""}
                        </div>
                        }
                    </div>
                </div>
            </div>
        </>
    );
}