import { useStoreWithInitializer } from '../../../../state/storeHooks';
import SweetAlert from 'react-bootstrap-sweetalert';
import { ContainerPage } from '../../../ContainerPage/ContainerPage';
import { useTranslation } from 'react-i18next';
import { dispatchOnCall, store } from '../../../../state/store';
import { useEffect, useState, useRef } from 'react';
import {
  initializeVendorEdit, updateField, updateErrors, toggleInformationModalStatus, EditVendorState, loadSelectDetails, loadVendorEditPostalCodeList
} from './VendorEdit.slice'
import { startPreloader, stopPreloader } from '../../../Preloader/Preloader.slice';
import * as yup from 'yup';
import { getFilteredCitiesByState } from '../../../../services/city';
import { convertBackEndErrorsToValidationErrors, formatDate, formatDateTime, formatSelectInput, formatSelectInputWithCode, formatSelectInputWithThreeArgParenthesis } from '../../../../helpers/formats';
import Select from 'react-select';
import { getTenantOfficeInfo } from '../../../../services/tenantOfficeInfo';
import { getFilteredStatesByCountry } from '../../../../services/state';
import { editVendor, getGstVendorTypes, getVendorList } from '../../../../services/vendor';
import { ValidationErrorComp } from '../../../ValidationErrors/ValidationError';
import { checkForPermission } from '../../../../helpers/permissions';
import { getValuesInMasterDataByTable } from '../../../../services/masterData';
import { loadVendors } from '../VendorList/VendorList.slice';
import { getCountries } from '../../../../services/country';
import { getPostalCodeList } from '../../../../services/postalcode';
import { createGstNumberValidation } from '../../../../helpers/validationformats';

