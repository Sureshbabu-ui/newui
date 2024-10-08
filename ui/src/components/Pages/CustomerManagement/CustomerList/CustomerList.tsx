import { useEffect, useState } from 'react';
import { store } from '../../../../state/store';
import { useStore } from '../../../../state/storeHooks';
import { ContainerPage } from '../../../ContainerPage/ContainerPage';
import { Pagination } from '../../../Pagination/Pagination';
import { initializeCustomersList, loadCustomers, changePage, setSearch } from './CustomerList.slice';
import { useTranslation } from 'react-i18next';
import { checkForPermission } from '../../../../helpers/permissions';
import FeatherIcon from 'feather-icons-react';
import SweetAlert from 'react-bootstrap-sweetalert';
import i18n from '../../../../i18n';
import toast, { Toaster } from 'react-hot-toast';
import { DeleteCustomer, getCustomerList } from '../../../../services/customer';
import { convertBackEndErrorsToValidationErrors } from '../../../../helpers/formats';

export function CustomerList() {
  const { t } = useTranslation();
  const {
    customerlist: { customers, totalRows, currentPage, search, perPage },
  } = useStore(({ customerlist, app }) => ({ customerlist, app }));

  useEffect(() => {
    if (checkForPermission("CUSTOMER_LIST")) {
      onLoad();
    }
  }, [null]);

  const [customerId, setCustomerId] = useState(0);
  const handleConfirm = (customerId: number) => {
    setCustomerId(customerId);
  };

  async function handleCancel() {
    setCustomerId(0);
  }

  function ConfirmationModal() {
    return (
      <SweetAlert
        warning
        showCancel
        confirmBtnText='Yes, Delete!'
        cancelBtnText='Cancel'
        cancelBtnBsStyle='light'
        confirmBtnBsStyle='warning'
        title='Are you sure?'
        onConfirm={() => deleteCustomerDetails(customerId)}
        onCancel={handleCancel}
        focusCancelBtn
      >
        {t('customer_deleted_conformation')}
      </SweetAlert>
    );
  }

  async function deleteCustomerDetails(Id: number) {
    var result = await DeleteCustomer(Id);
    result.match({
      ok: () => {
        setCustomerId(0)
        toast(i18n.t('customer_deleted_success_message'),
          {
            duration: 2300,
            style: {
              borderRadius: '0',
              background: '#00D26A',
              color: '#fff'
            }
          });
        onLoad()
      },
      err: (err) => {
        const formattedErrors = convertBackEndErrorsToValidationErrors(err);
        const errorMessages = Object.values(formattedErrors).join(', '); 
        toast(i18n.t(errorMessages),
          {
            duration: 2300,
            style: {
              borderRadius: '0',
              background: '#F92F60',
              color: '#fff',
              width: '500px'
            }
          });
        setCustomerId(0);
      },
    });
  }

  return (
    <>
      {checkForPermission("CUSTOMER_LIST") && (customers.match({
        none: () => (
          <div className="m-2">
            <ContainerPage>
              <div className="my-2">{t('customer_management_loading_customers')}</div>
            </ContainerPage>
          </div>
        ),
        some: (customer) => (
          <div>
            {checkForPermission("CUSTOMER_LIST") && <>
              <ContainerPage>
                <div className="mb-2">
                  {/* Section 2 */}
                  <div className="px-1">
                    <div className="input-group">
                      <input type='search' className="form-control custom-input" value={search ?? ""} placeholder={t('managecustomer_search_placeholder') ?? ''} onChange={addData}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            filterCustomerList(e);
                          }
                        }} />
                      <button className="btn app-primary-bg-color text-white float-end " type="button" onClick={filterCustomerList}>
                        Search
                      </button>
                    </div>
                  </div>
                  {/* Section 2 ends */}

                  {/* Table */}
                  <div className="row px-3 mt-3">
                    {customer.length > 0 ? (
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <th scope='col'>{t('customer_management_slno')}</th>
                            <th scope='col'>{t('customer_management_customer_name')}</th>
                            <th scope='col'>{t('customer_management_customer_code')}</th>
                            <th scope='col'>{t('customer_management_customer_email')}</th>
                            <th scope='col'>{t('customer_management_customer_phone')}</th>
                            <th scope='col'>{t('customer_management_action')}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {customer.map((field, index) => (
                            <tr key={index}>
                              <th scope='row'>{(currentPage - 1) * 10 + (index + 1)}</th>
                              <td>{field.customer.Name}</td>
                              <td>{field.customer.CustomerCode}</td>
                              <td>{field.customer.PrimaryContactEmail}</td>
                              <td>{field.customer.PrimaryContactPhone}</td>
                              <td>
                                {checkForPermission("CUSTOMER_VIEW") &&
                                  <a className="pseudo-href app-primary-color" href={`/config/customers/view/${field.customer.CustomerInfoId}`} data-toggle="tooltip" data-placement="left" title={'View'}
                                  >
                                    <FeatherIcon icon={"eye"} size="16" />
                                  </a>
                                }
                                &nbsp;&nbsp;
                                {checkForPermission("CUSTOMER_CREATE") && (
                                  <a
                                    className='pseudo-href app-primary-color '
                                    href={`/config/customers/edit/${field.customer.CustomerInfoId}`}
                                  >
                                    <FeatherIcon icon={"edit"} size="16" />
                                  </a>
                                )}
                                <a
                                  className='pseudo-href app-primary-color ps-2'
                                  data-toggle="tooltip" data-placement="left" title={'Delete Customer'}
                                  onClick={() => handleConfirm(field.customer.CustomerId)}
                                >
                                  <FeatherIcon icon={"trash-2"} size="20" />
                                </a>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="text-muted p-0">{t('customer_management_no_customer_found')}</div>
                    )}
                  </div>
                  {/* Table ends */}

                  {/* Pagination */}
                  <div className="row px-1">
                    <Pagination currentPage={currentPage} count={totalRows} itemsPerPage={perPage} onPageChange={onPageChange} />
                  </div>
                  {/* Pagination ends */}
                  {customerId ? <ConfirmationModal /> : ""}
                  <Toaster />
                </div>
              </ContainerPage>
            </>}
          </div>
        ),
      }))}
    </>)
}

async function onLoad() {
  store.dispatch(initializeCustomersList());
  try {
    const currentPage = store.getState().customerlist.currentPage;
    const searchKey = store.getState().customerlist.search;
    const customer = await getCustomerList(currentPage, searchKey);
    store.dispatch(loadCustomers(customer));
  } catch (error) {
    console.error(error);
  }
}

async function onPageChange(index: number) {
  store.dispatch(changePage(index));
  const searchKey = store.getState().customerlist.search;
  const customer = await getCustomerList(index, searchKey);
  store.dispatch(loadCustomers(customer));
}

async function filterCustomerList(event: any) {
  store.dispatch(changePage(1))
  const customer = await getCustomerList(1, store.getState().customerlist.search);
  store.dispatch(loadCustomers(customer));
}

const addData = async (event: any) => {
  store.dispatch(setSearch(event.target.value));
  if (event.target.value == "") {
    store.dispatch(changePage(1))
    const result = await getCustomerList(store.getState().customerlist.currentPage, store.getState().customerlist.search);
    store.dispatch(loadCustomers(result));
  }
}