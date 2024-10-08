import { useTranslation } from "react-i18next";
import { ContainerPage } from "../../../../ContainerPage/ContainerPage";
import { ValidationErrorComp } from "../../../../ValidationErrors/ValidationError";
import { store } from "../../../../../state/store";
import { startPreloader, stopPreloader } from "../../../../Preloader/Preloader.slice";
import { useStoreWithInitializer } from '../../../../../state/storeHooks';
import { useEffect, useRef, useState } from "react";
import SweetAlert from "react-bootstrap-sweetalert";
import { convertBackEndErrorsToValidationErrors, formatSelectInput, formatSelectInputWithCode, formatSelectInputWithThreeArgParenthesis } from "../../../../../helpers/formats";
import * as yup from 'yup';
import { EditBankBranchState, initializeBankBranchEdit, loadBankBranchPostalCodeList, loadCities, loadCountries, loadSelectDetails, loadStates, toggleInformationModalStatus, updateErrors, updateField } from "./BankBranchEdit.slice";
import { bankBranchEdit, getBankBranchList } from "../../../../../services/bankbranch";
import { loadBankBranches } from "../BankBranchList/BankBranchList.slice";
import { getApprovedBankNameList } from "../../../../../services/bank";
import Select from 'react-select';
import { getCountries } from "../../../../../services/country";
import { getFilteredStatesByCountry } from "../../../../../services/state";
import { getFilteredCitiesByState } from "../../../../../services/city";
import { checkForPermission } from "../../../../../helpers/permissions";
import { getPostalCodeList } from "../../../../../services/postalcode";

