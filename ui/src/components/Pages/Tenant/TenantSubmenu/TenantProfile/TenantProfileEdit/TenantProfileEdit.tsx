import { useTranslation } from "react-i18next";
import { ValidationErrorComp } from "../../../../../ValidationErrors/ValidationError";
import { EditTenantProfileState, initializeTenantEdit, loadSelectDetails, loadTenantProfilePostalCodeList, toggleInformationModalStatus, updateErrors, updateField } from "./TenantProfileEdit.slice";
import { store } from "../../../../../../state/store";
import { startPreloader, stopPreloader } from "../../../../../Preloader/Preloader.slice";
import { useEffect, useRef, useState } from "react";
import SweetAlert from "react-bootstrap-sweetalert";
import * as yup from 'yup';
import { useStore } from "../../../../../../state/storeHooks";
import { getClickedTenantDetails, updateTenant } from "../../../../../../services/tenant";
import { convertBackEndErrorsToValidationErrors, formatSelectInput } from "../../../../../../helpers/formats";
import { checkForPermission } from "../../../../../../helpers/permissions";
import { useParams } from "react-router-dom";
import { getFilteredStatesByCountry } from "../../../../../../services/state";
import { getFilteredCitiesByState } from "../../../../../../services/city";
import Select from 'react-select';
import { initializeTenantProfile, loadTenantDetails } from "../TenantProfile.slice";
import { getPostalCodeList } from "../../../../../../services/postalcode";

