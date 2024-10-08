import { useTranslation } from "react-i18next";
import { ContainerPage } from "../../../../../ContainerPage/ContainerPage";
import { ValidationErrorComp } from "../../../../../ValidationErrors/ValidationError";
import { store } from "../../../../../../state/store";
import { useEffect, useRef, useState } from "react";
import SweetAlert from "react-bootstrap-sweetalert";
import * as yup from 'yup';
import { convertBackEndErrorsToValidationErrors, formatSelectInput } from "../../../../../../helpers/formats";
import { useStore, useStoreWithInitializer } from "../../../../../../state/storeHooks";
import { clearPostalCodeList, CreateTenantOfficeState, initializeOfficeCreate, loadCities, loadManagers, loadMasterData, loadPostalCodeList, loadStates, loadTenantRegions, toggleInformationModalStatus, updateErrors, updateField } from "./TenantOfficeCreate.slice";
import { startPreloader, stopPreloader } from "../../../../../Preloader/Preloader.slice";
import { getManagersList, getTenantOfficeList, tenantOfficeCreate } from "../../../../../../services/tenantOfficeInfo";
import { loadTenantOffices, setVisibleModal } from "../TenantOfficeList/TenantOfficeList.slice";
import Select from 'react-select';
import { useParams } from "react-router-dom";
import { getTenantRegionNames } from "../../../../../../services/tenantRegion";
import { getValuesInMasterDataByTable } from "../../../../../../services/masterData";
import { getCountries } from "../../../../../../services/country";
import { getFilteredStatesByCountry } from "../../../../../../services/state";
import { getFilteredCitiesByState } from "../../../../../../services/city";
import { getPostalCodeList } from "../../../../../../services/postalcode";
import { createGstNumberValidation } from "../../../../../../helpers/validationformats";

