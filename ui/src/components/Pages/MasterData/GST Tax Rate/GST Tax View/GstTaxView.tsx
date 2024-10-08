import { useTranslation } from "react-i18next";
import { useStoreWithInitializer } from "../../../../../state/storeHooks";
import { initializeGstTaxRateView } from "./GstTaxView.slice";


const GstTaxView = () => {

    const { t } = useTranslation();
    const { selectedGstTaxRate } = useStoreWithInitializer(
        ({ gsttaxview }) => gsttaxview, initializeGstTaxRateView);

    return (
        <>
            <div className="modal fade" id="exampleModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{t('gst_tax_rate_title')}</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        {selectedGstTaxRate.Id !== 0 && (
                            <div className="modal-body">
                                    <div className=" mt-1 mb-3 m-0 ">
                                        <div className="text-dark">
                                            <div className="mb-2 mt-1">
                                                <label className="form-text">{t('gst_tax_rate_table_service_name')}</label>
                                                <div>{selectedGstTaxRate.TenantServiceName || "N/A"}</div>
                                            </div>
                                            <div className="mb-2 mt-2">
                                                <label className="form-text">{t('gst_tax_rate_table_service_code')}</label>
                                                <div>{selectedGstTaxRate.TenantServiceCode || "N/A"}</div>
                                            </div>
                                            <div className="mb-2 mt-2">
                                                <label className="form-text">{t('gst_tax_rate_table_service_account_code')}</label>
                                                <div>{selectedGstTaxRate.ServiceAccountCode || "N/A"}</div>
                                            </div>
                                            <div className="mb-2 mt-2">
                                                <label className="form-text">{t('gst_tax_rate_table_service_account_description')}</label>
                                                <div>{selectedGstTaxRate.ServiceAccountDescription || "N/A"}</div>
                                            </div>
                                            <div className="mb-2 mt-2">
                                                <label className="form-text">{t('gst_tax_rate_table_cgst')}</label>
                                                <div>{selectedGstTaxRate.Cgst || "N/A"}</div>
                                            </div>
                                            <div className="mb-2 mt-2">
                                                <label className="form-text">{t('gst_tax_rate_table_sgst')}</label>
                                                <div>{selectedGstTaxRate.Sgst || "N/A"}</div>
                                            </div>
                                            <div className="mb-2 mt-2">
                                                <label className="form-text">{t('gst_tax_rate_table_igst')}</label>
                                                <div>{selectedGstTaxRate.Igst || "N/A"}</div>
                                            </div>
                                            <div className="mb-2 mt-2">
                                                <label className="form-text">{t('gst_tax_rate_table_isactive')}</label>
                                                <div>{selectedGstTaxRate.IsActive ? "Active" : "Inactive"}</div>
                                            </div>
                                        </div>
                                    </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </>

    )
}

export default GstTaxView