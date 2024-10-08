import { useTranslation } from "react-i18next";
import { ContainerPage } from "../../../../ContainerPage/ContainerPage";
import { ValidationErrorComp } from "../../../../ValidationErrors/ValidationError";
import { EditCityState, initializeCityEdit, loadStates, loadTenantOffices, setCountryId, toggleInformationModalStatus, updateErrors, updateField } from "./CityEdit.slice";
import { store } from "../../../../../state/store";
import { startPreloader, stopPreloader } from "../../../../Preloader/Preloader.slice";
import { useStore } from '../../../../../state/storeHooks';
import { useEffect, useRef, useState } from "react";
import SweetAlert from "react-bootstrap-sweetalert";
import { convertBackEndErrorsToValidationErrors, formatSelectInput } from "../../../../../helpers/formats";
import * as yup from 'yup';
import { checkForPermission } from "../../../../../helpers/permissions";
import { cityEdit, getAllCities } from "../../../../../services/city";
import { loadCities } from "../CityList/City.slice";
import { getCountries } from "../../../../../services/country";
import { getFilteredStatesByCountry } from "../../../../../services/state";
import Select from "react-select";
import { CreateCityState } from "../CityCreate/CityCreate.slice";
import { getUserTenantOfficeName } from "../../../../../services/users";

