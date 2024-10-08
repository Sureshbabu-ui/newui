import { useTranslation } from "react-i18next";
import { ContainerPage } from "../../../../ContainerPage/ContainerPage";
import { ValidationErrorComp } from "../../../../ValidationErrors/ValidationError";
import { CreateDesignationState, initializeDesignationCreate, toggleInformationModalStatus, updateErrors, updateField } from "./DesignationCreate.slice";
import { store } from "../../../../../state/store";
import { startPreloader, stopPreloader } from "../../../../Preloader/Preloader.slice";
import { getDesignationList, designationCreate } from "../../../../../services/designation";
import { useStore } from '../../../../../state/storeHooks';
import { useEffect, useRef } from "react";
import SweetAlert from "react-bootstrap-sweetalert";
import { loadDesignations } from "../DesignationList/DesignationList.slice";
import { convertBackEndErrorsToValidationErrors } from "../../../../../helpers/formats";
import * as yup from 'yup';
import { checkForPermission } from "../../../../../helpers/permissions";

export const DesignationCreate = () => {
    const { t } = useTranslation();
    const modalRef = useRef<HTMLButtonElement>(null);
    const {
        designationcreate: { designation, displayInformationModal, errors },
    } = useStore(({ designationcreate, app }) => ({ designationcreate, app }));

    useEffect(() => {
        store.dispatch(initializeDesignationCreate())
    }, [])

    const onUpdateField = (ev: any) => {
        const name = ev.target.name;
        const value = ev.target.value;
        store.dispatch(updateField({ name: name as keyof CreateDesignationState['designation'], value }));
    }

    const onSubmit = async () => {
        store.dispatch(updateErrors({}))
        try {
            await validationSchema.validate(designation, { abortEarly: false });
        } catch (error: any) {
            const errors = error.inner.reduce((allErrors: any, currentError: any) => {
                return { ...allErrors, [currentError.path as string]: currentError.message };
            }, {});
            store.dispatch(updateErrors(errors))
            if (errors)
                return;
        }
        store.dispatch(startPreloader());
        const result = await designationCreate(designation)
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
            <SweetAlert success title="Success" onConfirm={updateDesignation}>
                {t('designation_create_success_message')}
            </SweetAlert>
        );
    }

    const updateDesignation = async () => {
        store.dispatch(toggleInformationModalStatus());
        const Designations = await getDesignationList(store.getState().designationlist.search, 1);
        store.dispatch(loadDesignations(Designations));
        modalRef.current?.click()
    }
    const onModalClose = () => {
        store.dispatch(initializeDesignationCreate())
    }
    const validationSchema = yup.object().shape({
        Code: yup.string().required(t('validation_error_designation_create_code_required') ?? '').max(8, t('validation_error_designation_create_code_max') ?? ''),
        Name: yup.string().required(t('validation_error_designation_create_name_required') ?? '').max(64, t('validation_error_designation_create_name_max') ?? ''),
    });
    return (
        <>
            <div
                className="modal fade"
                id='CreateDesignation'
                data-bs-backdrop='static'
                data-bs-keyboard='false'
                aria-hidden='true'
            >
                <div className="modal-dialog ">
                    <div className="modal-content">
                        <div className="modal-header mx-2">
                            <h5 className="modal-title">{t('designation_create_title')}</h5>
                            <button
                                type='button'
                                className="btn-close"
                                data-bs-dismiss='modal'
                                id='closeCreateDesignationModal'
                                aria-label='Close'
                                onClick={onModalClose}
                                ref={modalRef}
                            ></button>
                        </div>
                        {checkForPermission("DESIGNATION_MANAGE") &&<>
                        <div className="modal-body">
                            <ContainerPage>
                                <ValidationErrorComp errors={errors} />
                                <div className=''>
                                    <div className='row mb-1'>
                                        <div className='col-md-12'>
                                            <label className="mt-2 red-asterisk">{t('designation_create_input_code')}</label>
                                            <input name='Code'
                                                value={designation.Code}
                                                className={`form-control  ${errors["Code"] ? "is-invalid" : ""}`}
                                                onChange={onUpdateField} type='text' ></input>
                                            <div className="invalid-feedback"> {errors['Code']}</div>
                                        </div>
                                        <div className='col-md-12'>
                                            <label className="mt-2 red-asterisk">{t('designation_create_input_name')}</label>
                                            <input name='Name' onChange={onUpdateField} type='text'
                                                value={designation.Name}
                                                className={`form-control  ${errors["Name"] ? "is-invalid" : ""}`}
                                            ></input>
                                            <div className="invalid-feedback"> {errors['Name']}</div>
                                        </div>
                                        <div className="col-md-12">
                                            <label className="mt-2 red-asterisk">{t('designation_create_label_status')}</label>
                                            <select name="IsActive" onChange={onUpdateField} className="form-select">
                                                <option value="1">{t('designation_create_select_option_1')}</option>
                                                <option value="0">{t('designation_create_select_option_0')}</option>
                                            </select>
                                        </div>
                                        <div className="col-md-12 mt-4 ">
                                            <button type='button' className='btn  app-primary-bg-color text-white mt-2 float-end' onClick={onSubmit}>
                                                {t('designation_create_button')}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </ContainerPage>
                            {displayInformationModal ? <InformationModal /> : ""}
                        </div>
                        </>}

                    </div>
                </div>
            </div>
        </>
    );
}