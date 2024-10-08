import { ContainerPage } from '../../../ContainerPage/ContainerPage';
import { useStore } from '../../../../state/storeHooks';
import { useTranslation } from 'react-i18next';
import { formatCurrency, formatDate, formatDateTime } from '../../../../helpers/formats';
import { useState } from 'react';
import { OverlayTrigger, Popover as BootstrapPopover, Button, Popover } from 'react-bootstrap';
import FeatherIcon from 'feather-icons-react';

function GeneralContract() {
  const { t } = useTranslation();
  const { singlecontract } = useStore(
    ({ generalcontractdetails }) => generalcontractdetails);

  const [popoverShow, setPopoverShow] = useState(false);

  const popover = (
    <BootstrapPopover id="popover-basic">
      <BootstrapPopover.Body>
        <div>{t('general_label_amcvalue')} {formatCurrency(singlecontract?.AmcValue.toFixed(2))} &#8377; </div>
        <div>{t('general_label_fmsvalue')} {formatCurrency(singlecontract?.FmsValue.toFixed(2))} &#8377; </div>
      </BootstrapPopover.Body>
    </BootstrapPopover>
  );

  return (
    <>{singlecontract !== undefined && (
      <ContainerPage>
        <>
          {/* Contract Details Start*/}
          <div className='row'>
            <div className='col-4'>
              {/* customer name */}
              <div className='mb-1'>
                <label className='form-text'>{t('general_label_customer_name')}</label>
                <div className="">{singlecontract?.CustomerName}</div>
              </div>
              {/* customer name ends */}
              {/* accel location */}
              <div className='mb-1'>
                <label className='form-text'>{t('general_label_location')}</label>
                <div className=""> {singlecontract?.TenantOfficeName}</div>
              </div>
              {/* accel location ends */}
              <div className='mb-1'>
                <label className='form-text' >{t('general_label_marketing_executive')}</label>
                <div>{singlecontract?.SalesContactPerson ? singlecontract?.SalesContactPerson : "---"}</div>
              </div>
              <div className='mb-1'>
                <label className='form-text'>{t('general_label_start_date')}</label>
                <div className="">{formatDate(singlecontract?.StartDate ? singlecontract?.StartDate : "---")}</div>
              </div>
              <div className='mb-1'>
                <label className='form-text mt-2'>{t('general_label_end_date')}</label>
                <div className="">{formatDate(singlecontract?.EndDate ? singlecontract?.EndDate : "---")}</div>
              </div>
            </div>
            <div className='col-4'>
              {/* Agreement Type */}
              <div className='mb-1'>
                <label className='form-text'>{t('general_label_agreement_type')}</label>
                <div className=""> {singlecontract?.AgreementType}</div>
              </div>
              {/* Agreement Type ends */}
              <div className='mb-1'>
                <label className="form-text" style={{ display: 'inline-block', marginRight: '5px' }}>
                  {t('general_label_contract_value')}
                </label>
                <div>{formatCurrency(singlecontract?.ContractValue?.toFixed(2))}<span> &#8377;</span>
                  {['4', '5'].includes(singlecontract?.AgreementTypeId.toString()) && (
                    <span className='text-dark ms-3 '>
                      <OverlayTrigger
                        show={popoverShow}
                        placement="right"
                        overlay={popover}
                        onToggle={() => setPopoverShow(!popoverShow)}
                      >
                        <div style={{ display: 'inline-block' }}>
                          <FeatherIcon icon={"help-circle"} size="16" />
                        </div>
                      </OverlayTrigger>
                      <div>
                      </div>
                    </span>
                  )}</div>
              </div>
              <div className='mb-1'>
                <label className="form-text">{t('general_label_call_expiry_date')}</label>
                <div>{singlecontract.CallExpiryDate ? formatDate(singlecontract.CallExpiryDate) : "---"} </div>
              </div>
              <div className='mb-1'>
                <label className="form-text">{t('general_label_call_stop_date')}</label>
                <div>{singlecontract.CallStopDate ? formatDateTime(singlecontract.CallStopDate) : "---"} </div>
              </div>
              <div className='mb-1'>
                <label className="form-text">{t('general_label_call_stop_reason')}</label>
                <div>{singlecontract.CallStopReason ? singlecontract.CallStopReason : "---"} </div>
              </div>
            </div>
            <div className='col-4'>
              <div className='mb-1'>
                <label className="form-text">{t('general_label_first_approver')}</label>
                <div>{singlecontract.FirstApprover ? singlecontract.FirstApprover : "---"} </div>
              </div>
              <div className='mb-1'>
                <label className="form-text">{t('general_label_first_approvedOn')}</label>
                <div>{singlecontract.FirstApprovedOn ? formatDateTime(singlecontract.FirstApprovedOn) : "Not Approved"} </div>
              </div>
              <div className='mb-1'>
                <label className="form-text">{t('general_label_seond_aprover')}</label>
                <div>{singlecontract.SecondApprover ? singlecontract.SecondApprover : "---"} </div>
              </div>
              <div className='mb-1'>
                <label className="form-text">{t('general_label_seond_aprovedOn')}</label>
                <div>{singlecontract.SecondApprovedOn ? formatDateTime(singlecontract.SecondApprovedOn) : "Not Approved"} </div>
              </div>
            </div>
          </div>
          <div className="row mb-2">
            <div className="fw-bold fs-6 mt-3 border-bottom py-1 mb-2 border-light app-primary-color">
              {t('create_contract_sub_booking')}
            </div>
            <div className="col-4">
              <div className="mb-2 mt-0">
                <label className='form-text'>{t('general_label_booking_type')}</label>
                <div className=""> {singlecontract?.BookingType}</div>
              </div>
            </div>
            <div className="col-4">
              <label className='form-text'>{t('general_label__booking_date')}</label>
              <div>{formatDate(singlecontract?.BookingDate ? singlecontract?.BookingDate : '---')}</div>
            </div>
          </div>
        </>
        {/* Purchase Order Details */}
        <>
          <div className="fw-bold mt-2 border-bottom py-1 mb-2 border-light app-primary-color fs-6">
            {t('create_contract_sub_podetail')}
          </div>
          {/*  Quotation Reference Number & Date Start*/}
          <div className='row mb-2 mt-1'>
            <div className='col-4'>
              <label className='form-text'>{t('create_contract_label_quotation_reference_number')}</label>
              <div>{singlecontract?.QuotationReferenceNumber ? singlecontract?.QuotationReferenceNumber : '---'}</div>
            </div>
            <div className='col-4'>
              <label className='form-text'>{t('general_label_purchase_order_number')}</label>
              <div>{singlecontract?.PoNumber ? singlecontract?.PoNumber : '---'}</div>
            </div>
            {/* Is Preformance Guarentee*/}
            <div className=" mb-2 col-4">
              <label className="form-text" >
                {t('general_label_is_performance_guarentee')}
              </label>
              <div>{singlecontract?.IsPerformanceGuaranteeRequired == true ? "Yes" : "No"}</div>
            </div>
            {/* Is Preformance Guarentee End */}
          </div>

          {/* PO Number & Date Start */}
          <div className='row mb-2'>
            <div className="col-4">
              <label className='form-text'>{t('create_contract_label_quotation_reference_date')}</label>
              <div>{singlecontract?.QuotationReferenceDate !== null ? formatDate(singlecontract?.QuotationReferenceDate) : '---'}</div>
            </div>
            <div className='col-4'>
              <label className='form-text'>{t('general_label_purchase_order_date')}</label>
              <div>{singlecontract?.PoDate !== null ? formatDate(singlecontract?.PoDate) : '---'}</div>
            </div>
            <div className='mb-2 col-4'>
              <label className='form-text'>{t('general_label_performance_guarentee_amount')}</label>
              <div>{singlecontract?.PerformanceGuaranteeAmount ? <p>{formatCurrency(singlecontract?.PerformanceGuaranteeAmount)}</p> : '---'}</div>
            </div>
          </div>
          {/* PO Number & Date End */}
          <div className='row mb-2'>
            <div className="col-4">
              <label className="form-text">
                {t('general_label_multi_site_contract')}
              </label>
              <div >
                {singlecontract?.IsMultiSite == true ? "Yes" : "No"}
              </div>
            </div>
            <div className="col-4">
              <label className="form-text">{t('create_contract_label_is_site_count')}</label>
              <div className=""> {singlecontract?.SiteCount ? singlecontract?.SiteCount : "---"}</div>
            </div>
            <div className=" mb-2 col-4">
              <label className="form-text">
                {t('create_contract_label_is_pav_needed_contract')}
              </label>
              <div>{singlecontract?.IsPreAmcNeeded == true ? "Yes" : "No"}</div>
            </div>
          </div>
        </>
        {/* Purchase Order Details Ends*/}

        {/* Payment Details Starts*/}
        <>
          <div className="fw-bold mt-2 border-bottom py-1 mb-2 border-light app-primary-color fs-6">
            {t('create_contract_sub_payment')}
          </div>
          <div className='row mt-2'>
            <div className=" mb-2 col-4">
              <label className="form-text" >
                {t('create_contract_label_is_sez')}
              </label>
              <div>{singlecontract?.IsSez == true ? "Yes" : "No"}</div>
            </div>
            <div className="col-4">
              <label className='form-text'>{t('create_contract_label_payment_type')}</label>
              <div>{singlecontract?.PaymentMode ? singlecontract?.PaymentMode : '---'} {singlecontract?.PaymentFrequency ? singlecontract?.PaymentFrequency : "---"}</div>
            </div>
            <div className="mb-2 col-4">
              <label className='form-text'>{t('create_contract_label_creadit_period')}</label>
              <div>{singlecontract?.CreditPeriod ? singlecontract?.CreditPeriod : '---'}</div>
            </div>
          </div>
        </>
        {/* Payment Details Ends */}

        {/* Service Details Star*/}
        <div className="fw-bold mt-2 border-bottom py-1 mb-2 border-light app-primary-color fs-6">
          {t('create_contract_sub_service')}
        </div>

        <div className="row mb-2">
          <div className="col-4">
            <label className='form-text'>{t('create_contract_label_service_mode')}</label>
            <div>{singlecontract?.ServiceMode ? singlecontract?.ServiceMode : '---'}</div>
          </div>

          < div className="col-4">
            <label className="form-text" >
              {t('create_contract_label_is_preventive_maintenance_needed')}
            </label>
            <div>{singlecontract?.NeedPm == true ? "Yes" : 'No'}</div>
          </div>
          <div className='col-4'>
            <label className="form-text">
              {t('create_contract_label_is_back_to_back_allowed')}
            </label>
            <div>{singlecontract?.IsBackToBackAllowed == true ? "Yes" : "No"}</div>
          </div>
        </div>
        <div className='row'>
          <div className="col-4">
            <label className='form-text'>{t('general_label_service_window')}</label>
            <div>{singlecontract?.ServiceWindow ? singlecontract?.ServiceWindow : '---'}</div>
          </div>
          <div className="col-4">
            <label className='form-text'>{t('create_contract_label_preventive_maintenance_frequency')}</label>
            <div>{singlecontract?.PmFrequency ? singlecontract?.PmFrequency : '---'}</div>
          </div>
          <div className="col-4">
            <label className='form-text'>{t('create_contract_label_is_back_to_back_scope')}</label>
            <div>{singlecontract?.BackToBackScope ? singlecontract?.BackToBackScope : "---"}</div>
          </div>
        </div>
        {/* Service Details Ends*/}

        {/* SLA Details */}
        <>
          <div className="fw-bold mt-3 border-bottom py-1 mb-2 border-light app-primary-color fs-6" >
            {t('create_contract_sub_sla')}
          </div>
          <div className='row'>
            <div className="col-4">
              <label className="form-text" >
                {t('create_contract_label_is_standby_full_unit_required')}
              </label>
              <div>{singlecontract?.IsStandByFullUnitRequired == true ? "Yes" : "No"}
              </div>
            </div>
            <div className="col-4">
              <label className="form-text" >
                {t('create_contract_label_is_standby_impress_stock_required')}
              </label>
              <div>{singlecontract?.IsStandByImprestStockRequired == true ? "Yes" : "No"}</div>
            </div>
            <div className="col-4">
              <label className="form-text" >
                {t('create_contract_label_is_standby_required')}
              </label>
              <div>{singlecontract?.IsStandByImprestStockRequired || singlecontract?.IsStandByFullUnitRequired == true ? t('create_contract_label_is_standby_required_yes') : t('create_contract_label_is_standby_required_no')}</div>
            </div>
          </div>
          <>
          </>
          <div className='row mb-2'>
            <div className="fw-bold fs-6 mt-3 border-bottom py-1 mb-2 border-light app-primary-color">
              {t('create_contract_sub_documents')}
            </div>
            <div>{singlecontract?.ContractInvoicePrerequisite ? singlecontract?.ContractInvoicePrerequisite : 'No Documents Added'}</div>
          </div>
        </>
        {/* SLA Details Ends*/}
      </ContainerPage>
    )}
    </>
  )
}
export default GeneralContract