export const BankBranchEdit = () => {
    const { t } = useTranslation();
    const [bankList, setBankList] = useState<any>(null)
    const [formattedBankList, setFormattedBankList] = useState<any>(null)
    const modalRef = useRef<HTMLButtonElement>(null);
    const [pincodelist, setPincodeList] = useState<any>([])
    const [selectOption, setOption] = useState(0)
    const [isFocused, setIsFocused] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const selectedOption = pincodelist.find(option => option.value == selectOption) || null;
    const [isLoading, setIsLoading] = useState(false);

    const getSelectListData = async () => {
        const bankNames = await getApprovedBankNameList()
        setBankList(bankNames.ApprovedList)
        const Countries = await getCountries();
        const filteredCountries = await formatSelectInputWithCode(Countries.Countries, "Name", "Id", "CallingCode")
        store.dispatch(loadCountries({ Countries: filteredCountries }));
        const filteredCountryCode = await formatSelectInputWithThreeArgParenthesis(Countries.Countries, "CallingCode", "Name", "CallingCode")
        store.dispatch(loadSelectDetails({ name: 'PrimaryCountryCode', value: { Select: filteredCountryCode } }));
    }

    const { selectedBranch, displayInformationModal, errors, states, cities, countries, selectDetails, postalcodelist } = useStoreWithInitializer(({ bankbranchedit }) => bankbranchedit, getSelectListData);

    const getFilteredPostalCodeList = async (pincode: string) => {
        setIsLoading(true);
        try {
            const PostalCodeList = await getPostalCodeList(pincode);
            if (PostalCodeList && PostalCodeList.PostalCodeList) {
                const FilteredPincodes = await formatSelectInput(PostalCodeList.PostalCodeList, "Pincode", "Id");
                setPincodeList(FilteredPincodes);
                store.dispatch(loadBankBranchPostalCodeList(PostalCodeList));
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
        if (selectedBranch.Pincode) {
            getSelectedPostalCodeList()
            setInputValue(selectedBranch.Pincode)
        }
    }, [selectedBranch])

    useEffect(() => {
        if (selectedBranch.Pincode) {
            getSelectedPostalCodeList()
            setInputValue(selectedBranch.Pincode)
        }
    }, [selectedOption == null && isFocused == false])

    const getSelectedPostalCodeList = async () => {
        try {
            const PostalCodeList = await getPostalCodeList(selectedBranch.Pincode);
            const FilteredPincodes = await formatSelectInput(PostalCodeList.PostalCodeList, "Pincode", "Id");
            if (FilteredPincodes && FilteredPincodes.length > 0) {
                setPincodeList(FilteredPincodes);
                setOption(FilteredPincodes[0].value);
            } else {
                setPincodeList([]);
                setOption(0);
            }
            store.dispatch(loadBankBranchPostalCodeList(PostalCodeList));
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
        if (selectedBranch.CountryId != 0) {
            store.dispatch(startPreloader())
            getSelectListData()
            store.dispatch(stopPreloader())
        }
    }, [selectedBranch.CountryId])

    useEffect(() => {
        if (bankList != null)
            setFormattedBankList(formatSelectInput(bankList, "BankName", "Id"))
    }, [bankList])

    useEffect(() => {
        if (selectedBranch.CountryId != 0) {
            getFilteredStates()
        }
    }, [selectedBranch.CountryId])

    const getFilteredStates = async () => {
        const States = await getFilteredStatesByCountry(selectedBranch.CountryId.toString());
        const FilteredStates = await formatSelectInput(States.States, "Name", "Id")
        store.dispatch(loadStates({ States: FilteredStates }))
    }

    useEffect(() => {
        if (selectedBranch.StateId != 0) {
            getFilteredCities()
        }
    }, [selectedBranch.StateId])

    const getFilteredCities = async () => {
        const Cities = await getFilteredCitiesByState(selectedBranch.StateId.toString());
        const FilteredCities = await formatSelectInput(Cities.Cities, "Name", "Id")
        store.dispatch(loadCities({ Cities: FilteredCities }))
    }

    const onUpdateField = (ev: any) => {
        var name = ev.target.name;
        var value = ev.target.value;
        store.dispatch(updateField({ name: name as keyof EditBankBranchState['selectedBranch'], value }));
    }

    const onSubmit = async () => {
        store.dispatch(updateErrors({}))
        try {
            await validationSchema.validate(selectedBranch, { abortEarly: false });
        } catch (error: any) {
            const errors = error.inner.reduce((allErrors: any, currentError: any) => {
                return { ...allErrors, [currentError.path as string]: currentError.message };
            }, {});
            store.dispatch(updateErrors(errors))
            if (errors)
                return;
        }
        store.dispatch(startPreloader());
        const result = await bankBranchEdit(selectedBranch)
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
            <SweetAlert success title="Success" onConfirm={updateBankBranch}>
                {t('bankbranch_edit_success_message')}
            </SweetAlert>
        );
    }

    const updateBankBranch = async () => {
        store.dispatch(toggleInformationModalStatus());
        const BankBranches = await getBankBranchList(store.getState().bankbranchlist.search, 1);
        store.dispatch(loadBankBranches(BankBranches));
        modalRef.current?.click()
        setInputValue('');
        setIsFocused(false);
        setPincodeList([]);
        setOption(0);
    }

    const onModalClose = async () => {
        store.dispatch(initializeBankBranchEdit());
        try {
            const Countries = await getCountries();
            const filteredCountries = await formatSelectInputWithCode(Countries.Countries, "Name", "Id", "CallingCode");
            store.dispatch(loadCountries({ Countries: filteredCountries }));

            const data = filteredCountries.filter(item => item.value == store.getState().vendorbranchcreate.vendorBranch.CountryId)
            store.dispatch(updateField({ name: 'ContactNumberOneCountryCode', value: data[0].code }));

            const filteredCountryCode = await formatSelectInputWithThreeArgParenthesis(Countries.Countries, "CallingCode", "Name", "CallingCode")
            store.dispatch(loadSelectDetails({ name: 'PrimaryCountryCode', value: { Select: filteredCountryCode } }));
            
            setInputValue('');
            setIsFocused(false);
            setPincodeList([]);
            setOption(0);
        } catch (error) {
            return
        }
    }

    const validationSchema = yup.object().shape({
        BankId: yup.number().positive('validation_error_bankbranch_edit_bank_required'),
        BranchName: yup.string().required('validation_error_bankbranch_edit_name_required'),
        Address: yup.string().required('validation_error_bankbranch_edit_address_required'),
        CountryId: yup.number().positive('validation_error_bankbranch_edit_country_required'),
        StateId: yup.number().positive('validation_error_bankbranch_edit_state_required'),
        CityId: yup.number().positive('validation_error_bankbranch_edit_city_required'),
        Pincode: yup.string().required('validation_error_bankbranch_edit_pincode_required'),
        ContactPerson: yup.string().required('validation_error_bankbranch_edit_contactperson_required'),
        ContactNumberOneCountryCode: yup.string().required('validation_error_bankbranch_edit_contact1countrycode_required'),
        ContactNumberOne: yup.string().required('validation_error_bankbranch_edit_contact1_required'),
        Email: yup.string().required('validation_error_bankbranch_edit_email_required'),
        Ifsc: yup.string().required('validation_error_bankbranch_edit_ifsc_required'),
        MicrCode: yup.string().required('validation_error_bankbranch_edit_micrcode_required'),
        SwiftCode: yup.string().required('validation_error_bankbranch_edit_swiftcode_required')
    });

    const onSelectChange = (selectedOption: any, Name: any) => {
        var value = selectedOption.value
        var name = Name
        if (name == "CountryId") {
            store.dispatch(updateField({ name: 'ContactNumberOneCountryCode', value: selectedOption.code }));
        }
        store.dispatch(updateField({ name: name as keyof EditBankBranchState['selectedBranch'], value }));
    }

    return (
        <>
            <div
                className="modal fade"
                id='EditBankBranch'
                data-bs-backdrop='static'
                data-bs-keyboard='false'
                aria-hidden='true'
            >
                <div className="modal-dialog ">
                    <div className="modal-content">
                        <div className="modal-header mx-2">
                            <h5 className="modal-title app-primary-color">{t('bankbranch_edit_title')}</h5>
                            <button
                                type='button'
                                className="btn-close"
                                data-bs-dismiss='modal'
                                id='closeEditBankBranchModal'
                                aria-label='Close'
                                onClick={onModalClose}
                                ref={modalRef}
                            ></button>
                        </div>
                        <div className="modal-body">
                            {checkForPermission("BANKBRANCH_MANAGE") &&
                                <ContainerPage>
                                    <ValidationErrorComp errors={errors} />
                                    <div className=''>
                                        <div className='row mb-1'>
                                            <div className='col-md-12'>
                                                <label className="mt-2 red-asterisk">{t('bankbranch_edit_input_bankid')}</label>
                                                <Select
                                                    value={formattedBankList && formattedBankList.find(option => option.value == selectedBranch.BankId) || null}
                                                    options={formattedBankList}
                                                    onChange={(selectedOption) => onSelectChange(selectedOption, "BankId")}
                                                    isSearchable
                                                    isDisabled={true}
                                                    name="BankId"
                                                    placeholder={t('bankbranch_edit_select_bank_placeholder')}
                                                />
                                                <div className="small text-danger"> {t(errors['BankId'])}</div>
                                            </div>
                                            <div className='col-md-12'>
                                                <label className="mt-2 red-asterisk">{t('bankbranch_create_input_branchcode')}</label>
                                                <input name='BranchCode'
                                                    className={`form-control  ${errors["BranchCode"] ? "is-invalid" : ""}`}
                                                    onChange={onUpdateField}
                                                    disabled={true}
                                                    value={selectedBranch.BranchCode ?? ""}
                                                    type='text' ></input>
                                            </div>
                                            <div className='col-md-12'>
                                                <label className="mt-2 red-asterisk">{t('bankbranch_edit_input_branchname')}</label>
                                                <input name='BranchName'
                                                    value={selectedBranch.BranchName}
                                                    className={`form-control  ${errors["BranchName"] ? "is-invalid" : ""}`}
                                                    onChange={onUpdateField} type='text' ></input>
                                                <div className="invalid-feedback"> {t(errors['BranchName'])}</div>
                                            </div>
                                            <div className='col-md-12'>
                                                <label className="mt-2 red-asterisk">{t('bankbranch_edit_input_address')}</label>
                                                <textarea name='Address'
                                                    value={selectedBranch.Address}
                                                    className={`form-control  ${errors["Address"] ? "is-invalid" : ""}`}
                                                    onChange={onUpdateField} rows={4} ></textarea>
                                                <div className="invalid-feedback"> {t(errors['Address'])}</div>
                                            </div>
                                            <div className="col-md-12">
                                                <label className="mt-2 red-asterisk">{t('bankbranch_edit_input_pincode')}</label>
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
                                                    placeholder={t('bankbranch_edit_placeholder_select')}
                                                    noOptionsMessage={() => {
                                                        if (inputValue.length >= 3) {
                                                            if (isLoading) {
                                                                return t('bankbranch_edit_placeholder_pincode_loading');
                                                            } else if (pincodelist.length === 0) {
                                                                return t('bankbranch_edit_placeholder_invalid_pincode');
                                                            }
                                                        } else if (inputValue.length <= 2) {
                                                            return t('bankbranch_edit_placeholder_inital_select_msg');
                                                        }
                                                        return null;
                                                    }}
                                                />
                                                <div className="invalid-feedback"> {errors['Pincode']}</div>
                                            </div>
                                            <div className="col-md-12">
                                                <label className="mt-2 red-asterisk">{t('bankbranch_edit_input_countryid')}</label>
                                                <Select
                                                    options={countries}
                                                    value={countries && countries.find(option => option.value == selectedBranch.CountryId) || null}
                                                    onChange={(selectedOption) => onSelectChange(selectedOption, "CountryId")}
                                                    isSearchable
                                                    classNamePrefix="react-select"
                                                    name="CountryId"
                                                    placeholder={t('bankbranch_edit_select_country_placeholder')}
                                                />
                                                <div className="small text-danger"> {t(errors['CountryId'])}</div>
                                            </div>
                                            <div className='col-md-12'>
                                                <label className="mt-2 red-asterisk">{t('bankbranch_edit_input_stateid')}</label>
                                                <Select
                                                    options={states}
                                                    value={states && states.find(option => option.value == selectedBranch.StateId) || null}
                                                    onChange={(selectedOption) => onSelectChange(selectedOption, "StateId")}
                                                    isSearchable
                                                    name="StateId"
                                                    placeholder={t('bankbranch_edit_select_state_placeholder')}
                                                />
                                                <div className="small text-danger"> {t(errors['StateId'])}</div>
                                            </div>
                                            <div className='col-md-12'>
                                                <label className="mt-2 red-asterisk">{t('bankbranch_edit_input_cityid')}</label>
                                                <Select
                                                    options={cities}
                                                    value={cities && cities.find(option => option.value == selectedBranch.CityId) || null}
                                                    onChange={(selectedOption) => onSelectChange(selectedOption, "CityId")}
                                                    isSearchable
                                                    name="CityId"
                                                    placeholder={t('bankbranch_edit_select_city_placeholder')}
                                                />
                                                <div className="small text-danger"> {t(errors['CityId'])}</div>
                                            </div>
                                            <div className='col-md-12'>
                                                <label className="mt-2 red-asterisk">{t('bankbranch_edit_input_contactperson')}</label>
                                                <input name='ContactPerson'
                                                    value={selectedBranch.ContactPerson}
                                                    className={`form-control  ${errors["ContactPerson"] ? "is-invalid" : ""}`}
                                                    onChange={onUpdateField} type='text' ></input>
                                                <div className="invalid-feedback"> {t(errors['ContactPerson'])}</div>
                                            </div>
                                            <div className="mb-1 col-md-6">
                                                <label className="red-asterisk">{t('vendor_create_primaryno_code')}</label>
                                                <Select
                                                    options={selectDetails.PrimaryCountryCode}
                                                    value={selectDetails.PrimaryCountryCode && selectDetails.PrimaryCountryCode.find(option => option.value == selectedBranch.ContactNumberOneCountryCode) || null}
                                                    onChange={onSelectChange}
                                                    isSearchable
                                                    name="ContactNumberOneCountryCode"
                                                    placeholder={t('create_customer_site_select_city_id')}
                                                />
                                                <div className="invalid-feedback"> {t(errors['ContactNumberOneCountryCode'])}</div>
                                            </div>
                                            <div className='col-md-12'>
                                                <label className="mt-2 red-asterisk">{t('bankbranch_edit_input_contactnumberone')}</label>
                                                <input name='ContactNumberOne'
                                                    value={selectedBranch.ContactNumberOne}
                                                    className={`form-control  ${errors["ContactNumberOne"] ? "is-invalid" : ""}`}
                                                    onChange={onUpdateField} type='text' ></input>
                                                <div className="invalid-feedback"> {t(errors['ContactNumberOne'])}</div>
                                            </div>
                                            <div className='col-md-12'>
                                                <label className="mt-2">{t('bankbranch_edit_input_contactnumbertwocountrycode')}</label>
                                                <input name='ContactNumberTwoCountryCode'
                                                    value={selectedBranch.ContactNumberTwoCountryCode ?? ""}
                                                    className={`form-control  ${errors["ContactNumberTwoCountryCode"] ? "is-invalid" : ""}`}
                                                    onChange={onUpdateField} type='text' ></input>
                                                <div className="invalid-feedback"> {errors['ContactNumberTwoCountryCode']}</div>
                                            </div>
                                            <div className='col-md-12'>
                                                <label className="mt-2">{t('bankbranch_edit_input_contactnumbertwo')}</label>
                                                <input name='ContactNumberTwo'
                                                    value={selectedBranch.ContactNumberTwo ?? ""}
                                                    className={`form-control  ${errors["ContactNumberTwo"] ? "is-invalid" : ""}`}
                                                    onChange={onUpdateField} type='text' ></input>
                                                <div className="invalid-feedback"> {errors['ContactNumberTwo']}</div>
                                            </div>
                                            <div className='col-md-12'>
                                                <label className="mt-2 red-asterisk">{t('bankbranch_edit_input_email')}</label>
                                                <input name='Email'
                                                    value={selectedBranch.Email}
                                                    className={`form-control  ${errors["Email"] ? "is-invalid" : ""}`}
                                                    onChange={onUpdateField} type='text' ></input>
                                                <div className="invalid-feedback"> {t(errors['Email'])}</div>
                                            </div>
                                            <div className='col-md-12'>
                                                <label className="mt-2 red-asterisk">{t('bankbranch_edit_input_ifsc')}</label>
                                                <input name='Ifsc'
                                                    value={selectedBranch.Ifsc}
                                                    className={`form-control  ${errors["Ifsc"] ? "is-invalid" : ""}`}
                                                    onChange={onUpdateField} type='text' ></input>
                                                <div className="invalid-feedback"> {t(errors['Ifsc'])}</div>
                                            </div>
                                            <div className='col-md-12'>
                                                <label className="mt-2 red-asterisk">{t('bankbranch_edit_input_micrcode')}</label>
                                                <input name='MicrCode'
                                                    value={selectedBranch.MicrCode}
                                                    className={`form-control  ${errors["MicrCode"] ? "is-invalid" : ""}`}
                                                    onChange={onUpdateField} type='text' ></input>
                                                <div className="invalid-feedback"> {t(errors['MicrCode'])}</div>
                                            </div>
                                            <div className='col-md-12'>
                                                <label className="mt-2 red-asterisk">{t('bankbranch_edit_input_swiftcode')}</label>
                                                <input name='SwiftCode'
                                                    value={selectedBranch.SwiftCode}
                                                    className={`form-control  ${errors["SwiftCode"] ? "is-invalid" : ""}`}
                                                    onChange={onUpdateField} type='text' ></input>
                                                <div className="invalid-feedback"> {t(errors['SwiftCode'])}</div>
                                            </div>
                                            <div className="col-md-12 mt-4">
                                                <button type='button' className='btn  app-primary-bg-color text-white mt-2 float-end' onClick={onSubmit}>
                                                    {t('bankbranch_edit_submit_button')}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </ContainerPage>
                            }
                            {displayInformationModal ? <InformationModal /> : ""}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}