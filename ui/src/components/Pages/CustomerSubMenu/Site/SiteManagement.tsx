import { useEffect, useRef, useState } from 'react';
import { initializeCustomerSiteList, changePage, setSearch, loadCustomerSite, checkExist } from './SiteManagement.slice';
import { useTranslation } from 'react-i18next';
import { useStore } from '../../../../state/storeHooks';
import { ContainerPage } from '../../../ContainerPage/ContainerPage';
import { Pagination } from '../../../Pagination/Pagination';
import { store } from '../../../../state/store';
import { CreateCustomerSite } from './CreateSite';
import { customerActiveSiteCheck, customerSiteDelete, getCustomerSiteDetails, getCustomerSiteList } from '../../../../services/customer';
import { updateError } from './CreateSite.slice';
import { checkForPermission } from '../../../../helpers/permissions';
import SweetAlert from 'react-bootstrap-sweetalert';
import FeatherIcon from 'feather-icons-react';
import toast, { Toaster } from 'react-hot-toast';
import i18n from '../../../../i18n';
import { UpdateCustomerSite } from './CustomerSiteUpdate/UpdateCustomerSite';
import { loadCustomerSiteDetails } from './CustomerSiteUpdate/UpdateCustomerSite.slice';

export function SiteManagement() {
  const { t } = useTranslation();
  const {
    customersitemanagement: { customerSites, totalRows, perPage, currentPage, search, IsSiteExist },
  } = useStore(({ customersitemanagement, app }) => ({ customersitemanagement, app }));

  const CustomerId = store.getState().customerprofile.singlecustomer.CustomerId
  useEffect(() => {
    onLoad(Number(CustomerId));
  }, [CustomerId]);

  async function filterCustomerSiteList(event: any) {
    store.dispatch(changePage(1))
    store.dispatch(setSearch(event.target.value));
    const result = await getCustomerSiteList(event.target.value, 1, Number(CustomerId));
    store.dispatch(loadCustomerSite(result));
  }
  const addData = async (event: any) => {
    store.dispatch(setSearch(event.target.value));
    if (event.target.value == "") {
      const result = await getCustomerSiteList(store.getState().customersitemanagement.search, store.getState().customersitemanagement.currentPage, Number(CustomerId));
      store.dispatch(loadCustomerSite(result));
    }
  }

  const [siteId, setId] = useState(0);

  async function handleConfirm(siteId: number) {
    const result = await customerActiveSiteCheck(siteId)
    store.dispatch(checkExist(result.IsSiteExist))
    setId(siteId)
  }

  async function handleCancel() {
    setId(0);
  }


  function ConfirmationModal() {
    return (
      <SweetAlert
        showCancel
        customClass='w-50'
        confirmBtnText='Yes, Delete!'
        cancelBtnText='Cancel'
        cancelBtnBsStyle='light'
        confirmBtnBsStyle='danger'
        title='Are you sure?'
        onConfirm={() => deleteSite(siteId)}
        onCancel={handleCancel}
        focusCancelBtn
      >
        <p>{t('customer_site_management_delete_conformation1')}</p>
        {IsSiteExist == 1 && (
          <p className='text-danger'>{t('customer_site_management_delete_conformation2')}</p>
        )}
      </SweetAlert>
    );
  }

  async function deleteSite(Id: number) {
    var result = await customerSiteDelete(Id);
    result.match({
      ok: () => {
        setId(0)
        toast(i18n.t('customer_site_management_success_delete'),
          {
            duration: 2100,
            style: {
              borderRadius: '0',
              background: '#00D26A',
              color: '#fff',
            }
          });
        onLoad(Number(CustomerId));
      },
      err: (err) => {
        toast(i18n.t('customer_site_management_failure_delete'),
          {
            duration: 2100,
            style: {
              borderRadius: '0',
              background: '#F92F60',
              color: '#fff'
            }
          });
        console.log(err);
      },
    });
  }

  async function loadClickedCustomerSiteDetails(SiteId: number) {
    var result = await getCustomerSiteDetails(SiteId);
    store.dispatch(loadCustomerSiteDetails(result));
  }

  return customerSites.match({
    none: () => (
      <div className="m-2">
        <ContainerPage>
          <div className="my-2">{t('customer_site_management_loading_sites')}</div>
        </ContainerPage>
      </div>
    ),
    some: (customerSite) => (
      <div className="">
        <ContainerPage>
          <div className="my-2">
            {/* Section 1 */}
            <div className="row ms-1 ">
              {/* Header */}
              <div className="col-md-8 p-0 app-primary-color">
                <h5>{t('customer_site_management_manage_site')}</h5>
              </div>
              {/* Header ends */}
              {/* New customer site button */}
              <div className="col-md-4 px-2  d-flex justify-content-end">
                {checkForPermission("CUSTOMERS_CUSTOMER_SITE_CREATE") &&
                  <button
                    className="btn app-primary-bg-color text-white me-1"
                    data-bs-toggle='modal'
                    data-bs-target='#CreateNewCustomerSite'
                  >
                    {t('customer_site_management_new_site')}
                  </button>
                }
              </div>

              {/* New customer site button ends */}
            </div>
            {/* Section 1 ends */}

            {/* Section 2 */}
            <div className="mb-3 mt-3 ps-1">
              <div className="input-group">
                <input type='search' className="form-control custom-input" value={search ?? ""} placeholder={t('customer_site_management_search_placeholder') ?? ''} onChange={addData}
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
            <div className="row m-2 mt-3">
              {customerSite.length > 0 ? (
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th scope='col'>{t('customer_site_management_th_sl_no')}</th>
                      <th scope='col'>{t('customer_site_management_site_name')}</th>
                      <th scope='col'>{t('customer_site_management_address')}</th>
                      <th scope='col'>{t('customer_site_management_contact_phone')}</th>
                      <th scope='col'></th>
                    </tr>
                  </thead>
                  <tbody>
                    {customerSite.map((field, index) => (
                      <tr>
                        <th scope='row'>{(currentPage - 1) * 10 + (index + 1)}</th>
                        <td>{field.customerSite.SiteName}</td>
                        <td>{field.customerSite.Address}</td>
                        <td>{field.customerSite.PrimaryContactPhone}</td>
                        <td>
                          <a
                            className='pseudo-href app-primary-color'
                            data-toggle="tooltip" data-placement="left" title={'Delete Site'}
                            onClick={() => handleConfirm(field.customerSite.Id)}
                          >
                            <FeatherIcon icon={"trash-2"} size="20" />
                          </a>
                          &nbsp;&nbsp;
                          <a
                            className='pseudo-href app-primary-color'
                            data-toggle="tooltip" data-placement="left" title={'Edit'}
                            onClick={() => loadClickedCustomerSiteDetails(field.customerSite.Id)}
                            data-bs-toggle='modal'
                            data-bs-target='#UpdateCustomerSite'
                            data-testid={`site_update_button_edit_${field.customerSite.Id}`}
                          >
                            <FeatherIcon icon={"edit"} size="16" />
                          </a>
                        </td>
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
            {/* Pagination ends */}

            {/* Modals */}
            <CreateNewCustomerSite />
            <UpdateCustomerSite />
            {siteId ? <ConfirmationModal /> : ""}
            <Toaster />
            {/* Modals ends */}
          </div>
        </ContainerPage>
      </div>
    ),
  });

  async function onLoad(CustomerId: number | null) {
    store.dispatch(initializeCustomerSiteList());
    try {
      const CurrentPage = store.getState().customersitemanagement.currentPage;
      const SearchKey = store.getState().customersitemanagement.search;
      const result = await getCustomerSiteList(SearchKey, CurrentPage, CustomerId);
      store.dispatch(loadCustomerSite(result));
    } catch (error) {
      console.error(error);
    }
  }

  async function onPageChange(index: number) {
    store.dispatch(changePage(index));
    const searchKey = store.getState().customersitemanagement.search;
    const result = await getCustomerSiteList(searchKey, index, Number(CustomerId));
    store.dispatch(loadCustomerSite(result));
  }
}

function CreateNewCustomerSite() {
  const { t } = useTranslation();
  return (
    <div
      className="modal fade"
      id='CreateNewCustomerSite'
      data-bs-backdrop='static'
      data-bs-keyboard='false'
      aria-hidden='true'
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header mx-3">
            <h5 className="modal-title app-primary-color">{t('customer_site_management_create_new_customer_site')}</h5>
            <button
              type='button'
              className="btn-close"
              data-bs-dismiss='modal'
              id='closeCreateCustomerSiteModal'
              aria-label='Close'
              onClick={onCloseModalForCreateCustomerSite}
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

const onCloseModalForCreateCustomerSite = () => {
  store.dispatch(updateError({}))
}