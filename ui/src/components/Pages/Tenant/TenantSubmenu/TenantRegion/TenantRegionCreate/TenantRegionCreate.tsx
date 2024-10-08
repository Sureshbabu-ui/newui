import { useTranslation } from "react-i18next";
import { ContainerPage } from "../../../../../ContainerPage/ContainerPage";
import { ValidationErrorComp } from "../../../../../ValidationErrors/ValidationError";
import { store } from "../../../../../../state/store";
import { useEffect, useRef, useState } from "react";
import SweetAlert from "react-bootstrap-sweetalert";
import * as yup from 'yup';
import { convertBackEndErrorsToValidationErrors, formatSelectInput } from "../../../../../../helpers/formats";
import { useStore, useStoreWithInitializer } from "../../../../../../state/storeHooks";
import { initializeTenantRegionCreate, CreateTenantRegionState, toggleInformationModalStatus, updateErrors, updateField, loadManagers, loadStates, loadCities, loadPostalCodeList, clearPostalCodeList, initializeTenatRegionCreate } from "./TenantRegionCreate.slice";
import { startPreloader, stopPreloader } from "../../../../../Preloader/Preloader.slice";
import Select from 'react-select';
import { getTenantRegionsList, tenantRegionCreate } from "../../../../../../services/tenantRegion";
import { loadTeantRegions, setVisibleModal } from "../TenantRegionList/TenantRegionList.slice";
import { getCountries } from "../../../../../../services/country";
import { getManagersList } from "../../../../../../services/tenantOfficeInfo";
import { getFilteredStatesByCountry } from "../../../../../../services/state";
import { getFilteredCitiesByState } from "../../../../../../services/city";
import { useParams } from "react-router-dom";
import { getPostalCodeList } from "../../../../../../services/postalcode";
import { createGstNumberValidation } from "../../../../../../helpers/validationformats";

