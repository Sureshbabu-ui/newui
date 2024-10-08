import { useEffect, useState } from 'react';
import { store } from '../../../../../../state/store';
import { useStore, useStoreWithInitializer } from '../../../../../../state/storeHooks';
import { ContainerPage } from '../../../../../ContainerPage/ContainerPage';
import { Pagination } from '../../../../../Pagination/Pagination';
import { useTranslation } from 'react-i18next';
import BreadCrumb from '../../../../../BreadCrumbs/BreadCrumb';
import { changePage, initializePartStockDetailsList, loadPartStockDetails, setStockDetailSearch } from './PartStockDetailList.slice';
import { getPartStockDetailList } from '../../../../../../services/partStockDetail';
import { checkForPermission } from '../../../../../../helpers/permissions';
import { useLocation } from 'react-router-dom';
import { formatCurrency } from '../../../../../../helpers/formats';
import { setPart, setPartStocks, updateBasketItem } from '../../PartStock/PartStockBasket/PartStockBasket.slice';
import { PartStockBasketList } from '../../PartStock/PartStockBasket/PartStockBasket';

const PartStockDetailList = (props: {
    PartId?: string | null,
    RenderType?: string,
    search?: string | null
}) => {
    const { t } = useTranslation();
    const renderType = props.RenderType ?? 'fullview';
    const location = useLocation();

    // Access the search property from the location object
    const queryString = location.search;

    // Use URLSearchParams to parse the query string
    const queryParams = new URLSearchParams(queryString);
    const [partId, setPartId] = useState(props.PartId || queryParams.get('partid'))

    const { partstockdetaillist: { partStockDetails, totalRows, currentPage, perPage, search }, partstockbasket: { BasketList } } = useStore(({ partstockdetaillist, partstockbasket }) => ({ partstockdetaillist, partstockbasket }));

    const searchValue = props.search ?? search;

    const breadcrumbItems = () => {
        return [
            { Text: 'breadcrumbs_home', Link: '/' },
            { Text: 'breadcrumbs_manage_partstocklist', Link: '/inventory/partstock' },
            { Text: 'breadcrumbs_manage_partstocklistdetail' }
        ];
    }

    const handleBasketItemsModal = () => {
        store.dispatch(setPartStocks(true))
        document.getElementById("offcanvasPartStocks")?.click();
    };

    useEffect(() => {
        fetchCollectionList()
        { renderType == 'fullview' }
    }, [partId, renderType])

    const fetchCollectionList = async () => {
        try {
            if (checkForPermission("PARTSTOCK_LIST")) {
                const collections = await getPartStockDetailList(partId ?? null, searchValue, currentPage);
                store.dispatch(loadPartStockDetails(collections));
            }
        }
        catch (error) {
            console.error(error);
        }
    }

    const onPageChange = async (index: number) => {
        store.dispatch(changePage(index));
        const collections = await getPartStockDetailList(partId ?? null, searchValue, index);
        store.dispatch(loadPartStockDetails(collections));
    }

    const filterPartStockDetailList = async () => {
        await store.dispatch(changePage(1));
        fetchCollectionList()
    }

    const addData = async (event: any) => {
        store.dispatch(setStockDetailSearch(event.target.value));
    }

    useEffect(() => {
        if (search == "") {
            fetchCollectionList()
        }
    }, [search])

    const onUpdateField = (ev: any, PartStockId: number) => {
        const checked = ev.target.checked ? true : false;
        store.dispatch(updateBasketItem({ PartStockId: PartStockId, Action: checked }));
    }

    return (
        <ContainerPage>
            {renderType == 'fullview' ? <BreadCrumb items={breadcrumbItems()} /> : <></>}
            <div>
                {checkForPermission("PARTSTOCK_LIST") &&
                    <div>
                        {partStockDetails.match({
                            none: () => <div >{t('partstocklist_loading_message')}</div>,
                            some: (collection) =>
                                <div className='mx-2'>
                                    {/* search */}
                                    <div className="row">
                                        <div className={`${renderType == "compact" ? "sticky-top pt-2 mx-2 px-0 pe-4 position-absolute mt-5" : ""}`}>
                                            <div className={`input-group ${renderType == "compact" ? "pe-2" : ""}`}>
                                                <input type='search' className="form-control custom-input" value={search ?? ''} placeholder={t('partstocklistdetail_placeholder_search') ?? ''} onChange={addData}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            filterPartStockDetailList();
                                                        }
                                                    }} />
                                                <button className="btn app-primary-bg-color text-white text-center col-md-1 d-flex justify-content-center" type="button" onClick={filterPartStockDetailList}>
                                                    {renderType == 'fullview' ? (t('partstocklistdetail_button_search')) :
                                                        <span className="material-symbols-outlined align-middle"> search </span>
                                                    }
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    {/* search ends */}

                                    {collection.length > 0 ? (
                                        <div className="row mt-3" >
                                            <div>
                                                {collection.map((field, index) => (
                                                    <div className="row m-0 mb-2 ps-0 border-bottom py-2" key={index}>
                                                        {(checkForPermission("DELIVERYCHALLAN_CREATE") && checkForPermission("IMPRESTSTOCK_MANAGE")) && (
                                                            <>
                                                                {field.partStockDetail.RoomName == "S6" ?
                                                                    <div className='col-md-1 pt-2 px-0'><input
                                                                        className={`form-check-input border border-secondary me-2`}
                                                                        type="checkbox"
                                                                        onChange={(ev) => { onUpdateField(ev, field.partStockDetail.Id) }}
                                                                        checked={BasketList.includes(String(field.partStockDetail.Id)) ? true : false}
                                                                        name="PartStock"
                                                                    />
                                                                    </div> : <div className='col-md-1 pt-2 px-0'></div>

                                                                }
                                                            </>
                                                        )
                                                        }
                                                        {/* part details */}
                                                        <div className="col-md-10">
                                                            <div className="row">
                                                                <div className="small">{field.partStockDetail.PartCode}</div>
                                                                <div className="small fw-bold">{field.partStockDetail.PartName}</div>
                                                                <div className="small">{field.partStockDetail.SerialNumber}</div>
                                                                <div className='form-text'>{field.partStockDetail.OfficeName} <span className="mx-3">{field.partStockDetail.RoomName}</span><span>{field.partStockDetail.BinName}</span></div>
                                                            </div>
                                                        </div>
                                                        {/* part details ends */}

                                                        <div className="col-md-1 d-flex flex-row-reverse px-0">
                                                            <div className="text-size-11 text-muted fw-bold">{t('partstocklistdetail_rate')}<span className="ms-1">{formatCurrency(field.partStockDetail.Rate)}</span></div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="m-0">
                                                <Pagination currentPage={currentPage} count={totalRows} itemsPerPage={perPage} onPageChange={onPageChange} />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-muted p-4">{t('partstocklistdetail_nodata')}</div>
                                    )}
                                    {renderType == 'fullview' &&
                                        <>
                                            {store.getState().partstockbasket.BasketList.length > 0 &&
                                                <button
                                                    type='button'
                                                    onClick={handleBasketItemsModal} data-bs-toggle="modal" data-bs-target="#StockTransfer"
                                                    className='sticky-bottom btn app-primary-bg-color text-white mt-3 mb-1 w-100'
                                                >
                                                    {t('partstocklist_go_to_cart')}
                                                </button>
                                            }
                                        </>
                                    }
                                </div>
                        }
                        )}
                    </div>
                }
                <PartStockBasketList />
            </div>
        </ContainerPage>
    )
}
export default PartStockDetailList