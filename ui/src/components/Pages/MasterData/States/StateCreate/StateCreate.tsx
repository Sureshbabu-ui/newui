import { useTranslation } from "react-i18next";
import { ContainerPage } from "../../../../ContainerPage/ContainerPage";
import { ValidationErrorComp } from "../../../../ValidationErrors/ValidationError";
import { CreateState, initializeStateCreate,toggleInformationModalStatus, updateErrors, updateField } from "./StateCreate.slice";
import { store } from "../../../../../state/store";
import { startPreloader, stopPreloader } from "../../../../Preloader/Preloader.slice";
import { useStore } from '../../../../../state/storeHooks';
import { useEffect, useRef, useState } from "react";
import SweetAlert from "react-bootstrap-sweetalert";
import { convertBackEndErrorsToValidationErrors, formatSelectInput } from "../../../../../helpers/formats";
import * as yup from 'yup';
import { checkForPermission } from "../../../../../helpers/permissions";
import { getAllStates, stateCreate } from "../../../../../services/state";
import Select from 'react-select';
import { getCountries } from "../../../../../services/country";
import { loadStates } from "../StateList.slice";

export const StateCreate = () => {
    const { t } = useTranslation();
    const modalRef = useRef<HTMLButtonElement>(null);
    const { statecreate: { state, displayInformationModal, errors } } = useStore(({ statecreate }) => ({ statecreate }));

    const [countryList, setCountryList] = useState<any>(null)
    const [formattedCountryList, setFormattedCountryList] = useState<any>(null)

    useEffect(() => {
        store.dispatch(initializeStateCreate())
        getCountryList()
    }, [])

    useEffect(() => {
        if (countryList != null)
            setFormattedCountryList(formatSelectInput(countryList, "Name", "Id"))
    }, [countryList])

    const getCountryList = async () => {
        const Countries = await getCountries();
        setCountryList(Countries.Countries);
    }

    const onUpdateField = (ev: any) => {
        var name = ev.target.name;
        var value = ev.target.value;
        store.dispatch(updateField({ name: name as keyof CreateState['state'], value }));
    }

    function onFieldChangeSelect(selectedOption: any, actionMeta: any) {
        const name = actionMeta.name;
        const value = selectedOption.value;
        store.dispatch(updateField({ name: 'CountryId', value }));
    }

    const onSubmit = async () => {
        store.dispatch(updateErrors({}))
        try {
            await validationSchema.validate(state, { abortEarly: false });
        } catch (error: any) {
            const errors = error.inner.reduce((allErrors: any, currentError: any) => {
                return { ...allErrors, [currentError.path as string]: currentError.message };
            }, {});
            store.dispatch(updateErrors(errors))
            if (errors)
                return;
        }
        store.dispatch(startPreloader());
        const result = await stateCreate(state)
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
            <SweetAlert success title="Success" onConfirm={updateState}>
                {t('state_create_success_message')}
            </SweetAlert>
        );
    }

    const updateState = async () => {
        store.dispatch(toggleInformationModalStatus());
        const result = await getAllStates(store.getState().statelist.search, store.getState().statelist.currentPage);
        store.dispatch(loadStates(result));
        modalRef.current?.click()
    }

    const onModalClose = () => {
        store.dispatch(initializeStateCreate())
    }

    const validationSchema = yup.object().shape({
        Code: yup.string().required('validation_error_state_create_code_required').max(2, 'validation_error_state_create_code_max'),
        Name: yup.string().required('validation_error_state_create_name_required'),
        CountryId: yup.number().positive('validation_error_state_create_country_required'),
        GstStateCode: yup.string().required('validation_error_state_create_gst_state_code_required'),
        GstStateName: yup.string().required('validation_error_state_create_gst_state_name_required'),
    });
    return (
        <>
            <div
                className="modal fade"
                id='CreateState'
                data-bs-backdrop='static'
                data-bs-keyboard='false'
                aria-hidden='true'
            >
                <div className="modal-dialog ">
                    <div className="modal-content">
                        <div className="modal-header mx-2">
                            <h5 className="modal-title">{t('state_create_title')}</h5>
                            <button
                                type='button'
                                className="btn-close"
                                data-bs-dismiss='modal'
                                id='closeCreateStateModal'
                                aria-label='Close'
                                onClick={onModalClose}
                                ref={modalRef}
                            ></button>
                        </div>
                        {checkForPermission("STATE_MANAGE") &&
                            <div className="modal-body">
                                <ContainerPage>
                                    <ValidationErrorComp errors={errors} />
                                    <div className=''>
                                        <div className='row mb-1'>
                                            <div className='col-md-12'>
                                                <label className="mt-2 red-asterisk">{t('state_create_input_code')}</label>
                                                <input name='Code'
                                                    value={state.Code}
                                                    className={`form-control  ${errors["Code"] ? "is-invalid" : ""}`}
                                                    onChange={onUpdateField} type='text' ></input>
                                                <div className="invalid-feedback"> {t(errors['Code'])}</div>
                                            </div>
                                            <div className='col-md-12'>
                                                <label className="mt-2 red-asterisk">{t('state_create_input_name')}</label>
                                                <input name='Name' onChange={onUpdateField} type='text'
                                                    value={state.Name}
                                                    className={`form-control  ${errors["Name"] ? "is-invalid" : ""}`}
                                                ></input>
                                                <div className="invalid-feedback"> {t(errors['Name'])}</div>
                                            </div>
                                            <div className="col-md-12">
                                                <label className="mt-2 red-asterisk">{t('state_create_input_country')}</label>
                                                <Select
                                                    options={formattedCountryList}
                                                    value={formattedCountryList && formattedCountryList.find(option => option.value == state.CountryId) || null}
                                                    onChange={(selectedOption) => onFieldChangeSelect(selectedOption, 'CountryId')}
                                                    isSearchable
                                                    classNamePrefix="react-select"
                                                    name="CountryId"
                                                    placeholder={t('state_create_placeholder_country')}
                                                />
                                                <div className="small text-danger"> {t(errors['CountryId'])}</div>
                                            </div>
                                            <div className='col-md-12'>
                                                <label className="mt-2 red-asterisk">{t('state_create_input_gst_state_code')}</label>
                                                <input name='GstStateCode'
                                                    value={state.GstStateCode}
                                                    className={`form-control  ${errors["GstStateCode"] ? "is-invalid" : ""}`}
                                                    onChange={onUpdateField} type='text' ></input>
                                                <div className="invalid-feedback"> {t(errors['GstStateCode'])}</div>
                                            </div>
                                            <div className='col-md-12'>
                                                <label className="mt-2 red-asterisk">{t('state_create_input_gst_state_name')}</label>
                                                <input name='GstStateName' onChange={onUpdateField} type='text'
                                                    value={state.GstStateName}
                                                    className={`form-control  ${errors["GstStateName"] ? "is-invalid" : ""}`}
                                                ></input>
                                                <div className="invalid-feedback"> {t(errors['GstStateName'])}</div>
                                            </div>
                                            <div className="col-md-12 mt-4">
                                                <button type='button' className='btn  app-primary-bg-color text-white mt-2' onClick={onSubmit}>
                                                    {t('state_create_button')}
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