export const CityEdit = () => {
    const { t } = useTranslation();
    const modalRef = useRef<HTMLButtonElement>(null);
    const { cityedit: { city, CountryId, States, countries, displayInformationModal, errors, Location } } = useStore(({ cityedit }) => ({ cityedit }));

    useEffect(() => {
        store.dispatch(initializeCityEdit())
        getCountryList()
        onLoad()
    }, [])

    const onLoad = async () => {
        const TenantLocations = await getUserTenantOfficeName();
        const filteredTenantOfiiceInfo = formatSelectInput(TenantLocations.TenantOfficeName, "OfficeName", "Id")
        store.dispatch(loadTenantOffices({ MasterData: filteredTenantOfiiceInfo }));
    }

    const [countryList, setCountryList] = useState<any>(null)
    const [formattedCountryList, setFormattedCountryList] = useState<any>(null)

    useEffect(() => {
        if (countryList != null)
            setFormattedCountryList(formatSelectInput(countryList, "Name", "Id"))
    }, [countryList])

    const getCountryList = async () => {
        const Countries = await getCountries();
        setCountryList(Countries.Countries);
        store.dispatch(setCountryId(1))
    }

    useEffect(() => {
        if (CountryId != 0) {
            getFilteredStates()
        }
    }, [CountryId])

    const getFilteredStates = async () => {
        const States = await getFilteredStatesByCountry(String(CountryId));
        const FilteredStates = await formatSelectInput(States.States, "Name", "Id")
        store.dispatch(loadStates({ States: FilteredStates }))
    }

    const onUpdateField = (ev: any) => {
        var name = ev.target.name;
        var value = ev.target.value;
        store.dispatch(updateField({ name: name as keyof EditCityState['city'], value }));
    }

    const onSubmit = async () => {
        store.dispatch(updateErrors({}))
        try {
            await validationSchema.validate(city, { abortEarly: false });
        } catch (error: any) {
            const errors = error.inner.reduce((allErrors: any, currentError: any) => {
                return { ...allErrors, [currentError.path as string]: currentError.message };
            }, {});
            store.dispatch(updateErrors(errors))
            if (errors)
                return;
        }
        store.dispatch(startPreloader());
        const result = await cityEdit(city)
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
            <SweetAlert success title="Success" onConfirm={updateCity}>
                {t('city_edit_success_message')}
            </SweetAlert>
        );
    }

    const updateCity = async () => {
        store.dispatch(toggleInformationModalStatus());
        const result = await getAllCities(store.getState().citieslist.searchWith, store.getState().citieslist.currentPage);
        store.dispatch(loadCities(result));
        modalRef.current?.click()
    }

    const onModalClose = () => {
        store.dispatch(initializeCityEdit())
    }

    const validationSchema = yup.object().shape({
        Code: yup.string().required('validation_error_city_update_code_required').max(8, 'validation_error_city_update_code_max'),
        Name: yup.string().required('validation_error_city_update_name_required'),
        StateId: yup.number().positive('validation_error_city_update_state_required'),
        TenantOfficeId: yup.number().positive('validation_error_city_create_tenantoffice_required'),
    });

    function onFieldChangeSelect(selectedOption: any, actionMeta: any) {
        const name = actionMeta.name;
        const value = selectedOption.value;
        store.dispatch(updateField({ name: name as keyof CreateCityState['city'], value }));
    }

    return (
        <>
            <div
                className="modal fade"
                id='EditCity'
                data-bs-backdrop='static'
                data-bs-keyboard='false'
                aria-hidden='true'
            >
                <div className="modal-dialog ">
                    <div className="modal-content">
                        <div className="modal-header mx-2">
                            <h5 className="modal-title">{t('city_edit_title')}</h5>
                            <button
                                type='button'
                                className="btn-close"
                                data-bs-dismiss='modal'
                                id='closeEditCityModal'
                                aria-label='Close'
                                onClick={onModalClose}
                                ref={modalRef}
                            ></button>
                        </div>
                        {checkForPermission("CITY_MANAGE") &&
                            <div className="modal-body">
                                <ContainerPage>
                                    <ValidationErrorComp errors={errors} />
                                    <div className=''>
                                        <div className='row mb-1'>
                                            <div className='col-md-12'>
                                                <label className="mt-2 red-asterisk">{t('city_update_input_code')}</label>
                                                <input name='Code'
                                                    value={city.Code}
                                                    className={`form-control  ${errors["Code"] ? "is-invalid" : ""}`}
                                                    onChange={onUpdateField} type='text' ></input>
                                                <div className="invalid-feedback"> {t(errors['Code'])}</div>
                                            </div>
                                            <div className='col-md-12'>
                                                <label className="mt-2 red-asterisk">{t('city_update_input_name')}</label>
                                                <input name='Name' onChange={onUpdateField} type='text'
                                                    value={city.Name}
                                                    className={`form-control  ${errors["Name"] ? "is-invalid" : ""}`}
                                                ></input>
                                                <div className="invalid-feedback"> {t(errors['Name'])}</div>
                                            </div>
                                            <div className="col-md-12">
                                                <label className="mt-2 red-asterisk">{t('city_update_input_country')}</label>
                                                <Select
                                                    options={formattedCountryList}
                                                    value={formattedCountryList && formattedCountryList.find(option => option.value == CountryId) || null}
                                                    onChange={(selectedOption) => store.dispatch(setCountryId(selectedOption.value))}
                                                    isSearchable
                                                    classNamePrefix="react-select"
                                                    name="CountryId"
                                                    placeholder={t('city_update_placeholder_country')}
                                                />
                                                <div className="small text-danger"> {t(errors['CountryId'])}</div>
                                            </div>
                                            <div className=" mt-2">
                                                <label className="form-label  mb-0 red-asterisk">{t('city_update_label_state_id')}</label>
                                                <Select
                                                    options={States}
                                                    name="StateId"
                                                    value={States && States.find(option => option.value == city.StateId) || null}
                                                    onChange={onFieldChangeSelect}
                                                    isSearchable
                                                    placeholder="Select state"
                                                />
                                                <div className="small text-danger"> {t(errors['StateId'])}</div>
                                            </div>
                                            <div className="mb-1 mt-2">
                                                <label className="red-asterisk">{t('city_create_teantlocation')}</label>
                                                <Select
                                                    options={Location}
                                                    value={Location && Location.find(option => option.value == city.TenantOfficeId) || null}
                                                    onChange={onFieldChangeSelect}
                                                    isSearchable
                                                    name="TenantOfficeId"
                                                    placeholder={t('city_create_teantlocation_placeholder')}
                                                />
                                                <div className="small text-danger"> {t(errors['TenantOfficeId'])}</div>
                                            </div>
                                            <div className="col-md-12 mt-4">
                                                <button type='button' className='btn  app-primary-bg-color text-white mt-2' onClick={onSubmit}>
                                                    {t('city_update_button')}
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