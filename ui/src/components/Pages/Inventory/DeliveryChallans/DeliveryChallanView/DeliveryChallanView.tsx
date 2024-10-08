import { useTranslation } from "react-i18next";
import { useStoreWithInitializer } from "../../../../../state/storeHooks";
import { dispatchOnCall, store } from "../../../../../state/store";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { initializeDeliveryChallanInfo, loadSelectedDC } from "./DeliveryChallanView.slice";
import { getDeliveryChallanDetails } from "../../../../../services/deliverychallan";
import BreadCrumb from "../../../../BreadCrumbs/BreadCrumb";
import { formatDate, formatDateTime } from "../../../../../helpers/formats";
import { checkForPermission } from "../../../../../helpers/permissions";

export function DeliveryChallanView() {
    const { t, i18n } = useTranslation();
    const { dcdetails } = useStoreWithInitializer(({ deliverychallandetail }) => deliverychallandetail, dispatchOnCall(initializeDeliveryChallanInfo()));

    const { DCId } = useParams<{ DCId: string }>();

    useEffect(() => {
        onLoad(Number(DCId));
    }, [DCId]);

    async function onLoad(DCId: number) {
        store.dispatch(initializeDeliveryChallanInfo());
        try {
            const result = await getDeliveryChallanDetails(DCId);
            store.dispatch(loadSelectedDC(result));
        } catch (error) {
            console.error(error);
        }
    }

    const breadcrumbItems = [
        { Text: 'breadcrumbs_home', Link: '/' },
        { Text: 'breadcrumbs_delivery_challans', Link: '/logistics/deliverychallans' },
        { Text: 'breadcrumbs_delivery_challans_view' }
    ];

    return (
        <>
            <BreadCrumb items={breadcrumbItems} />
            {checkForPermission('DELIVERYCHALLAN_VIEW') && (
                <div className="row mx-2 mt-4">
                    {/* col-1 */}
                    <div className="col-md-4">
                        <div className="pt-2">
                            <label className="form-text">{t('delivery_challan_dcnumber')}</label>
                            <div >{dcdetails.DcNumber}</div>
                        </div>
                        <div className="pt-2">
                            <label className="form-text">{t('delivery_challan_dcdate')}</label>
                            <div >{formatDateTime(dcdetails.DcDate)}</div>
                        </div>
                        <div className="pt-2">
                            <label className="form-text">{t('delivery_challan_dctype')}</label>
                            <div >{dcdetails.DcType}</div>
                        </div>
                        {dcdetails.PartIndentDemandNumber &&
                            <div className="pt-2">
                                <label className="form-text">{t('delivery_challan_demand_no')}</label>
                                <div >{dcdetails.PartIndentDemandNumber}</div>
                            </div>
                        }
                        <div className="pt-2">
                            <label className="form-text">{t('delivery_challan_source_tenantoffice')}</label>
                            <div >{dcdetails.SourceTenantOffice}</div>
                        </div>
                        <div className="pt-2">
                            <label className="form-text">{t('delivery_challan_issued_employee')}</label>
                            <div >{dcdetails.IssuedEmployee}</div>
                        </div>
                        {dcdetails.DcTypeCode == "DCN_ITRN" ? (
                            <div className="pt-2">
                                <label className="form-text">{t('delivery_challan_destination_tenantoffice')}</label>
                                <div >{dcdetails.DestinationTenantOffice}</div>
                            </div>
                        ) : dcdetails.DcTypeCode == "DCN_VNDR" ? (
                            <div className="pt-2">
                                <label className="form-text">{t('delivery_challan_destination_vendor')}</label>
                                <div >{dcdetails.DestinationVendor}</div>
                            </div>
                        ) : dcdetails.DcTypeCode == "DCN_ENGR" &&
                        <div className="pt-2">
                            <label className="form-text">{t('delivery_challan_destination_employee')}</label>
                            <div >{dcdetails.DestinationEmployee}</div>
                        </div>
                        }
                        <div className="pt-2">
                            <label className="form-text">{t('delivery_challan_logistics_vendor')}</label>
                            <div >{dcdetails.LogisticsVendor ?? "---"}</div>
                        </div>
                        <div className="pt-2">
                            <label className="form-text">{t('delivery_challan_logistics_receipt_no')}</label>
                            <div >{dcdetails.LogisticsReceiptNumber ?? "---"}</div>
                        </div>
                        <div className="pt-2">
                            <label className="form-text">{t('delivery_challan_logistics_receipt_date')}</label>
                            <div >{dcdetails.LogisticsReceiptDate ? formatDate(dcdetails.LogisticsReceiptDate) : "---"}</div>
                        </div>
                        <div className="pt-2">
                            <label className="form-text">{t('delivery_challan_mode_of_transport')}</label>
                            <div >{dcdetails.ModeOfTransport ?? "---"}</div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}