import SweetAlert from 'react-bootstrap-sweetalert';
import { CreateCustomerSiteState, startSubmitting, stopSubmitting, toggleInformationModalStatus, updateError, updateField, initializeCreateCustomerSite, loadStates, loadCities, loadOfficeLocations, loadPostalCodeList, clearPostalCodeList } from './CreateSite.slice';
import { useTranslation } from 'react-i18next';
import { useStoreWithInitializer } from '../../../../state/storeHooks';
import { store } from '../../../../state/store';
import { CustomerSiteCreate } from '../../../../types/customer';
import { startPreloader, stopPreloader } from '../../../Preloader/Preloader.slice';
import { createCustomerSite } from '../../../../services/customer';
import { useEffect, useState } from 'react';
import { getFilteredStatesByCountry } from '../../../../services/state';
import { cityFormatSelectInput, convertBackEndErrorsToValidationErrors, formatSelectInput } from '../../../../helpers/formats';
import { getFilteredCitiesByState } from '../../../../services/city';
import Select from 'react-select';
import * as yup from 'yup';
import { checkForPermission } from '../../../../helpers/permissions';
import { ValidationErrorComp } from '../../../ValidationErrors/ValidationError';
import { getPostalCodeList } from '../../../../services/postalcode';
import { getTenantOfficeInfo } from '../../../../services/tenantOfficeInfo';