export const TenantRegionCreate = () => {
    const { t } = useTranslation();
    const { TenantId } = useParams<{ TenantId: string }>();
    const modalRef = useRef<HTMLButtonElement>(null);
    const [countryList, setCountryList] = useState<any>(null)
    const [formattedCountryList, setFormattedCountryList] = useState<any>(null)
    const [selectManagersList, setManagersList] = useState<any>(null)
    const [pincodelist, setPincodeList] = useState<any>([])
    const [isFocused, setIsFocused] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [enableSubmit, setEnableSubmit] = useState(true)
    const [selectOption, setOption] = useState(0)
    const { tenantregioncreate: { tenantRegion, cities, states, displayInformationModal, errors, pincodecheck, postalcodelist }, tenantregionlist: { visibleModal } } = useStore(({ tenantregioncreate, tenantregionlist }) => ({ tenantregioncreate, tenantregionlist }));
    const MODAL_NAME = "CreateTenantRegion"

    useEffect(() => {
        GetMasterDataItems()
    }, [tenantRegion.TenantId && visibleModal == MODAL_NAME]);

    const onUpdateField = (ev: any) => {
        var name = ev.target.name;
        var value = ev.target.value;
        store.dispatch(updateField({ name: name as keyof CreateTenantRegionState['tenantRegion'], value }));
    }

    const onSelectChange = (selectedOption: any, Name: any) => {
        var value = selectedOption.value
        var name = Name
        store.dispatch(updateField({ name: name as keyof CreateTenantRegionState['tenantRegion'], value }));
    }

    const onTenantRegionSubmit = async () => {
        store.dispatch(updateErrors({}))
        try {
            await validationTenantOfficeSchema.validate(tenantRegion, { abortEarly: false });
        } catch (error: any) {
            const errors = error.inner.reduce((allErrors: any, currentError: any) => {
                return { ...allErrors, [currentError.path as string]: currentError.message };
            }, {});
            store.dispatch(updateErrors(errors))
            if (errors)
                return;
        }
        store.dispatch(startPreloader());
        const result = await tenantRegionCreate(tenantRegion)
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
            <SweetAlert success title="Success" onConfirm={updateTenantRegion}>
                {t('tenantregion_create_success_message')}
            </SweetAlert>
        );
    }

    const updateTenantRegion = async () => {
        store.dispatch(toggleInformationModalStatus());
        store.dispatch(initializeTenatRegionCreate())
        store.dispatch(setVisibleModal(""))
        const tenantRegions = await getTenantRegionsList("", 1);
        store.dispatch(loadTeantRegions(tenantRegions));
        modalRef.current?.click()
        setInputValue('');
        setIsFocused(false);
        setPincodeList([]);
        setEnableSubmit(true);
        setOption(0);
    }

    const onModalClose = () => {
        store.dispatch(initializeTenatRegionCreate())
        store.dispatch(setVisibleModal(""))
        setInputValue('');
        setIsFocused(false);
        setPincodeList([]);
        setEnableSubmit(true);
        setOption(0);
    }

    const validationTenantOfficeSchema = yup.object().shape({
        RegionName: yup.string().required('validation_error_tenantregion_name_required'),
        Code: yup.string().required('validation_error_tenantregion_code_required').max(2, ('validation_error_tenant_region_code_max_required')),
        OfficeName: yup.string().required('validation_error_tenantregion_create_contractcustomername_required'),
        Address: yup.string().required('validation_error_tenantregion_create_address_required'),
        CityId: yup.number().positive('validation_error_tenantregion_create_city_required'),
        StateId: yup.number().positive('validation_error_tenantregion_create_state_required'),
        CountryId: yup.number().positive('validation_error_tenantregion_create_country_required'),
        Pincode: yup.string().required('validation_error_tenantregion_create_pincode_required'),
        Phone: yup.string().required('validation_error_tenantregion_create_Phone_required'),
        Email: yup.string().required('validation_error_tenantregion_create_email_required'),
        Mobile: yup.string().required('validation_error_tenantregion_create_mobile_required'),
        ManagerId: yup.string().required('validation_error_tenantregion_create_manager_required'),
        GstNumber: createGstNumberValidation(t('validation_error_tenantregion_create_gstno_required'), t('validation_error_tenantregion_create_gstnumber_checking_rule') ?? ''),
        GstStateId: yup.number().positive('validation_error_tenantregion_create_gststate_required'),
    });

    async function GetMasterDataItems() {
        store.dispatch(initializeTenantRegionCreate());
        store.dispatch(updateField({ name: "TenantId", value: TenantId }));
        if (visibleModal == MODAL_NAME) {
            try {
                const Countries = await getCountries();
                setCountryList(Countries.Countries);

                const Managers = await getManagersList();
                setManagersList(formatSelectInput(Managers.Managers, "FullName", "Id"));
                store.dispatch(loadManagers(Managers));
            } catch (error) {
                console.error(error);
            }
        }
    }

    useEffect(() => {
        if (countryList != null)
            setFormattedCountryList(formatSelectInput(countryList, "Name", "Id"))
    }, [countryList])

    useEffect(() => {
        if (tenantRegion.CountryId != null) {
            getFilteredStates()
        }
    }, [tenantRegion.CountryId])

    const getFilteredStates = async () => {
        if (tenantRegion.CountryId != null) {
            const States = await getFilteredStatesByCountry(tenantRegion.CountryId.toString());
            const FilteredStates = await formatSelectInput(States.States, "Name", "Id")
            store.dispatch(loadStates({ States: FilteredStates }))
        }
    }

    useEffect(() => {
        if (tenantRegion.StateId != null) {
            getFilteredCities()
        }
    }, [tenantRegion.StateId])

    const getFilteredCities = async () => {
        if (tenantRegion.StateId != null) {
            const Cities = await getFilteredCitiesByState(tenantRegion.StateId.toString());
            const FilteredCities = await formatSelectInput(Cities.Cities, "Name", "Id")
            store.dispatch(loadCities({ Cities: FilteredCities }))
        }
    }

    const getFilteredPostalCodeList = async (pincode: string) => {
        store.dispatch(updateField({ name: 'Pincode', value: pincode }));
        const PostalCodeList = await getPostalCodeList(pincode);
        const FilteredPostalCodes = await formatSelectInput(PostalCodeList.PostalCodeList, "Pincode", "Id")
        setPincodeList(FilteredPostalCodes);
        store.dispatch(loadPostalCodeList(PostalCodeList))
    }

    const onPostalCodeSelectChange = (selectedOption) => {
        var value = selectedOption.value
        setOption(value)
        setInputValue(selectedOption.label)
        const postalcodeobj = postalcodelist.filter((item) => item.Id == value)[0]
        store.dispatch(updateField({ name: 'CountryId', value: postalcodeobj.CountryId }));
        store.dispatch(updateField({ name: 'CityId', value: postalcodeobj.CityId }));
        store.dispatch(updateField({ name: 'StateId', value: postalcodeobj.StateId }));
        store.dispatch(updateField({ name: 'Pincode', value: postalcodeobj.Pincode }));
        store.dispatch(updateField({ name: 'GstStateId', value: postalcodeobj.StateId }));
        setEnableSubmit(false)
    };

    const selectedOption = pincodelist.find(option => option.value === selectOption) || null;

    return (
        <>
            <div
                className="modal fade"
                id='CreateTenantRegion'
                data-bs-backdrop='static'
                data-bs-keyboard='false'
                aria-hidden='true'
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header mx-3">
                            <h5 className="modal-title app-primary-color">{t('tenantregion_create_new_tenant_region')}</h5>
                            <button
                                type='button'
                                className="btn-close"
                                data-bs-dismiss='modal'
                                id='closeCreateTenantRegion'
                                onClick={onModalClose}
                                aria-label='Close'
                                ref={modalRef}
                            ></button>
                        </div>
                        <div className="modal-body">
                            <ValidationErrorComp errors={errors} />
                            <div className='row mb-1'>
                                <div className="mb-1 col-md-12">
                                    <label className="red-asterisk" >{t('tenantregion_create_code')}</label>
                                    <input onChange={onUpdateField} name="Code" value={tenantRegion.Code} type="text" className={`form-control  ${errors["Code"] ? "is-invalid" : ""}`} />
                                    <div className="invalid-feedback"> {t(errors['Code'])}</div>
                                </div>
                                <div className="mb-1 col-md-12">
                                    <label className="red-asterisk">{t('tenantregion_create_regionname')}</label>
                                    <input onChange={onUpdateField} name="RegionName" value={tenantRegion.RegionName} type="text" className={`form-control  ${errors["RegionName"] ? "is-invalid" : ""}`} />
                                    <div className="invalid-feedback"> {t(errors['RegionName'])}</div>
                                </div>
                                <div className="mb-1 col-md-12">
                                    <label className="red-asterisk">{t('tenantregion_create_name')}</label>
                                    <input onChange={onUpdateField} name="OfficeName" value={tenantRegion.OfficeName} type="text" className={`form-control  ${errors["OfficeName"] ? "is-invalid" : ""}`} />
                                    <div className="invalid-feedback"> {t(errors['OfficeName'])}</div>
                                </div>
                                <div className="mb-1 col-md-12">
                                    <label className="red-asterisk">{t('tenantregion_create_address')}</label>
                                    <textarea onChange={onUpdateField} name="Address" rows={3} value={tenantRegion.Address} className={`form-control  ${errors["Address"] ? "is-invalid" : ""}`} />
                                    <div className="invalid-feedback"> {t(errors['Address'])}</div>
                                </div>
                                <div className="mb-1 col-md-12">
                                    <label>{t('tenantregion_create_geolocation')}</label>
                                    <input onChange={onUpdateField} name="GeoLocation" value={tenantRegion.GeoLocation} className={`form-control  ${errors["GeoLocation"] ? "is-invalid" : ""}`} />
                                    <div className="invalid-feedback"> {errors['GeoLocation']}</div>
                                </div>
                                <div className="col-md-12">
                                    <label className="mt-2 red-asterisk">{t('tenantregion_create_pincode')}</label>
                                    <Select
                                        options={pincodelist && pincodelist.length > 0 ? pincodelist : []}
                                        inputValue={isFocused || tenantRegion.Pincode == "" ? inputValue : ''}
                                        value={isFocused ? null : selectedOption}
                                        isSearchable
                                        onInputChange={(newValue, { action }) => {
                                            if (action === 'input-change') {
                                                setInputValue(newValue);
                                                if (newValue.length >= 3) {
                                                    getFilteredPostalCodeList(newValue);
                                                } else if (newValue.length === 0) {
                                                    store.dispatch(clearPostalCodeList());
                                                    setPincodeList([]);
                                                }
                                                if (selectedOption) {
                                                    store.dispatch(clearPostalCodeList());
                                                    setPincodeList([]);
                                                    setOption(0)
                                                    setEnableSubmit(true)
                                                    setIsFocused(true);
                                                }
                                            }
                                        }}
                                        onChange={(selectedOption) => {
                                            onPostalCodeSelectChange(selectedOption);
                                            setInputValue(selectedOption ? selectedOption.label : '');
                                            setIsFocused(false);
                                        }}
                                        onMenuOpen={() => setIsFocused(true)}
                                        onMenuClose={() => setIsFocused(false)}
                                        classNamePrefix="react-select"
                                        name="Pincode"
                                        placeholder={t('tenant_office_create_placeholder_select')}
                                        noOptionsMessage={() => {
                                            if (inputValue.length == 3 && pincodelist.length == 0) {
                                                return t('tenant_office_create_placeholder_pincode_loading');
                                            } else if (inputValue.length < 3) {
                                                return t('tenant_office_create_placeholder_inital_select_msg');
                                            } else {
                                                return t('tenant_office_create_placeholder_invalid_pincode');
                                            }
                                        }}
                                    />
                                    <div className="invalid-feedback"> {errors['Pincode']}</div>
                                </div>
                                <div className='mb-1 col-md-12'>
                                    <label className="red-asterisk">{t('tenantregion_create_city')}</label>
                                    <Select
                                        options={cities}
                                        value={cities && cities.find(option => option.value == tenantRegion.CityId) || null}
                                        onChange={(selectedOption) => onSelectChange(selectedOption, "CityId")}
                                        isSearchable
                                        name="CityId"
                                        placeholder={t('tenant_office_create_placeholder_city')}
                                    />
                                    <div className="small text-danger"> {t(errors['CityId'])}</div>
                                </div>
                                <div className='mb-1 col-md-12'>
                                    <label className="asterisk">{t('tenantregion_create_state')}</label>
                                    <Select
                                        options={states}
                                        value={states && states.find(option => option.value == tenantRegion.StateId) || null}
                                        onChange={(selectedOption) => onSelectChange(selectedOption, "StateId")}
                                        isSearchable
                                        name="StateId"
                                        placeholder={t('tenant_office_create_placeholder_state')}
                                    />
                                    <div className="small text-danger"> {t(errors['StateId'])}</div>
                                </div>
                                <div className="mb-1 col-md-12">
                                    <label className="red-asterisk">{t('tenantregion_create_country')}</label>
                                    <Select
                                        options={formattedCountryList}
                                        value={formattedCountryList && formattedCountryList.find(option => option.value == tenantRegion.CountryId) || null}
                                        onChange={(selectedOption) => onSelectChange(selectedOption, "CountryId")}
                                        isSearchable
                                        classNamePrefix="react-select"
                                        name="CountryId"
                                        placeholder={t('tenant_office_create_placeholder_country')}
                                    />
                                    <div className="small text-danger"> {t(errors['CountryId'])}</div>
                                </div>
                                <div className="mb-1 col-md-12">
                                    <label className="red-asterisk">{t('tenantregion_create_phone')}</label>
                                    <input onChange={onUpdateField} name="Phone" type="text" value={tenantRegion.Phone} className={`form-control  ${errors["Phone"] ? "is-invalid" : ""}`}></input>
                                    <div className="invalid-feedback"> {t(errors['Phone'])}</div>
                                </div>
                                <div className="mb-1 col-md-12">
                                    <label className="red-asterisk">{t('tenantregion_create_email')}</label>
                                    <input onChange={onUpdateField} name="Email" type="text" value={tenantRegion.Email} className={`form-control  ${errors["Email"] ? "is-invalid" : ""}`} ></input>
                                    <div className="invalid-feedback"> {t(errors['Email'])}</div>
                                </div>
                                <div className="mb-1 col-md-12">
                                    <label className="red-asterisk">{t('tenantregion_create_mobile')}</label>
                                    <input onChange={onUpdateField} name="Mobile" value={tenantRegion.Mobile} type="text" className={`form-control  ${errors["Mobile"] ? "is-invalid" : ""}`} />
                                    <div className="invalid-feedback"> {t(errors['Mobile'])}</div>
                                </div>
                                <div className="mb-1 col-md-12">
                                    <label className="red-asterisk">{t('tenantregion_create_gstno')}</label>
                                    <input onChange={onUpdateField} name="GstNumber" value={tenantRegion.GstNumber} type="text" className={`form-control  ${errors["GstNumber"] ? "is-invalid" : ""}`} ></input>
                                    <div className="invalid-feedback"> {t(errors['GstNumber'])}</div>
                                </div>
                                <div className='mb-1 col-md-12'>
                                    <label className="red-asterisk">{t('tenantregion_create_gststate')}</label>
                                    <Select
                                        options={states}
                                        value={states && states.find(option => option.value == tenantRegion.GstStateId) || null}
                                        onChange={(selectedOption) => onSelectChange(selectedOption, "GstStateId")}
                                        isSearchable
                                        name="GstStateId"
                                        placeholder={t('tenant_office_create_placeholder_state')}
                                    />
                                    <div className="small text-danger"> {t(errors['GstStateId'])}</div>
                                </div>
                                <div className="mb-1 col-md-12">
                                    <label className="red-asterisk">{t('tenantregion_create_manager')}</label>
                                    <Select
                                        options={selectManagersList}
                                        value={selectManagersList && selectManagersList.find(option => option.value == tenantRegion.ManagerId) || null}
                                        onChange={(selectedOption) => onSelectChange(selectedOption, "ManagerId")}
                                        isSearchable
                                        classNamePrefix="react-select"
                                        name="ManagerId"
                                        placeholder={t('tenantregion_create_manager_placeholder')}
                                    />
                                    <div className="small text-danger"> {t(errors['ManagerId'])}</div>
                                </div>
                                <div className="mb-1 col-md-12">
                                    <label className="">{t('tenantregion_create_tin')}</label>
                                    <input onChange={onUpdateField} name="Tin" value={tenantRegion.Tin} type="text" className={`form-control`} ></input>
                                </div>
                                <div className="d-grid gap-2 mt-2">
                                    <button className="btn app-primary-bg-color text-white" type="button" onClick={onTenantRegionSubmit}>
                                        {t('tenantregion_create_btn_submit')}
                                    </button>
                                </div>
                            </div>
                            {displayInformationModal ? <InformationModal /> : ""}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
} 