export const EditTenant = () => {
    const { t } = useTranslation();
    const modalRef = useRef<HTMLButtonElement>(null);
    const { TenantId } = useParams<{ TenantId: string }>();
    const [pincodelist, setPincodeList] = useState<any>([])
    const [selectOption, setOption] = useState(0)
    const [isFocused, setIsFocused] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const selectedOption = pincodelist.find(option => option.value === selectOption) || null;
    const [isLoading, setIsLoading] = useState(false);
    const { tenantprofileedit: { tenant, displayInformationModal, errors, selectDetails, postalcodelist } } = useStore(({ tenantprofileedit }) => ({ tenantprofileedit }));

    const getFilteredPostalCodeList = async (pincode: string) => {
        setIsLoading(true);
        try {
            const PostalCodeList = await getPostalCodeList(pincode);
            if (PostalCodeList && PostalCodeList.PostalCodeList) {
                const FilteredPincodes = await formatSelectInput(PostalCodeList.PostalCodeList, "Pincode", "Id");
                setPincodeList(FilteredPincodes);
                store.dispatch(loadTenantProfilePostalCodeList(PostalCodeList));
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
        if (tenant.Pincode) {
            getSelectedPostalCodeList()
            setInputValue(tenant.Pincode)
        }
    }, [tenant])

    useEffect(() => {
        if (tenant.Pincode) {
            getSelectedPostalCodeList()
            setInputValue(tenant.Pincode)
        }
    }, [selectedOption == null && isFocused == false])

    const getSelectedPostalCodeList = async () => {
        try {
            const PostalCodeList = await getPostalCodeList(tenant.Pincode);
            const FilteredPincodes = await formatSelectInput(PostalCodeList.PostalCodeList, "Pincode", "Id");
            if (FilteredPincodes && FilteredPincodes.length > 0) {
                setPincodeList(FilteredPincodes);
                setOption(FilteredPincodes[0].value);
            } else {
                setPincodeList([]);
                setOption(0);
            }
            store.dispatch(loadTenantProfilePostalCodeList(PostalCodeList));
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
        store.dispatch(updateField({ name: 'Country', value: postalcodeobj.CountryId }));
        store.dispatch(updateField({ name: 'City', value: postalcodeobj.CityId }));
        store.dispatch(updateField({ name: 'State', value: postalcodeobj.StateId }));
        store.dispatch(updateField({ name: 'Pincode', value: postalcodeobj.Pincode }));
    };

    const onUpdateField = (ev: any) => {
        var name = ev.target.name;
        var value = ev.target.value;
        store.dispatch(updateField({ name: name as keyof EditTenantProfileState['tenant'], value }));
    }

    const onSubmit = async () => {
        store.dispatch(updateErrors({}))
        try {
            await validationSchema.validate(tenant, { abortEarly: false });
        } catch (error: any) {
            const errors = error.inner.reduce((allErrors: any, currentError: any) => {
                return { ...allErrors, [currentError.path as string]: currentError.message };
            }, {});
            store.dispatch(updateErrors(errors))
            if (errors)
                return;
        }
        store.dispatch(startPreloader());
        const result = await updateTenant(tenant)
        result.match({
            ok: ({ IsTenantUpdated }) => {
                store.dispatch(toggleInformationModalStatus())
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
            <SweetAlert success title="Success" onConfirm={updateTenantProfile}>
                {t('tenant_edit_success_message')}
            </SweetAlert>
        );
    }

    const updateTenantProfile = async () => {
        store.dispatch(toggleInformationModalStatus())
        store.dispatch(initializeTenantProfile());
        try {
            const result = await getClickedTenantDetails(TenantId);
            store.dispatch(loadTenantDetails(result));
        } catch (error) {
            console.error(error);
        }
        modalRef.current?.click()
        setInputValue('');
        setIsFocused(false);
        setPincodeList([]);
        setOption(0);
    }

    useEffect(() => {
        if (tenant.Country !== 0) {
            getFilteredStates()
        }
    }, [tenant.Country])

    const getFilteredStates = async () => {
        const { States } = await getFilteredStatesByCountry(tenant.Country.toString());
        const filteredStates = await formatSelectInput(States, "Name", "Id")
        store.dispatch(loadSelectDetails({ name: 'States', value: { Select: filteredStates } }));
    }

    useEffect(() => {
        if (tenant.State != 0) {
            getFilteredCities()
        }
    }, [tenant.State])

    const getFilteredCities = async () => {
        const { Cities } = await getFilteredCitiesByState(tenant.State.toString());
        const filteredCities = await formatSelectInput(Cities, "Name", "Id")
        store.dispatch(loadSelectDetails({ name: 'Cities', value: { Select: filteredCities } }));
    }

    const onModalClose = () => {
        store.dispatch(initializeTenantEdit())
        setInputValue('');
        setIsFocused(false);
        setPincodeList([]);
        setOption(0);
    }
    const validationSchema = yup.object().shape({
        Name: yup.string().required('validation_error_tenant_edit_name_required'),
        NameOnPrint: yup.string().required('validation_error_tenant_edit_nameonprint_required'),
        Address: yup.string().required('validation_error_tenant_edit_address_required'),
        CWHAddress: yup.string().required('validation_error_tenant_edit_cwhaddress_required'),
        GRCAddress: yup.string().required('validation_error_tenant_edit_grcaddress_required'),
        HOAddress: yup.string().required('validation_error_tenant_edit_ho_required'),
        City: yup.number().positive('validation_error_tenant_edit_city_required'),
        State: yup.number().positive('validation_error_tenant_edit_state_required'),
        Country: yup.number().positive('validation_error_tenant_edit_country_required'),
        Pincode: yup.string().required('validation_error_tenant_edit_pincode_required'),
        PanNumber: yup.string().required('validation_error_tenant_edit_pan_required').matches(/^[A-Z]{3}[PHAFCT]{1}[A-Z]{1}[0-9]{4}[A-Z]{1}$/, ('validation_error_tenantprofileedit_pannumber_checking_rule') ?? ''),
    });

    const onSelectChange = (selectedOption: any, actionMeta: any) => {
        var value = selectedOption.value
        var name = actionMeta.name
        store.dispatch(updateField({ name: name as keyof EditTenantProfileState['tenant'], value }));
    }

    return (
        <>
            <div
                className="modal fade"
                id='EditTenant'
                data-bs-backdrop='static'
                data-bs-keyboard='false'
                aria-hidden='true'
            >
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header mx-2">
                            <h5 className="modal-title">{t('tenant_edit_title')}</h5>
                            <button
                                type='button'
                                className="btn-close"
                                data-bs-dismiss='modal'
                                id='closeEditTenantModal'
                                aria-label='Close'
                                onClick={onModalClose}
                                ref={modalRef}
                            ></button>
                        </div>
                        {checkForPermission("ACCEL_MANAGE") &&
                            <div className="modal-body">
                                <div className="container-fluid">
                                    <ValidationErrorComp errors={errors} />
                                    <div>
                                        <div className='row mb-1'>
                                            <div className='col-md-12'>
                                                <label className="mt-2 red-asterisk">{t('tenant_edit_input_name')}</label>
                                                <input name='Name' onChange={onUpdateField} type='text'
                                                    value={tenant.Name}
                                                    className={`form-control  ${errors["Name"] ? "is-invalid" : ""}`}
                                                ></input>
                                                <div className="invalid-feedback"> {t(errors['Name'])}</div>
                                            </div>
                                            <div className='col-md-12'>
                                                <label className="mt-2 red-asterisk">{t('tenant_edit_input_nameonprint')}</label>
                                                <input name='NameOnPrint' onChange={onUpdateField} type='text'
                                                    value={tenant.NameOnPrint}
                                                    className={`form-control  ${errors["NameOnPrint"] ? "is-invalid" : ""}`}
                                                ></input>
                                                <div className="invalid-feedback"> {t(errors['NameOnPrint'])}</div>
                                            </div>
                                            <div className='col-md-12'>
                                                <label className="mt-2 red-asterisk">{t('tenant_edit_input_pannumber')}</label>
                                                <input name='PanNumber' onChange={onUpdateField} type='text'
                                                    value={tenant.PanNumber}
                                                    className={`form-control  ${errors["PanNumber"] ? "is-invalid" : ""}`}
                                                ></input>
                                                <div className="invalid-feedback"> {t(errors['PanNumber'])}</div>
                                            </div>
                                            <div className="col-md-12">
                                                <label className="mt-2 red-asterisk">{t('tenant_edit_input_pincode')}</label>
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
                                                    placeholder={t('tenantprofile_create_placeholder_select')}
                                                    noOptionsMessage={() => {
                                                        if (inputValue.length >= 3) {
                                                            if (isLoading) {
                                                                return t('tenantprofile_create_placeholder_pincode_loading'); // API is still loading
                                                            } else if (pincodelist.length === 0) {
                                                                return t('tenantprofile_create_placeholder_invalid_pincode'); // No results found
                                                            }
                                                        } else if (inputValue.length <= 2) {
                                                            return t('tenantprofile_create_placeholder_inital_select_msg');
                                                        }
                                                        return null;
                                                    }}
                                                />
                                                <div className="invalid-feedback"> {errors['Pincode']}</div>
                                            </div>
                                            <div className="mb-1 mt-1">
                                                <label className="red-asterisk">{t('tenant_edit_input_country')}</label>
                                                <Select
                                                    options={selectDetails.Countrys}
                                                    value={selectDetails.Countrys && selectDetails.Countrys.find(option => option.value == tenant.Country) || null}
                                                    onChange={onSelectChange}
                                                    isSearchable
                                                    name="Country"
                                                    placeholder={t('tenant_edit_select_placeholder')}
                                                />
                                                <div className="small text-danger"> {t(errors['Country'])}</div>
                                            </div>
                                            <div className="mb-1 mt-1">
                                                <label className="red-asterisk">{t('tenant_edit_input_state')}</label>
                                                <Select
                                                    options={selectDetails.States}
                                                    value={selectDetails.States && selectDetails.States.find(option => option.value == tenant.State) || null}
                                                    onChange={onSelectChange}
                                                    isSearchable
                                                    name="State"
                                                    placeholder={t('tenant_edit_select_placeholder')}
                                                />
                                                <div className="small text-danger"> {t(errors['State'])}</div>
                                            </div>
                                            <div className="mb-1 mt-1">
                                                <label className="red-asterisk">{t('tenant_edit_input_city')}</label>
                                                <Select
                                                    options={selectDetails.Cities}
                                                    value={selectDetails.Cities && selectDetails.Cities.find(option => option.value == tenant.City) || null}
                                                    onChange={onSelectChange}
                                                    isSearchable
                                                    name="City"
                                                    placeholder={t('tenant_edit_select_placeholder')}
                                                />
                                                <div className="small text-danger"> {t(errors['City'])}</div>
                                            </div>
                                            <div className="mb-1">
                                                <label className="red-asterisk">{t('tenant_edit_input_address')}</label>
                                                <textarea rows={4} onChange={onUpdateField} name="Address" value={tenant.Address} className={`form-control  ${errors["Address"] ? "is-invalid" : ""}`} ></textarea>
                                                <div className="invalid-feedback "> {t(errors['Address'])}</div>
                                            </div>
                                            <div className='col-md-12'>
                                                <label className="mt-2 red-asterisk">{t('tenant_edit_input_hoaddress')}</label>
                                                <textarea rows={4} name='HOAddress' onChange={onUpdateField}
                                                    value={tenant.HOAddress}
                                                    className={`form-control  ${errors["HOAddress"] ? "is-invalid" : ""}`}
                                                ></textarea>
                                                <div className="invalid-feedback"> {t(errors['HOAddress'])}</div>
                                            </div>
                                            <div className='col-md-12'>
                                                <label className="mt-2 red-asterisk">{t('tenant_edit_input_grcaddress')}</label>
                                                <textarea rows={4} name='GRCAddress' onChange={onUpdateField}
                                                    value={tenant.GRCAddress}
                                                    className={`form-control  ${errors["GRCAddress"] ? "is-invalid" : ""}`}
                                                ></textarea>
                                                <div className="invalid-feedback"> {t(errors['GRCAddress'])}</div>
                                            </div>
                                            <div className='col-md-12'>
                                                <label className="mt-2 red-asterisk">{t('tenant_edit_input_cwhaddress')}</label>
                                                <textarea rows={4} name='CWHAddress' onChange={onUpdateField}
                                                    value={tenant.CWHAddress}
                                                    className={`form-control  ${errors["CWHAddress"] ? "is-invalid" : ""}`}
                                                ></textarea>
                                                <div className="invalid-feedback"> {t(errors['CWHAddress'])}</div>
                                            </div>
                                            <div className="col-md-12 mt-2">
                                                <button type='button' className='btn app-primary-bg-color text-white mt-2 w-100' onClick={onSubmit}>
                                                    {t('tenant_edit_button')}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {displayInformationModal ? <InformationModal /> : ""}
                            </div>
                        }
                    </div>
                </div>
            </div>
        </>
    );
}