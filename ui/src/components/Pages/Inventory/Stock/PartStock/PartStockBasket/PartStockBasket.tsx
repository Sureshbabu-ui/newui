import { useEffect, useRef, useState } from 'react';
import { store } from '../../../../../../state/store';
import { useStore } from '../../../../../../state/storeHooks';
import { useTranslation } from 'react-i18next';
import { checkForPermission } from '../../../../../../helpers/permissions';
import { clearDeliveryChallan, clearImprestStock, loadPartStockInBasket, setPartStocks, setTransfermode, updateBasketItem, updateErrors, updateErrorsForDc } from './PartStockBasket.slice';
import { getPartStockDetailsInBasket } from '../../../../../../services/partStockDetail';
import { ContainerPage } from '../../../../../ContainerPage/ContainerPage';
import { StockTranferDC } from '../StockManagement/InternalStocktransferDC/StockTransferDC';
import { ImprestStockCustomer } from '../StockManagement/ImprestStockCutomerCreate/ImprestStockCustomer';
import SweetAlert from 'react-bootstrap-sweetalert';

export const PartStockBasketList = () => {
    const { t } = useTranslation();
    const modalRef = useRef<HTMLButtonElement>(null);
    const { partstockbasket: { partStockDetails, PartStockIdList, BasketList, BasketItem, impreststock, deliverychallan, TransferType } } = useStore(({ partstockbasket }) => ({ partstockbasket }));

    useEffect(() => {
        if (BasketItem == true) {
            onLoad()
        }
    }, [BasketItem])

    const onLoad = async () => {
        if (checkForPermission("PARTSTOCK_LIST")) {
            const basketitems = await getPartStockDetailsInBasket(BasketList);
            store.dispatch(loadPartStockInBasket(basketitems));
        }
    }

    const onUpdateField = (ev: any, PartStockId: number) => {
        const checked = ev.target.checked ? true : false;
        if (PartStockIdList.length === 1 && checked == false) {
            setMinExceed(1)
        } else {
            store.dispatch(updateBasketItem({ PartStockId: PartStockId, Action: checked }));
        }

    }

    const onModalClose = () => {
        store.dispatch(setPartStocks(false));
        store.dispatch(updateErrorsForDc({}));
        store.dispatch(updateErrors({}));
        if (deliverychallan.DcTypeId == 0 && impreststock.CustomerId == 0) {
            clearAll()
        }
    }

    const stocktransfertypes = [
        { value: 'STT_ISTR', label: 'Internal Stock Transfer', Description: 'Relocating stock items between various locations within the organization' },
        { value: 'STT_ISCR', label: 'Imprest Stock for Customer', Description: 'Maintaining a predetermined quantity of stock at the customers site or at the customer imprest stock room' }
    ]

    const [confirm, setConfirm] = useState<number>(0)
    const [transportationMode, settransportationMode] = useState<string>('')
    const [minExceed, setMinExceed] = useState(0);

    const ClearDataConformation = () => {
        const { t } = useTranslation();
        return (
            <SweetAlert
                custom
                showCloseButton
                showCancel
                confirmBtnText="Yes"
                cancelBtnText="No"
                confirmBtnBsStyle="primary"
                cancelBtnBsStyle="light"
                title="Are you sure?"
                closeBtnStyle={{ border: "none" }}
                onConfirm={clearAll}
                onCancel={handleCancel}
            >
                Would you like to clear all the entered data?
            </SweetAlert>
        );
    }

    const handleCancel = () => {
        setConfirm(0);
    }

    function clearAll() {
        store.dispatch(setTransfermode(transportationMode))
        store.dispatch(clearDeliveryChallan())
        store.dispatch(clearImprestStock())
        store.dispatch(updateErrorsForDc({}));
        store.dispatch(updateErrors({}));
        setConfirm(0);
    }

    function handleCheckbox(value: string) {
        if (impreststock.CustomerId != 0 || deliverychallan.DcTypeId != 0) {
            setConfirm(1);
            settransportationMode(value)
        }
        else {
            store.dispatch(setTransfermode(value))
            store.dispatch(clearDeliveryChallan())
            store.dispatch(clearImprestStock())
            store.dispatch(updateErrorsForDc({}));
            store.dispatch(updateErrors({}))
        }
    }

    return (
        <>
            {checkForPermission("DELIVERYCHALLAN_CREATE") &&
                <div
                    className="modal fade"
                    id='StockTransfer'
                    data-bs-backdrop='static'
                    data-bs-keyboard='false'
                    aria-hidden='true'
                >
                    <div className="modal-dialog modal-xl">
                        <div className="modal-content">
                            <div className="modal-header mx-3">
                                <h5 className="modal-title app-primary-color">{TransferType == "STT_ISTR" ? (<>{t('deliverychallan_create_main_heading')}</>) : TransferType == "STT_ISCR" ? (<>{t('impreststock_main_heading')}</>) : (<>{t('impreststock_main_heading_manage_stock')}</>)}</h5>
                                <button
                                    type='button'
                                    className="btn-close me-2"
                                    data-bs-dismiss='modal'
                                    id='closeStockTransfer'
                                    onClick={onModalClose}
                                    aria-label='Close'
                                    ref={modalRef}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <ContainerPage>
                                    {partStockDetails.match({
                                        none: () => <div >{t('deliverychallan_partstocklist_loading_message')}</div>,
                                        some: (collection) =>
                                            <div className=" pe-2 mx-0 ps-2">
                                                {collection.length > 0 ? (
                                                    <div className="row" >
                                                        <h6 className='app-primary-color fs-6'>{t('deliverychallan_partstock_details')}</h6>
                                                        <div className='table-responsive overflow-y'>
                                                            <table className="table table-bordered">
                                                                <thead>
                                                                    <tr>
                                                                        <th></th>
                                                                        <th scope="col">{t('deliverychallan_create_partstock_label_slno')}</th>
                                                                        <th scope="col">{t('deliverychallan_create_partstock_label_partcode')}</th>
                                                                        <th scope="col">{t('deliverychallan_create_partstock_label_partname')}</th>
                                                                        <th scope="col">{t('deliverychallan_create_partstock_label_rate')}</th>
                                                                        <th scope='col'>{t('deliverychallan_create_partstock_label_serialno')}</th>
                                                                        <th scope='col'>{t('deliverychallan_create_partstock_label_location')}</th>
                                                                        <th scope='col'>{t('deliverychallan_create_partstock_label_room')}</th>
                                                                        <th scope='col'>{t('deliverychallan_create_partstock_label_bin')}</th>
                                                                    </tr>
                                                                </thead>
                                                                {collection.map((field, index) => (
                                                                    <tbody key={index}>
                                                                        <tr>
                                                                            <td>
                                                                                <input
                                                                                    className={`form-check-input me-2`}
                                                                                    type="checkbox"
                                                                                    onChange={(ev) => { onUpdateField(ev, field.partStockDetail.Id) }}
                                                                                    checked={BasketList.includes(String(field.partStockDetail.Id)) ? true : false}
                                                                                    name="PartStock"
                                                                                />
                                                                            </td>
                                                                            <td scope='row'>{(1 - 1) * 10 + (index + 1)}</td>
                                                                            <td>{field.partStockDetail.PartCode}</td>
                                                                            <td>{field.partStockDetail.PartName}</td>
                                                                            <td>{field.partStockDetail.Rate}</td>
                                                                            <td>{field.partStockDetail.SerialNumber}</td>
                                                                            <td>{field.partStockDetail.OfficeName}</td>
                                                                            <td>{field.partStockDetail.RoomName}</td>
                                                                            <td>{field.partStockDetail.BinName}</td>
                                                                        </tr>
                                                                    </tbody>
                                                                ))}
                                                            </table>
                                                            {minExceed == 1 &&
                                                                <div className="alert alert-danger p-1 ms-2 me-4" role="alert">
                                                                    <div>
                                                                        <span className="material-symbols-outlined align-bottom">warning</span>&nbsp;
                                                                        <span>Atleast one item needs to proceed</span>
                                                                    </div>
                                                                </div>
                                                            }
                                                        </div>
                                                        <div className="row mx-0">
                                                            {stocktransfertypes.map((item) => (
                                                                <div key={item.value} className="pb-2 ps-0">
                                                                    <input
                                                                        type="radio"
                                                                        className={`form-check-input border-secondary`}
                                                                        onChange={(ev) => handleCheckbox(item.value)}
                                                                        value={item.value}
                                                                        checked={TransferType == item.value}
                                                                    />
                                                                    <label className="form-check-label ms-2">{item.label}</label>
                                                                    <div className="form-text mt-0 ps-4"> <span>{item.Description}</span></div>
                                                                </div>
                                                            )
                                                            )}
                                                        </div>
                                                        {/* componet */}
                                                        {TransferType == 'STT_ISTR' ?
                                                            (
                                                                <StockTranferDC />
                                                            ) : TransferType == 'STT_ISCR' &&
                                                            (
                                                                <ImprestStockCustomer />
                                                            )
                                                        }
                                                        {/* componet ends*/}
                                                    </div>
                                                ) : (
                                                    <div className="text-muted ps-3">{t('deliverychallan_create_partstocklistdetail_nodata')}</div>
                                                )}
                                            </div>
                                    })}
                                    {confirm == 1 ? <ClearDataConformation /> : <></>}
                                </ContainerPage>
                            </div>
                        </div>
                    </div >
                </div >
            }
        </>
    )
}