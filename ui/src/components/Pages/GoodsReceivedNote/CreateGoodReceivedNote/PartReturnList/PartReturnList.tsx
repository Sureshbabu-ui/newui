import { useStoreWithInitializer } from '../../../../../state/storeHooks';
import { useTranslation } from 'react-i18next';
import { Pagination } from '../../../../Pagination/Pagination';
import { formatDate } from '../../../../../helpers/formats';
import { CreateGoodsReceivedNoteState, setLocationId, setVendorId, updateField } from '../CreateGRN/CreateGRN.slice';
import { useEffect } from 'react';
import { startPreloader, stopPreloader } from '../../../../Preloader/Preloader.slice';
import { store } from '../../../../../state/store';
import { getAllPartReturns } from '../../../../../services/goodsreceivednote';
import { changePage, initializePartReturn, loadPartReturnList, setSearch } from './PartReturnList.slice';

export function PartReturnList(props: { TransactionTypeCode: string }) {
  const { t, i18n } = useTranslation();
  const { perPage, totalRows, search, currentPage, partreturnlist } = useStoreWithInitializer(({ partreturnlist }) => partreturnlist, initializePartReturn);

  const onPageChange = async (index: number) => {
    store.dispatch(changePage(index));
    const partreturnlist = await getAllPartReturns(search, index);
    store.dispatch(loadPartReturnList(partreturnlist));
  }

  const filterList = async () => {
    store.dispatch(changePage(1))
    const result = await getAllPartReturns(store.getState().partreturnlist.search, 1);
    store.dispatch(loadPartReturnList(result));
  }

  const addData = async (event: any) => {
    store.dispatch(setSearch(event.target.value));
    if (event.target.value == "") {
      store.dispatch(changePage(1))
      const result = await getAllPartReturns(store.getState().partreturnlist.search, store.getState().partreturnlist.currentPage);
      store.dispatch(loadPartReturnList(result));
    }
  }

  useEffect(() => {
    onSelectedData();
  }, [props.TransactionTypeCode]);

  const onSelectedData = async () => {
    store.dispatch(startPreloader())
    try {
      const partreturnlist = await getAllPartReturns(search, currentPage);
      store.dispatch(loadPartReturnList(partreturnlist));
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
      {partreturnlist.match({
        none: () => <>{t('partreturn_list_loading')}</>,
        some: (partreturnlist) =>
          <div className="row mx-1 px-0 p-0 mt-2">
            <h6 className="app-primary-color p-0">{t('partreturn_list_main_heading')}</h6>
            <div className="input-group mb-2 p-0">
              <input type='search' className="form-control custom-input " value={search} placeholder={t('partreturn_list_search_placeholder') ?? ''} onChange={addData}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    filterList();
                  }
                }}
              />
              <button className="btn app-primary-bg-color text-white float-end" type="button" onClick={filterList}> {t('partreturn_list_search')} </button>
            </div>
            {partreturnlist.length > 0 ? (
              <div className='p-0'>
                <table className="table">
                  <thead>
                    <tr className="border mt-1 mb-1">
                      <th scope="col"></th>
                      <th scope="col">{t('partreturn_list_wono')}</th>
                      <th scope="col">{t('partreturn_list_serialno')}</th>
                      <th scope="col">{t('partreturn_list_partname')}</th>
                      <th scope="col">{t('partreturn_list_returned_parttype')}</th>
                      <th scope="col">{t('partreturn_list_receiving_location')}</th>
                      <th scope="col">{t('partreturn_list_return_initiatedby')}</th>
                      <th scope="col">{t('partreturn_list_return_initiatedon')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {partreturnlist.map((field, index) => (
                      <tr className="border mt-1 mb-1  pb-1">
                        <th scope="row">
                          <div className="form-check ">
                            <input className="form-check-input border-secondary" type="radio" value={field.Id}
                              onClick={(ev) => { onUpdateField(ev); store.dispatch(setLocationId(field.ReceivingLocationId)); }}
                              name="TransactionId" id="flexRadioDefault1" />
                          </div>
                        </th>
                        <td>{field.WorkOrderNumber}</td>
                        <td>{field.SerialNumber ?? "Not Available"}</td>
                        <td>{field.PartName}</td>
                        <td>{field.ReturnedPartType}</td>
                        <td>{field.ReceivingLocation}</td>
                        <td>{field.ReturnInitiatedBy}</td>
                        <td>{formatDate(field.ReturnInitiatedOn)}</td>
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
                  {t('partreturn_list_not_found')}
              </div>
            )}
          </div>
      })}
    </>
  );
}