export const TenantOfficeCreate = () => {
    const { t } = useTranslation();
    const MODAL_NAME = "CreateTenantOffice"
    const { TenantId } = useParams<{ TenantId: string }>();
    const modalRef = useRef<HTMLButtonElement>(null);
    const [countryList, setCountryList] = useState<any>(null)
    const [formattedCountryList, setFormattedCountryList] = useState<any>(null)
    const [selectManagersList, setManagersList] = useState<any>(null)
    const [selectRegionsList, setRegionsList] = useState<any>(null)
    const [pincodelist, setPincodeList] = useState<any>([])
    const [enableSubmit, setEnableSubmit] = useState(true)
    const [selectOption, setOption] = useState(0)
    const { tenantofficecreate: { tenantOffice, displayInformationModal, errors, entitiesList, tenantofficetypes, cities, states, pincodecheck, postalcodelist }, tenantofficelist: { visibleModal } } = useStore(({ tenantofficecreate, tenantofficelist }) => ({ tenantofficecreate, tenantofficelist }));

    const getFilteredPostalCodeList = async (pincode: string) => {
        store.dispatch(updateField({ name: 'Pincode', value: pincode }));
        const PostalCodeList = await getPostalCodeList(pincode);
        const FilteredPostalCodes = await formatSelectInput(PostalCodeList.PostalCodeList, "Pincode", "Id")
        setPincodeList(FilteredPostalCodes);
        store.dispatch(loadPostalCodeList(PostalCodeList))
    }

    useEffect(() => {
        setManagersList(formatSelectInput(entitiesList.Managers, "FullName", "Id"));
    }, [entitiesList.Managers])

    useEffect(() => {
        setRegionsList(formatSelectInput(entitiesList.TenantRegions, "RegionName", "Id"));
    }, [entitiesList.TenantRegions])

    useEffect(() => {
        GetMasterDataItems()
    }, [visibleModal == MODAL_NAME]);

    useEffect(() => {
        if (countryList != null)
            setFormattedCountryList(formatSelectInput(countryList, "Name", "Id"))
    }, [countryList])

    useEffect(() => {
        if (tenantOffice.CountryId != null) {
            getFilteredStates()
        }
    }, [tenantOffice.CountryId])

    const getFilteredStates = async () => {
        if (tenantOffice.CountryId != null) {
            const States = await getFilteredStatesByCountry(tenantOffice.CountryId.toString());
            const FilteredStates = await formatSelectInput(States.States, "Name", "Id")
            store.dispatch(loadStates({ States: FilteredStates }))
        }
    }

    useEffect(() => {
        if (tenantOffice.StateId != "") {
            getFilteredCities()
        }
    }, [tenantOffice.StateId])

    const getFilteredCities = async () => {
        if (tenantOffice.StateId != null) {
            const Cities = await getFilteredCitiesByState(tenantOffice.StateId.toString());
            const FilteredCities = await formatSelectInput(Cities.Cities, "Name", "Id")
            store.dispatch(loadCities({ Cities: FilteredCities }))
        }
    }

    const onUpdateField = (ev: any) => {
        var name = ev.target.name;
        var value = ev.target.value;
        store.dispatch(updateField({ name: name as keyof CreateTenantOfficeState['tenantOffice'], value }));
    }

    const onTenantOfficeSubmit = async () => {
        store.dispatch(updateErrors({}))
        try {
            await validationTenantOfficeSchema.validate(tenantOffice, { abortEarly: false });
        } catch (error: any) {
            const errors = error.inner.reduce((allErrors: any, currentError: any) => {
                return { ...allErrors, [currentError.path as string]: currentError.message };
            }, {});
            store.dispatch(updateErrors(errors))
            if (errors)
                return;
        }
        store.dispatch(startPreloader());
        const result = await tenantOfficeCreate(tenantOffice)
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
            <SweetAlert success title="Success" onConfirm={updateTenantOffice}>
                {t('tenant_office_create_success_message')}
            </SweetAlert>
        );
    }

    const updateTenantOffice = async () => {
        store.dispatch(toggleInformationModalStatus());
        store.dispatch(initializeOfficeCreate())
        store.dispatch(setVisibleModal(""))
        const tenantOffices = await getTenantOfficeList("", 1);
        store.dispatch(loadTenantOffices(tenantOffices));
        const TenantRegion = await getTenantRegionNames();
        store.dispatch(loadTenantRegions(TenantRegion));
        modalRef.current?.click()
        setInputValue('');
        setIsFocused(false);
        setPincodeList([]);
        setEnableSubmit(true);
        setOption(0);
    }

    const validationTenantOfficeSchema = yup.object().shape({
        OfficeName: yup.string().required('validation_error_tenant_office_contractcustomername_required'),
        Code: yup.string().required('validation_error_tenant_office_code_required').max(3, ('validation_error_tenant_office_code_max_required')),
        OfficeTypeId: yup.string().required('validation_error_tenant_office_OfficeTypeId_required'),
        Address: yup.string().required('validation_error_tenant_office_address_required'),
        CityId: yup.number().positive('validation_error_tenant_office_city_required'),
        StateId: yup.number().positive('validation_error_tenant_office_state_required'),
        CountryId: yup.number().positive('validation_error_tenant_office_country_required'),
        Pincode: yup.string().required('validation_error_tenant_office_pincode_required'),
        Phone: yup.string().required('validation_error_tenant_office_Phone_required'),
        Email: yup.string().required('validation_error_tenant_office_email_required'),
        Mobile: yup.string().required('validation_error_tenant_office_mobile_required'),
        ManagerId: yup.string().required('validation_error_tenant_office_manager_required'),
        GstNumber: createGstNumberValidation(t('validation_error_tenant_office_gstno_required'), t('validation_error_tenant_office_gstnumber_checking_rule') ?? ''),
        GstStateId: yup.number().positive('validation_error_tenant_office_gststate_required'),
        Tin: yup.string().required('validation_error_tenant_office_tin_required'),
    });

    const onSelectChange = (selectedOption: any, Name: any) => {
        var value = selectedOption.value
        var name = Name
        store.dispatch(updateField({ name: name as keyof CreateTenantOfficeState['tenantOffice'], value }));
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
        setEnableSubmit(false)
    };

    async function GetMasterDataItems() {
        store.dispatch(initializeOfficeCreate());
        store.dispatch(updateField({ name: "TenantId", value: TenantId }));
        if (visibleModal == MODAL_NAME) {
            try {
                const Countries = await getCountries();
                setCountryList(Countries.Countries);

                const TenantOfficeTypeList = await getValuesInMasterDataByTable("TenantOfficeType");
                const filteredTenantOfficeTypes = TenantOfficeTypeList.MasterData.filter(option => option.Name === "Area Office");
                const TenantOfficeType = await formatSelectInput(filteredTenantOfficeTypes, "Name", "Id")
                store.dispatch(loadMasterData({ MasterData: TenantOfficeType }));

                const Managers = await getManagersList();
                store.dispatch(loadManagers(Managers));

                const TenantRegion = await getTenantRegionNames();
                store.dispatch(loadTenantRegions(TenantRegion));
            } catch (error) {
                console.error(error);
            }
        }
    }
    const [isFocused, setIsFocused] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const selectedOption = pincodelist.find(option => option.value === selectOption) || null;

    const onModalClose = async () => {
        store.dispatch(initializeOfficeCreate())
        store.dispatch(setVisibleModal(""))
        setInputValue('');
        setIsFocused(false);
        setPincodeList([]);
        setEnableSubmit(true);
        setOption(0);
    }
    return (
        <>
            <div
                className="modal fade"
                id='CreateTenantOffice'
                data-bs-backdrop='static'
                data-bs-keyboard='false'
                aria-hidden='true'
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header mx-3">
                            <h5 className="modal-title app-primary-color">{t('tenant_office_create_new_tenant_office')}</h5>
                            <button
                                type='button'
                                className="btn-close"
                                data-bs-dismiss='modal'
                                id='closeCreateTenantOfficeModal'
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
                                        <div className="col-md-12" >
                                            <div className="mb-1">
                                                <label className="red-asterisk">{t('tenant_officeinfo_create_name')}</label>
                                                <input onChange={onUpdateField} name="OfficeName" value={tenantOffice.OfficeName} type="text" className={`form-control  ${errors["OfficeName"] ? "is-invalid" : ""}`} />
                                                <div className="invalid-feedback"> {t(errors['OfficeName'])}</div>
                                            </div>
                                            <div className="mb-1">
                                                <label className="red-asterisk" >{t('tenant_officeinfo_create_code')}</label>
                                                <input onChange={onUpdateField} name="Code" max={3} value={tenantOffice.Code} type="text" className={`form-control  ${errors["Code"] ? "is-invalid" : ""}`} />
                                                <div className="invalid-feedback"> {t(errors['Code'])}</div>
                                            </div>
                                            <div className="mb-1">
                                                <label className="red-asterisk">{t('tenant_officeinfo_create_address')}</label>
                                                <textarea onChange={onUpdateField} name="Address" value={tenantOffice.Address} className={`form-control  ${errors["Address"] ? "is-invalid" : ""}`} />
                                                <div className="invalid-feedback"> {t(errors['Address'])}</div>
                                            </div>
                                            <div className="mb-1 col-md-12">
                                                <label className="red-asterisk">{t('tenant_officeinfo_create_office_type')}</label>
                                                <Select
                                                    value={tenantofficetypes && tenantofficetypes.find(option => option.value == tenantOffice.OfficeTypeId) || null}
                                                    options={tenantofficetypes}
                                                    onChange={(selectedOption) => onSelectChange(selectedOption, "OfficeTypeId")}
                                                    isSearchable
                                                    name="BankAccountTypeId"
                                                    placeholder={t('tenant_office_create_placeholder_officetype')}
                                                />
                                                <div className="small text-danger"> {t(errors['OfficeTypeId'])}</div>
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <label className="mt-2">{t('tenant_officeinfo_create_region_id')}</label>
                                            <Select
                                                options={selectRegionsList}
                                                value={selectRegionsList && selectRegionsList.find(option => option.value == tenantOffice.RegionId) || null}
                                                onChange={(selectedOption) => onSelectChange(selectedOption, "RegionId")}
                                                isSearchable
                                                classNamePrefix="react-select"
                                                name="RegionId"
                                                placeholder="Select Region"
                                            />
                                        </div>
                                        <div className="mb-1 mt-2">
                                            <label>{t('tenant_officeinfo_create_geolocation')}</label>
                                            <textarea onChange={onUpdateField} name="GeoLocation" value={tenantOffice.GeoLocation} className={`form-control  ${errors["GeoLocation"] ? "is-invalid" : ""}`} />
                                            <div className="invalid-feedback"> {errors['GeoLocation']}</div>
                                        </div>
                                        <div className="col-md-12">
                                            <label className="mt-2 red-asterisk">{t('tenant_officeinfo_create_select_pincode')}</label>
                                            <Select
                                                options={pincodelist && pincodelist.length > 0 ? pincodelist : []}
                                                inputValue={isFocused || tenantOffice.Pincode == "" ? inputValue : ''}
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
                                        <div className="col-md-12">
                                            <label className="mt-2 red-asterisk">{t('tenant_officeinfo_create_country')}</label>
                                            <Select
                                                options={formattedCountryList}
                                                value={formattedCountryList && formattedCountryList.find(option => option.value == tenantOffice.CountryId) || null}
                                                onChange={(selectedOption) => onSelectChange(selectedOption, "CountryId")}
                                                isSearchable
                                                classNamePrefix="react-select"
                                                name="CountryId"
                                                placeholder={t('tenant_office_create_placeholder_country')}
                                            />
                                            <div className="small text-danger"> {t(errors['CountryId'])}</div>
                                        </div>

                                        <div className='col-md-12'>
                                            <label className="mt-2 asterisk">{t('tenant_officeinfo_create_state')}</label>
                                            <Select
                                                options={states}
                                                value={states && states.find(option => option.value == tenantOffice.StateId) || null}
                                                onChange={(selectedOption) => onSelectChange(selectedOption, "StateId")}
                                                isSearchable
                                                name="StateId"
                                                placeholder={t('tenant_office_create_placeholder_state')}
                                            />
                                            <div className="small text-danger"> {t(errors['StateId'])}</div>
                                        </div>
                                        <div className='col-md-12'>
                                            <label className="mt-2 red-asterisk">{t('tenant_officeinfo_create_city')}</label>
                                            <Select
                                                options={cities}
                                                value={cities && cities.find(option => option.value == tenantOffice.CityId) || null}
                                                onChange={(selectedOption) => onSelectChange(selectedOption, "CityId")}
                                                isSearchable
                                                name="CityId"
                                                placeholder={t('tenant_office_create_placeholder_city')}
                                            />
                                            <div className="small text-danger"> {t(errors['CityId'])}</div>
                                        </div>
                                        <div className="mb-1">
                                            <label className="red-asterisk">{t('tenant_officeinfo_create_phone')}</label>
                                            <input onChange={onUpdateField} name="Phone" type="text" value={tenantOffice.Phone} className={`form-control  ${errors["Phone"] ? "is-invalid" : ""}`}></input>
                                            <div className="invalid-feedback"> {t(errors['Phone'])}</div>
                                        </div>
                                        <div className="mb-1">
                                            <label className="red-asterisk">{t('tenant_officeinfo_create_email')}</label>
                                            <input onChange={onUpdateField} name="Email" type="text" value={tenantOffice.Email} className={`form-control  ${errors["Email"] ? "is-invalid" : ""}`} ></input>
                                            <div className="invalid-feedback"> {t(errors['Email'])}</div>
                                        </div>
                                        <div className="mb-1">
                                            <label className="red-asterisk">{t('tenant_officeinfo_create_mobile')}</label>
                                            <input onChange={onUpdateField} name="Mobile" value={tenantOffice.Mobile} type="text" className={`form-control  ${errors["Mobile"] ? "is-invalid" : ""}`} />
                                            <div className="invalid-feedback"> {t(errors['Mobile'])}</div>
                                        </div>
                                        <div className="mb-1">
                                            <label className="red-asterisk">{t('tenant_officeinfo_create_gstno')}</label>
                                            <input onChange={onUpdateField} name="GstNumber" value={tenantOffice.GstNumber} type="text" className={`form-control  ${errors["GstNumber"] ? "is-invalid" : ""}`} ></input>
                                            <div className="invalid-feedback"> {t(errors['GstNumber'])}</div>
                                        </div>
                                        <div className='col-md-12'>
                                            <label className="mt-2 red-asterisk">{t('tenant_officeinfo_create_gststate')}</label>
                                            <Select
                                                options={states}
                                                value={states && states.find(option => option.value == tenantOffice.GstStateId) || null}
                                                onChange={(selectedOption) => onSelectChange(selectedOption, "GstStateId")}
                                                isSearchable
                                                name="GstStateId"
                                                placeholder={t('tenant_office_create_placeholder_state')}
                                            />
                                            <div className="small text-danger"> {t(errors['GstStateId'])}</div>
                                        </div>
                                        <div className="col-md-12">
                                            <label className="mt-2 red-asterisk">{t('tenant_officeinfo_create_manager')}</label>
                                            <Select
                                                options={selectManagersList}
                                                value={selectManagersList && selectManagersList.find(option => option.value == tenantOffice.ManagerId) || null}
                                                onChange={(selectedOption) => onSelectChange(selectedOption, "ManagerId")}
                                                isSearchable
                                                classNamePrefix="react-select"
                                                name="ManagerId"
                                                placeholder="Select Manager"
                                            />
                                            <div className="small text-danger"> {t(errors['ManagerId'])}</div>
                                        </div>
                                        <div className="mb-1 mt-2">
                                            <label className="red-asterisk">{t('tenant_officeinfo_create_tin')}</label>
                                            <input onChange={onUpdateField} name="Tin" value={tenantOffice.Tin} type="text" className={`form-control  ${errors["Tin"] ? "is-invalid" : ""}`} ></input>
                                            <div className="invalid-feedback"> {t(errors['Tin'])}</div>
                                        </div>
                                        <div className="d-grid gap-2 mt-2">
                                            <button className="btn app-primary-bg-color text-white" disabled={enableSubmit} type="button" onClick={onTenantOfficeSubmit}>
                                                {t('tenant_office_create_btn_submit')}
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