import { useTranslation } from "react-i18next";
import { useStoreWithInitializer } from "../../../../../state/storeHooks";
import { dispatchOnCall, store } from "../../../../../state/store";
import { formatCurrency, formatDateTime } from "../../../../../helpers/formats";
import { checkForPermission } from "../../../../../helpers/permissions";
import { initializePurchaseOrder } from "./PurchaseOrderView.slice";

export function PurchaseOrderView() {
    const { t, i18n } = useTranslation();
    const { podetails } = useStoreWithInitializer(({ purchaseorderdetail }) => purchaseorderdetail, dispatchOnCall(initializePurchaseOrder()));

    const onModalClose = () => {
        store.dispatch(initializePurchaseOrder());
    }

    return (
        <>
            {checkForPermission('PURCHASEORDER_VIEW') && (
                <div
                    className="modal fade"
                    id='PurchaseOrder'
                    data-bs-backdrop='static'
                    data-bs-keyboard='false'
                    aria-hidden='true'
                >
                    <div className="modal-dialog modal-xl">
                        <div className="modal-content">
                            <div className="modal-header mx-2">
                                <h5 className="modal-title app-primary-color ms-4 text-bold">{t('purchase_order_view_main_heading')}</h5>

                                <button
                                    type='button'
                                    className="btn-close"
                                    data-bs-dismiss='modal'
                                    id='closePurchaseOrder'
                                    aria-label='Close'
                                    onClick={onModalClose}
                                ></button>
                            </div>
                            <div className="modal-body pt-0">
                                {podetails.match({
                                    none: () => <>{t('po_list_loading')}</>,
                                    some: (purchaseorders) =>
                                        <>
                                            {purchaseorders.length > 0 ?
                                                <>
                                                    {purchaseorders.map((field, index) => (
                                                        <div className="row mx-2 mt-4 border-bottom pb-2">
                                                            {/* col-1 */}
                                                            <div className="col-md-6">
                                                                <div className="pt-2">
                                                                    <label className="form-text">{t('purchase_order_view_ponumber')}</label>
                                                                    <div >{field.PoNumber}</div>
                                                                </div>
                                                                <div className="pt-2">
                                                                    <label className="form-text">{t('purchase_order_view_podate')}</label>
                                                                    <div >{formatDateTime(field.PoDate)}</div>
                                                                </div>
                                                                <div className="pt-2">
                                                                    <label className="form-text">{t('purchase_order_view_tenantoffice')}</label>
                                                                    <div >{field.TenantOffice}</div>
                                                                </div>
                                                                <div className="pt-2">
                                                                    <label className="form-text">{t('purchase_order_view_vendor')}</label>
                                                                    <div >{field.Vendor}</div>
                                                                </div>
                                                                <div className="pt-2">
                                                                    <label className="form-text">{t('purchase_order_view_billtolocation')}</label>
                                                                    <div >{field.BillToTenantOffice}</div>
                                                                </div>
                                                                <div className="pt-2">
                                                                    <label className="form-text">{t('purchase_order_view_billtoaddress')}</label>
                                                                    <div >{field.BillToAddress}</div>
                                                                </div>
                                                                <div className="pt-2">
                                                                    <label className="form-text">{t('purchase_order_view_shiptolocation')}</label>
                                                                    <div >{field.ShipToTenantOffice}</div>
                                                                </div>
                                                                <div className="pt-2">
                                                                    <label className="form-text">{t('purchase_order_view_shiptoaddress')}</label>
                                                                    <div >{field.ShipToAddress}</div>
                                                                </div>
                                                                <div className="pt-2">
                                                                    <label className="form-text">{t('purchase_order_view_price')}</label>
                                                                    <div >{formatCurrency(field.Price)}</div>
                                                                </div>

                                                            </div>
                                                            {/* col-1 ends*/}
                                                            {/* col-2*/}
                                                            <div className="col-md-6">
                                                                <div className="pt-2">
                                                                    <label className="form-text">{t('purchase_order_view_postatus')}</label>
                                                                    <div >{field.PoStatus}</div>
                                                                </div>
                                                                <div className="pt-2">
                                                                    <label className="form-text">{t('purchase_order_view_cgst')}</label>
                                                                    <div >{field.CgstRate}</div>
                                                                </div>
                                                                <div className="pt-2">
                                                                    <label className="form-text">{t('purchase_order_view_sgst')}</label>
                                                                    <div >{field.SgstRate}</div>
                                                                </div>
                                                                <div className="pt-2">
                                                                    <label className="form-text">{t('purchase_order_view_igst')}</label>
                                                                    <div >{field.IgstRate}</div>
                                                                </div>
                                                                <div className="pt-2">
                                                                    <label className="form-text">{t('purchase_order_view_partname')}</label>
                                                                    <div >{field.PartName}</div>
                                                                </div>
                                                                <div className="pt-2">
                                                                    <label className="form-text">{t('purchase_order_view_poparttype')}</label>
                                                                    <div >{field.PoPartType}</div>
                                                                </div>
                                                                <div className="pt-2">
                                                                    <label className="form-text">{t('purchase_order_view_quantity')}</label>
                                                                    <div >{field.Quantity ?? 0}</div>
                                                                </div>
                                                                {field.GrnReceivedQuantity > 0 &&
                                                                    <div className="pt-2">
                                                                        <label className="form-text">{t('purchase_order_view_grnquantity')}</label>
                                                                        <div >{field.GrnReceivedQuantity}</div>
                                                                    </div>
                                                                }
                                                                {field.IndentRequestNumber &&
                                                                    <div className="pt-2">
                                                                        <label className="form-text">{t('purchase_order_view_indentrequetnumber')}</label>
                                                                        <div >{field.IndentRequestNumber}</div>
                                                                    </div>
                                                                }
                                                            </div>
                                                            {/* col-2 ends*/}
                                                        </div>
                                                    ))}
                                                </> :
                                                <>{t('purchase_order_no_data')}</>
                                            }
                                        </>
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}