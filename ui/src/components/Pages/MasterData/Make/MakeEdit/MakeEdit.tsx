import { useTranslation } from "react-i18next";
import { ContainerPage } from "../../../../ContainerPage/ContainerPage";
import { ValidationErrorComp } from "../../../../ValidationErrors/ValidationError";
import { store } from "../../../../../state/store";
import SweetAlert from "react-bootstrap-sweetalert";
import * as yup from 'yup';
import { convertBackEndErrorsToValidationErrors } from "../../../../../helpers/formats";
import { useStore } from "../../../../../state/storeHooks";
import { startPreloader, stopPreloader } from "../../../../Preloader/Preloader.slice";
import { useRef } from "react";
import { UpdateMakeState, initializeMakeUpdate, toggleInformationModalStatus, updateErrors, updateField } from "./MakeEdit.slice";
import { editMake, getMakeList } from "../../../../../services/make";
import { loadMakes } from "../MakeList/MakeList.slice";

export const MakeEdit = () => {
    const { t } = useTranslation();
    const modalRef = useRef<HTMLButtonElement>(null);

    const { displayInformationModal, errors, make } = useStore(({ makeupdate }) => makeupdate);

    const onUpdateField = (ev: any) => {
        var { name, value } = ev.target
        store.dispatch(updateField({ name: name as keyof UpdateMakeState['make'], value }));
    }

    const validationSchema = yup.object().shape({
        Code: yup.string().required('validation_error_make_update_code_required').max(8, ('validation_error_make_update_code_max')),
        Name: yup.string().required('validation_error_make_update_name_required'),
    });

    const onSubmit = async () => {
        store.dispatch(updateErrors({}))
        try {
            await validationSchema.validate(make, { abortEarly: false });
        } catch (error: any) {
            const errors = error.inner.reduce((allErrors: any, currentError: any) => {
                return { ...allErrors, [currentError.path as string]: currentError.message };
            }, {});
            store.dispatch(updateErrors(errors))
            if (errors)
                return;
        }
        store.dispatch(startPreloader());
        const result = await editMake(make)
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
            <SweetAlert success title="Success" onConfirm={updateMakeList}>
                {t('make_update_success_message')}
            </SweetAlert>
        );
    }

    const updateMakeList = async () => {
        store.dispatch(toggleInformationModalStatus());
        const result = await getMakeList(store.getState().makelist.search, 1);
        store.dispatch(loadMakes(result));
        modalRef.current?.click()
    }

    const onModalClose = () => {
        store.dispatch(initializeMakeUpdate())
    }

    return (
        <>
            <div
                className="modal fade"
                id='EditMake'
                data-bs-backdrop='static'
                data-bs-keyboard='false'
                aria-hidden='true'
            >
                <div className="modal-dialog ">
                    <div className="modal-content">
                        <div className="modal-header mx-3">
                            <h5 className="modal-title app-primary-color">{t('make_update_title')}</h5>
                            <button
                                type='button'
                                className="btn-close"
                                data-bs-dismiss='modal'
                                id='closeEditMake'
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
                                        <div className='col-md-12'>
                                            <label className="mt-2 red-asterisk">{t('make_update_input_code')}</label>
                                            <input name='Code' onChange={onUpdateField} type='text' disabled={true}
                                                value={make.Code}
                                                className={`form-control  ${errors["Code"] ? "is-invalid" : ""}`}
                                            ></input>
                                            <div className="invalid-feedback"> {t(errors['Code'])}</div>
                                        </div>
                                        <div className='col-md-12'>
                                            <label className="mt-2 red-asterisk">{t('make_update_input_name')}</label>
                                            <input name='Name' onChange={onUpdateField} type='text'
                                                value={make.Name}
                                                className={`form-control  ${errors["Name"] ? "is-invalid" : ""}`}
                                            ></input>
                                            <div className="invalid-feedback"> {t(errors['Name'])}</div>
                                        </div>
                                        <div className="col-md-12 mt-2">
                                            <button type='button' className='btn float-end app-primary-bg-color text-white mt-2' onClick={onSubmit}>
                                                {t('make_update_button')}
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