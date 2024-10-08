import { useStoreWithInitializer } from '../../../../../state/storeHooks';
import { useTranslation } from 'react-i18next';
import { Pagination } from '../../../../Pagination/Pagination';
import { formatDate } from '../../../../../helpers/formats';
import { CreateGoodsReceivedNoteState, setLocationId, setVendorId, updateField } from '../CreateGRN/CreateGRN.slice';
import { useEffect } from 'react';
import { startPreloader, stopPreloader } from '../../../../Preloader/Preloader.slice';
import { getAllDeliveryChallans } from '../../../../../services/deliverychallan';
import { changePage, initializeDC, loadDeliverychallans, setSearch } from './DeliveryChallanlist.slice';
import { store } from '../../../../../state/store';
import { checkForPermission } from '../../../../../helpers/permissions';

export function DeliveryChallanList(props: { TransactionTypeCode: string }) {
  const { t, i18n } = useTranslation();
  const { perPage, totalRows, search, currentPage, dclist } = useStoreWithInitializer(({ deliverychallanlist }) => deliverychallanlist, initializeDC);

  const onPageChange = async (index: number) => {
    store.dispatch(changePage(index));
    const dclist = await getAllDeliveryChallans(search, index);
    store.dispatch(loadDeliverychallans(dclist));
  }

  const filterList = async () => {
    store.dispatch(changePage(1))
    const result = await getAllDeliveryChallans(store.getState().deliverychallanlist.search, 1);
    store.dispatch(loadDeliverychallans(result));
  }

  const addData = async (event: any) => {
    store.dispatch(setSearch(event.target.value));
    if (event.target.value == "") {
      store.dispatch(changePage(1))
      const result = await getAllDeliveryChallans(store.getState().deliverychallanlist.search, store.getState().deliverychallanlist.currentPage);
      store.dispatch(loadDeliverychallans(result));
    }
  }

  useEffect(() => {
    onSelectedData();
  }, [props.TransactionTypeCode]);

  const onSelectedData = async () => {
    store.dispatch(startPreloader())
    try {
      const dclist = await getAllDeliveryChallans(search, currentPage);
      store.dispatch(loadDeliverychallans(dclist));
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
      {checkForPermission("DELIVERYCHALLAN_VIEW") && (
        <>
          {dclist.match({
            none: () => <>{t('deliverychallan_list_loadng_message')}</>,
            some: (deliverychallanlist) =>
              <div className="row mx-1 px-0 p-0 mt-2">
                <h6 className="app-primary-color p-0">{t('deliverychallan_list_main_heading')}</h6>
                <div className="input-group mb-2 p-0">
                  <input type='search' className="form-control custom-input " value={search} placeholder={t('deliverychallan_list_search_placeholder') ?? ''} onChange={addData}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        filterList();
                      }
                    }}
                  />
                  <button className="btn app-primary-bg-color text-white float-end" type="button" onClick={filterList}> {t('deliverychallan_list_search')} </button>
                </div>
                {deliverychallanlist.length > 0 ? (
                  <div className='p-0'>
                    <table className="table">
                      <thead>
                        <tr className="border mt-1 mb-1">
                          <th scope="col"></th>
                          <th scope="col">{t('deliverychallan_list_dc_no')}</th>
                          <th scope="col">{t('deliverychallan_list_dc_date')}</th>
                          <th scope="col">{t('deliverychallan_list_dc_type')}</th>
                          <th scope="col">{t('deliverychallan_list_issued_employee')}</th>
                          <th scope="col">{t('deliverychallan_list_source_location')}</th>
                          <th scope="col">{t('deliverychallan_list_destination')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {deliverychallanlist.map((field, index) => (
                          <tr className="border mt-1 mb-1  pb-1">
                            <th scope="row">
                              <div className="form-check">
                                <input className="form-check-input border-secondary" type="radio" value={field.Id}
                                  onClick={(ev) => {
                                    onUpdateField(ev); store.dispatch(setLocationId(field.SourceTenantOfficeId));
                                  }} name="TransactionId" id="flexRadioDefault1" />
                              </div>
                            </th>
                            <td>{field.DcNumber}</td>
                            <td>{formatDate(field.DcDate)}</td>
                            <td>{field.DcType}</td>
                            <td>{field.IssuedEmployee}</td>
                            <td>{field.SourceTenantOffice}</td>
                            {field.DcTypeCode == "DCN_VNDR" ? (
                              <td>{field.DestinationVendor}</td>
                            ) : field.DcTypeCode == "DCN_ITRN" ? (
                              <td>{field.DestinationTenantOffice}</td>
                            ) : field.DcTypeCode == "DCN_ENGR" &&
                            <td>{field.DestinationEmployee}</td>}
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
                    {t('deliverychallan_list_no_records')}
                  </div>
                )}
              </div>
          })}
        </>
      )
      }
    </>
  );
}