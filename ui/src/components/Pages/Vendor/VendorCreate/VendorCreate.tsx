import { useStoreWithInitializer } from '../../../../state/storeHooks';
import SweetAlert from 'react-bootstrap-sweetalert';
import { ContainerPage } from '../../../ContainerPage/ContainerPage';
import { useTranslation } from 'react-i18next';
import { dispatchOnCall, store } from '../../../../state/store';
import { useEffect, useRef, useState } from 'react';
import {
  initializeVendorCreate, updateField, updateErrors, toggleInformationModalStatus, CreateVendorState, loadSelectDetails,
  loadPostalCodeList,
  clearPostalCodeList
} from './VendorCreate.slice'
import { startPreloader, stopPreloader } from '../../../Preloader/Preloader.slice';
import * as yup from 'yup';
import { getFilteredCitiesByState } from '../../../../services/city';
import { convertBackEndErrorsToValidationErrors, formatSelectInput, formatSelectInputWithCode, formatSelectInputWithThreeArgParenthesis } from '../../../../helpers/formats';
import Select from 'react-select';
import { getFilteredStatesByCountry } from '../../../../services/state';
import { createVendor, getVendorList } from '../../../../services/vendor';
import { ValidationErrorComp } from '../../../ValidationErrors/ValidationError';
import { checkForPermission } from '../../../../helpers/permissions';
import { getValuesInMasterDataByTable } from '../../../../services/masterData';
import { loadVendors } from '../VendorList/VendorList.slice';
import { getCountries } from '../../../../services/country';
import { getUserTenantOfficeName } from '../../../../services/users';
import { getPostalCodeList } from '../../../../services/postalcode';
import { createGstNumberValidation } from '../../../../helpers/validationformats';

