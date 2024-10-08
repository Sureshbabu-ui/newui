import { useTranslation } from "react-i18next";
import { ContainerPage } from "../../../../ContainerPage/ContainerPage";
import { ValidationErrorComp } from "../../../../ValidationErrors/ValidationError";
import { CreateCountryState, initializeCountryCreate, toggleInformationModalStatus, updateErrors, updateField } from "./CountryCreate.slice";
import { store } from "../../../../../state/store";
import { startPreloader, stopPreloader } from "../../../../Preloader/Preloader.slice";
import { useStore } from '../../../../../state/storeHooks';
import { useRef} from "react";
import SweetAlert from "react-bootstrap-sweetalert";
import { convertBackEndErrorsToValidationErrors } from "../../../../../helpers/formats";
import * as yup from 'yup';
import { checkForPermission } from "../../../../../helpers/permissions";
import { loadCountryList } from "../CountryList/CountryList.slice";
import { countryCreate, getCountryList } from "../../../../../services/country";

export const CountryCreate = () => {
    const { t } = useTranslation();
    const modalRef = useRef<HTMLButtonElement>(null);
    const { countrycreate: { countrycreate,displayInformationModal, errors } } = useStore(({ countrycreate }) => ({ countrycreate }));

    const onUpdateField = (ev: any) => {
        var name = ev.target.name;
        var value = ev.target.value;
        store.dispatch(updateField({ name: name as keyof CreateCountryState['countrycreate'], value }));
    }

    const onSubmit = async () => {
        store.dispatch(updateErrors({}))
        try {
            await validationSchema.validate(countrycreate, { abortEarly: false });
        } catch (error: any) {
            const errors = error.inner.reduce((allErrors: any, currentError: any) => {
                return { ...allErrors, [currentError.path as string]: currentError.message };
            }, {});
            store.dispatch(updateErrors(errors))
            if (errors)
                return;
        }
        store.dispatch(startPreloader());
        const result = await countryCreate(countrycreate)
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
            <SweetAlert success title="Success" onConfirm={updateCountry}>
                {t('country_create_success_message')}
            </SweetAlert>
        );
    }

    const updateCountry = async () => {
        store.dispatch(toggleInformationModalStatus());
        const result = await getCountryList(store.getState().countrylist.searchWith, store.getState().countrylist.currentPage);
        store.dispatch(loadCountryList(result));
        modalRef.current?.click()
    }

    const onModalClose = () => {
        store.dispatch(initializeCountryCreate())
    }

    const validationSchema = yup.object().shape({
        IsoThreeCode: yup.string().required('validation_error_country_create_isothreecode_required'),
        Name: yup.string().required('validation_error_country_create_name_required'),
        IsoTwoCode: yup.string().required('validation_error_country_create_isotwocode_required'),
        CallingCode: yup.string().required('validation_error_country_create_calling_code_required'),
        CurrencyCode: yup.string().required('validation_error_country_create_currency_code_required'),
        CurrencyName: yup.string().required('validation_error_country_create_currency_name_required'),
        CurrencySymbol: yup.string().required('validation_error_country_create_currency_symbol_required'),
    });

    return (
        <>
            <div
                className="modal fade"
                id='CreateCountry'
                data-bs-backdrop='static'
                data-bs-keyboard='false'
                aria-hidden='true'
            >
                <div className="modal-dialog ">
                    <div className="modal-content">
                        <div className="modal-header mx-2">
                            <h5 className="modal-title">{t('country_create_title')}</h5>
                            <button
                                type='button'
                                className="btn-close"
                                data-bs-dismiss='modal'
                                id='closeCreateCountryModal'
                                aria-label='Close'
                                onClick={onModalClose}
                                ref={modalRef}
                            ></button>
                        </div>
                        {checkForPermission("COUNTRY_MANAGE") &&
                            <div className="modal-body">
                                <ContainerPage>
                                    <ValidationErrorComp errors={errors} />
                                    <div className=''>
                                        <div className='row mb-1'>
                                            <div className='col-md-12'>
                                                <label className="mt-2 red-asterisk">{t('country_create_isothreecode')}</label>
                                                <input name='IsoThreeCode'
                                                    value={countrycreate.IsoThreeCode}
                                                    maxLength={3}
                                                    className={`form-control  ${errors["IsoThreeCode"] ? "is-invalid" : ""}`}
                                                    onChange={onUpdateField} type='text' ></input>
                                                <div className="invalid-feedback"> {t(errors['IsoThreeCode'])}</div>
                                            </div>
                                            <div className='col-md-12'>
                                                <label className="mt-2 red-asterisk">{t('country_create_isotwocode')}</label>
                                                <input name='IsoTwoCode' onChange={onUpdateField} type='text'
                                                    value={countrycreate.IsoTwoCode}
                                                    maxLength={2}
                                                    className={`form-control  ${errors["IsoTwoCode"] ? "is-invalid" : ""}`}
                                                ></input>
                                                <div className="invalid-feedback"> {t(errors['IsoTwoCode'])}</div>
                                            </div>
                                            <div className='col-md-12'>
                                                <label className="mt-2 red-asterisk">{t('country_create_name')}</label>
                                                <input name='Name'
                                                    value={countrycreate.Name}
                                                    className={`form-control  ${errors["Name"] ? "is-invalid" : ""}`}
                                                    onChange={onUpdateField} type='text' ></input>
                                                <div className="invalid-feedback"> {t(errors['Name'])}</div>
                                            </div>
                                            <div className='col-md-12'>
                                                <label className="mt-2 red-asterisk">{t('country_create_callingcode')}</label>
                                                <input name='CallingCode' onChange={onUpdateField} type='text'
                                                    value={countrycreate.CallingCode}
                                                    className={`form-control  ${errors["CallingCode"] ? "is-invalid" : ""}`}
                                                ></input>
                                                <div className="invalid-feedback"> {t(errors['CallingCode'])}</div>
                                            </div>
                                            <div className='col-md-12'>
                                                <label className="mt-2 red-asterisk">{t('country_create_currencycode')}</label>
                                                <input name='CurrencyCode'
                                                    value={countrycreate.CurrencyCode}
                                                    className={`form-control  ${errors["CurrencyCode"] ? "is-invalid" : ""}`}
                                                    onChange={onUpdateField} type='text' ></input>
                                                <div className="invalid-feedback"> {t(errors['CurrencyCode'])}</div>
                                            </div>
                                            <div className='col-md-12'>
                                                <label className="mt-2 red-asterisk">{t('country_create_currencyname')}</label>
                                                <input name='CurrencyName' onChange={onUpdateField} type='text'
                                                    value={countrycreate.CurrencyName}
                                                    className={`form-control  ${errors["CurrencyName"] ? "is-invalid" : ""}`}
                                                ></input>
                                                <div className="invalid-feedback"> {t(errors['CurrencyName'])}</div>
                                            </div>
                                            <div className='col-md-12'>
                                                <label className="mt-2 red-asterisk">{t('country_create_currencysymbol')}</label>
                                                <input name='CurrencySymbol' onChange={onUpdateField} type='text'
                                                    value={countrycreate.CurrencySymbol}
                                                    className={`form-control  ${errors["CurrencySymbol"] ? "is-invalid" : ""}`}
                                                ></input>
                                                <div className="invalid-feedback"> {t(errors['CurrencySymbol'])}</div>
                                            </div>
                                            <div className="col-md-12 mt-4">
                                                <button type='button' className='btn  app-primary-bg-color text-white mt-2' onClick={onSubmit}>
                                                    {t('country_create_button')}
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