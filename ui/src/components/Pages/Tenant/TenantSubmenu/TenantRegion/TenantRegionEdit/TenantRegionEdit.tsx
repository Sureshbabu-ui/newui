import { useTranslation } from "react-i18next";
import { ContainerPage } from "../../../../../ContainerPage/ContainerPage";
import { ValidationErrorComp } from "../../../../../ValidationErrors/ValidationError";
import { store } from "../../../../../../state/store";
import { useEffect, useRef, useState } from "react";
import SweetAlert from "react-bootstrap-sweetalert";
import * as yup from 'yup';
import { convertBackEndErrorsToValidationErrors, formatSelectInput } from "../../../../../../helpers/formats";
import { useStore, useStoreWithInitializer } from "../../../../../../state/storeHooks";
import { initializeTenantRegionUpdate, UpdateTenantRegionState, toggleInformationModalStatus, updateErrors, updateField, loadTenantRegionDetails, loadManagers, loadStates, loadCities, loadPostalCodeList, initializeTenatRegionUpdate } from "./TenantRegionEdit.slice";
import { startPreloader, stopPreloader } from "../../../../../Preloader/Preloader.slice";
import Select from 'react-select';
import { editRegion, getTenantRegionsList } from "../../../../../../services/tenantRegion";
import { loadTeantRegions } from "../TenantRegionList/TenantRegionList.slice";
import { useParams } from "react-router-dom";
import { getCountries } from "../../../../../../services/country";
import { getManagersList } from "../../../../../../services/tenantOfficeInfo";
import { getFilteredStatesByCountry } from "../../../../../../services/state";
import { getFilteredCitiesByState } from "../../../../../../services/city";
import { getPostalCodeList } from "../../../../../../services/postalcode";
import { createGstNumberValidation } from "../../../../../../helpers/validationformats";

