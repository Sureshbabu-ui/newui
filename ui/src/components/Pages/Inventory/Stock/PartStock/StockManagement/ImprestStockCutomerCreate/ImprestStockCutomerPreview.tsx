import { t } from "i18next";
import { store } from "../../../../../../../state/store";
import { useStore } from "../../../../../../../state/storeHooks";
import { setProceedToPreview } from "./ImprestStockCustomer.slice";

export const ImprestStockCustomerPreview = () => {
    const { partstockbasket: { ReserveLocation, impreststock, deliverychallan } } = useStore(({ partstockbasket }) => ({ partstockbasket }));
    const { impreststockcustomer: { CustomerNames, masterDataList, VendorNames, ServiceEngineers, ContractNumbers, CustomerSiteNames } } = useStore(({ impreststockcustomer }) => ({ impreststockcustomer }));

    const proceedButton = async () => {
        store.dispatch(setProceedToPreview(false))
    }

    return (
        <div className="row bg-light mt-2 mx-0 p-0">
            <h6 className="pt-2 app-primary-color fw-bold">{t('impreststock_create_stock_detail')}</h6>
            <div className="row mx-0">
                <div className="col-md-6 p-0">
                    <label className="mt-2 text-muted">{t('impreststock_create_label_customer_name')}</label>
                    <div className="">
                        {CustomerNames.find(option => option.value === impreststock.CustomerId)?.label ?? "---"}
                    </div>
                </div>
                <div className="col-md-6 p-0">
                    <label className="mt-2 text-muted">{t('impreststock_create_label_contract_number')}</label>
                    <div className="">
                        {ContractNumbers.find(option => option.value === impreststock.ContractId)?.label ?? "---"}
                    </div>
                </div>
            </div>
            <div className="row mx-0">
                <div className="col-md-6 p-0">
                    <label className="text-muted mt-2">{t('impreststock_create_reserve_location')}</label>
                    <div>{ReserveLocation == "RLN_LGST" ? <>{t('impreststock_create_at_location')}</> : ReserveLocation == "RLN_CSMR" ? <>{t('impreststock_create_at_site')}</> : "---"}</div>
                </div>
                {ReserveLocation == "RLN_CSMR" &&
                    <div className="col-md-6 p-0">
                        <label className="mt-2 text-muted">{t('impreststock_create_label_contract_customer_site_name')}</label>
                        <div className=""> {CustomerSiteNames.find(option => option.value == impreststock.CustomerSiteId)?.label ?? "---"}</div>
                        {CustomerSiteNames.length > 0 && (
                            <div className="mt-1">
                                {(CustomerSiteNames.filter((value) => (value.value == impreststock.CustomerSiteId))).length > 0
                                    ? `Address : ${(CustomerSiteNames.filter((value) => (value.value == impreststock.CustomerSiteId)))[0].code || t('impreststock_create_address_not_available')}`
                                    : ''}
                            </div>
                        )}
                    </div>
                }
            </div>
            <div className="row mx-0">
                {/* from date */}
                <div className='col-md-6 ps-0'>
                    <div className="">
                        <label className="mt-2 text-muted">{t('impreststock_create_label_reservedfrom')}</label>
                        <div >{impreststock.ReservedFrom ? impreststock.ReservedFrom : "---"}</div>
                    </div>
                </div>
                {/* from date ends */}
                {/* to date */}
                <div className='col-md-6 ps-0'>
                    <div className="">
                        <label className="mt-2 text-muted">{t('impreststock_create_label_reservedto')}</label>
                        <div > {impreststock.ReservedTo ? impreststock.ReservedTo : "---"}</div>
                    </div>
                </div>
                {/* to date ends */}
            </div>
            <div className='col-md-12'>
                <label className="mt-2 ">{t('impreststock_create_label_remarks')}</label>
                <div>{impreststock.Remarks ? impreststock.Remarks : "---"}</div>
            </div>
            <div className="row mx-0">
                <div className="col-md-6 p-0">
                    {impreststock.IsbyCourier != "" && <label className="text-muted mt-2">{t('impreststock_create_label_transmode')}</label>}
                    <div> {impreststock.IsbyCourier == "ISC_BHND" ? <>{t('impreststock_create_label_transtype_byhand')}</> : impreststock.IsbyCourier == "ISC_BCER" && <>{t('impreststock_create_label_transtype_bycourier')}</>}</div>
                </div>
                {impreststock.IsbyCourier == "ISC_BHND" ? <>
                    <div className="col-md-6 p-0">
                        <label className="mt-2 text-muted">{t('impreststock_create_label_se')}</label>
                        <div className=""> {ServiceEngineers.find(option => option.value == impreststock.ServiceEngineerId)?.label}</div>
                        {ServiceEngineers.length > 0 && (
                            <div className="mt-1">
                                {(ServiceEngineers.filter((value) => (value.value == impreststock.ServiceEngineerId))).length > 0
                                    ? `Address : ${(ServiceEngineers.filter((value) => (value.value == impreststock.ServiceEngineerId)))[0].code || t('impreststock_create_address_not_available')}`
                                    : ''}
                            </div>
                        )}
                    </div>
                </> : impreststock.IsbyCourier == "ISC_BCER" &&
                <>
                    <div className="col-md-6 p-0">
                        <label className="mt-2 text-muted">{t('impreststock_create_label_transto')}</label>
                        <div className=""> {masterDataList.DCType.find(option => option.value == deliverychallan.DcTypeId)?.label}</div>
                    </div>
                    {deliverychallan.DCTypeCode == "DCN_ENGR" &&
                        <div className="col-md-6 p-0">
                            <label className="mt-2 text-muted">{t('deliverychallan_create_destination_engid')}</label>
                            <div className=""> {ServiceEngineers.find(option => option.value == deliverychallan.DestinationEmployeeId)?.label}</div>
                            {ServiceEngineers.length > 0 && (
                                <div className="mt-1">
                                    {(ServiceEngineers.filter((value) => (value.value == deliverychallan.DestinationEmployeeId))).length > 0
                                        ? `Address : ${(ServiceEngineers.filter((value) => (value.value == deliverychallan.DestinationEmployeeId)))[0].code || t('impreststock_create_address_not_available')}`
                                        : ''}
                                </div>
                            )}
                        </div>
                    }
                    <div className="row m-0 p-0">
                        <div className="col-md-6 p-0">
                            <label className="mt-2 text-muted">{t('deliverychallan_create_logistics_vendor')}</label>
                            <div >{VendorNames.find((option) => option.value === deliverychallan.LogisticsVendorId)?.label ?? "---"}</div>
                            {(VendorNames.length > 0 &&
                                <div className="mt-1">
                                    {(VendorNames.filter((value) => (value.value == deliverychallan.LogisticsVendorId)
                                    )).length > 0 ? `Address : ${(VendorNames.filter((value) => (value.value == deliverychallan.LogisticsVendorId)
                                    ))[0].code}` : ''}
                                </div>
                            )}
                        </div>
                        <div className='col-md-6 p-0'>
                            <label className="mt-2 text-muted">{t('deliverychallan_create_logistics_receipt_no')}</label>
                            <div>{deliverychallan.LogisticsReceiptNumber ? deliverychallan.LogisticsReceiptNumber : "---"}</div>
                        </div>
                        <div className='col-md-6 p-0'>
                            <label className='mt-2 text-muted'>{t('deliverychallan_create_logistics_receipt_date')}</label>
                            <div >{deliverychallan.LogisticsReceiptDate ? deliverychallan.LogisticsReceiptDate : "---"}</div>
                        </div>
                        <div className="mb-2 col-md-6 p-0">
                            <label className="mt-2 text-muted">{t('deliverychallan_create_modeof_transport')}</label>
                            <div>{store.getState().impreststockcustomer.masterDataList.TransportationMode.find(option => option.value == deliverychallan.ModeOfTransport)?.label ?? "---"}</div>
                        </div>
                        <div className="col-md-6 p-0">
                            <label className="mt-2 text-muted">{t('deliverychallan_create_trackingid')}</label>
                            <div>{deliverychallan.TrackingId ? deliverychallan.TrackingId : "---"}</div>
                        </div>
                    </div>
                </>
                }
            </div>
            <div className="mt-2 p-0">
                <button className="btn app-primary-bg-color text-white float-end" type="button" onClick={proceedButton}>
                    <span className="material-symbols-outlined align-middle pe-1">arrow_back</span> {t('impreststock_create_back')}
                </button>
            </div>
        </div>
    )
}