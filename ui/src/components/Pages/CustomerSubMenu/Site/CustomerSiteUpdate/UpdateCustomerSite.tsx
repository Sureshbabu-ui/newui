import SweetAlert from 'react-bootstrap-sweetalert';
import {
  UpdateCustomerSiteState,
  startSubmitting,
  stopSubmitting,
  toggleInformationModalStatus,
  updateError,
  updateField,
  initializeUpdateCustomerSite,
  loadStates,
  loadCities,
  loadTenantOffices
} from './UpdateCustomerSite.slice';
import { useTranslation } from 'react-i18next';
import { useStoreWithInitializer } from '../../../../../state/storeHooks';
import { store } from '../../../../../state/store';
import { startPreloader, stopPreloader } from '../../../../Preloader/Preloader.slice';
import { getCustomerSiteList, updateCustomerSite } from '../../../../../services/customer';
import { useEffect, useRef, useState } from 'react';
import { getFilteredStatesByCountry } from '../../../../../services/state';
import { convertBackEndErrorsToValidationErrors, formatSelectInput } from '../../../../../helpers/formats';
import { getFilteredCitiesByState } from '../../../../../services/city';
import Select from 'react-select';
import { getTenantOfficeInfo } from '../../../../../services/tenantOfficeInfo';
import * as yup from 'yup';
import { checkForPermission } from '../../../../../helpers/permissions';
import { ClickedCustomerSiteDetails } from '../../../../../types/customerSite';
import { loadCustomerSite } from '../SiteManagement.slice';
import { ValidationErrorComp } from '../../../../ValidationErrors/ValidationError';

