import { useTranslation } from "react-i18next";
import { ContainerPage } from "../../../../ContainerPage/ContainerPage";
import { ValidationErrorComp } from "../../../../ValidationErrors/ValidationError";
import { CreateMakeState, initializeMakeCreate, toggleInformationModalStatus, updateErrors, updateField } from "./MakeCreate.slice";
import { store } from "../../../../../state/store";
import { startPreloader, stopPreloader } from "../../../../Preloader/Preloader.slice";
import { useStore } from '../../../../../state/storeHooks';
import { useEffect, useRef } from "react";
import SweetAlert from "react-bootstrap-sweetalert";
import { loadMakes } from "../MakeList/MakeList.slice";
import { convertBackEndErrorsToValidationErrors } from "../../../../../helpers/formats";
import * as yup from 'yup';
import { getMakeList, makeCreate } from "../../../../../services/make";
import { checkForPermission } from "../../../../../helpers/permissions";

export const MakeCreate = () => {
    const { t } = useTranslation();
    const modalRef = useRef<HTMLButtonElement>(null);
    const {
        makecreate: { make, displayInformationModal, errors },
    } = useStore(({ makecreate, app }) => ({ makecreate, app }));

    useEffect(() => {
        store.dispatch(initializeMakeCreate())
    }, [])

    const onUpdateField = (ev: any) => {
        var { name, value } = ev.target
        store.dispatch(updateField({ name: name as keyof CreateMakeState['make'], value }));
    }

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
        const result = await makeCreate(make)
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
            <SweetAlert success title="Success" onConfirm={updateMakeList}>
                {t('make_create_success_message')}
            </SweetAlert>
        );
    }

    const updateMakeList = async () => {
        store.dispatch(toggleInformationModalStatus());
        const relult = await getMakeList(store.getState().makelist.search, 1);
        store.dispatch(loadMakes(relult));
        modalRef.current?.click()
    }

    const onModalClose = () => {
        store.dispatch(initializeMakeCreate())
    }
    const validationSchema = yup.object().shape({
        Name: yup.string().required('validation_error_make_create_name_required').max(64, ('validation_error_make_create_name_max')),
    });
    return (
        <>
            <div
                className="modal fade"
                id='CreateMake'
                data-bs-backdrop='static'
                data-bs-keyboard='false'
                aria-hidden='true'
            >
                <div className="modal-dialog modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header mx-2">
                            <h5 className="modal-title">{t('make_create_title')}</h5>
                            <button
                                type='button'
                                className="btn-close"
                                data-bs-dismiss='modal'
                                id='closeCreateMakeModal'
                                aria-label='Close'
                                onClick={onModalClose}
                                ref={modalRef}
                            ></button>
                        </div>
                        {checkForPermission("MAKE_MANAGE") &&
                            <div className="modal-body">
                                <ContainerPage>
                                    <ValidationErrorComp errors={errors} />
                                    <div className=''>
                                        <div className='row mb-1'>
                                            <div className='col-md-12'>
                                                <label className="mt-2 red-asterisk">{t('make_create_input_name')}</label>
                                                <input name='Name' onChange={onUpdateField} type='text'
                                                    value={make.Name}
                                                    className={`form-control  ${errors["Name"] ? "is-invalid" : ""}`}
                                                ></input>
                                                <div className="invalid-feedback"> {t(errors['Name'])}</div>
                                            </div>
                                            <div className="col-md-12 mt-2">
                                                <button type='button' className='btn float-end app-primary-bg-color text-white mt-2' onClick={onSubmit}>
                                                    {t('make_create_button')}
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