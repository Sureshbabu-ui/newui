import { dispatchOnCall, store } from '../../../../../../state/store';
import { ContainerPage } from '../../../../../ContainerPage/ContainerPage';
import { useStoreWithInitializer } from '../../../../../../state/storeHooks';
import { useEffect } from 'react';
import { initializeDemandDetail, loadDemandDetail } from './PartIndentDemandView.slice';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { checkForPermission } from '../../../../../../helpers/permissions';
import { getClickedPartIndendDemand } from '../../../../../../services/partindentdemand';
import { formatDate, formatDateTime, formatDocumentName } from '../../../../../../helpers/formats';
import BreadCrumb from '../../../../../BreadCrumbs/BreadCrumb';
import { loadDemandData } from '../GoodsIssuedReceivedNote/GINAllocation/GINAllocatePart.slice';
import { CreateGoodsIssuedReceivedNote } from '../GoodsIssuedReceivedNote/GINAllocation/GINAllocatePart';
import { loadDemandId, loadPartName } from '../RequestPO/RequestPO.slice';
import { RequestPurchaseOrder } from '../RequestPO/RequestPO';
import { loadDetailsForPo } from '../CreatePO/CreatePO.slice';
import { CreatePurchaseOrder } from '../CreatePO/CreatePO';
import FileSaver from 'file-saver';
import { downloadPurchaseOrder } from '../../../../../../services/purchaseorder';
import { startPreloader, stopPreloader } from '../../../../../Preloader/Preloader.slice';