export function UpdateCustomerSite() {
  const { t, i18n } = useTranslation();
  const modalRef = useRef<HTMLButtonElement>(null);
  const { customerSite, displayInformationModal, cities, states, tenantOffices, errors } = useStoreWithInitializer(
    ({ customersiteupdate, }) => customersiteupdate,
    initializeUpdateCustomerSite
  );
  const [formattedOfficeList, setFormattedOfficeList] = useState<any>([])

  useEffect(() => {
    GetMasterDataItems()
  }, []);

  useEffect(() => {
    getFilteredStates()
  }, [])

  const getFilteredStates = async () => {
    const States = await getFilteredStatesByCountry("1");
    const FilteredStates = await formatSelectInput(States.States, "Name", "Id")
    store.dispatch(loadStates({ States: FilteredStates }))
  }

  async function GetMasterDataItems() {
    try {
      const TenantOffices = await getTenantOfficeInfo();
      setFormattedOfficeList(formatSelectInput(TenantOffices.TenantOfficeInfo, "OfficeName", "Id"))
      store.dispatch(loadTenantOffices(TenantOffices));
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    if (customerSite.StateId != 0) {
      getFilteredCities()
    }
  }, [customerSite.StateId])

  const getFilteredCities = async () => {
    const Cities = await getFilteredCitiesByState(customerSite.StateId.toString());
    const FilteredCities = await formatSelectInput(Cities.Cities, "Name", "Id")
    store.dispatch(loadCities({ Cities: FilteredCities }))
  }

  const onSelectChange = (selectedOption: any, Name: any) => {
    var value = selectedOption.value
    var name = Name
    store.dispatch(updateField({ name: name as keyof UpdateCustomerSiteState['customerSite'], value }));
  }

  const onCloseModalForCreateCustomerSite = () => {
    store.dispatch(updateError({}))
  }

  const validationSchema = yup.object().shape({
    SiteName: yup.string().required('validation_error_updatesite_sitename_required'),
    Address: yup.string().required('validation_error_updatesite_address_required'),
    StateId: yup.string().required('validation_error_updatesite_stateid_required'),
    CityId: yup.string().required('validation_error_updatesite_cityid_required'),
    Pincode: yup.number().typeError('validation_error_updatesite_pincode_required').max(~(1 << 31), ('validation_error_updatesite_pincode_exceed')),
    TenantOfficeId: yup.number().moreThan(0, ('validation_error_updatesite_tenantofficeid_required')),
    PrimaryContactName: yup.string().required('validation_error_updatesite_contactname_required'),
    PrimaryContactPhone: yup.string().required('validation_error_updatesite_contactphone_required'),
  });

  const onSubmit = async (customerSite: ClickedCustomerSiteDetails) => {
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
    const result = await updateCustomerSite(customerSite)
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
  }

  function InformationModal() {
    const { t, i18n } = useTranslation();
    return (
      <SweetAlert success title='Success' onConfirm={reDirectRoute}>
        {t('update_customer_site_success')}
      </SweetAlert>
    );
  }
  const CustomerId = store.getState().customerprofile.singlecustomer.CustomerId

  async function reDirectRoute() {
    store.dispatch(toggleInformationModalStatus());
    document.getElementById('closeUpdateCustomerSiteModal')?.click();
    const result = await getCustomerSiteList(store.getState().customersitemanagement.search, store.getState().customersitemanagement.currentPage, Number(CustomerId));
    store.dispatch(loadCustomerSite(result));
    modalRef.current?.click()
  }

  return (
    <div
      className="modal fade"
      id='UpdateCustomerSite'
      data-bs-backdrop='static'
      data-bs-keyboard='false'
      aria-hidden='true'
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header mx-3">
            <h5 className="modal-title app-primary-color">{t('customer_site_management_update_new_customer_site')}</h5>
            <button
              type='button'
              className="btn-close"
              data-bs-dismiss='modal'
              id='closeUpdateCustomerSiteModal'
              aria-label='Close'
              ref={modalRef}
              onClick={onCloseModalForCreateCustomerSite}
            ></button>
          </div>
          <div className="modal-body">
            <div className="container-fluid col-md-12">
              <ValidationErrorComp errors={errors} />
              {checkForPermission("CUSTOMERS_CUSTOMER_SITE_CREATE") && <>
                <div className="mb-1 mt-1">
                  <label className="form-label mb-0 red-asterisk">{t('update_customer_site_label_site_name')}</label>
                  <input name='SiteName' value={customerSite.SiteName} onChange={onUpdateField} className="form-control"></input>
                  <div className="small text-danger"> {t(errors['SiteName'])}</div>
                </div>
                <div className="mb-1 mt-1">
                  <label className="form-label  mb-0 red-asterisk">{t('update_customer_site_label_address')}</label>
                  <input name='Address' value={customerSite.Address} onChange={onUpdateField} className="form-control"></input>
                  <div className="small text-danger"> {t(errors['Address'])}</div>

                </div>
                <div className="mb-1 mt-1">
                  <label className="form-label  mb-0 red-asterisk">{t('update_customer_state_label_state_id')}</label>
                  <Select
                    options={states}
                    value={states && states.find(option => option.value == customerSite.StateId) || null}
                    onChange={(selectedOption) => onSelectChange(selectedOption, "StateId")}
                    isSearchable
                    name="StateId"
                    placeholder={t('update_customer_site_select_state_id')}
                  />
                  <div className="small text-danger"> {t(errors['StateId'])}</div>
                </div>
                <div className="mb-1 mt-1">
                  <label className="form-label  mb-0 red-asterisk">{t('update_customer_site_label_city_id')}</label>
                  <Select
                    options={cities}
                    onChange={(selectedOption) => onSelectChange(selectedOption, "CityId")}
                    isSearchable
                    value={cities && cities.find(option => option.value == customerSite.CityId) || null}
                    name="CityId"
                    placeholder={t('update_customer_site_select_city_id')}
                  />
                  <div className="small text-danger"> {t(errors['CityId'])}</div>
                </div>
                <div className="mb-1 mt-1">
                  <label className="form-label  mb-0 red-asterisk">{t('update_customer_site_label_pincode')}</label>
                  <input name='Pincode' type='text' maxLength={6} value={customerSite.Pincode ?? ""} onChange={onUpdateField} className="form-control"></input>
                  <div className="small text-danger"> {t(errors['Pincode'])}</div>
                </div>
                <div className="mb-1 mt-1">
                  <label className="form-label  mb-0">{t('update_customer_site_label_geo_location')}</label>
                  <input name='GeoLocation' value={customerSite.GeoLocation ?? ""} onChange={onUpdateField} className="form-control"></input>
                </div>
                <div className="mb-1 mt-1">
                  <label className="form-label  mb-0 red-asterisk">{t('update_customer_site_label_tenant_info')}</label>
                  <Select
                    options={formattedOfficeList}
                    value={formattedOfficeList && formattedOfficeList.find(option => option.value == customerSite.TenantOfficeId) || null}
                    name="TenantOfficeId"
                    isSearchable
                    isDisabled={true}
                    placeholder={t('update_customer_select_tenantoffice')}
                  />
                  <div className="small text-danger"> {t(errors['TenantOfficeId'])}</div>
                </div>
                <div className="mb-1 mt-1">
                  <label className="form-label  mb-0 red-asterisk">{t('update_customer_site_label_contact_name')}</label>
                  <input name='PrimaryContactName' value={customerSite.PrimaryContactName ?? ""} onChange={onUpdateField} className="form-control"></input>
                  <div className="small text-danger"> {t(errors['PrimaryContactName'])}</div>
                </div>
                <div className="mb-1 mt-1">
                  <label className="form-label  mb-0 red-asterisk">{t('update_customer_site_label_contact_phone')}</label>
                  <input name='PrimaryContactPhone' value={customerSite.PrimaryContactPhone ?? ""} onChange={onUpdateField} className="form-control"></input>
                  <div className="small text-danger"> {t(errors['PrimaryContactPhone'])}</div>
                </div>
                <div className="mb-1 mt-1">
                  <label className="form-label  mb-0">{t('update_customer_site_label_contact_email')}</label>
                  <input name='PrimaryContactEmail' value={customerSite.PrimaryContactEmail ?? ""} onChange={onUpdateField} className="form-control"></input>
                </div>
                <div className="mb-1 mt-1">
                  <label className="form-label  mb-0">{t('update_customer_site_label_secondary_contact_name')}</label>
                  <input name='SecondaryContactName' value={customerSite.SecondaryContactName ?? ""} onChange={onUpdateField} className="form-control"></input>
                </div>
                <div className="mb-1 mt-1">
                  <label className="form-label  mb-0">{t('update_customer_site_label_secondary_contact_phone')}</label>
                  <input name='SecondaryContactPhone' value={customerSite.SecondaryContactPhone ?? ""} onChange={onUpdateField} className="form-control"></input>
                </div>
                <div className="mb-1 mt-1">
                  <label className="form-label  mb-0">{t('update_customer_site_label_secondary_contact_email')}</label>
                  <input name='SecondaryContactEmail' value={customerSite.SecondaryContactEmail ?? ""} onChange={onUpdateField} className="form-control"></input>
                </div>
              </>}
              {checkForPermission("CUSTOMERS_CUSTOMER_SITE_CREATE") &&
                <button type='button' onClick={() => onSubmit(customerSite)} className="btn app-primary-bg-color text-white mt-2">
                  {t('update_customer_site_create_button')}
                </button>
              }
              {/* Create customer Site form ends here */}

              {displayInformationModal ? <InformationModal /> : ''}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function onUpdateField(event: any) {
  var name = event.target.name;
  var value = event.target.value;
  store.dispatch(updateField({ name: name as keyof UpdateCustomerSiteState['customerSite'], value }));
}