export const VendorEdit = () => {
  const modalRef = useRef<HTMLButtonElement>(null);
  const { t, i18n } = useTranslation();
  const [pincodelist, setPincodeList] = useState<any>([])
  const [selectOption, setOption] = useState(0)
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const selectedOption = pincodelist.find(option => option.value === selectOption) || null;
  const [isLoading, setIsLoading] = useState(false);
  const [gstVendoTypes, setGstVendorTypes] = useState<any>(null)

  const { vendor, displayInformationModal, errors, selectDetails, postalcodelist } = useStoreWithInitializer(({ vendoredit }) => vendoredit, dispatchOnCall(initializeVendorEdit()))

  const getFilteredPostalCodeList = async (pincode: string) => {
    setIsLoading(true);
    try {
      const PostalCodeList = await getPostalCodeList(pincode);
      if (PostalCodeList && PostalCodeList.PostalCodeList) {
        const FilteredPincodes = await formatSelectInput(PostalCodeList.PostalCodeList, "Pincode", "Id");
        setPincodeList(FilteredPincodes);
        store.dispatch(loadVendorEditPostalCodeList(PostalCodeList));
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
    if (vendor.Pincode) {
      getSelectedPostalCodeList()
      setInputValue(vendor.Pincode)
    }
  }, [vendor])

  useEffect(() => {
    if (vendor.Pincode) {
      getSelectedPostalCodeList()
      setInputValue(vendor.Pincode)
    }
  }, [selectedOption == null && isFocused == false])

  const getSelectedPostalCodeList = async () => {
    try {
      const PostalCodeList = await getPostalCodeList(vendor.Pincode);
      const FilteredPincodes = await formatSelectInput(PostalCodeList.PostalCodeList, "Pincode", "Id");
      if (FilteredPincodes && FilteredPincodes.length > 0) {
        setPincodeList(FilteredPincodes);
        setOption(FilteredPincodes[0].value);
      } else {
        setPincodeList([]);
        setOption(0);
      }
      store.dispatch(loadVendorEditPostalCodeList(PostalCodeList));
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
    if (checkForPermission("VENDOR_CREATE")) {
      onLoad();
    }
  }, []);

  const onLoad = async () => {
    try {
      var { MasterData } = await getValuesInMasterDataByTable('VendorType');
      const filteredVendorType = await formatSelectInput(MasterData, 'Name', 'Id');
      store.dispatch(loadSelectDetails({ name: 'VendorType', value: { Select: filteredVendorType } }));

      const { TenantOfficeInfo } = await getTenantOfficeInfo();
      const filteredTenantOfiiceInfo = formatSelectInput(TenantOfficeInfo, "OfficeName", "Id")
      store.dispatch(loadSelectDetails({ name: 'Location', value: { Select: filteredTenantOfiiceInfo } }));

      var { MasterData } = await getValuesInMasterDataByTable('PanType');
      const filteredPanType = await formatSelectInput(MasterData, 'Name', 'Id');
      store.dispatch(loadSelectDetails({ name: 'PanType', value: { Select: filteredPanType } }));

      var { MasterData } = await getValuesInMasterDataByTable('GSTVendorType');
      const gstVendorTypeList = await formatSelectInputWithCode(MasterData, 'Name', 'Id', 'Code')
      setGstVendorTypes(gstVendorTypeList);
      const filteredGstVendorTypeType = await formatSelectInput(MasterData, 'Name', 'Id');
      store.dispatch(loadSelectDetails({ name: 'GstVendorType', value: { Select: filteredGstVendorTypeType } }));

      const Countries = await getCountries();
      const filteredCountries = await formatSelectInput(Countries.Countries, "Name", "Id")
      store.dispatch(loadSelectDetails({ name: 'Countrys', value: { Select: filteredCountries } }));

      const data = filteredCountries.filter(item => item.value == store.getState().vendorbranchcreate.vendorBranch.CountryId)
      store.dispatch(updateField({ name: 'ContactNumberOneCountryCode', value: data[0].value }));

      const filteredCountryCode = await formatSelectInputWithThreeArgParenthesis(Countries.Countries, "CallingCode", "Name", "CallingCode")
      store.dispatch(loadSelectDetails({ name: 'PrimaryCountryCode', value: { Select: filteredCountryCode } }));
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (vendor.CountryId !== 0) {
      getFilteredStates()
    }
  }, [vendor.CountryId])

  const getFilteredStates = async () => {
    const { States } = await getFilteredStatesByCountry(vendor.CountryId.toString());
    const filteredStates = await formatSelectInput(States, "Name", "Id")
    store.dispatch(loadSelectDetails({ name: 'States', value: { Select: filteredStates } }));
  }

  useEffect(() => {
    if (vendor.StateId != 0) {
      getFilteredCities()
    }
  }, [vendor.StateId])

  const getFilteredCities = async () => {
    const { Cities } = await getFilteredCitiesByState(vendor.StateId.toString());
    const filteredCities = await formatSelectInput(Cities, "Name", "Id")
    store.dispatch(loadSelectDetails({ name: 'Cities', value: { Select: filteredCities } }));
  }

  const validationSchema = yup.object().shape({
    Name: yup.string().required('validation_error_vendor_edit_name_required'),
    Address: yup.string().required('validation_error_vendor_edit_address_required'),
    TenantOfficeId: yup.number().positive('validation_error_vendor_edit_tenantoffice_required'),
    CityId: yup.number().positive('validation_error_vendor_edit_city_required'),
    StateId: yup.number().positive('validation_error_vendor_edit_state_required'),
    CountryId: yup.number().positive('validation_error_vendor_edit_country_required'),
    Pincode: yup.string().required('validation_error_vendor_edit_pincode_required'),
    ContactName: yup.string().required('validation_error_vendor_edit_contactname_required'),
    Email: yup.string().required('validation_error_vendor_edit_email_required'),
    ContactNumberOneCountryCode: yup.string().required('validation_error_vendor_edit_primaryccode_required'),
    ContactNumberOne: yup.string().required('validation_error_vendor_edit_primarycname_required').matches(/\d{9}$/, 'validation_error_vendor_create_primarycname_match'),
    CreditPeriodInDays: yup.string().required('validation_error_vendor_edit_creditperiod_indays_required'),
    GstNumber: yup.string().when('GstVendorTypeCode', (GstVendorTypeCode, schema) =>
      vendor.GstVendorTypeCode === "GVT_RGST"
        ? createGstNumberValidation(
          'validation_error_vendor_edit_gstno_required',
          'validation_error_vendor_edit_gstnumber_checking_rule'
        )
        : schema.nullable()
    ),
    GstVendorTypeId: yup.number().positive('validation_error_vendor_edit_gstvendortype_required'),
    MsmeRegistrationNumber: yup.string().when('IsMsme', (IsMsme, schema) => { return vendor.IsMsme == true ? schema.required('Enter MSME Registration Number') : schema }),
    PanNumber: yup.string().required('validation_error_vendor_create_panno_required').matches(/^[A-Z]{3}[PHAFCT]{1}[A-Z]{1}[0-9]{4}[A-Z]{1}$/, t('validation_error_vendoredit_pannumber_checking_rule') ?? ''),
    PanTypeId: yup.number().positive('validation_error_vendor_create_pantypeid_required'),
    VendorTypeId: yup.number().required('validation_error_vendor_create_vendortype_required').positive('validation_error_vendor_create_vendortype_required'),
  });

  const onModalClose = () => {
    store.dispatch(initializeVendorEdit())
    onLoad()
    setInputValue('');
    setIsFocused(false);
    setPincodeList([]);
    setOption(0);
  }

  const onSubmit = async () => {
    store.dispatch(updateErrors({}));
    try {
      await validationSchema.validate(vendor, { abortEarly: false });
    } catch (error: any) {
      const errors = error.inner.reduce((allErrors: any, currentError: any) => {
        return { ...allErrors, [currentError.path as string]: currentError.message };
      }, {});
      store.dispatch(updateErrors(errors))
      if (errors)
        return;
    }
    store.dispatch(startPreloader());
    const result = await editVendor(store.getState().vendoredit.vendor);
    result.match({
      ok: () => {
        store.dispatch(toggleInformationModalStatus());
      },
      err: async (e) => {
        const formattedErrors = convertBackEndErrorsToValidationErrors(e)
        store.dispatch(updateErrors(formattedErrors))
      },
    });
    store.dispatch(stopPreloader())
  }

  const onUpdateField = (ev: any) => {
    var name = ev.target.name;
    var value = ev.target.value;
    var checked = ev.target.checked
    if (['IsMsme', 'IsActive'].includes(name)) {
      value = checked ? true : false;
    } store.dispatch(updateField({ name: name as keyof EditVendorState['vendor'], value }));
  }

  const onSelectChange = (selectedOption: any, actionMeta: any) => {
    var value = selectedOption.value
    var name = actionMeta.name
    if (name == "CountryId") {
      store.dispatch(updateField({ name: 'ContactNumberOneCountryCode', value: selectedOption.code }));
    } else if (name == 'GstVendorTypeId') {
      store.dispatch(updateField({ name: 'GstVendorTypeCode', value: selectedOption.code }));
      if (selectedOption.code == "GVT_URST") {
        store.dispatch(updateField({ name: 'GstNumber', value: "" }));
      }
      store.dispatch(updateField({ name: name as keyof EditVendorState['vendor'], value }));
    }
    store.dispatch(updateField({ name: name as keyof EditVendorState['vendor'], value }));
  }

  const InformationModal = () => {
    const { t, i18n } = useTranslation();
    return (
      <SweetAlert success title='Success' onConfirm={reDirectRoute}>
        {t('vendor_edit_success')}
      </SweetAlert>
    );
  }

  const reDirectRoute = async () => {
    store.dispatch(initializeVendorEdit())
    document.getElementById('closeEditVendorModal')?.click();
    const result = await getVendorList(store.getState().vendorlist.currentPage, store.getState().vendorlist.searchWith);
    store.dispatch(loadVendors(result));
    onLoad()
    setInputValue('');
    setIsFocused(false);
    setPincodeList([]);
    setOption(0);
  }

  return (
    <>
      {
        checkForPermission("VENDOR_CREATE")
        &&
        <div
          className="modal fade"
          id='EditVendor'
          data-bs-backdrop='static'
          data-bs-keyboard='false'
          aria-hidden='true'
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header mx-2">
                <h5 className="modal-title">{t('vendor_edit_modal')}</h5>
                <button
                  type='button'
                  className="btn-close"
                  data-bs-dismiss='modal'
                  id='closeEditVendorModal'
                  aria-label='Close'
                  onClick={onModalClose}
                  ref={modalRef}
                ></button>
              </div>
              <div className="modal-body">
                <ContainerPage>
                  <ValidationErrorComp errors={errors} />
                  <div className="col-md-12" >
                    <div className="mb-2 mt-1">
                      <div className="form-check form-switch ps-4 ms-3">
                        <input
                          className="form-check-input switch-input-lg ps-1"
                          type="checkbox"
                          name="IsActive"
                          id="ActiveSwitch"
                          checked={vendor.IsActive}
                          value={vendor.IsActive.toString()}
                          onChange={onUpdateField}
                        ></input>
                        <span className=''>{t('vendor_edit_isactive')}</span>
                      </div>
                    </div>
                    <div className="mb-1 mt-1">
                      <label className="red-asterisk">{t('vendor_edit_vendortype')}</label>
                      <Select
                        options={selectDetails.VendorType}
                        value={selectDetails.VendorType && selectDetails.VendorType.find(option => option.value == vendor.VendorTypeId) || null}
                        onChange={onSelectChange}
                        isSearchable
                        name="VendorTypeId"
                        placeholder={t('create_customer_site_select_state_id')}
                      />
                      <div className="small text-danger"> {t(errors['VendorTypeId'])}</div>
                    </div>
                    <div className="mb-1">
                      <label className="red-asterisk">{t('vendor_edit_teantlocation')}</label>
                      <Select
                        options={selectDetails.Location}
                        value={selectDetails.Location && selectDetails.Location.find(option => option.value == vendor.TenantOfficeId) || null}
                        isDisabled={true}
                      />
                      <div className="small text-danger"> {t(errors['TenantOfficeId'])}</div>
                    </div>
                    <div className="mb-1">
                      <label className="red-asterisk">{t('vendor_edit_name')}</label>
                      <input value={vendor.Name} type="text" disabled={true} className={`form-control  ${errors["Name"] ? "is-invalid" : ""}`} />
                      <div className="invalid-feedback"> {t(errors['Name'])}</div>
                    </div>
                    <div className="mb-1">
                      <label className="red-asterisk">{t('vendor_edit_address')}</label>
                      <textarea onChange={onUpdateField} name="Address" value={vendor.Address} className={`form-control  ${errors["Address"] ? "is-invalid" : ""}`} style={{ height: "100px", resize: "vertical" }}></textarea>
                      <div className="invalid-feedback "> {t(errors['Address'])}</div>
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
                        placeholder={t('vendor_edit_placeholder_select')}
                        noOptionsMessage={() => {
                          if (inputValue.length >= 3) {
                            if (isLoading) {
                              return t('vendor_edit_placeholder_pincode_loading');
                            } else if (pincodelist.length === 0) {
                              return t('vendor_edit_placeholder_invalid_pincode');
                            }
                          } else if (inputValue.length <= 2) {
                            return t('vendor_edit_placeholder_inital_select_msg');
                          }
                          return null;
                        }}
                      />
                      <div className="invalid-feedback"> {errors['Pincode']}</div>
                    </div>
                    <div className="mb-1 mt-1">
                      <label className="red-asterisk">{t('vendor_edit_country')}</label>
                      <Select
                        options={selectDetails.Countrys}
                        value={selectDetails.Countrys && selectDetails.Countrys.find(option => option.value == vendor.CountryId) || null}
                        onChange={onSelectChange}
                        isSearchable
                        name="CountryId"
                        placeholder={t('create_customer_site_select_state_id')}
                      />
                      <div className="small text-danger"> {t(errors['CountryId'])}</div>
                    </div>
                    <div className="mb-1 mt-1">
                      <label className="red-asterisk">{t('vendor_edit_state')}</label>
                      <Select
                        options={selectDetails.States}
                        value={selectDetails.States && selectDetails.States.find(option => option.value == vendor.StateId) || null}
                        onChange={onSelectChange}
                        isSearchable
                        name="StateId"
                        placeholder={t('create_customer_site_select_state_id')}
                      />
                      <div className="small text-danger"> {t(errors['StateId'])}</div>
                    </div>
                    <div className="mb-1 mt-1">
                      <label className="red-asterisk">{t('vendor_edit_city')}</label>
                      <Select
                        options={selectDetails.Cities}
                        value={selectDetails.Cities && selectDetails.Cities.find(option => option.value == vendor.CityId) || null}
                        onChange={onSelectChange}
                        isSearchable
                        name="CityId"
                        placeholder={t('create_customer_site_select_city_id')}
                      />
                      <div className="small text-danger"> {t(errors['CityId'])}</div>
                    </div>
                    <div className="mb-1">
                      <label className="red-asterisk">{t('vendor_edit_contactname')}</label>
                      <input onChange={onUpdateField} name="ContactName" value={vendor.ContactName} type="text" className={`form-control  ${errors["ContactName"] ? "is-invalid" : ""}`} />
                      <div className="invalid-feedback"> {t(errors['ContactName'])}</div>
                    </div>
                    <div className="mb-1">
                      <label className="red-asterisk">{t('vendor_edit_email')}</label>
                      <input onChange={onUpdateField} name="Email" value={vendor.Email} className={`form-control  ${errors["Email"] ? "is-invalid" : ""}`} ></input>
                      <div className="invalid-feedback"> {t(errors['Email'])}</div>
                    </div>
                    <div className="row">
                      <div className="mb-1 col-md-6">
                        <label className="red-asterisk">{t('vendor_create_primaryno_code')}</label>
                        <Select
                          options={selectDetails.PrimaryCountryCode}
                          value={selectDetails.PrimaryCountryCode && selectDetails.PrimaryCountryCode.find(option => option.value == vendor.ContactNumberOneCountryCode) || null}
                          onChange={onSelectChange}
                          isSearchable
                          name="ContactNumberOneCountryCode"
                          placeholder={t('create_customer_site_select_city_id')}
                        />
                        <div className="invalid-feedback"> {t(errors['ContactNumberOneCountryCode'])}</div>
                      </div>
                      <div className="mb-1 col-md-6">
                        <label className="red-asterisk">{t('vendor_edit_primaryno')}</label>
                        <input onChange={onUpdateField} name="ContactNumberOne" value={vendor.ContactNumberOne} className={`form-control  ${errors["ContactNumberOne"] ? "is-invalid" : ""}`} ></input>
                        <div className="invalid-feedback"> {t(errors['ContactNumberOne'])}</div>
                      </div>
                      <div className="mb-1 col-md-6">
                        <label >{t('vendor_edit_secondaryno_code')}</label>
                        <input onChange={onUpdateField} name="ContactNumberTwoCountryCode" value={vendor.ContactNumberTwoCountryCode} type="text" className={`form-control  ${errors["ContactNumberTwoCountryCode"] ? "is-invalid" : ""}`} />
                        <div className="invalid-feedback"> {errors['ContactNumberTwoCountryCode']}</div>
                      </div>
                      <div className="mb-1 col-md-6">
                        <label >{t('vendor_edit_secondno')}</label>
                        <input onChange={onUpdateField} name="ContactNumberTwo" value={vendor.ContactNumberTwo} className={`form-control  ${errors["ContactNumberTwo"] ? "is-invalid" : ""}`} ></input>
                        <div className="invalid-feedback"> {errors['ContactNumberTwo']}</div>
                      </div>
                    </div>
                    <div className="mb-1">
                      <label className="red-asterisk">{t('vendor_edit_creditperiodindays')}</label>
                      <input onChange={onUpdateField} name="CreditPeriodInDays" value={vendor.CreditPeriodInDays} type="text" className={`form-control  ${errors["CreditPeriodInDays"] ? "is-invalid" : ""}`} />
                      <div className="invalid-feedback"> {t(errors['CreditPeriodInDays'])}</div>
                    </div>
                    <div className="mb-1 mt-1">
                      <label className="red-asterisk">{t('vendor_edit_gstvendortype')}</label>
                      <Select
                        options={gstVendoTypes}
                        value={gstVendoTypes && gstVendoTypes.find(option => option.value == vendor.GstVendorTypeId) || null}
                        onChange={onSelectChange}
                        isSearchable
                        name="GstVendorTypeId"
                        placeholder={t('create_customer_site_select_city_id')}
                      />
                      <div className="small text-danger"> {t(errors['GstVendorTypeId'])}</div>
                    </div>
                    {vendor.GstVendorTypeCode == "GVT_RGST" &&
                      <div className="mb-1">
                        <label className="red-asterisk">{t('vendor_edit_gstno')}</label>
                        <input onChange={onUpdateField} name="GstNumber" value={vendor.GstNumber} className={`form-control  ${errors["GstNumber"] ? "is-invalid" : ""}`} ></input>
                        <div className="invalid-feedback"> {t(errors['GstNumber'])}</div>
                      </div>
                    }
                    <div className="row">
                      <div className="mb-1 col-md-6">
                        <label>{t('vendor_edit_tanno')}</label>
                        <input onChange={onUpdateField} name="TanNumber" value={vendor.TanNumber ? vendor.TanNumber : ""} className={`form-control  ${errors["TanNumber"] ? "is-invalid" : ""}`} ></input>
                        <div className="invalid-feedback"> {t(errors['TanNumber'])}</div>
                      </div>
                      <div className="mb-1 col-md-6">
                        <label>{t('vendor_edit_cinno')}</label>
                        <input onChange={onUpdateField} name="CinNumber" value={vendor.CinNumber ? vendor.CinNumber : ""} type="text" className={`form-control  ${errors["CinNumber"] ? "is-invalid" : ""}`} />
                        <div className="invalid-feedback"> {t(errors['CinNumber'])}</div>
                      </div>
                      <div className="mb-1 col-md-6">
                        <label>{t('vendor_edit_arnno')}</label>
                        <input onChange={onUpdateField} name="ArnNumber" value={vendor.ArnNumber ? vendor.ArnNumber : ""} type="text" className={`form-control  ${errors["ArnNumber"] ? "is-invalid" : ""}`} />
                        <div className="invalid-feedback"> {t(errors['ArnNumber'])}</div>
                      </div>
                      <div className="mb-1 col-md-6">
                        <label>{t('vendor_edit_esino')}</label>
                        <input onChange={onUpdateField} name="EsiNumber" value={vendor.EsiNumber ? vendor.EsiNumber : ""} className={`form-control  ${errors["EsiNumber"] ? "is-invalid" : ""}`} ></input>
                        <div className="invalid-feedback"> {t(errors['EsiNumber'])}</div>
                      </div>
                    </div>
                    <div className="row">

                      <div className="mb-1 col-md-6">
                        <label className="red-asterisk">{t('vendor_edit_panno')}</label>
                        <input onChange={onUpdateField} name="PanNumber" value={vendor.PanNumber ? vendor.PanNumber : ""} type="text" className={`form-control  ${errors["PanNumber"] ? "is-invalid" : ""}`} />
                        <div className="invalid-feedback"> {t(errors['PanNumber'])}</div>
                      </div>
                      <div className="mb-1 col-md-6">
                        <label className="red-asterisk">{t('vendor_edit_pantype')}</label>
                        <Select
                          options={selectDetails.PanType}
                          value={selectDetails.PanType && selectDetails.PanType.find(option => option.value == vendor.PanTypeId) || null}
                          onChange={onSelectChange}
                          isSearchable
                          name="PanTypeId"
                          placeholder={t('create_customer_site_select_city_id')}
                        />
                        <div className="small text-danger"> {t(errors['PanTypeId'])}</div>
                      </div>
                    </div>
                    <div className="mb-2 mt-1">
                      <div className="form-check form-switch ps-4 ms-3">
                        <input
                          className="form-check-input switch-input-lg ps-1"
                          type="checkbox"
                          name="IsMsme"
                          id="flexSwitchCheckDefault"
                          checked={vendor.IsMsme}
                          value={vendor.IsMsme.toString()}
                          onChange={onUpdateField}
                        ></input>
                        <span className=''>{t('vendor_edit_ismsme')}</span>
                      </div>
                    </div>
                    <div className='mt-1'>
                      {vendor.IsMsme == true && (
                        <>
                          <div className="mb-1 mt-1">
                            <label className="red-asterisk">{t('vendor_edit_msmeregistrationnumber')}</label>
                            <input onChange={onUpdateField} name="MsmeRegistrationNumber" value={vendor.MsmeRegistrationNumber ? vendor.MsmeRegistrationNumber : ""} type="text" className={`form-control  ${errors["MsmeRegistrationNumber"] ? "is-invalid" : ""}`} />
                            <div className="invalid-feedback"> {errors['MsmeRegistrationNumber']}</div>
                          </div>
                          <div className="row">
                            <div className="mb-1 col-md-6">
                              <label>{t('vendor_edit_msmecomencementdate')}</label>
                              <input onChange={onUpdateField} name="MsmeCommencementDate" type="date" value={typeof vendor.MsmeCommencementDate === 'string' ? vendor.MsmeCommencementDate.split('T')[0] : undefined} className={`form-control  ${errors["MsmeCommencementDate"] ? "is-invalid" : ""}`}></input>
                              <div className="invalid-feedback"> {errors['MsmeCommencementDate']}</div>
                            </div>
                            <div className="col-md-6">
                              <label>{t('vendor_edit_msmeexpdate')}</label>
                              <input onChange={onUpdateField} name="MsmeExpiryDate" type="date" value={typeof vendor.MsmeExpiryDate === 'string' ? vendor.MsmeExpiryDate.split('T')[0] : undefined} className={`form-control  ${errors["MsmeExpiryDate"] ? "is-invalid" : ""}`} />
                              <div className="invalid-feedback"> {errors['MsmeExpiryDate']}</div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                    <button type="button" onClick={onSubmit} className="btn  app-primary-bg-color text-white mt-2 float-end">{t('vendor_edit_button')}</button><div>
                      <br></br></div>
                    {displayInformationModal ? <InformationModal /> : ''}
                  </div>
                </ContainerPage>
              </div>
            </div>
          </div >
        </div >
      }
    </>
  );
}