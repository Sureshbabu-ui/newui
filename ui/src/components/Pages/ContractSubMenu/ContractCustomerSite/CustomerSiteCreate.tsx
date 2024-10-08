import SweetAlert from 'react-bootstrap-sweetalert';
import {
  startSubmitting,
  stopSubmitting,
  toggleInformationModalStatus,
  updateErrors,
  initializeCreateCustomerSite,
  loadCustomerSite,
  customerSiteSelected,
  selectedCustomeSite,
  updateField,
  addSelectedCustomerSiteId,
  removeSelectedCustomerSiteId,
} from './CustomerSiteCreate.slice';
import { useTranslation } from 'react-i18next';
import { useStore, useStoreWithInitializer } from '../../../../state/storeHooks';
import { ContainerPage } from '../../../ContainerPage/ContainerPage';
import { store } from '../../../../state/store';
import { startPreloader, stopPreloader } from '../../../Preloader/Preloader.slice';
import { createContractCustomerSite, getAllCustomerSiteList, getCustomerSiteNames } from '../../../../services/customer';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CustomerSiteList } from '../../../../types/customer';
import { convertBackEndErrorsToValidationErrors } from '../../../../helpers/formats';
import { ValidationErrorComp } from '../../../ValidationErrors/ValidationError';

export function CreateCustomerSite() {
  const { t } = useTranslation();
  const { contractcustomersitecreate: { displayInformationModal, customerSiteList, selectedCustomerSiteName, customerSiteCreate, errors }, contractcustomersitemanagement: { visibleModal } } = useStore(
    ({ contractcustomersitecreate, contractcustomersitemanagement }) => ({ contractcustomersitecreate, contractcustomersitemanagement }));
  const { ContractId } = useParams<{ ContractId: string }>();
  const CustomerInfoId = store.getState().generalcontractdetails.singlecontract.CustomerInfoId
  useEffect(() => {
    onLoad()
  }, [ContractId != null && visibleModal == "CreateNewCustomerSite"]);

  const addItemToList = (index: number, siteName: CustomerSiteList) => {
    return async (ev: React.FormEvent) => {
      ev.preventDefault()
      if ((store.getState().generalcontractdetails.singlecontract.IsMultiSite == true) || (selectedCustomerSiteName.length <= 1)) {
        const customerList = [...customerSiteList]
        customerList.splice(index, 1)
        store.dispatch(loadCustomerSite(customerList))
        const selectedSite = [...selectedCustomerSiteName, siteName]
        store.dispatch(customerSiteSelected(selectedSite))
        store.dispatch(addSelectedCustomerSiteId(siteName.Id))
      }
      else {
        store.dispatch(updateErrors({ "Message": "No need to add sites in this contract it is a single site contract" }));
      }
    }
  }

  const removeItemFromList = (index: number, siteName: CustomerSiteList) => {
    return async (ev: React.FormEvent) => {
      ev.preventDefault()
      const selectedSite = [...selectedCustomerSiteName]
      selectedSite.splice(index, 1)
      store.dispatch(customerSiteSelected(selectedSite))
      store.dispatch(removeSelectedCustomerSiteId(siteName.Id))
      const customerList = [...customerSiteList, siteName]
      store.dispatch(loadCustomerSite(customerList))
    }
  }

  return (
    <div>
      <ContainerPage>
        <ValidationErrorComp errors={errors} />
        <div className="row">
          {/* section 1 */}
          <div className="col-md-6">
            <div className="card">
              <div className="card-header">
                {t('customer_site_create_customer_sites')}
              </div>
              <div className="card-body ">
                <p className="my-1 red-asterisk">{t('customer_site_create_header')}</p>
                {/* customer sites list */}
                {customerSiteList.map((eachCustomerSite, index) => (
                  <div className="mt-0" >
                    <div className="row">
                      <div className="col-sm-11 pb-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-navigation"><polygon points="3 11 22 2 13 21 11 13 3 11"></polygon></svg>&nbsp;
                        <label className="form-check-label">{eachCustomerSite.SiteName}</label>&nbsp;
                        <p> <small className='pt-0 ms-3 mt-0 pb-0'>{eachCustomerSite.Address}</small>
                        </p>
                      </div>
                      <div className="col-sm-1 pt-2 text-success " onClick={addItemToList(index, eachCustomerSite)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" stroke-width="2"
                          stroke-linecap="round" stroke-linejoin="round"
                          className="feather feather-plus-circle"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line>
                          <line x1="8" y1="12" x2="16" y2="12"></line>
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
                {/* </p> */}
                {/* customer sites list ends */}
              </div>
            </div>
          </div>
          {/* section 1 ends */}

          {/* section 2 */}
          <div className="col-md-6">
            <div className="card">
              <div className="card-header">
                {t('customer_site_create_selected_customer_sites')}
              </div>
              {selectedCustomerSiteName.length > 0 ? (
                <div className="card-body">
                  {selectedCustomerSiteName.map((eachSelectedCustomerSite, index) => (
                    <div className="mt-0" >
                      <div className="row  ">
                        <div className="col-sm-11 pb-0">
                          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-navigation"><polygon points="3 11 22 2 13 21 11 13 3 11"></polygon></svg>&nbsp;
                          <label className="form-check-label   ">{eachSelectedCustomerSite.SiteName}</label>&nbsp;
                          <p> <small className='pt-0 mt-0 ps-3 pb-0'>{eachSelectedCustomerSite.Address}</small>
                          </p>
                        </div>
                        <div className="col-sm-1 pt-2 text-danger" onClick={removeItemFromList(index, eachSelectedCustomerSite)}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-minus-circle"><circle cx="12" cy="12" r="10"></circle><line x1="8" y1="12" x2="16" y2="12"></line></svg>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* submit button */}
                  <p>
                    <button type='button' onClick={onSubmit(customerSiteCreate)} className="btn app-primary-bg-color text-white mt-2">Save Selected Customer Sites</button>
                  </p>
                  {/* submit button ends */}

                </div>
              ) : (
                <small className="mt-2 mx-2">{t('customer_site_create_no_customer_sites_found')}</small>
              )}
            </div>
          </div>
          {/* section 2 ends */}
          {displayInformationModal ? <InformationModal /> : ''}
          {/* Create customer Site form ends here */}
        </div>
        {/* Add customer Site form */}
      </ContainerPage>
    </div>
  )

  async function onLoad() {
    store.dispatch(initializeCreateCustomerSite());
    store.dispatch(updateField(ContractId))
    if (visibleModal == "CreateNewCustomerSite") {
      try {
        const customerSite = await getCustomerSiteNames(CustomerInfoId);
        store.dispatch(loadCustomerSite(customerSite));
      } catch (error) {
        console.error(error);
      }
    }
  }

  async function filterCustomerSiteList(event: any) {
    const result = await getCustomerSiteNames(event.target.value);
    store.dispatch(loadCustomerSite(result));
  }
}

function onSubmit(customerSite: selectedCustomeSite) {
  return async (ev: React.FormEvent) => {
    ev.preventDefault();
    store.dispatch(startPreloader());
    store.dispatch(startSubmitting());
    const result = await createContractCustomerSite(customerSite)
    store.dispatch(stopSubmitting());
    result.match({
      ok: () => {
        store.dispatch(toggleInformationModalStatus());
      },
      err: (e) => {
        const errorMessages = convertBackEndErrorsToValidationErrors(e)
        store.dispatch(updateErrors(errorMessages))
      },
    });
    store.dispatch(stopPreloader());
  };
}

function InformationModal() {
  const { t, i18n } = useTranslation();
  return (
    <SweetAlert success title='Success' onConfirm={reDirectRoute}>
      {t('customer_site_create_success')}
    </SweetAlert>
  );
}

function reDirectRoute() {
  store.dispatch(toggleInformationModalStatus());
  document.getElementById('closeCustomerSiteCreateModal')?.click();
  window.location.reload();
}