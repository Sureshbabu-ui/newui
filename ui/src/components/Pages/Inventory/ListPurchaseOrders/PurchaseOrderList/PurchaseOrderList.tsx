import { useStoreWithInitializer } from '../../../../../state/storeHooks';
import { useTranslation } from 'react-i18next';
import { Pagination } from '../../../../Pagination/Pagination';
import { formatCurrency, formatDate } from '../../../../../helpers/formats';
import { getPurchaseOrderDetails, getPurchaseOrders } from '../../../../../services/purchaseorder';
import { useEffect } from 'react';
import { startPreloader, stopPreloader } from '../../../../Preloader/Preloader.slice';
import { changePage, initializePO, loadPurchaseOrders, setSearch } from './PurchaseOrderList.slice';
import { store } from '../../../../../state/store';
import BreadCrumb from '../../../../BreadCrumbs/BreadCrumb';
import { PurchaseOrderView } from '../PurchaseOrderView/PurchaseOrderView';
import { checkForPermission } from '../../../../../helpers/permissions';
import { Link } from "react-router-dom";
import { loadSelectedPO } from '../PurchaseOrderView/PurchaseOrderView.slice';

export function PurchaseOrderList() {
  const { t, i18n } = useTranslation();
  const { perPage, totalRows, search, currentPage, polist } = useStoreWithInitializer(({ purchaseorderlist }) => purchaseorderlist, initializePO);

  const onPageChange = async (index: number) => {
    store.dispatch(changePage(index));
    const polist = await getPurchaseOrders(search, index);
    store.dispatch(loadPurchaseOrders(polist));
  }

  const filterList = async () => {
    store.dispatch(changePage(1))
    const result = await getPurchaseOrders(store.getState().purchaseorderlist.search, 1);
    store.dispatch(loadPurchaseOrders(result));
  }

  const addData = async (event: any) => {    
    store.dispatch(setSearch(event.target.value));
    if (event.target.value == "") {
      store.dispatch(changePage(1))
      const result = await getPurchaseOrders(search, store.getState().purchaseorderlist.currentPage);
      store.dispatch(loadPurchaseOrders(result));
    }
  }

  useEffect(() => {
    if (checkForPermission('PURCHASEORDER_VIEW')) {
      onLoad();
    }
  }, []);

  const onLoad = async () => {
    store.dispatch(startPreloader())
    try {
      const polist = await getPurchaseOrders(search, currentPage);
      store.dispatch(loadPurchaseOrders(polist));
    } catch (error) {
      return error;
    }
    store.dispatch(stopPreloader())
  }

  const breadcrumbItems = [
    { Text: 'breadcrumbs_home', Link: '/' },
    { Text: 'breadcrumbs_purchase_orders' }
  ];

  const redirectToViewDetails = async (Id: number) => {
    try {
      if (checkForPermission('PURCHASEORDER_VIEW')) {
        const podetails = await getPurchaseOrderDetails(Id)
        store.dispatch(loadSelectedPO(podetails))
      }
    }
    catch (error) {
      return error;
    }
  }

  return (
    <>
      <BreadCrumb items={breadcrumbItems} />
      {checkForPermission('PURCHASEORDER_VIEW') &&
        <>
          {polist.match({
            none: () => <>{t('po_list_loading')}</>,
            some: (purchaseorders) =>
              <div className="row mx-4 mt-4">
                {checkForPermission("IMPRESTPURCHASEORDER_MANAGE") &&
                  <div className="p-0 m-0">
                    <Link to='/logistics/imprest/purchaseorder'>
                      <button className='btn app-primary-bg-color m-0 text-white my-1 float-end'>
                        {t('imprest_purchase_orders_create_button')}
                      </button>
                    </Link>
                  </div>
                }
                <div className="input-group mb-2 p-0 mt-3">
                  <input type='search' className="form-control custom-input " value={search} placeholder={t('po_list_search_placeholder') ?? ''} onChange={addData}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        filterList();
                      }
                    }}
                  />
                  <button className="btn app-primary-bg-color text-white float-end" type="button" onClick={filterList}> {t('po_list_search')} </button>
                </div>
                {purchaseorders.length > 0 ? (
                  <div className='p-0 table-responsive'>
                    <table className="table table-hover  table-bordered ">
                      <thead>
                        <tr className="border mt-1">
                          <th></th>
                          <th scope="col">#</th>
                          <th scope="col">{t('po_list_po_no')}</th>
                          <th scope="col">{t('po_list_po_date')}</th>
                          <th scope="col">{t('po_list_vendor')}</th>
                          <th scope="col">{t('po_list_location')}</th>
                          <th scope="col">{t('po_list_status')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {purchaseorders.map((field, index) => (
                          <tr className="border mt-1 pb-1" key={index}>
                            <td className='col-auto'>
                              <a className="pseudo-href app-primary-color"
                                onClick={() => redirectToViewDetails(field.Id)}
                                data-bs-toggle='modal' data-bs-target='#PurchaseOrder'>
                                <span className="material-symbols-outlined">
                                  visibility
                                </span>
                              </a>
                            </td>
                            <td>{(currentPage - 1) * 10 + index + 1}</td>
                            <td>{field.PoNumber}</td>
                            <td>{formatDate(field.PoDate)}</td>
                            <td>{field.Vendor}</td>
                            <td>{field.TenantOffice}</td>
                            <td>{field.PoStatus}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="row m-0">
                      <Pagination currentPage={currentPage} count={totalRows} itemsPerPage={perPage} onPageChange={onPageChange} />
                    </div>
                  </div>
                ) : (
                  <div className="form-text">
                    {t('po_list_no_records')}
                  </div>
                )}
                <PurchaseOrderView />
              </div>
          })}
        </>
      }
    </>
  );
}