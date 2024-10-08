import { useStoreWithInitializer } from '../../../../../state/storeHooks';
import { useTranslation } from 'react-i18next';
import { Pagination } from '../../../../Pagination/Pagination';
import { formatDate } from '../../../../../helpers/formats';
import { CreateGoodsReceivedNoteState, setVendorId, updateField } from '../CreateGRN/CreateGRN.slice';
import { getLocationWisePurchaseOrders } from '../../../../../services/purchaseorder';
import { useEffect } from 'react';
import { startPreloader, stopPreloader } from '../../../../Preloader/Preloader.slice';
import { changePage, initializePO, loadPurchaseOrders, setSearch } from './PurchaseOrders.slice';
import { store } from '../../../../../state/store';

export function PurchaseOrders(props: { TransactionTypeCode: string }) {
  const { t, i18n } = useTranslation();
  const { perPage, totalRows, search, currentPage, polist } = useStoreWithInitializer(({ purchaseorders }) => purchaseorders, initializePO);

  const onPageChange = async (index: number) => {
    store.dispatch(changePage(index));
    const polist = await getLocationWisePurchaseOrders(search, index);
    store.dispatch(loadPurchaseOrders(polist));
  }

  const filterList = async () => {
    store.dispatch(changePage(1))
    const result = await getLocationWisePurchaseOrders(store.getState().purchaseorders.search, 1);
    store.dispatch(loadPurchaseOrders(result));
  }

  const addData = async (event: any) => {
    store.dispatch(setSearch(event.target.value));
    if (event.target.value == "") {
      store.dispatch(changePage(1))
      const result = await getLocationWisePurchaseOrders(store.getState().purchaseorders.search, store.getState().purchaseorders.currentPage);
      store.dispatch(loadPurchaseOrders(result));
    }
  }

  useEffect(() => {
    onSelectedData();
  }, [props.TransactionTypeCode]);

  const onSelectedData = async () => {
    store.dispatch(startPreloader())
    try {
      const polist = await getLocationWisePurchaseOrders(search, currentPage);
      store.dispatch(loadPurchaseOrders(polist));
    } catch (error) {
      console.error(error);
    }
    store.dispatch(stopPreloader())
  }

  function onUpdateField(ev: any) {
    var name = ev.target.name;
    var value = ev.target.value;
    store.dispatch(updateField({ name: name as keyof CreateGoodsReceivedNoteState['creategrn'], value }));
  }
  return (
    <>
      {polist.match({
        none: () => <>{t('po_list_loading')}</>,
        some: (purchaseorders) =>
          <div className="row mx-2 px-0 p-0 mt-2 my-0">
            <h6 className="app-primary-color p-0">{t('po_list_main_heading')}</h6>
            <div className="input-group mb-2 p-0">
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
              <div className='p-0'>
                <table className="table mb-0">
                  <thead>
                    <tr className="border mt-1">
                      <th scope="col"></th>
                      <th scope="col">{t('po_list_po_no')}</th>
                      <th scope="col">{t('po_list_po_date')}</th>
                      <th scope="col">{t('po_list_vendor')}</th>
                      <th scope="col">{t('po_list_location')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {purchaseorders.map((field, index) => (
                      <tr className="border mt-1 pb-1">
                        <th scope="row">
                          <div className="form-check">
                            <input className="form-check-input border-secondary" type="radio" value={field.Id}
                              onClick={(ev) => {
                                onUpdateField(ev); store.dispatch(setVendorId(field.VendorId));
                              }} name="TransactionId" id="flexRadioDefault1" />
                          </div>
                        </th>
                        <td>{field.PoNumber}</td>
                        <td>{formatDate(field.PoDate)}</td>
                        <td>{field.Vendor}</td>
                        <td>{field.TenantOffice}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="row m-0">
                  <Pagination currentPage={currentPage} count={totalRows} itemsPerPage={perPage} onPageChange={onPageChange} />
                </div>
              </div>
            ) : (
              <div className="alert alert-danger border-danger rounded-0 border-dashed" role="alert">
                {t('po_list_no_records')}
              </div>
            )}
          </div>
      })}
    </>
  );
}