export const TenantRegionEdit = () => {
    const { t } = useTranslation();
    const modalRef = useRef<HTMLButtonElement>(null);
    const { Id } = useParams<{ Id: string }>();
    const [countryList, setCountryList] = useState<any>(null)
    const [formattedCountryList, setFormattedCountryList] = useState<any>(null)
    const [selectManagersList, setManagersList] = useState<any>(null)
    const [pincodelist, setPincodeList] = useState<any>([])
    const [selectOption, setOption] = useState(0)
    const [isFocused, setIsFocused] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const selectedOption = pincodelist.find(option => option.value === selectOption) || null;
    const [isLoading, setIsLoading] = useState(false);
    const MODAL_NAME = "EditTenantRegion"
    const { tenantregionupdate: { displayInformationModal, errors, TenantOffices, tenantRegion, postalcodelist, Managers, cities, states }, tenantregionlist: { visibleModal } } = useStore(({ tenantregionupdate, tenantregionlist }) => ({ tenantregionupdate, tenantregionlist }));

    useEffect(() => {
        GetMasterDataItems()
    }, [visibleModal == MODAL_NAME])

    const getFilteredPostalCodeList = async (pincode: string) => {
        setIsLoading(true);
        try {
            const PostalCodeList = await getPostalCodeList(pincode);
            if (PostalCodeList && PostalCodeList.PostalCodeList) {
                const FilteredPincodes = await formatSelectInput(PostalCodeList.PostalCodeList, "Pincode", "Id");
                setPincodeList(FilteredPincodes);
                store.dispatch(loadPostalCodeList(PostalCodeList));
            } else {
                setPincodeList([]);
            }
        } catch (error) {
            setPincodeList([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (tenantRegion.Pincode) {
            getSelectedPostalCodeList()
            setInputValue(tenantRegion.Pincode)
        }
    }, [tenantRegion])

    useEffect(() => {
        if (tenantRegion.Pincode) {
            getSelectedPostalCodeList()
            setInputValue(tenantRegion.Pincode)
        }
    }, [selectedOption == null && isFocused == false])

    const getSelectedPostalCodeList = async () => {
        try {
            const PostalCodeList = await getPostalCodeList(tenantRegion.Pincode);
            const FilteredPincodes = await formatSelectInput(PostalCodeList.PostalCodeList, "Pincode", "Id");
            if (FilteredPincodes && FilteredPincodes.length > 0) {
                setPincodeList(FilteredPincodes);
                setOption(FilteredPincodes[0].value);
            } else {
                setPincodeList([]);
                setOption(0);
            }
            store.dispatch(loadPostalCodeList(PostalCodeList));
        } catch (error) {
            setPincodeList([]);
            setOption(0);
            return error;
        }
    };

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
    };

    const onUpdateField = (ev: any) => {
        var name = ev.target.name;
        var value = ev.target.value;
        if (name === 'IsActive') {
            value = ev.target.checked ? true : false;
        }
        store.dispatch(updateField({ name: name as keyof UpdateTenantRegionState['tenantRegion'], value }));
    }

    const onSelectChange = (selectedOption: any, Name: any) => {
        var value = selectedOption.value
        var name = Name
        store.dispatch(updateField({ name: name as keyof UpdateTenantRegionState['tenantRegion'], value }));
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
        const result = await editRegion(tenantRegion)
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
                {t('tenantregion_update_success_message')}
            </SweetAlert>
        );
    }

    const updateTenantRegion = async () => {
        store.dispatch(toggleInformationModalStatus());
        const tenantRegions = await getTenantRegionsList("", 1);
        store.dispatch(loadTeantRegions(tenantRegions));
        modalRef.current?.click()
        store.dispatch(initializeTenatRegionUpdate());
        setInputValue('');
        setIsFocused(false);
        setPincodeList([]);
        setOption(0);
    }

    const onModalClose = () => {
        store.dispatch(initializeTenatRegionUpdate());
        setInputValue('');
        setIsFocused(false);
        setPincodeList([]);
        setOption(0);
    }

    const validationTenantOfficeSchema = yup.object().shape({
        RegionName: yup.string().required('validation_error_tenantregion_name_required'),
        Code: yup.string().required('validation_error_tenantregion_code_required'),
        Address: yup.string().required('validation_error_tenantregion_update_address_required'),
        CityId: yup.number().positive('validation_error_tenantregion_update_city_required'),
        StateId: yup.number().positive('validation_error_tenantregion_update_state_required'),
        CountryId: yup.number().positive('validation_error_tenantregion_update_country_required'),
        Pincode: yup.string().required('validation_error_tenantregion_update_pincode_required'),
        Phone: yup.string().required('validation_error_tenantregion_update_Phone_required'),
        Email: yup.string().required('validation_error_tenantregion_update_email_required'),
        Mobile: yup.string().required('validation_error_tenantregion_update_mobile_required'),
        ManagerId: yup.string().required('validation_error_tenantregion_update_manager_required'),
        GstNumber: createGstNumberValidation(t('validation_error_tenantregion_update_gstno_required'), t('validation_error_tenantregion_update_gstnumber_checking_rule') ?? ''),
        GstStateId: yup.number().positive('validation_error_tenantregion_update_gststate_required'),
    });

    useEffect(() => {
        setManagersList(formatSelectInput(Managers, "FullName", "Id"));
    }, [Managers])

    useEffect(() => {
        if (countryList != null)
            setFormattedCountryList(formatSelectInput(countryList, "Name", "Id"))
    }, [countryList])

    useEffect(() => {
        if (tenantRegion.CountryId != 0) {
            getFilteredStates()
        }
    }, [tenantRegion.CountryId])

    const getFilteredStates = async () => {
        const States = await getFilteredStatesByCountry(tenantRegion.CountryId.toString());
        const FilteredStates = await formatSelectInput(States.States, "Name", "Id")
        store.dispatch(loadStates({ States: FilteredStates }))
    }

    useEffect(() => {
        if (tenantRegion.StateId != 0) {
            getFilteredCities()
        }
    }, [tenantRegion.StateId])

    const getFilteredCities = async () => {
        const Cities = await getFilteredCitiesByState(tenantRegion.StateId.toString());
        const FilteredCities = await formatSelectInput(Cities.Cities, "Name", "Id")
        store.dispatch(loadCities({ Cities: FilteredCities }))
    }


    async function GetMasterDataItems() {
        store.dispatch(initializeTenantRegionUpdate());
        if (visibleModal == MODAL_NAME) {
            try {
                const Countries = await getCountries();
                setCountryList(Countries.Countries);

                const States = await getFilteredStatesByCountry(tenantRegion.CountryId.toString());
                const FilteredStates = await formatSelectInput(States.States, "Name", "Id")
                store.dispatch(loadStates({ States: FilteredStates }))

                const Managers = await getManagersList();
                store.dispatch(loadManagers(Managers));
            } catch (error) {
                console.error(error);
            }
        }
    }

    return (
        <>
            <div
                className="modal fade"
                id='EditTenantRegion'
                data-bs-backdrop='static'
                data-bs-keyboard='false'
                aria-hidden='true'
            >
                <div className="modal-dialog ">
                    <div className="modal-content">
                        <div className="modal-header mx-3">
                            <h5 className="modal-title app-primary-color">{t('tenantregion_update_tenant_region')}</h5>
                            <button
                                type='button'
                                className="btn-close"
                                data-bs-dismiss='modal'
                                id='closeEditTenantRegion'
                                onClick={onModalClose}
                                aria-label='Close'
                                ref={modalRef}
                            ></button>
                        </div>
                        <div className="modal-body">
                            <ValidationErrorComp errors={errors} />
                            <div className='row mb-1'>
                                <div className="col-md-12" >
                                    <div className="mb-2">
                                        <label className="red-asterisk" >{t('tenantregion_update_code')}</label>
                                        <input onChange={onUpdateField} name="Code" value={tenantRegion.Code} type="text" disabled={true} className={`form-control  ${errors["Code"] ? "is-invalid" : ""}`} />
                                        <div className="invalid-feedback"> {t(errors['Code'])}</div>
                                    </div>
                                    <div className="mb-2">
                                        <label className="red-asterisk">{t('tenantregion_update_regionname')}</label>
                                        <input onChange={onUpdateField} name="RegionName" value={tenantRegion.RegionName} disabled={true} type="text" className={`form-control  ${errors["RegionName"] ? "is-invalid" : ""}`} />
                                        <div className="invalid-feedback"> {t(errors['RegionName'])}</div>
                                    </div>
                                    <div className=" mb-1">
                                        <label className="red-asterisk">{t('tenant_officeinfo_update_officename')}</label>
                                        <input value={tenantRegion.OfficeName} type="text" className={`form-control`} disabled={true} />
                                    </div>
                                    <div className="mb-1">
                                        <label className="red-asterisk">{t('tenant_officeinfo_update_address')}</label>
                                        <textarea onChange={onUpdateField} name="Address" value={tenantRegion.Address} className={`form-control  ${errors["Address"] ? "is-invalid" : ""}`} />
                                        <div className="invalid-feedback"> {t(errors['Address'])}</div>
                                    </div>
                                    <div className="col-md-12">
                                        <label className="mt-2 red-asterisk">{t('tenant_officeinfo_create_select_pincode')}</label>
                                        <Select
                                            options={pincodelist && pincodelist.length > 0 ? pincodelist : []}
                                            inputValue={isFocused || pincodelist.length == 0 ? inputValue : ''}
                                            value={isFocused ? null : selectedOption}
                                            isSearchable
                                            onInputChange={(newValue, { action }) => {
                                                if (action === 'input-change') {
                                                    setInputValue(newValue);
                                                    if (newValue.length >= 3) {
                                                        getFilteredPostalCodeList(newValue);
                                                    } else if (newValue.length === 0) {
                                                        getSelectedPostalCodeList();
                                                    }
                                                }
                                            }}
                                            onChange={(selectedOption) => {
                                                onPostalCodeSelectChange(selectedOption);
                                                setInputValue(selectedOption ? selectedOption.label : '');
                                                setIsFocused(false);
                                                if (selectedOption == null) {
                                                    getSelectedPostalCodeList();
                                                }
                                            }}
                                            onMenuOpen={() => setIsFocused(true)}
                                            onMenuClose={() => setIsFocused(false)}
                                            classNamePrefix="react-select"
                                            name="Pincode"
                                            placeholder={t('tenant_office_create_placeholder_select')}
                                            noOptionsMessage={() => {
                                                if (inputValue.length >= 3) {
                                                    if (isLoading) {
                                                        return t('tenant_office_create_placeholder_pincode_loading'); // API is still loading
                                                    } else if (pincodelist.length === 0) {
                                                        return t('tenant_office_create_placeholder_invalid_pincode'); // No results found
                                                    }
                                                } else if (inputValue.length <= 2) {
                                                    return t('tenant_office_create_placeholder_inital_select_msg');
                                                }
                                                return null;
                                            }}
                                        />
                                        <div className="invalid-feedback"> {errors['Pincode']}</div>
                                    </div>
                                    <div className='col-md-12'>
                                        <label className="mt-2 red-asterisk">{t('tenant_officeinfo_update_city')}</label>
                                        <Select
                                            options={cities}
                                            value={cities && cities.find(option => option.value == tenantRegion.CityId) || null}
                                            onChange={(selectedOption) => onSelectChange(selectedOption, "CityId")}
                                            isSearchable
                                            name="CityId"
                                            placeholder={t('tenant_office_update_placeholder_city')}
                                        />
                                        <div className="small text-danger"> {t(errors['CityId'])}</div>
                                    </div>
                                    <div className='col-md-12'>
                                        <label className="mt-2 asterisk">{t('tenant_officeinfo_update_state')}</label>
                                        <Select
                                            options={states}
                                            value={states && states.find(option => option.value == tenantRegion.StateId) || null}
                                            onChange={(selectedOption) => onSelectChange(selectedOption, "StateId")}
                                            isSearchable
                                            name="StateId"
                                            placeholder={t('tenant_office_update_placeholder_state')}
                                        />
                                        <div className="small text-danger"> {t(errors['StateId'])}</div>
                                    </div>
                                    <div className="col-md-12">
                                        <label className="mt-2 red-asterisk">{t('tenant_officeinfo_update_country')} </label>
                                        <Select
                                            options={formattedCountryList}
                                            value={formattedCountryList && formattedCountryList.find(option => option.value == tenantRegion.CountryId) || null}
                                            onChange={(selectedOption) => onSelectChange(selectedOption, "CountryId")}
                                            isSearchable
                                            classNamePrefix="react-select"
                                            name="CountryId"
                                            placeholder={t('tenant_office_update_placeholder_country')}
                                        />
                                        <div className="small text-danger"> {t(errors['CountryId'])}</div>
                                    </div>
                                    <div className="mb-1">
                                        <label className="red-asterisk">{t('tenant_officeinfo_update_phone')}</label>
                                        <input onChange={onUpdateField} name="Phone" type="text" value={tenantRegion.Phone} className={`form-control  ${errors["Phone"] ? "is-invalid" : ""}`}></input>
                                        <div className="invalid-feedback"> {t(errors['Phone'])}</div>
                                    </div>
                                    <div className="mb-1">
                                        <label className="red-asterisk">{t('tenant_officeinfo_update_email')}</label>
                                        <input onChange={onUpdateField} name="Email" type="text" value={tenantRegion.Email} className={`form-control  ${errors["Email"] ? "is-invalid" : ""}`} ></input>
                                        <div className="invalid-feedback"> {t(errors['Email'])}</div>
                                    </div>
                                    <div className="mb-1">
                                        <label className="red-asterisk">{t('tenant_officeinfo_update_mobile')}</label>
                                        <input onChange={onUpdateField} name="Mobile" value={tenantRegion.Mobile} type="text" className={`form-control  ${errors["Mobile"] ? "is-invalid" : ""}`} />
                                        <div className="invalid-feedback"> {t(errors['Mobile'])}</div>
                                    </div>
                                    <div className="mb-1">
                                        <label className="red-asterisk">{t('tenant_officeinfo_update_gstno')}</label>
                                        <input onChange={onUpdateField} name="GstNumber" value={tenantRegion.GstNumber} type="text" className={`form-control  ${errors["GstNumber"] ? "is-invalid" : ""}`} ></input>
                                        <div className="invalid-feedback"> {t(errors['GstNumber'])}</div>
                                    </div>
                                    <div className='col-md-12'>
                                        <label className="mt-2 red-asterisk">{t('tenant_officeinfo_update_gststate')}</label>
                                        <Select
                                            options={states}
                                            value={states && states.find(option => option.value == tenantRegion.GstStateId) || null}
                                            onChange={(selectedOption) => onSelectChange(selectedOption, "GstStateId")}
                                            isSearchable
                                            name="GstStateId"
                                            placeholder={t('tenant_office_update_placeholder_state')}
                                        />
                                        <div className="small text-danger"> {t(errors['GstStateId'])}</div>
                                    </div>
                                    <div className="col-md-12">
                                        <label className="mt-2 red-asterisk">{t('tenant_officeinfo_update_manager')}</label>
                                        <Select
                                            options={selectManagersList}
                                            value={selectManagersList && selectManagersList.find(option => option.value == tenantRegion.ManagerId) || null}
                                            onChange={(selectedOption) => onSelectChange(selectedOption, "ManagerId")}
                                            isSearchable
                                            classNamePrefix="react-select"
                                            name="ManagerId"
                                            placeholder={t('tenantregion_update_manager_placeholder')}
                                        />
                                        <div className="small text-danger"> {t(errors['ManagerId'])}</div>
                                    </div>
                                    <div className="mb-1 mt-2">
                                        <label className="">{t('tenant_officeinfo_update_tin')}</label>
                                        <input onChange={onUpdateField} name="Tin" value={tenantRegion.Tin ?? ""} type="text" className={`form-control`} ></input>
                                    </div>
                                    <div className=" mb-2 form-check form-switch">
                                        <label className="form-check-label" htmlFor="flexSwitchCheckDefault">
                                            {t('tenantregion_update_tenant_status')}
                                            <input
                                                className="form-check-input switch-input-lg"
                                                type="checkbox"
                                                name="IsActive"
                                                id="flexSwitchCheckDefault"
                                                checked={tenantRegion.IsActive.valueOf()}
                                                value={tenantRegion.IsActive.toString()}
                                                onChange={onUpdateField}
                                            />
                                        </label>
                                    </div>
                                    <div className="d-grid gap-2 mt-2">
                                        <button className="btn app-primary-bg-color text-white" type="button" onClick={onTenantRegionSubmit}>
                                            {t('tenantregion_update_btn_submit')}
                                        </button>
                                    </div>
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