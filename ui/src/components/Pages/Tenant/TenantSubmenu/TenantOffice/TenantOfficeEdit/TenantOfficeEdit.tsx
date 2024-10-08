import { useTranslation } from "react-i18next";
import { ValidationErrorComp } from "../../../../../ValidationErrors/ValidationError";
import { store } from "../../../../../../state/store";
import { useEffect, useRef, useState } from "react";
import SweetAlert from "react-bootstrap-sweetalert";
import * as yup from 'yup';
import { convertBackEndErrorsToValidationErrors, formatSelectInput } from "../../../../../../helpers/formats";
import { useStore, useStoreWithInitializer } from "../../../../../../state/storeHooks";
import { TenantOfficeEditState, clearPostalCodeList, initializeTenantOfficeEdit, initializeTenantOfficeUpdate, loadCities, loadManagers, loadMasterData, loadPostalCodeList, loadStates, loadTenantRegions, toggleInformationModalStatus, updateErrors, updateField } from "./TenantOfficeEdit.slice";
import { startPreloader, stopPreloader } from "../../../../../Preloader/Preloader.slice";
import { getManagersList, getTenantOfficeList, tenantOfficeUpdate } from "../../../../../../services/tenantOfficeInfo";
import { loadTenantOffices, setVisibleModal } from "../TenantOfficeList/TenantOfficeList.slice";
import Select from 'react-select';
import { getTenantRegionNames } from "../../../../../../services/tenantRegion";
import { getValuesInMasterDataByTable } from "../../../../../../services/masterData";
import { getCountries } from "../../../../../../services/country";
import { getFilteredStatesByCountry } from "../../../../../../services/state";
import { getFilteredCitiesByState } from "../../../../../../services/city";
import { getPostalCodeList } from "../../../../../../services/postalcode";
import { createGstNumberValidation } from "../../../../../../helpers/validationformats";

