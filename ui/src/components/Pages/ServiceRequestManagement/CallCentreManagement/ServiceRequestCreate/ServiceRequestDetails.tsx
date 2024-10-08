import { ServiceRequestAsset } from '../../../../../types/serviceRequest'
import { PartsExclusions } from '../../../../PartsExclusions/PartsExclusions'
import { formatDate } from '../../../../../helpers/formats'
import { useTranslation } from 'react-i18next'
import { masterDataList } from './ServiceRequestCreate.slice'
import { store } from '../../../../../state/store'
import PreviousTicketsList from '../../CallCordinatorManagement/CallCordinatorView/Submenu/PreviousTickets/PreviousServiceRequests/PreviousTicketList'

const ServiceRequestDetails = ({ asset, assetDetails }: { asset: ServiceRequestAsset, assetDetails: masterDataList }) => {
    const { t } = useTranslation();     
    return (
        <div className="col-md-6">
            <div className="mb-3  p-0">
                <div className="row">
                    <div className="col-md-12">
                        <div className="row  ">

                            {store.getState().servicerequestcreate.searchStatus == true && asset.Id!==null ? (
                                <div className="accordion py-4" id="accordionExample">
                                    <div className="accordion-item">
                                        <h2 className="accordion-header" id="headingOne">
                                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                                Asset Details
                                            </button>
                                        </h2>
                                        <div id="collapseOne" className="accordion-collapse collapse " aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                                            <div className="accordion-body">
                                                <div className="row mx-4">
                                                    <div className="col md-6">
                                                        <div className="row pt-2">
                                                            <label className="form-text">{t('service_request_create_radio_accel_asset_id')}</label>
                                                            <div >{asset.MspAssetId ? asset.MspAssetId : "---"}</div>
                                                        </div>
                                                        <div className="row pt-2">
                                                            <label className="form-text">{t('service_request_create_radio_assetserialnumber')}</label>
                                                            <div >{asset.ProductSerialNumber ? asset.ProductSerialNumber : "---"}</div>
                                                        </div>
                                                        <div className="row pt-2">
                                                            <label className="form-text">{t('create_assets_label_asset_category')}</label>
                                                            <div >{(assetDetails.CategoryNames.find(option => option.value == asset.ProductCategoryId) || {}).label ? (assetDetails.CategoryNames.find(option => option.value == asset.ProductCategoryId) || {}).label : "---"}</div>
                                                        </div>
                                                        <div className="row pt-2">
                                                            <label className="form-text">{t('create_assets_label_asset_warranty_end_date')}</label>
                                                            <div >{asset.WarrantyEndDate ? formatDate(asset.WarrantyEndDate) : "---"}</div>
                                                        </div>
                                                    </div>
                                                    <div className="col md-6">
                                                        <div className="row pt-2">
                                                            <label className="form-text">{t('service_request_create_radio_customer_asset_id')}</label>
                                                            <div >{asset.CustomerAssetId ? asset.CustomerAssetId : "---"}</div>
                                                        </div>
                                                        <div className="row pt-2">
                                                            <label className="form-text">{t('create_assets_label_asset_make')}</label>
                                                            <div >{(assetDetails.MakeNames.find(option => option.value == asset.ProductMakeId) || {}).label ? (assetDetails.MakeNames.find(option => option.value == asset.ProductMakeId) || {}).label : "---"}</div>
                                                        </div>
                                                        <div className="row pt-2">
                                                            <label className="form-text">{t('create_assets_label_asset_model')}</label>
                                                            <div >{(assetDetails.ModelNames.find(option => option.value == asset.ProductModelNumber) || {}).label ? (assetDetails.ModelNames.find(option => option.value == asset.ProductModelNumber) || {}).label : "---"}</div>
                                                        </div>
                                                        <div className="row pt-2">
                                                            <label className="form-text">{t('create_assets_label_asset_preamc_status')}</label>
                                                            {asset.Id != 0 ? (
                                                                <div >{asset.IsPreAmcCompleted ? t("create_assets_label_preamc_status_value_preamc_done") : t("create_assets_label_preamc_status_value_preamc_pending")}</div>
                                                            ) : "---"}
                                                        </div>
                                                    </div>
                                                </div>
                                                {asset.ProductCategoryId > 0 && asset?.ContractId !== null && (
                                                    <div className="row mb-3 mt-0 pt-0 mx-4">
                                                        <PartsExclusions ContractId={asset?.ContractId} ProductCategoryId={asset.ProductCategoryId} View="pills" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="accordion-item">
                                        <h2 className="accordion-header" id="headingTwo">
                                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="true" aria-controls="collapseTwo">
                                                Previous Tickets
                                            </button>
                                        </h2>
                                        <div id="collapseTwo" className="accordion-collapse collapse " aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                                            <div className="accordion-body">
                                                <div className="row ">
                                                    <>
                                                        {asset.Id !== null && (
                                                            <div className="row  mt-0">
                                                                <div className="row  me-0 ms-0">
                                                                    <PreviousTicketsList ContractAssetId={asset.Id} Show={false} View="view" />
                                                                </div>
                                                            </div>
                                                        )}
                                                    </>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="accordion-item">
                                        <h2 className="accordion-header" id="headingThree">
                                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseContractDetils" aria-expanded="true" aria-controls="collapseTwo">
                                                Contract Details
                                            </button>
                                        </h2>
                                        <div id="collapseContractDetils" className="accordion-collapse collapse " aria-labelledby="headingThree" data-bs-parent="#accordionExample">
                                            <div className="accordion-body">
                                                <div className="row mx-4">

                                                    <div className="col md-6">
                                                        <div className="row pt-2">
                                                            <label className="form-text">{t('service_request_create_label_contract_number')}</label>
                                                            <div>{asset.ContractNumber ? asset.ContractNumber : "---"}</div>
                                                        </div>
                                                        <div className="row pt-2">
                                                            <label className="form-text">{t('service_request_create_label_agreement_type')}</label>
                                                            <div>{asset.AgreementType ? asset.AgreementType : "---"}</div>
                                                        </div>
                                                        <div className="row pt-2">
                                                            <label className="form-text">{t('service_request_create_label_service_mode')}</label>
                                                            <div >{asset.ServiceMode ? asset.ServiceMode : "---"}</div>
                                                        </div>
                                                        <div className="row pt-2">
                                                            <label className="form-text">{t('service_request_create_label_tenent_office')}</label>
                                                            <div>{asset.Location ? asset.Location : "---"}</div>
                                                        </div>
                                                    </div>
                                                    <div className="col md-6">
                                                        <div className="row pt-2">
                                                            <label className="form-text">{t('service_request_create_label_contract_end_date')}</label>
                                                            <div>{asset.EndDate ? formatDate(asset.EndDate) : "---"}</div>
                                                        </div>
                                                        <div className="row pt-2">
                                                            <label className="form-text">{t('service_request_create_label_call_expiry')}</label>
                                                            <div >{asset.CallExpiryDate ? formatDate(asset.CallExpiryDate) : "---"}</div>
                                                        </div>
                                                        <div className="row pt-2">
                                                            <label className="form-text">{t('service_request_create_label_call_stop_date')}</label>
                                                            <div >{asset.CallStopDate ? formatDate(asset.CallStopDate) : "---"}</div>
                                                        </div>
                                                        <div className="row pt-2">
                                                            <label className="form-text">{t('service_request_create_label_call_stop_reason')}</label>
                                                            <div>{asset.CallStopReason ? asset.CallStopReason : "---"}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="accordion-item">
                                        <h2 className="accordion-header" id="headingThree">
                                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                                Customer Details
                                            </button>
                                        </h2>
                                        <div id="collapseThree" className="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
                                            <div className="accordion-body">
                                                <div className="row mx-4">
                                                    <div className="col md-6">
                                                        <div className="row pt-2">
                                                            <label className="form-text">{t('service_request_create_label_customer')}</label>
                                                            <div>{asset.CustomerName ? asset.CustomerName : "---"}</div>
                                                        </div>
                                                        <div className="row pt-2">
                                                            <label className="form-text">{t('service_request_create_label_customername')}</label>
                                                            <div>{asset.CustomerContactName ? asset.CustomerContactName : "---"}</div>
                                                        </div>
                                                        <div className="row pt-2">
                                                            <label className="form-text">{t('service_request_create_label_sitename_and_adderss')}</label>
                                                            <div >{asset.CustomerSiteName ?? "---"}</div>
                                                            <div >{asset.CustomerContactAddress ? asset.CustomerContactAddress : "---"}</div>
                                                        </div>
                                                    </div>
                                                    <div className="col md-6">
                                                        <div className="row pt-2">
                                                            <label className="form-text">{t('service_request_create_label_customeremail')}</label>
                                                            <div >{asset.CustomerContactEmail ? asset.CustomerContactEmail : "---"}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="mt-4 ms-3 px-4 py-1 my-2  bg-light text-dark">
                                    <h4 className="app-primary-color">{t('service_request_create_title_hello')}</h4>
                                    <p className="small">{t('service_request_create_help_text')}</p>
                                    <div className="mt-2">
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ServiceRequestDetails