export function PartIndentDemandDetail() {
  const { t, i18n } = useTranslation();
  const { singledemanddetail } = useStoreWithInitializer(({ demanddetail }) => demanddetail, dispatchOnCall(initializeDemandDetail()));
  const { DemandId } = useParams<{ DemandId: string }>();

  useEffect(() => {
    {
      checkForPermission('PARTINDENTDEMAND_VIEW') && (
        onLoad(DemandId)
      )
    }
  }, [DemandId]);

  const breadcrumbItems = [
    { Text: 'breadcrumbs_home', Link: '/' },
    { Text: 'breadcrumbs_manage_demandnote_requests', Link: '/logistics/partindentdemands/logistics' },
    { Text: 'breadcrumbs_manage_demandnote_detail' }
  ];

  async function onLoad(DemandId: string) {
    store.dispatch(initializeDemandDetail());
    try {
      store.dispatch(startPreloader())
      const result = await getClickedPartIndendDemand(DemandId);
      store.dispatch(loadDemandDetail(result.Indentdemandetails));
    } catch (error) {
      console.error(error);
    }
    store.dispatch(stopPreloader())
  }

  async function setDemandIdForRequestPO(Id: number) {
    store.dispatch(loadDemandId(Id))
    store.dispatch(loadPartName(singledemanddetail.PartName))
  }

  async function setDemandIdForCreatePO(DemandId: number, Price: number, vendorId: number, vendorTypeId: number, PartIndentRequestId: number, TenantOfficeId: number, PartId: number, DemandQuantity: number, StockTypeId: number, CustomerInfoId: number) {
    store.dispatch(loadDetailsForPo({ DemandId: DemandId, Price: Price, vendorId: vendorId, vendorTypeId: vendorTypeId, PartIndentRequestId: PartIndentRequestId, TenantOfficeId: TenantOfficeId, PartId: PartId, DemandQuantity: DemandQuantity, StockTypeId: StockTypeId, CustomerInfoId: CustomerInfoId }))
  }

  const onDownloadClick = async (e: any) => {
    const response = await downloadPurchaseOrder(singledemanddetail.Id)
    const url = window.URL.createObjectURL(response.data);
    FileSaver.saveAs(url, formatDocumentName())
  }

  return (
    <ContainerPage>
      <div className="mx-2">
        <BreadCrumb items={breadcrumbItems} />
        {checkForPermission('PARTINDENTDEMAND_VIEW') && (
          <div className="row">
            {/* col-1 */}
            <div className="col-md-8">
              <div className="accordion" id="accordionPanelsStayOpenExample">
                <div className="accordion-item">
                  <h2 className="accordion-header" id="panelsStayOpen-headingOne">
                    <button className="accordion-button bg-light" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseOne" aria-expanded="true" aria-controls="panelsStayOpen-collapseOne">
                      {/* demand number */}
                      <div className="col-md-2 ps-0 text-dark">
                        <div className="text-muted text-size-11">{t('partindentdemand_view_demandno')}</div>
                        <div className="text-size-12 fw-normal">{singledemanddetail.DemandNumber}</div>
                      </div>
                      <div className="col-md-2 ps-0 text-dark">
                        <div className="text-muted text-size-11">{t('partindentdemand_view_demanddate')}</div>
                        <div className="text-size-12 fw-normal">{formatDate(singledemanddetail.DemandDate)}</div>
                      </div>
                      {/* service engineer */}
                      <div className="col-md-2 text-dark">
                        <div className="text-muted text-size-11">{t('partindentdemand_view_eng')}</div>
                        <div className="text-size-12 fw-normal">{singledemanddetail.Recipient}</div>
                      </div>
                      <div className="col-md-2 ps-0 text-dark">
                        <div className="text-muted text-size-11">{t('partindentdemand_view_location')}</div>
                        <div className="text-size-12 fw-normal">{singledemanddetail.TenantOfficeName}</div>
                      </div>
                      {/* parts count */}
                      <div className="col-md-2">
                        <div className="text-muted text-size-11">{t('partindentdemand_view_qunatity')}</div>
                        <div className="text-size-12 fw-normal tex-center ms-3">
                          <span className="badge text-bg-success" data-bs-toggle="Approved" data-bs-placement="top" title="Approved">{singledemanddetail.DemandQuantity}</span>
                        </div>
                      </div>
                    </button>
                  </h2>
                  <div id="panelsStayOpen-collapseOne" className="accordion-collapse collapse show" aria-labelledby="panelsStayOpen-headingOne">
                    <div className="accordion-body row">
                      <div className="col-md-1 px-0 py-1 text-start">
                        <div className="p-1 bg-light">&nbsp;</div>
                      </div>
                      <div className="col-md-11">
                        <div className="">
                          <span className="me-2 small"><small><span className="fw-bold">{t('partindent_header_hsncode')}: </span>{singledemanddetail.HsnCode}</small></span>
                          <span className="me-2 small"><small><span className="fw-bold">{t('partindent_header_partcode')}: </span>{singledemanddetail.PartCode}</small></span>
                          <span className="me-2 small"><small><span className="fw-bold">{t('partindent_header_oemnum')}: </span>{singledemanddetail.OemPartNumber}</small></span>
                          <div className='mb-1'><small className="small fw-bold">{singledemanddetail.PartName}</small></div>
                        </div>
                        <small className="me-1"><span className='text-muted'>{t('partindentdemand_view_calldetails')} </span>{singledemanddetail.WorkOrderNumber}</small>
                        <small className="me-1 text-secondary">&#9679;</small>
                        <small className="me-1">{singledemanddetail.CallCreatedBy}</small>
                        <small className="me-1 text-secondary">&#9679;</small>
                        <small className="me-1">{formatDate(singledemanddetail.CallCreatedOn)}</small>
                        <div><small className="me-1"><span className='text-muted'>{t('partindentdemand_view_indentno')}</span>{singledemanddetail.PartIndentRequestNumber}</small></div>
                        <div><p className="text-muted small">{t("partindent_header_remarks")} : {singledemanddetail.Remarks == "" ? "---" : singledemanddetail.Remarks}</p></div>
                      </div>
                      <div className='col-md-6'>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* col-2 */}
            <div className="col-md-4 m-0">
              <h6 >{t('partindentdemand_view_stock_info')}</h6>
              <div className="">
                <label className="form-text">{t('partindentdemand_view_cl_partcount')}</label>
                <div >{singledemanddetail.CLPartCount} {singledemanddetail.UnitOfMeasurement}</div>
              </div>
              <div className="pt-2">
                <label className="form-text">{t('partindentdemand_view_ol_partcount')}</label>
                <div >{singledemanddetail.OLPartCount} {singledemanddetail.UnitOfMeasurement}</div>
              </div>
              <div className="pt-2 mb-2">
                <label className="form-text">{t('partindentdemand_view_cwh_partcount')}</label>
                <div >{singledemanddetail.CWHPartCount} {singledemanddetail.UnitOfMeasurement}</div>
              </div>
              {/* Condition Based Modal */}
              {singledemanddetail.IsCwhAttentionNeeded == false && singledemanddetail.POCount == 0 ? (
                <div className='mb-0'>
                  {singledemanddetail.CLPartCount >= Math.floor(singledemanddetail.DemandQuantity) && singledemanddetail.GIRNCount == 0 ? (
                    <>
                      {checkForPermission('PARTINDENTDEMAND_CREATE_GIN') &&
                        <button
                          type="button"
                          className="btn app-primary-bg-color text-white" data-bs-toggle="modal"
                          data-bs-target="#CreateGIN">
                          {t('partindentdemand_label_create_gin_button')}
                        </button>
                      }
                    </>
                  ) : singledemanddetail.CLPartCount < Math.floor(singledemanddetail.DemandQuantity) ? (
                    <>
                      {checkForPermission('PARTINDENTDEMAND_REQUESTPO') &&
                        <button
                          type='button'
                          className="btn app-primary-bg-color text-white"
                          onClick={() => setDemandIdForRequestPO(singledemanddetail.Id)}
                          data-bs-toggle='modal'
                          data-bs-target='#RequestPO'
                        >
                          {t('partindentdemand_view_request_po')}
                        </button>
                      }
                    </>
                  ) : singledemanddetail.GIRNCount > 0 && (
                    <>{t('create_gin_created_message')}</>
                  )}
                </div>
              ) : singledemanddetail.IsCwhAttentionNeeded == true && singledemanddetail.POCount == 0 ? (
                <>{checkForPermission('PARTINDENTDEMAND_CREATEPO') &&
                  <button
                    type='button'
                    className="btn app-primary-bg-color text-white"
                    onClick={() => {
                      if (singledemanddetail.Price !== null && singledemanddetail.VendorId !== null) {
                        setDemandIdForCreatePO(singledemanddetail.Id,
                          singledemanddetail.Price,
                          singledemanddetail.VendorId,
                          singledemanddetail.VendorTypeId ?? 0,
                          singledemanddetail.PartIndentRequestId, singledemanddetail.LocationId,
                          singledemanddetail.PartId, singledemanddetail.DemandQuantity,
                          singledemanddetail.StockTypeId, singledemanddetail.CustomerInfoId
                        )
                      }
                    }}

                    data-bs-toggle='modal'
                    data-bs-target='#CreatePO'
                  >
                    {t('partindentdemand_view_create_po')}
                  </button>
                }</>
              ) : singledemanddetail.IsCwhAttentionNeeded == false && singledemanddetail.POCount > 0 &&
              <>{checkForPermission('PARTINDENTDEMAND_DOWNLOADPO') &&
                <button
                  type='button'
                  className="btn app-primary-bg-color text-white"
                  onClick={onDownloadClick}
                >
                  {t('partindentdemand_view_dwnld_po')}
                </button>
              }</>
              }
            </div>
          </div>
        )}
        {/* Modal */}
        <CreateGoodsIssuedReceivedNote />
        <RequestPurchaseOrder />
        <CreatePurchaseOrder />
      </div>
    </ContainerPage >
  );
}