export const TenantOfficeEdit = () => {
    const { t } = useTranslation();
    const modalRef = useRef<HTMLButtonElement>(null);

    const { tenantofficeedit: { tenantOffice, displayInformationModal, errors, entitiesList, cities, states, postalcodelist }, tenantofficelist: { visibleModal } } = useStore(({ tenantofficeedit, tenantofficelist }) => ({ tenantofficeedit, tenantofficelist }));

    const [countryList, setCountryList] = useState<any>(null)
    const [formattedCountryList, setFormattedCountryList] = useState<any>(null)
    const [selectManagersList, setManagersList] = useState<any>(null)
    const [pincodelist, setPincodeList] = useState<any>([])
    const [selectOption, setOption] = useState(0)
    const [isFocused, setIsFocused] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const selectedOption = pincodelist.find(option => option.value === selectOption) || null;
    const [isLoading, setIsLoading] = useState(false);
    const MODAL_NAME = "EditTenantOffice"
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
        GetMasterDataItems()
    }, [visibleModal == MODAL_NAME])

    useEffect(() => {
        if (tenantOffice.Pincode) {
            getSelectedPostalCodeList()
            setInputValue(tenantOffice.Pincode)
        }
    }, [tenantOffice])

    useEffect(() => {
        if (tenantOffice.Pincode) {
            getSelectedPostalCodeList()
            setInputValue(tenantOffice.Pincode)
        }
    }, [selectedOption == null && isFocused == false])

    const getSelectedPostalCodeList = async () => {
        try {
            const PostalCodeList = await getPostalCodeList(tenantOffice.Pincode);
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
    };

    useEffect(() => {
        setManagersList(formatSelectInput(entitiesList.Managers, "FullName", "Id"));
    }, [entitiesList.Managers])

    useEffect(() => {
        if (countryList != null)
            setFormattedCountryList(formatSelectInput(countryList, "Name", "Id"))
    }, [countryList])

    useEffect(() => {
        if (tenantOffice.CountryId != "") {
            getFilteredStates()
        }
    }, [tenantOffice.CountryId])

    const getFilteredStates = async () => {
        const States = await getFilteredStatesByCountry(tenantOffice.CountryId.toString());
        const FilteredStates = await formatSelectInput(States.States, "Name", "Id")
        store.dispatch(loadStates({ States: FilteredStates }))
    }

    useEffect(() => {
        if (tenantOffice.StateId != "") {
            getFilteredCities()
        }
    }, [tenantOffice.StateId])

    const getFilteredCities = async () => {
        const Cities = await getFilteredCitiesByState(tenantOffice.StateId.toString());
        const FilteredCities = await formatSelectInput(Cities.Cities, "Name", "Id")
        store.dispatch(loadCities({ Cities: FilteredCities }))
    }

    const onUpdateField = (ev: any) => {
        var name = ev.target.name;
        var value = ev.target.value;
        store.dispatch(updateField({ name: name as keyof TenantOfficeEditState['tenantOffice'], value }));
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
        const result = await tenantOfficeUpdate(tenantOffice)
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
                {t('tenant_office_update_success_message')}
            </SweetAlert>
        );
    }

    const updateTenantOffice = async () => {
        store.dispatch(toggleInformationModalStatus());
        store.dispatch(initializeTenantOfficeUpdate())
        store.dispatch(setVisibleModal(""))
        const tenantOffices = await getTenantOfficeList("", 1);
        store.dispatch(loadTenantOffices(tenantOffices));
        const TenantRegion = await getTenantRegionNames();
        store.dispatch(loadTenantRegions(TenantRegion));
        modalRef.current?.click()
        setInputValue('');
        setIsFocused(false);
        setPincodeList([]);
        setOption(0);
    }

    const onModalClose = async () => {
        store.dispatch(initializeTenantOfficeUpdate())
        store.dispatch(setVisibleModal(""))
        setInputValue('');
        setIsFocused(false);
        setPincodeList([]);
        setOption(0);
    }

    const validationTenantOfficeSchema = yup.object().shape({
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
        store.dispatch(updateField({ name: name as keyof TenantOfficeEditState['tenantOffice'], value }));
    }

    async function GetMasterDataItems() {
        store.dispatch(initializeTenantOfficeUpdate());
        if (visibleModal == MODAL_NAME) {
            try {
                const Countries = await getCountries();
                setCountryList(Countries.Countries);

                const States = await getFilteredStatesByCountry(tenantOffice.CountryId.toString());
                const FilteredStates = await formatSelectInput(States.States, "Name", "Id")
                store.dispatch(loadStates({ States: FilteredStates }))

                const TenantOfficeTypeList = await getValuesInMasterDataByTable("TenantOfficeType");
                const filteredTenantOfficeTypes = TenantOfficeTypeList.MasterData.filter(option => option.Name === "Area Office");
                const TenantOfficeType = await formatSelectInput(filteredTenantOfficeTypes, "Name", "Id")
                store.dispatch(loadMasterData({ MasterData: TenantOfficeType }));

                const Managers = await getManagersList();
                store.dispatch(loadManagers(Managers));

                const TenantRegion = await getTenantRegionNames();
                store.dispatch(loadTenantRegions(TenantRegion));
            } catch (error) {
                return error;
            }
        }
    }

    return (
        <>
            <div
                className="modal fade"
                id='EditTenantOffice'
                data-bs-backdrop='static'
                data-bs-keyboard='false'
                aria-hidden='true'
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header mx-3">
                            <h5 className="modal-title app-primary-color">{t('tenant_office_update_tenant_office')}</h5>
                            <button
                                type='button'
                                className="btn-close"
                                data-bs-dismiss='modal'
                                id='closeEditTenantOfficeModal'
                                onClick={onModalClose}
                                aria-label='Close'
                                ref={modalRef}
                            ></button>
                        </div>
                        <div className="modal-body">
                            <div className="container-fluid">
                                <ValidationErrorComp errors={errors} />
                                <div className=''>
                                    <div className='row mb-1'>
                                        <div className="row p-0 m-0">
                                            <div className="col-md-6 mb-1">
                                                <label className="red-asterisk">{t('tenant_officeinfo_update_officename')}</label>
                                                <input value={tenantOffice.OfficeName} type="text" className={`form-control`} disabled={true} />
                                            </div>
                                            <div className="col-md-6 mb-1">
                                                <label className="red-asterisk">{t('tenant_officeinfo_update_Officecode')}</label>
                                                <input value={tenantOffice.Code} type="text" className={`form-control`} disabled={true} />
                                            </div>
                                        </div>
                                        <div className="col-md-12" >
                                            <div className="mb-1">
                                                <label className="red-asterisk">{t('tenant_officeinfo_update_address')}</label>
                                                <textarea onChange={onUpdateField} name="Address" value={tenantOffice.Address} className={`form-control  ${errors["Address"] ? "is-invalid" : ""}`} />
                                                <div className="invalid-feedback"> {t(errors['Address'])}</div>
                                            </div>
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
                                        <div className="col-md-12">
                                            <label className="mt-2 red-asterisk">{t('tenant_officeinfo_update_country')}</label>
                                            <Select
                                                options={formattedCountryList}
                                                value={formattedCountryList && formattedCountryList.find(option => option.value == tenantOffice.CountryId) || null}
                                                onChange={(selectedOption) => onSelectChange(selectedOption, "CountryId")}
                                                isSearchable
                                                classNamePrefix="react-select"
                                                name="CountryId"
                                                placeholder={t('tenant_office_update_placeholder_country')}
                                            />
                                            <div className="small text-danger"> {t(errors['CountryId'])}</div>
                                        </div>
                                        <div className='col-md-12'>
                                            <label className="mt-2 asterisk">{t('tenant_officeinfo_update_state')}</label>
                                            <Select
                                                options={states}
                                                value={states && states.find(option => option.value == tenantOffice.StateId) || null}
                                                onChange={(selectedOption) => onSelectChange(selectedOption, "StateId")}
                                                isSearchable
                                                name="StateId"
                                                placeholder={t('tenant_office_update_placeholder_state')}
                                            />
                                            <div className="small text-danger"> {t(errors['StateId'])}</div>
                                        </div>
                                        <div className='col-md-12'>
                                            <label className="mt-2 red-asterisk">{t('tenant_officeinfo_update_city')}</label>
                                            <Select
                                                options={cities}
                                                value={cities && cities.find(option => option.value == tenantOffice.CityId) || null}
                                                onChange={(selectedOption) => onSelectChange(selectedOption, "CityId")}
                                                isSearchable
                                                name="CityId"
                                                placeholder={t('tenant_office_update_placeholder_city')}
                                            />
                                            <div className="small text-danger"> {t(errors['CityId'])}</div>
                                        </div>
                                        <div className="mb-1">
                                            <label className="red-asterisk">{t('tenant_officeinfo_update_phone')}</label>
                                            <input onChange={onUpdateField} name="Phone" type="text" value={tenantOffice.Phone} className={`form-control  ${errors["Phone"] ? "is-invalid" : ""}`}></input>
                                            <div className="invalid-feedback"> {t(errors['Phone'])}</div>
                                        </div>
                                        <div className="mb-1">
                                            <label className="red-asterisk">{t('tenant_officeinfo_update_email')}</label>
                                            <input onChange={onUpdateField} name="Email" type="text" value={tenantOffice.Email} className={`form-control  ${errors["Email"] ? "is-invalid" : ""}`} ></input>
                                            <div className="invalid-feedback"> {t(errors['Email'])}</div>
                                        </div>
                                        <div className="mb-1">
                                            <label className="red-asterisk">{t('tenant_officeinfo_update_mobile')}</label>
                                            <input onChange={onUpdateField} name="Mobile" value={tenantOffice.Mobile} type="text" className={`form-control  ${errors["Mobile"] ? "is-invalid" : ""}`} />
                                            <div className="invalid-feedback"> {t(errors['Mobile'])}</div>
                                        </div>
                                        <div className="mb-1">
                                            <label className="red-asterisk">{t('tenant_officeinfo_update_gstno')}</label>
                                            <input onChange={onUpdateField} name="GstNumber" value={tenantOffice.GstNumber} type="text" className={`form-control  ${errors["GstNumber"] ? "is-invalid" : ""}`} ></input>
                                            <div className="invalid-feedback"> {t(errors['GstNumber'])}</div>
                                        </div>
                                        <div className='col-md-12'>
                                            <label className="mt-2 red-asterisk">{t('tenant_officeinfo_update_gststate')}</label>
                                            <Select
                                                options={states}
                                                value={states && states.find(option => option.value == tenantOffice.GstStateId) || null}
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
                                            <label className="red-asterisk">{t('tenant_officeinfo_update_tin')}</label>
                                            <input onChange={onUpdateField} name="Tin" value={tenantOffice.Tin ?? ""} type="text" className={`form-control  ${errors["Tin"] ? "is-invalid" : ""}`} ></input>
                                            <div className="invalid-feedback"> {t(errors['Tin'])}</div>
                                        </div>
                                        <div className="d-grid gap-2 mt-2">
                                            <button className="btn app-primary-bg-color text-white" type="button" onClick={onTenantOfficeSubmit}>
                                                {t('tenant_office_update_btn_submit')}
                                            </button>
                                        </div>
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