export const VendorCreate = () => {
  const modalRef = useRef<HTMLButtonElement>(null);
  const { t } = useTranslation();
  const [gstVendoTypes, setGstVendorTypes] = useState<any>(null)
  const [pincodelist, setPincodeList] = useState<any>([])
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [selectOption, setOption] = useState(0)

  const { vendor, displayInformationModal, errors, selectDetails, pincodecheck, postalcodelist } = useStoreWithInitializer(({ vendorcreate }) => vendorcreate,
    dispatchOnCall(initializeVendorCreate()))

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

      const TenantLocations = await getUserTenantOfficeName();
      const TenantLocation = await formatSelectInput(TenantLocations.TenantOfficeName, 'OfficeName', 'Id');
      store.dispatch(loadSelectDetails({ name: 'Location', value: { Select: TenantLocation } }));

      var { MasterData } = await getValuesInMasterDataByTable('PanType');
      const filteredPanType = await formatSelectInput(MasterData, 'Name', 'Id');
      store.dispatch(loadSelectDetails({ name: 'PanType', value: { Select: filteredPanType } }));

      var { MasterData } = await getValuesInMasterDataByTable('GSTVendorType');
      const gstVendorTypeList = await formatSelectInputWithCode(MasterData, 'Name', 'Id', 'Code')
      setGstVendorTypes(gstVendorTypeList);
      const filteredGstVendorTypeType = await formatSelectInput(MasterData, 'Name', 'Id');
      store.dispatch(loadSelectDetails({ name: 'GstVendorType', value: { Select: filteredGstVendorTypeType } }));
      const GstVendorTypeData = MasterData.filter(item => item.Code == "GVT_RGST")[0];
      store.dispatch(updateField({ name: 'GstVendorTypeCode', value: GstVendorTypeData.Code }));
      store.dispatch(updateField({ name: 'GstVendorTypeId', value: GstVendorTypeData.Id }));

      const Countries = await getCountries();
      const filteredCountries = await formatSelectInputWithCode(Countries.Countries, "Name", "Id", "CallingCode")
      store.dispatch(loadSelectDetails({ name: 'Countrys', value: { Select: filteredCountries } }));

      const data = filteredCountries.filter(item => item.value == store.getState().vendorbranchcreate.vendorBranch.CountryId)
      store.dispatch(updateField({ name: 'ContactNumberOneCountryCode', value: data[0].code }));

      const filteredCountryCode = await formatSelectInputWithThreeArgParenthesis(Countries.Countries, "CallingCode", "Name", "CallingCode")
      store.dispatch(loadSelectDetails({ name: 'PrimaryCountryCode', value: { Select: filteredCountryCode } }));
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (vendor.CountryId !== null) {
      getFilteredStates()
    }
  }, [vendor.CountryId])

  const getFilteredStates = async () => {
    if (vendor.CountryId !== null) {
      const { States } = await getFilteredStatesByCountry(vendor.CountryId.toString());
      const filteredStates = await formatSelectInput(States, "Name", "Id")
      store.dispatch(loadSelectDetails({ name: 'States', value: { Select: filteredStates } }));
    }
  }

  useEffect(() => {
    if (vendor.StateId != null) {
      getFilteredCities()
    }
  }, [vendor.StateId])

  const getFilteredCities = async () => {
    if (vendor.StateId != null) {
      const { Cities } = await getFilteredCitiesByState(vendor.StateId.toString());
      const filteredCities = await formatSelectInput(Cities, "Name", "Id")
      store.dispatch(loadSelectDetails({ name: 'Cities', value: { Select: filteredCities } }));
    }
  }

  const validationSchema = yup.object().shape({
    Name: yup.string().required('validation_error_vendor_create_name_required'),
    Address: yup.string().required('validation_error_vendor_create_address_required'),
    TenantOfficeId: yup.number().positive('validation_error_vendor_create_tenantoffice_required'),
    CityId: yup.number().positive('validation_error_vendor_create_city_required'),
    StateId: yup.number().positive('validation_error_vendor_create_state_required'),
    CountryId: yup.number().positive('validation_error_vendor_create_country_required'),
    Pincode: yup.string().required('validation_error_vendor_create_pincode_required'),
    ContactName: yup.string().required('validation_error_vendor_create_contactname_required'),
    Email: yup.string().required('validation_error_vendor_create_email_required'),
    MsmeRegistrationNumber: yup.string().when('IsMsme', (IsMsme, schema) => { return vendor.IsMsme == true ? schema.required('Enter MSME Registration Number') : schema }),
    ContactNumberOneCountryCode: yup.string().required('validation_error_vendor_create_primaryccode_required'),
    ContactNumberOne: yup.string().required('validation_error_vendor_create_primarycname_required').matches(/\d{9}$/, 'validation_error_vendor_create_primarycname_match'),
    CreditPeriodInDays: yup.string().required('validation_error_vendor_create_creditperiod_indays_required'),
    GstNumber: yup.string().when('GstVendorTypeCode', (GstVendorTypeCode, schema) =>
      vendor.GstVendorTypeCode === "GVT_RGST"
        ? createGstNumberValidation(
          'validation_error_vendor_create_gstno_required',
          'validation_error_vendorcreate_gstnumber_checking_rule'
        )
        : schema.nullable()
    ),
    PanNumber: yup.string().required('validation_error_vendor_create_panno_required').matches(/^[A-Z]{3}[PHAFCT]{1}[A-Z]{1}[0-9]{4}[A-Z]{1}$/, t('validation_error_vendorcreate_pannumber_checking_rule') ?? ''),
    GstVendorTypeId: yup.number().positive('validation_error_vendor_create_gstvendortype_required'),
    PanTypeId: yup.number().positive('validation_error_vendor_create_pantypeid_required'),
    VendorTypeId: yup.number().positive('validation_error_vendor_create_vendortype_required'),
  });

  const onModalClose = () => {
    store.dispatch(initializeVendorCreate())
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
    const result = await createVendor(store.getState().vendorcreate.vendor);
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
    if (name == 'IsMsme') {
      value = checked ? true : false;
    }
    store.dispatch(updateField({ name: name as keyof CreateVendorState['vendor'], value }));
  }

  const onSelectChange = (selectedOption: any, actionMeta: any) => {
    var value = selectedOption.value
    var name = actionMeta.name
    if (name == "CountryId") {
      store.dispatch(updateField({ name: 'ContactNumberOneCountryCode', value: selectedOption.code }));
    }
    else if (name == 'GstVendorTypeId') {
      store.dispatch(updateField({ name: 'GstVendorTypeCode', value: selectedOption.code }));
      store.dispatch(updateField({ name: name as keyof CreateVendorState['vendor'], value }));
    }
    store.dispatch(updateField({ name: name as keyof CreateVendorState['vendor'], value }));
  }

  const InformationModal = () => {
    const { t } = useTranslation();
    return (
      <SweetAlert success title='Success' onConfirm={reDirectRoute}>
        {t('vendor_create_success')}
      </SweetAlert>
    );
  }
  const reDirectRoute = async () => {
    store.dispatch(initializeVendorCreate())
    document.getElementById('closeCreateVendorModal')?.click();
    const result = await getVendorList(store.getState().vendorlist.currentPage, store.getState().vendorlist.searchWith);
    store.dispatch(loadVendors(result));
    onLoad()
    setInputValue('');
    setIsFocused(false);
    setPincodeList([]);
    setOption(0);
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
  };

  const selectedOption = pincodelist.find(option => option.value === selectOption) || null;

  return (
    <>
      {checkForPermission("VENDOR_CREATE") &&
        <div
          className="modal fade"
          id='CreateVendor'
          data-bs-backdrop='static'
          data-bs-keyboard='false'
          aria-hidden='true'
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header mx-2">
                <h5 className="modal-title">{t('vendor_create_modal')}</h5>
                <button
                  type='button'
                  className="btn-close"
                  data-bs-dismiss='modal'
                  id='closeCreateVendorModal'
                  aria-label='Close'
                  onClick={onModalClose}
                  ref={modalRef}
                ></button>
              </div>
              <div className="modal-body">
                <ContainerPage>
                  <ValidationErrorComp errors={errors} />
                  <div className="col-md-12" >
                    <div className="mb-1">
                      <label className="red-asterisk">{t('vendor_create_vendortype')}</label>
                      <Select
                        options={selectDetails.VendorType}
                        value={selectDetails.VendorType && selectDetails.VendorType.find(option => option.value == vendor.VendorTypeId) || null}
                        onChange={onSelectChange}
                        isSearchable
                        name="VendorTypeId"
                        placeholder={t('vendor_create_placeholder_vendortype')}
                      />
                      <div className="small text-danger"> {t(errors['VendorTypeId'])}</div>
                    </div>
                    <div className="mb-1">
                      <label className="red-asterisk">{t('vendor_create_teantlocation')}</label>
                      <Select
                        options={selectDetails.Location}
                        value={selectDetails.Location && selectDetails.Location.find(option => option.value == vendor.TenantOfficeId) || null}
                        onChange={onSelectChange}
                        isSearchable
                        name="TenantOfficeId"
                        placeholder="Select Accel Location"
                      />
                      <div className="small text-danger"> {t(errors['TenantOfficeId'])}</div>
                    </div>
                    <div className="mb-1">
                      <label className="red-asterisk">{t('vendor_create_name')}</label>
                      <input onChange={onUpdateField} name="Name" value={vendor.Name} type="text" className={`form-control  ${errors["Name"] ? "is-invalid" : ""}`} />
                      <div className="invalid-feedback"> {t(errors['Name'])}</div>
                    </div>
                    <div className="col-md-12">
                      <label className="mt-2 red-asterisk">{t('vendor_create_pincode')}</label>
                      <Select
                        options={pincodelist && pincodelist.length > 0 ? pincodelist : []}
                        inputValue={isFocused || vendor.Pincode == "" ? inputValue : ''}
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
                        placeholder={t('vendor_create_placeholder_select')}
                        noOptionsMessage={() => {
                          if (inputValue.length == 3 && pincodelist.length == 0) {
                            return t('vendor_create_placeholder_pincode_loading');
                          } else if (inputValue.length < 3) {
                            return t('vendor_create_placeholder_inital_select_msg');
                          } else {
                            return t('vendor_create_placeholder_invalid_pincode');
                          }
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
                      <label className="red-asterisk">{t('vendor_create_state')}</label>
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
                      <label className="red-asterisk">{t('vendor_create_city')}</label>
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
                      <label className="red-asterisk">{t('vendor_create_address')}</label>
                      <textarea rows={4} onChange={onUpdateField} name="Address" value={vendor.Address} className={`form-control  ${errors["Address"] ? "is-invalid" : ""}`} ></textarea>
                      <div className="invalid-feedback "> {t(errors['Address'])}</div>
                    </div>
                    <div className="mb-1">
                      <label className="red-asterisk">{t('vendor_create_contactname')}</label>
                      <input onChange={onUpdateField} name="ContactName" value={vendor.ContactName} type="text" className={`form-control  ${errors["ContactName"] ? "is-invalid" : ""}`} />
                      <div className="invalid-feedback"> {t(errors['ContactName'])}</div>
                    </div>
                    <div className="mb-1">
                      <label className="red-asterisk">{t('vendor_create_email')}</label>
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
                        <label className="red-asterisk">{t('vendor_create_primaryno')}</label>
                        <input onChange={onUpdateField} name="ContactNumberOne" value={vendor.ContactNumberOne} className={`form-control  ${errors["ContactNumberOne"] ? "is-invalid" : ""}`} ></input>
                        <div className="invalid-feedback"> {t(errors['ContactNumberOne'])}</div>
                      </div>
                      <div className="mb-1 col-md-6">
                        <label >{t('vendor_create_secondaryno_code')}</label>
                        <input onChange={onUpdateField} name="ContactNumberTwoCountryCode" value={vendor.ContactNumberTwoCountryCode} type="text" className={`form-control  ${errors["ContactNumberTwoCountryCode"] ? "is-invalid" : ""}`} />
                        <div className="invalid-feedback"> {errors['ContactNumberTwoCountryCode']}</div>
                      </div>
                      <div className="mb-1 col-md-6">
                        <label >{t('vendor_create_secondno')}</label>
                        <input onChange={onUpdateField} name="ContactNumberTwo" value={vendor.ContactNumberTwo} className={`form-control  ${errors["ContactNumberTwo"] ? "is-invalid" : ""}`} ></input>
                        <div className="invalid-feedback"> {errors['ContactNumberTwo']}</div>
                      </div>
                    </div>
                    <div className="mb-1">
                      <label className="red-asterisk">{t('vendor_create_creditperiodindays')}</label>
                      <input onChange={onUpdateField} name="CreditPeriodInDays" value={vendor.CreditPeriodInDays} type="text" className={`form-control  ${errors["CreditPeriodInDays"] ? "is-invalid" : ""}`} />
                      <div className="invalid-feedback"> {t(errors['CreditPeriodInDays'])}</div>
                    </div>
                    <div className="mb-1 mt-1">
                      <label className="red-asterisk">{t('vendor_create_gstvendortype')}</label>
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
                        <label className="red-asterisk">{t('vendor_create_gstno')}</label>
                        <input onChange={onUpdateField} name="GstNumber" value={vendor.GstNumber} className={`form-control  ${errors["GstNumber"] ? "is-invalid" : ""}`} ></input>
                        <div className="invalid-feedback"> {t(errors['GstNumber'])}</div>
                      </div>
                    }
                    <div className="row">
                      <div className="mb-1 col-md-6">
                        <label>{t('vendor_create_tanno')}</label>
                        <input onChange={onUpdateField} name="TanNumber" value={vendor.TanNumber} className={`form-control  ${errors["TanNumber"] ? "is-invalid" : ""}`} ></input>
                        <div className="invalid-feedback"> {t(errors['TanNumber'])}</div>
                      </div>
                      <div className="mb-1 col-md-6">
                        <label>{t('vendor_create_cinno')}</label>
                        <input onChange={onUpdateField} name="CinNumber" value={vendor.CinNumber} type="text" className={`form-control  ${errors["CinNumber"] ? "is-invalid" : ""}`} />
                        <div className="invalid-feedback"> {t(errors['CinNumber'])}</div>
                      </div>
                      <div className="mb-1 col-md-6">
                        <label>{t('vendor_create_arnno')}</label>
                        <input onChange={onUpdateField} name="ArnNumber" value={vendor.ArnNumber} type="text" className={`form-control  ${errors["ArnNumber"] ? "is-invalid" : ""}`} />
                        <div className="invalid-feedback"> {t(errors['ArnNumber'])}</div>
                      </div>
                      <div className="mb-1 col-md-6">
                        <label>{t('vendor_create_esino')}</label>
                        <input onChange={onUpdateField} name="EsiNumber" value={vendor.EsiNumber} className={`form-control  ${errors["EsiNumber"] ? "is-invalid" : ""}`} ></input>
                        <div className="invalid-feedback"> {t(errors['EsiNumber'])}</div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="mb-1 col-md-6">
                        <label className="red-asterisk">{t('vendor_create_panno')}</label>
                        <input onChange={onUpdateField} name="PanNumber" value={vendor.PanNumber} type="text" className={`form-control  ${errors["PanNumber"] ? "is-invalid" : ""}`} />
                        <div className="invalid-feedback"> {t(errors['PanNumber'])}</div>
                      </div>
                      <div className="mb-1 col-md-6">
                        <label className="red-asterisk">{t('vendor_create_pantype')}</label>
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
                        <span className=''>{t('vendor_create_label_is_msme')}</span>
                      </div>
                    </div>
                    <div className='mt-1'>
                      {vendor.IsMsme == true && (
                        <>
                          <div className="mb-1 mt-1">
                            <label className="red-asterisk">{t('vendor_create_msmeregistrationnumber')}</label>
                            <input onChange={onUpdateField} name="MsmeRegistrationNumber" value={vendor.MsmeRegistrationNumber} type="text" className={`form-control  ${errors["MsmeRegistrationNumber"] ? "is-invalid" : ""}`} />
                            <div className="invalid-feedback"> {errors['MsmeRegistrationNumber']}</div>
                          </div>
                          <div className="row">
                            <div className="mb-1 col-md-6">
                              <label>{t('vendor_create_msmecomencementdate')}</label>
                              <input onChange={onUpdateField} name="MsmeCommencementDate" type="date" value={vendor.MsmeCommencementDate!} className={`form-control  ${errors["MsmeCommencementDate"] ? "is-invalid" : ""}`}></input>
                              <div className="invalid-feedback"> {errors['MsmeCommencementDate']}</div>
                            </div>
                            <div className="col-md-6">
                              <label>{t('vendor_create_msmeexpdate')}</label>
                              <input onChange={onUpdateField} name="MsmeExpiryDate" type="date" value={vendor.MsmeExpiryDate!} className={`form-control  ${errors["MsmeExpiryDate"] ? "is-invalid" : ""}`} />
                              <div className="invalid-feedback"> {errors['MsmeExpiryDate']}</div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                    <button type="button" onClick={onSubmit} className="btn  app-primary-bg-color text-white mt-2 float-end">{t('vendor_create_create_button')}</button><div>
                      <br></br></div>
                    {displayInformationModal ? <InformationModal /> : ''}
                  </div>
                </ContainerPage>
              </div>
            </div>
          </div>
        </div>
      }
    </>
  );
}