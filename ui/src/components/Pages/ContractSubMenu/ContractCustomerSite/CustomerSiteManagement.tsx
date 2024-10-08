import { useEffect } from 'react';
import { initializeCustomerSiteList, changePage, setSearch, loadCustomerSite, setVisibleModal } from './CustomerSiteManagement.slice';
import { useTranslation } from 'react-i18next';
import { useStore } from '../../../../state/storeHooks';
import { ContainerPage } from '../../../ContainerPage/ContainerPage';
import { Pagination } from '../../../Pagination/Pagination';
import { store } from '../../../../state/store';
import { CreateCustomerSite } from './CustomerSiteCreate';
import { getContractCustomerSiteList } from '../../../../services/customer';
import { useParams } from 'react-router-dom';
import { updateErrors } from './CustomerSiteCreate.slice';
import { checkForPermission } from '../../../../helpers/permissions';
import { CustomerSiteDocumentUpload } from './SiteDocumentUpload';
import FeatherIcon from 'feather-icons-react';
import { loadSiteDocumentDetails } from './SiteDocumentUpload.slice';
import { updateValidationErrors } from '../../../App/App.slice';

function CustomerSiteManagement() {
  const { t } = useTranslation();
  const {
    contractcustomersitemanagement: { customerSites, totalRows, currentPage, perPage, search },
  } = useStore(({ contractcustomersitemanagement, app }) => ({ contractcustomersitemanagement, app }));

  const { ContractId } = useParams<{ ContractId: string }>();
  const fileName = "SiteUploadSample";

  useEffect(() => {
    if (checkForPermission("CONTRACT_CUSTOMER_SITE_CREATE")) {
      onLoad(ContractId);
    }
  }, [ContractId]);

  async function filterCustomerSiteList(event: any) {
    store.dispatch(changePage(1))
    const result = await getContractCustomerSiteList(store.getState().contractcustomersitemanagement.search, 1, ContractId);
    store.dispatch(loadCustomerSite(result));
  }

  const addData = async (event: any) => {
    store.dispatch(setSearch(event.target.value));
    if (event.target.value == "") {
      const result = await getContractCustomerSiteList(store.getState().contractcustomersitemanagement.search, store.getState().contractcustomersitemanagement.currentPage, ContractId);
      store.dispatch(loadCustomerSite(result));
    }
  }

  return <>
    {checkForPermission("CONTRACT_CUSTOMER_SITE_CREATE") &&

      (customerSites.match({
        none: () => (
          <div className="m-2">
            <ContainerPage>
              <div className="my-2">{t('customer_site_management_loading_sites')}</div>
            </ContainerPage>
          </div>
        ),
        some: (customerSite: any) => (
          <ContainerPage>
            <div className="my-2">
              {/* {checkForPermission("CONTRACT_CUSTOMER_SITE_CREATE") && <> */}

              <div className="row m-1">
                {/* Header */}
                <div className="col-md-6 p-0 app-primary-color">
                  <h5>{t('customer_site_management_manage_site')}</h5>
                </div>
                {/* Header ends */}
                {/* New customer site button */}
                {((store.getState().generalcontractdetails.singlecontract.IsMultiSite == true) || (totalRows <= 0)) && (
                  <div className="col-md-6 p-0 d-flex justify-content-end">
                    {checkForPermission("CONTRACT_CUSTOMER_SITE_CREATE") && store.getState().generalcontractdetails.singlecontract.ContractStatusCode !== 'CTS_PNDG' &&
                      <>
                        <a href={`${process.env.REACT_APP_DOWNLOAD_TEMPLATE}${fileName}.xlsx`} download>
                          <button className="btn btn-light app-primary-color fw-bold float-end border" type='button'>
                            <span className="material-symbols-outlined align-middle"> download </span>
                            {t('customer_site_management_download_template')}
                          </button>
                        </a>
                        <button
                          disabled={store.getState().generalcontractdetails.singlecontract.ContractStatusCode === 'CTS_PNDG'}
                          className="btn app-primary-bg-color text-white float-end ms-1"
                          data-bs-toggle='modal'
                          data-bs-target='#CreateNewCustomerSite'
                          onClick={() => store.dispatch(setVisibleModal("CreateNewCustomerSite"))}
                        >
                          {t('customer_site_management_new_site')}
                        </button>
                        <button
                          disabled={store.getState().generalcontractdetails.singlecontract.ContractStatusCode === 'CTS_PNDG'}
                          className="btn app-primary-bg-color text-white ms-1"
                          data-bs-toggle='modal'
                          data-bs-target='#UploadSiteDocument'
                        >
                          {t('customer_site_management_uploadnew_site')}
                        </button>
                      </>
                    }
                  </div>
                )}
                {/* New customer site button ends */}
              </div>
              {/* Section 1 ends */}
              {/* Section 2 */}
              <div className="mb-3 mt-3 p-0">
                <div className="input-group ">
                  <input type='search' className="form-control custom-input" value={search} placeholder={t('customer_search_placeholder') ?? ''} onChange={addData}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        filterCustomerSiteList(e);
                      }
                    }} />
                  <button className="btn app-primary-bg-color text-white float-end " type="button" onClick={filterCustomerSiteList}>
                    Search
                  </button>
                </div>
              </div>
              {/* Section 2 ends */}

              {/* Table */}
              <div className="row m-0 mt-3">
                {customerSite.length > 0 ? (
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th scope='col'>{t('customer_site_management_th_sl_no')}</th>
                        <th scope='col'>{t('customer_site_management_site_name')}</th>
                        <th scope='col'>{t('customer_site_management_address')}</th>
                        <th scope='col'>{t('customer_site_management_contact_phone')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {customerSite.map((field: any, index: any) => (
                        <tr>
                          <th scope='row'>{(currentPage - 1) * 10 + (index + 1)}</th>
                          <td>{field.customerSite.SiteName}</td>
                          <td>{field.customerSite.Address}</td>
                          <td>{field.customerSite.PrimaryContactPhone}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-muted p-0">{t('customer_site_management_no_customer_site_found')}</div>
                )}
              </div>
              {/* Table ends */}

              {/* Pagination */}
              <div className="row m-0">
                <Pagination currentPage={currentPage} count={totalRows} itemsPerPage={perPage} onPageChange={onPageChange} />
              </div>

              {/* Section 1 */}
              {/* Pagination ends */}

              {/* Modals */}
              <CreateNewCustomerSite />
              <SiteDocumentUpload />
              {/* Modals ends */}
            </div>
          </ContainerPage>
        ),
      }))}
  </>

  async function onLoad(ContractId: string) {
    store.dispatch(initializeCustomerSiteList());
    try {
      const CurrentPage = store.getState().customersitemanagement.currentPage;
      const SearchKey = store.getState().customersitemanagement.search;
      const result = await getContractCustomerSiteList(SearchKey, CurrentPage, ContractId);
      store.dispatch(loadCustomerSite(result));
    } catch (error) {
      console.error(error);
    }
  }

  async function onPageChange(index: number) {
    store.dispatch(changePage(index));
    const searchKey = store.getState().customersitemanagement.search;
    const result = await getContractCustomerSiteList(searchKey, index, ContractId);
    store.dispatch(loadCustomerSite(result));
  }
}

const onModalClose = () => {
  store.dispatch(updateErrors({}))
}

function SiteDocumentUpload() {
  const onCloseModal = () => {
    store.dispatch(loadSiteDocumentDetails({ SiteDetails: [], ContractId: null, CustomerSiteValidations: [] }))
    store.dispatch(updateValidationErrors({}))
    store.dispatch(updateErrors({}))
  }

  const { t, i18n } = useTranslation();
  return (
    <div
      className="modal fade px-0"
      id='UploadSiteDocument'
      data-bs-backdrop='static'
      data-bs-keyboard='false'
      aria-hidden='true'
    >
      <div className="modal-dialog modal-fullscreen">
        <div className="modal-content">
          <div className="modal-header mx-3">
            <h5 className="modal-title app-primary-color">{t('bulk_upload_customer_site_modal_title')}</h5>
            <button
              type='button'
              className="btn-close"
              data-bs-dismiss='modal'
              id='closeSiteDocumentModal'
              aria-label='Close'
              onClick={onCloseModal}
            ></button>
          </div>
          <div className="modal-body">
            <CustomerSiteDocumentUpload isPreAmcUpload={false} />
          </div>
        </div>
      </div>
    </div>
  );
}

function CreateNewCustomerSite() {
  const { t, i18n } = useTranslation();
  return (
    <div
      className="modal fade"
      id='CreateNewCustomerSite'
      data-bs-backdrop='static'
      data-bs-keyboard='false'
      aria-hidden='true'
    >
      <div className="modal-dialog modal-fullscreen">
        <div className="modal-content">
          <div className="modal-header mx-3">
            {checkForPermission("CONTRACT_CUSTOMER_SITE_CREATE") &&
              <h5 className="modal-title app-primary-color">{t('customer_site_management_create_new_customer_site')}</h5>}
            <button
              type='button'
              className="btn-close"
              data-bs-dismiss='modal'
              id='closeCustomerSiteCreateModal'
              aria-label='Close'
              onClick={onModalClose}
            ></button>
          </div>
          <div className="modal-body">
            <CreateCustomerSite />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerSiteManagement
