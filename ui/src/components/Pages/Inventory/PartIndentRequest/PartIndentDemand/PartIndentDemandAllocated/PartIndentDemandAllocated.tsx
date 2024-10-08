import { dispatchOnCall, store } from '../../../../../../state/store';
import { useStore, useStoreWithInitializer } from '../../../../../../state/storeHooks';
import { useEffect, useState } from 'react';
import { PartIndentDemandDetailState, changePage, initializeDemandDetail, loadDemandDetail, loadGinDetail, loadPartStocks, loadSelectedDC, toggleInformationModalStatus, updateErrors, updateField } from './PartIndentDemandAllocated.slice';
import { useHistory, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { checkForPermission } from '../../../../../../helpers/permissions';
import { DemandListCWHAttentionNotNeeded, IssuePartsForDemand, downloadGin, getClickedGinDetail, getClickedPartIndendDemand } from '../../../../../../services/partindentdemand';
import { convertBackEndErrorsToValidationErrors, formatCurrency, formatDate, formatDateTime, formatDocumentName, formatSelectInputWithCode } from '../../../../../../helpers/formats';
import BreadCrumb from '../../../../../BreadCrumbs/BreadCrumb';
import { startPreloader, stopPreloader } from '../../../../../Preloader/Preloader.slice';
import { getPartStocksForIssue } from '../../../../../../services/partStock';
import SweetAlert from 'react-bootstrap-sweetalert';
import { ValidationErrorComp } from '../../../../../ValidationErrors/ValidationError';
import { loadPartIndentDemand } from '../PartIndentDemandListLogistics/PartIndentDemandsCompleted/PartIndentDemandCompleted.slice';
import { setActiveTab } from '../PartIndentDemandListLogistics/DemandListManagement.slice';
import { Pagination } from '../../../../../Pagination/Pagination';
import { DeliveryChallanFORGIN } from './CreateDeliveryChallan';
import { getDeliveryChallanDetails } from '../../../../../../services/deliverychallan';
import FileSaver from 'file-saver';

export function PartIndentDemandAllocated() {
  const { t, i18n } = useTranslation();
  const history = useHistory();
  const { singledemanddetail, PartStocks, issueparts, currentPage, dcdetails, perPage, totalRows, displayInformationModal, gindetail, errors } = useStoreWithInitializer(({ partallocateddemand }) => partallocateddemand, dispatchOnCall(initializeDemandDetail()));
  const { deliverychallan } = useStore(({ deliverychallanforgin }) => deliverychallanforgin);
  const { DemandId } = useParams<{ DemandId: string }>();

  useEffect(() => {
    {
      checkForPermission('PARTINDENTDEMAND_VIEW') && (
        onLoad(DemandId)
      )
    }
  }, [DemandId]);

  const InformationModal = () => {
    const { t } = useTranslation();
    return (
      <SweetAlert success title="Success" onConfirm={redirectToDemandList}>
        {t('part_issue_success_message')}
      </SweetAlert>
    );
  }

  const redirectToDemandList = async () => {
    store.dispatch(toggleInformationModalStatus());
    history.push('/logistics/partindentdemands/logistics')
    const result = await DemandListCWHAttentionNotNeeded(1, store.getState().partindentdemandlogisticsallocated.search, true);
    store.dispatch(loadPartIndentDemand(result));
    store.dispatch(setActiveTab('nav-allocated'))
  }

  const breadcrumbItems = [
    { Text: 'breadcrumbs_home', Link: '/' },
    { Text: 'breadcrumbs_manage_demandnote_requests', Link: '/logistics/partindentdemands/logistics' },
    { Text: 'breadcrumbs_manage_demandnote_detail' }
  ];

  async function onLoad(DemandId: string) {
    store.dispatch(startPreloader())
    store.dispatch(initializeDemandDetail());
    try {
      const result = await getClickedPartIndendDemand(DemandId);
      store.dispatch(loadDemandDetail(result.Indentdemandetails));

      const stocks = await getPartStocksForIssue(Number(DemandId));
      store.dispatch(loadPartStocks(stocks))
      store.dispatch(updateField({ name: 'PartIndentDemandId', value: DemandId }));

      const gin = await getClickedGinDetail(DemandId);
      store.dispatch(loadGinDetail(gin.GinDetails));

    } catch (error) {
      console.error(error);
    }
    store.dispatch(stopPreloader())
  }


  const onDownloadClick = async () => {
    const response = await downloadGin(gindetail.Id);
    const url = window.URL.createObjectURL(response.data);
    FileSaver.saveAs(url, formatDocumentName());
  };

  useEffect(() => {
    const getDcDetails = async () => {
      if (gindetail.DeliveryChallanId != null) {
        const dcdetail = await getDeliveryChallanDetails(gindetail.DeliveryChallanId);
        store.dispatch(loadSelectedDC(dcdetail));
      }
    }
    getDcDetails()
  }, [gindetail.DeliveryChallanId])

  const onPageChange = async (index: number) => {
    store.dispatch(changePage(index));
    const stocks = await getPartStocksForIssue(Number(DemandId));
    store.dispatch(loadPartStocks(stocks))
    store.dispatch(updateField({ name: 'PartIndentDemandId', value: DemandId }));
  }

  const onUpdateField = (ev: any) => {
    var name = ev.target.name;
    var value = ev.target.value;
    store.dispatch(updateField({ name: name as keyof PartIndentDemandDetailState['issueparts'], value }));
  }

  const onSubmit = async () => {
    store.dispatch(startPreloader());
    const result = await (issuemode === "ISM_BHND" ? IssuePartsForDemand(issueparts, issuemode) : IssuePartsForDemand(issueparts, issuemode, deliverychallan));
    result.match({
      ok: () => {
        store.dispatch(toggleInformationModalStatus());
      },
      err: (e) => {
        const errorMessages = convertBackEndErrorsToValidationErrors(e)
        store.dispatch(updateErrors(errorMessages));
      }
    });
    store.dispatch(stopPreloader());
  }

  const ginmodes = [
    { value: 'ISM_BHND', label: "By Hand" },
    { value: 'ISM_BCER', label: "By Courier" }
  ];

  const [issuemode, setIssueMode] = useState('');

  function handleCheckbox(value: string) {
    setIssueMode(value)
  }

  return (
    <div className="mt-5">
      <BreadCrumb items={breadcrumbItems} />
      <ValidationErrorComp errors={errors} />

      {checkForPermission('PARTINDENTDEMAND_VIEW') && (
        <div className="row mx-4">
          <div className={`${gindetail.DeliveryChallanId == null && gindetail.GinNumber !== null ? 'col-md-12' : 'col-md-6'} m-0 p-0`}>
            <div className='col-md-12 p-0 app-primary-color'>
              <div className="d-flex  justify-content-between align-items-center">
                <h6 className='app-primary-color fw-bold'>{t('partindentdemand_view_demanddetails')}</h6>
                {checkForPermission('PARTINDENTDEMAND_CREATE_GIN') && (
                  <>
                    {gindetail.DeliveryChallanId == null && gindetail.GinNumber !== null && (
                      <button className='btn app-primary-bg-color m-0 text-white my-1 float-end' onClick={onDownloadClick}>
                        <span className="material-symbols-outlined align-middle">download</span>&nbsp; {t('partindentdemand_view_downloadgin')}
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
            <div className="d-flex flex-row bd-highlight mb-2 px-1 bg-light">
              <div className="p-2 bd-highlight flex-fill">
                <div className="text-muted form-text">{t('partindentdemand_view_demandno')}</div>
                <div className="text-size-12 fw-normal">{singledemanddetail.DemandNumber}</div>
              </div>
              <div className="p-2 bd-highlight flex-fill">
                <div className="text-muted form-text">{t('partindentdemand_view_demanddate')}</div>
                <div className="text-size-12 fw-normal">{formatDate(singledemanddetail.DemandDate)}</div>
              </div>
              <div className="p-2 bd-highlight flex-fill">
                <div className="text-muted form-text">{t('partindentdemand_view_eng')}</div>
                <div className="text-size-12 fw-normal">{singledemanddetail.Recipient}</div>
              </div>
              <div className="p-2 bd-highlight flex-fill">
                <div className="text-muted form-text">{t('partindentdemand_view_location')}</div>
                <div className="text-size-12 fw-normal">{singledemanddetail.TenantOfficeName}</div>
              </div>
              <div className="p-2 bd-highlight flex-fill">
                <div className="text-muted form-text">{t('partindentdemand_view_qunatity')}</div>
                <div className="text-size-12 fw-normal tex-center ms-3 badge text-bg-success">{singledemanddetail.DemandQuantity}</div>
              </div>
            </div>
            {PartStocks.length > 0 ? (
              <>
                <h6 className='app-primary-color fw-bold mt-3'>{t('partindentdemand_view_allocateditems')}</h6>
                {PartStocks.map((field, index) => (
                  <>
                    <div className="row mb-2 bg-light py-2 px-2 mx-0">
                      <div className="col-md-10 ps-1">
                        <div className="fw-bold pb-1">
                          {field.PartName} ({field.PartCode}) , {field.TenantOffice}
                        </div>
                        <div className="text-size-12 fw-normal">
                          {t('part_issue_partstock_label_serialno')} : <span className='fw-bold'>{field.SerialNumber}</span>
                        </div>
                        <div className="text-size-12 fw-normal">
                          {t('part_issue_partstock_label_stocktype')} : {field.StockType} <span className="fw-bold">|</span> {t('part_issue_partstock_label_warranty_expiry')} :
                          {field.PartWarrantyExpiryDate == null ?
                            <span className='form-text'>{t('partindentdemand_view_notavailable')}</span>
                            : formatDate(field.PartWarrantyExpiryDate)}
                        </div>
                      </div>
                      <div className="col-md-2 pt-3 pe-1">
                        <div className="text-size-12 fw-normal float-end">
                          <span className="material-symbols-outlined text-size-14">currency_rupee</span>
                          <span className="fs-6">{formatCurrency(field.Rate)}</span>
                        </div>
                      </div>
                    </div>
                  </>
                ))}
                <div className="row m-0">
                  <Pagination currentPage={currentPage} count={totalRows} itemsPerPage={perPage} onPageChange={onPageChange} />
                </div>
                {gindetail.GinNumber != null &&
                  (
                    <>
                      <h6 className='fs-6 app-primary-color fw-bold'>{t('part_issue_gin_detail')}</h6>
                      <div className="d-flex flex-row bd-highlight mb-2 px-1 bg-light">
                        <div className="p-2 bd-highlight flex-fill">
                          <div className="text-muted form-text">{t('part_issue_gin_no')}</div>
                          <div className="text-size-12 fw-normal">{gindetail.GinNumber ?? "---"}</div>
                        </div>
                        <div className="p-2 bd-highlight flex-fill">
                          <div className="text-muted form-text">{t('part_issue_gin_date')}</div>
                          <div className="text-size-12 fw-normal">{gindetail.GinDate == null ? "---" : formatDate(gindetail.GinDate)}</div>
                        </div>
                        <div className="p-2 bd-highlight flex-fill">
                          <div className="text-muted form-text">{t('part_issue_allocatedon')}</div>
                          <div className="text-size-12 fw-normal">{formatDate(gindetail.AllocatedOn)}</div>
                        </div>
                        <div className="p-2 bd-highlight flex-fill">
                          <div className="text-muted form-text">{t('part_issue_view_location')}</div>
                          <div className="text-size-12 fw-normal">{gindetail.TenantOffice}</div>
                        </div>
                        <div className="p-2 bd-highlight flex-fill">
                          <div className="text-muted form-text">{t('part_issue_receivedby')}</div>
                          <div className="text-size-12 fw-normal">{gindetail.RecipientUser ?? '---'}</div>
                        </div>
                        <div className="p-2 bd-highlight flex-fill">
                          <div className="text-muted form-text">{t('part_issue_receivedon')}</div>
                          <div className="text-size-12 fw-normal">{gindetail.ReceivedOn != null ? formatDate(gindetail.ReceivedOn) : '---'}</div>
                        </div>
                      </div>
                    </>
                  )}
              </>
            ) : (
              <div className='mt-3'>{t('part_issue_no_records')}</div>
            )}
          </div>
          {gindetail.GinNumber == null ? (
            <div className="col-md-6">
              <h6 className='red-asterisk '>{t('partindentdemand_view_choose')}</h6>
              {ginmodes.map((item) => (
                <div key={item.value} className="ps-0 pb-2">
                  <input
                    type="radio"
                    className={`form-check-input border-secondary`}
                    onChange={(ev) => handleCheckbox(item.value)}
                    value={item.value}
                    name="TransactionTypeCode"
                    data-testid={`create_user_input_checkbox_${item.label}`}
                    checked={issuemode == item.value}
                  />
                  <label className="form-check-label ms-2">{item.label}</label>
                  <div className="form-text mt-0 ps-4"> <span>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</span></div>
                </div>
              )
              )}
              {issuemode === 'ISM_BCER' && (
                <div>
                  <DeliveryChallanFORGIN demandnumber={singledemanddetail.DemandNumber} partstocks={PartStocks.map((item) => (item.PartStockId))} />
                </div>
              )}
              {issuemode != "" &&
                <div className="mb-1 mt-2">
                  <label>{t('part_issue_label_remarks')}</label>
                  <textarea onChange={onUpdateField} rows={3} name="Remarks" value={issueparts.Remarks} className="form-control" />
                </div>
              }
              <div className='mt-3'>
                <button type="button" onClick={() => onSubmit()} disabled={issuemode == "" ? true : false} className="btn app-primary-bg-color border text-white float-end">
                  {t('part_issue_buttion')}
                </button>
              </div>
            </div>
          ) : gindetail.DeliveryChallanId !== null && (
            <div className="col-md-6">
              <div className="row">
                <h6 className="app-primary-color fw-bold">{t('partindentdemand_view_dc_details')}</h6>
                <div className="col">
                  <div className="mt-0">
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
                </div>
                <div className="col">
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
                    <div >{dcdetails.LogisticsReceiptNumber?? "---"}</div>
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
            </div>
          )}
        </div>
      )}
      {displayInformationModal ? <InformationModal /> : ""}
    </div>
  );
}