export function CreateCustomerSite() {
  const { t, i18n } = useTranslation();
  const [pincodelist, setPincodeList] = useState<any>([])
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [selectOption, setOption] = useState(0)
  const { customerSite, displayInformationModal, cities, states, location, errors, postalcodelist } = useStoreWithInitializer(({ customersitecreate, }) => customersitecreate, initializeCreateCustomerSite);
  const CustomerId = store.getState().customerprofile.singlecustomer.CustomerId;
  const [selectTenantLocationNameList, setTenantLocationNameList] = useState<any>(null)

  useEffect(() => {
    setTenantLocationNameList(location)
  }, [location])

  useEffect(() => {
    store.dispatch(updateField({ name: "CustomerId", value: CustomerId }))
  }, [CustomerId]);

  useEffect(() => {
    getFilteredStates()
  }, [])

  const getFilteredStates = async () => {
    const States = await getFilteredStatesByCountry("1");
    const FilteredStates = await formatSelectInput(States.States, "Name", "Id")
    store.dispatch(loadStates({ States: FilteredStates }))
  }

  async function GetMasterDataItems(Id?: number) {
    try {
      const TenantLocations = await getTenantOfficeInfo(Id)
      const TenantLocation = await formatSelectInput(TenantLocations.TenantOfficeInfo, 'OfficeName', 'Id');
      store.dispatch(loadOfficeLocations({ Select: TenantLocation }));
      store.dispatch(updateField({ name: "TenantOfficeId", value: Id }))
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (customerSite.StateId != null) {
      getFilteredCities()
    }
  }, [customerSite.StateId])

  const getFilteredCities = async () => {
    if (customerSite.StateId != null) {
      const Cities = await getFilteredCitiesByState(customerSite.StateId.toString());
      const FilteredCities = await cityFormatSelectInput(Cities.Cities, "Name", "Id", "TenantOfficeId")
      store.dispatch(loadCities(FilteredCities))
    }
  }

  useEffect(() => {
    if (customerSite.CityId != null) {
      const TenantOffice = cities.filter(item => item.value == customerSite.CityId)[0]
      if (TenantOffice.TenantOfficeId)
        GetMasterDataItems(TenantOffice.TenantOfficeId)
    }
  }, [cities])

  const onSelectChange = (selectedOption: any, Name: any) => {
    var value = selectedOption.value
    var name = Name
    store.dispatch(updateField({ name: name as keyof CreateCustomerSiteState['customerSite'], value }));
  }
  const validationSchema = yup.object().shape({
    SiteName: yup.string().required('validation_error_createsite_sitename_required'),
    Address: yup.string().required('validation_error_createsite_address_required'),
    StateId: yup.string().required('validation_error_createsite_stateid_required'),
    CityId: yup.string().required('validation_error_createsite_cityid_required'),
    Pincode: yup.number().typeError('validation_error_createsite_pincode_required').max(~(1 << 31), ('validation_error_createsite_pincode_exceed')),
    TenantOfficeId: yup.number().moreThan(0, ('validation_error_createsite_tenantofficeid_required')),
    PrimaryContactName: yup.string().required('validation_error_createsite_contactname_required'),
    PrimaryContactPhone: yup.string().required('validation_error_createsite_contactphone_required'),
  });

  function onSubmit(customerSite: CustomerSiteCreate) {
    return async (ev: React.FormEvent) => {
      ev.preventDefault();
      try {
        await validationSchema.validate(customerSite, { abortEarly: false });
      } catch (error: any) {
        const errors = error.inner.reduce((allErrors: any, currentError: any) => {
          return { ...allErrors, [currentError.path as string]: currentError.message };
        }, {});
        store.dispatch(updateError(errors));
        if (errors)
          return;
      }
      store.dispatch(startPreloader());
      store.dispatch(startSubmitting());
      const result = await createCustomerSite(customerSite)
      store.dispatch(stopSubmitting());
      result.match({
        ok: () => {
          store.dispatch(toggleInformationModalStatus());
        },
        err: (e) => {
          const errorMessages = convertBackEndErrorsToValidationErrors(e)
          store.dispatch(updateError(errorMessages));
        },
      });
      store.dispatch(stopPreloader());
    };
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
    store.dispatch(updateField({ name: 'CityId', value: postalcodeobj.CityId }));
    store.dispatch(updateField({ name: 'StateId', value: postalcodeobj.StateId }));
    store.dispatch(updateField({ name: 'Pincode', value: postalcodeobj.Pincode }));
  };

  const selectedOption = pincodelist.find(option => option.value === selectOption) || null;
  return (
    <div className="container-fluid">
      <ValidationErrorComp errors={errors} />
      <div className="col-md-12">
        {/* Create customer Site form */}
        {checkForPermission("CUSTOMERS_CUSTOMER_SITE_CREATE") && <>
          <div className="mb-1 mt-1">
            <label className="form-label mb-0 red-asterisk">{t('create_customer_site_label_site_name')}</label>
            <input name='SiteName' onChange={onUpdateField} className="form-control"></input>
            <div className="small text-danger"> {t(errors['SiteName'])}</div>
          </div>
          <div className="mb-1 mt-1">
            <label className="form-label  mb-0 red-asterisk">{t('create_customer_site_label_address')}</label>
            <input name='Address' onChange={onUpdateField} className="form-control"></input>
            <div className="small text-danger"> {t(errors['Address'])}</div>
          </div>
          <div className="col-md-12">
            <label className="mt-2 red-asterisk">{t('create_customer_site_label_pincode')}</label>
            <Select
              options={pincodelist && pincodelist.length > 0 ? pincodelist : []}
              inputValue={isFocused || customerSite.Pincode == "" ? inputValue : ''}
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
              placeholder={t('site_create_placeholder_select')}
              noOptionsMessage={() => {
                if (inputValue.length == 3 && pincodelist.length == 0) {
                  return t('site_create_placeholder_pincode_loading');
                } else if (inputValue.length < 3) {
                  return t('site_create_placeholder_inital_select_msg');
                } else {
                  return t('site_create_placeholder_invalid_pincode');
                }
              }}
            />
            <div className="invalid-feedback"> {errors['Pincode']}</div>
          </div>
          <div className="mb-1 mt-1">
            <label className="form-label  mb-0 red-asterisk">{t('create_customer_state_label_state_id')}</label>
            <Select
              options={states}
              value={states && states.find(option => option.value == customerSite.StateId) || null}
              onChange={(selectedOption) => onSelectChange(selectedOption, "StateId")}
              isSearchable
              name="StateId"
              placeholder={t('create_customer_site_select_state_id')}
            />
            <div className="small text-danger"> {t(errors['StateId'])}</div>
          </div>
          <div className="mb-1 mt-1">
            <label className="form-label  mb-0 red-asterisk">{t('create_customer_site_label_city_id')}</label>
            <Select
              options={cities}
              onChange={(selectedOption) => onSelectChange(selectedOption, "CityId")}
              isSearchable
              value={cities && cities.find(option => option.value == customerSite.CityId) || null}
              name="CityId"
              placeholder={t('create_customer_site_select_city_id')}
            />
            <div className="small text-danger"> {t(errors['CityId'])}</div>
          </div>
          <div className="mb-1 mt-1">
            <label className="form-label  mb-0 red-asterisk">{t('create_customer_site_label_tenant_info')}</label>
            <Select
              options={location}
              value={location && location.find(option => option.value == customerSite.TenantOfficeId) || null}
              isSearchable
              isDisabled
              name="TenantOfficeId"
              placeholder="Select Option"
            />
            <div className="small text-danger"> {t(errors['TenantOfficeId'])}</div>
          </div>
          <div className="mb-1 mt-1">
            <label className="form-label  mb-0">{t('create_customer_site_label_geo_location')}</label>
            <input name='GeoLocation' onChange={onUpdateField} className="form-control"></input>
          </div>
          <div className="mb-1 mt-1">
            <label className="form-label  mb-0 red-asterisk">{t('create_customer_site_label_contact_name')}</label>
            <input name='PrimaryContactName' onChange={onUpdateField} className="form-control"></input>
            <div className="small text-danger"> {t(errors['PrimaryContactName'])}</div>
          </div>
          <div className="mb-1 mt-1">
            <label className="form-label  mb-0 red-asterisk">{t('create_customer_site_label_contact_phone')}</label>
            <input name='PrimaryContactPhone' onChange={onUpdateField} className="form-control"></input>
            <div className="small text-danger"> {t(errors['PrimaryContactPhone'])}</div>
          </div>
          <div className="mb-1 mt-1">
            <label className="form-label  mb-0">{t('create_customer_site_label_contact_email')}</label>
            <input name='PrimaryContactEmail' onChange={onUpdateField} className="form-control"></input>
          </div>
          <div className="mb-1 mt-1">
            <label className="form-label mb-0">{t('create_customer_site_label_secondary_contact_name')}</label>
            <input name='SecondaryContactName' onChange={onUpdateField} className="form-control"></input>
            <div className="small text-danger"> {t(errors['SecondaryContactName'])}</div>
          </div>
          <div className="mb-1 mt-1">
            <label className="form-label mb-0">{t('create_customer_site_label_secondary_contact_phone')}</label>
            <input name='SecondaryContactPhone' onChange={onUpdateField} className="form-control"></input>
            <div className="small text-danger"> {t(errors['SecondaryContactPhone'])}</div>
          </div>
          <div className="mb-1 mt-1">
            <label className="form-label mb-0">{t('create_customer_site_label_secondary_contact_email')}</label>
            <input name='SecondaryContactEmail' onChange={onUpdateField} className="form-control"></input>
            <div className="small text-danger"> {t(errors['SecondaryContactEmail'])}</div>
          </div>
        </>}
        {checkForPermission("CUSTOMERS_CUSTOMER_SITE_CREATE") &&
          <button type='button' onClick={onSubmit(customerSite)} className="btn app-primary-bg-color text-white mt-2">
            {t('create_customer_site_create_button')}
          </button>
        }
        {/* Create customer Site form ends here */}

        {displayInformationModal ? <InformationModal /> : ''}
      </div>
    </div>
  );
}

function onUpdateField(event: any) {
  var name = event.target.name;
  var value = event.target.value;
  store.dispatch(updateField({ name: name as keyof CreateCustomerSiteState['customerSite'], value }));
}

function InformationModal() {
  const { t, i18n } = useTranslation();
  return (
    <SweetAlert success title='Success' onConfirm={reDirectRoute}>
      {t('create_customer_site_success')}
    </SweetAlert>
  );
}

function reDirectRoute() {
  store.dispatch(toggleInformationModalStatus());
  document.getElementById('closeCreateCustomerSiteModal')?.click();
  window.location.reload();
}