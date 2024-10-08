import { dispatchOnCall, store } from '../../../../../state/store';
import { ContainerPage } from '../../../../ContainerPage/ContainerPage';
import { useStoreWithInitializer } from '../../../../../state/storeHooks';
import { useEffect, useState } from 'react';
import {
  initializeContractVersion,
  loadContractVersions
} from './ContractHistory.slice';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getContractVersion } from '../../../../../services/contractistory';
import { formatDate, formatDateTime } from '../../../../../helpers/formats';

function ContractHistory() {
  const { t, i18n } = useTranslation();
  const { version, totalrows } = useStoreWithInitializer(
    ({ contracthistory }) => contracthistory,
    dispatchOnCall(initializeContractVersion())
  );

  const { ContractId } = useParams<{ ContractId: string }>();
  useEffect(() => {
    onLoad(ContractId);
  }, [ContractId]);

  return (
    <ContainerPage>
      {version.match({
        none: () =>
          <div className="row m-2 ps-3 mt-2 ">{t('contracthistory_loading_data')}</div>,
        some: (version) =>
          <div className="row m-0 pe-0">
            <div className='ps-0 table-responsive overflow-auto pe-0'>
              {version.length > 0 ? (
                  <table className="table table-bordered text-nowrap">
                  <thead>
                    <tr className="header">
                      <th scope="col">{t('contracthistory_table_th_version')}</th>
                      <th scope="col">{t('contracthistory_table_th_effective_from')}</th>
                      <th scope="col">{t('contracthistory_table_th_effective_to')}</th>
                      <th scope="col">{t('contracthistory_table_th_contract_number')}</th>
                      <th scope="col">{t('contracthistory_table_th_customer_name')}</th>
                      <th scope="col">{t('contracthistory_table_th_tenant_location')}</th>
                      <th scope="col">{t('contracthistory_table_th_agreementtype')}</th>
                      <th scope="col">{t('contracthistory_table_th_bookingtype')}</th>
                      <th scope="col">{t('contracthistory_table_th_booking_date')}</th>
                      <th scope="col">{t('contracthistory_table_th_booking_value_date')}</th>
                      <th scope="col">{t('contracthistory_table_th_qrn')}</th>
                      <th scope="col">{t('contracthistory_table_th_qrd')}</th>
                      <th scope="col">{t('contracthistory_table_th_pon')}</th>
                      <th scope="col">{t('contracthistory_table_th_pod')}</th>
                      <th scope="col">{t('contracthistory_table_th_contractvalue')}</th>
                      <th scope="col">{t('contracthistory_table_th_startdate')}</th>
                      <th scope="col">{t('contracthistory_table_th_endate')}</th>
                      <th scope="col">{t('contracthistory_table_th_isbacktoback_allowed')}</th>
                      <th scope="col">{t('contracthistory_table_th_backtoback_scope')}</th>
                      <th scope="col">{t('contracthistory_table_th_multisite')}</th>
                      <th scope="col">{t('contracthistory_table_th_sitecount')}</th>
                      <th scope="col">{t('contracthistory_table_th_service_mode')}</th>
                      <th scope="col">{t('contracthistory_table_th_service_window')}</th>
                      <th scope="col">{t('contracthistory_table_th_payment_mode')}</th>
                      <th scope="col">{t('contracthistory_table_th_payment_frequency')}</th>
                      <th scope="col">{t('contracthistory_table_th_need_pm')}</th>
                      <th scope="col">{t('contracthistory_table_th_pmfrequency')}</th>
                      <th scope="col">{t('contracthistory_table_th_is_sez')}</th>
                      <th scope="col">{t('contracthistory_table_th_is_pre_amc_needed')}</th>
                      <th scope="col">{t('contracthistory_table_th_is_standby_imprest_stock_required')}</th>
                      <th scope="col">{t('contracthistory_table_th_is_standby_full_unit_required')}</th>
                      <th scope="col">{t('contracthistory_table_th_performance_guarentee_required')}</th>
                      <th scope="col">{t('contracthistory_table_th_performance_guarentee_amount')}</th>
                      <th scope="col">{t('contracthistory_table_th_scp')}</th>
                      <th scope="col">{t('contracthistory_table_th_createdon')}</th>
                      <th scope="col">{t('contracthistory_table_th_createdby')}</th>
                      <th scope="col">{t('contracthistory_table_th_updatedon')}</th>
                      <th scope="col">{t('contracthistory_table_th_updatedby')}</th>
                      <th scope="col">{t('contracthistory_table_th_call_expiry_date')}</th>
                      <th scope="col">{t('contracthistory_table_th_call_stop_date')}</th>
                      <th scope="col">{t('contracthistory_table_th_call_stop_reason')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {version.map((eachVersion, index) => {
                      return (
                        <tr key={index}>
                          <th scope="row">{(`${version.length - index}.0`)}</th>
                          <td><div>{formatDateTime(eachVersion.SelectedContractItem.EffectiveFrom)}</div></td>
                          <td><div>{formatDateTime(eachVersion.SelectedContractItem.EffectiveTo)}</div></td>
                          <td><div className={(version[index < version.length - 1 ? index + 1 : version.length - 1].SelectedContractItem.ContractNumber != eachVersion.SelectedContractItem.ContractNumber) ? "different-cell" : ""}>{eachVersion.SelectedContractItem.ContractNumber}</div></td>
                          <td><div className={(version[index < version.length - 1 ? index + 1 : version.length - 1].SelectedContractItem.CustomerName != eachVersion.SelectedContractItem.CustomerName) ? "different-cell" : ""}>{eachVersion.SelectedContractItem.CustomerName}</div></td>
                          <td><div className={(version[index < version.length - 1 ? index + 1 : version.length - 1].SelectedContractItem.AccelLocation != eachVersion.SelectedContractItem.AccelLocation) ? "different-cell" : ""}>{eachVersion.SelectedContractItem.AccelLocation}</div></td>
                          <td><div className={(version[index < version.length - 1 ? index + 1 : version.length - 1].SelectedContractItem.AgreementType != eachVersion.SelectedContractItem.AgreementType) ? "different-cell" : ""}>{eachVersion.SelectedContractItem.AgreementType}</div></td>
                          <td><div className={(version[index < version.length - 1 ? index + 1 : version.length - 1].SelectedContractItem.BookingType != eachVersion.SelectedContractItem.BookingType) ? "different-cell" : ""}>{eachVersion.SelectedContractItem.BookingType}</div></td>
                          <td><div className={(version[index < version.length - 1 ? index + 1 : version.length - 1].SelectedContractItem.BookingDate != eachVersion.SelectedContractItem.BookingDate) ? "different-cell" : ""}>{eachVersion.SelectedContractItem.BookingDate?.split('T')[0]}</div></td>
                          <td><div className={(version[index < version.length - 1 ? index + 1 : version.length - 1].SelectedContractItem.BookingValueDate != eachVersion.SelectedContractItem.BookingValueDate) ? "different-cell" : ""}>{eachVersion.SelectedContractItem.BookingValueDate?.split('T')[0]}</div></td>
                          <td><div className={(version[index < version.length - 1 ? index + 1 : version.length - 1].SelectedContractItem.QuotationReferenceNumber != eachVersion.SelectedContractItem.QuotationReferenceNumber) ? "different-cell" : ""}>{eachVersion.SelectedContractItem.QuotationReferenceNumber}</div></td>
                          <td><div className={(version[index < version.length - 1 ? index + 1 : version.length - 1].SelectedContractItem.QuotationReferenceDate != eachVersion.SelectedContractItem.QuotationReferenceDate) ? "different-cell" : ""}>{formatDate(eachVersion.SelectedContractItem.QuotationReferenceDate)}</div></td>
                          <td><div className={(version[index < version.length - 1 ? index + 1 : version.length - 1].SelectedContractItem.PoNumber != eachVersion.SelectedContractItem.PoNumber) ? "different-cell" : ""}>{eachVersion.SelectedContractItem.PoNumber}</div></td>
                          <td><div className={(version[index < version.length - 1 ? index + 1 : version.length - 1].SelectedContractItem.PoDate != eachVersion.SelectedContractItem.PoDate) ? "different-cell" : ""}>{eachVersion.SelectedContractItem.PoDate?.split('T')[0]}</div></td>
                          <td><div className={(version[index < version.length - 1 ? index + 1 : version.length - 1].SelectedContractItem.ContractValue != eachVersion.SelectedContractItem.ContractValue) ? "different-cell" : ""}>{eachVersion.SelectedContractItem.ContractValue}</div></td>
                          <td><div className={(version[index < version.length - 1 ? index + 1 : version.length - 1].SelectedContractItem.StartDate != eachVersion.SelectedContractItem.StartDate) ? "different-cell" : ""}>{eachVersion.SelectedContractItem.StartDate?.split('T')[0]}</div></td>
                          <td><div className={(version[index < version.length - 1 ? index + 1 : version.length - 1].SelectedContractItem.EndDate != eachVersion.SelectedContractItem.EndDate) ? "different-cell" : ""}>{eachVersion.SelectedContractItem.EndDate?.split('T')[0]}</div></td>
                          <td><div className={(version[index < version.length - 1 ? index + 1 : version.length - 1].SelectedContractItem.IsBackToBackAllowed != eachVersion.SelectedContractItem.IsBackToBackAllowed) ? "different-cell" : ""}>{eachVersion.SelectedContractItem.IsBackToBackAllowed == true ? "Yes" : "No"}</div></td>
                          <td><div className={(version[index < version.length - 1 ? index + 1 : version.length - 1].SelectedContractItem.BackToBackScope != eachVersion.SelectedContractItem.BackToBackScope) ? "different-cell" : ""}>{eachVersion.SelectedContractItem.BackToBackScope}</div></td>
                          <td><div className={(version[index < version.length - 1 ? index + 1 : version.length - 1].SelectedContractItem.IsMultiSite != eachVersion.SelectedContractItem.IsMultiSite) ? "different-cell" : ""}>{eachVersion.SelectedContractItem.IsMultiSite == true ? "Yes" : "No"}</div></td>
                          <td><div className={(version[index < version.length - 1 ? index + 1 : version.length - 1].SelectedContractItem.SiteCount != eachVersion.SelectedContractItem.SiteCount) ? "different-cell" : ""}>{eachVersion.SelectedContractItem.SiteCount}</div></td>
                          <td><div className={(version[index < version.length - 1 ? index + 1 : version.length - 1].SelectedContractItem.ServiceMode != eachVersion.SelectedContractItem.ServiceMode) ? "different-cell" : ""}>{eachVersion.SelectedContractItem.ServiceMode}</div></td>
                          <td><div className={(version[index < version.length - 1 ? index + 1 : version.length - 1].SelectedContractItem.ServiceWindow != eachVersion.SelectedContractItem.ServiceWindow) ? "different-cell" : ""}>{eachVersion.SelectedContractItem.ServiceWindow}</div></td>
                          <td><div className={(version[index < version.length - 1 ? index + 1 : version.length - 1].SelectedContractItem.PaymentMode != eachVersion.SelectedContractItem.PaymentMode) ? "different-cell" : ""}>{eachVersion.SelectedContractItem.PaymentMode}</div></td>
                          <td><div className={(version[index < version.length - 1 ? index + 1 : version.length - 1].SelectedContractItem.PaymentFrequency != eachVersion.SelectedContractItem.PaymentFrequency) ? "different-cell" : ""}>{eachVersion.SelectedContractItem.PaymentFrequency}</div></td>
                          <td><div className={(version[index < version.length - 1 ? index + 1 : version.length - 1].SelectedContractItem.IsPmRequired != eachVersion.SelectedContractItem.IsPmRequired) ? "different-cell" : ""}>{eachVersion.SelectedContractItem.IsPmRequired == true ? "Yes" : "No"}</div></td>
                          <td><div className={(version[index < version.length - 1 ? index + 1 : version.length - 1].SelectedContractItem.PmFrequency != eachVersion.SelectedContractItem.PmFrequency) ? "different-cell" : ""}>{eachVersion.SelectedContractItem.PmFrequency}</div></td>
                          <td><div className={(version[index < version.length - 1 ? index + 1 : version.length - 1].SelectedContractItem.IsSez != eachVersion.SelectedContractItem.IsSez) ? "different-cell" : ""}>{eachVersion.SelectedContractItem.IsSez == true ? "Yes" : "No"}</div></td>
                          <td><div className={(version[index < version.length - 1 ? index + 1 : version.length - 1].SelectedContractItem.IsPreAmcNeeded != eachVersion.SelectedContractItem.IsPreAmcNeeded) ? "different-cell" : ""}>{eachVersion.SelectedContractItem.IsPreAmcNeeded == true ? "Yes" : "No"}</div></td>
                          <td><div className={(version[index < version.length - 1 ? index + 1 : version.length - 1].SelectedContractItem.IsStandByImprestStockRequired != eachVersion.SelectedContractItem.IsStandByImprestStockRequired) ? "different-cell" : ""}>{eachVersion.SelectedContractItem.IsStandByImprestStockRequired == true ? "Yes" : "No"}</div></td>
                          <td><div className={(version[index < version.length - 1 ? index + 1 : version.length - 1].SelectedContractItem.IsStandByFullUnitRequired != eachVersion.SelectedContractItem.IsStandByFullUnitRequired) ? "different-cell" : ""}>{eachVersion.SelectedContractItem.IsStandByFullUnitRequired == true ? "Yes" : "No"}</div></td>
                          <td><div className={(version[index < version.length - 1 ? index + 1 : version.length - 1].SelectedContractItem.IsPerformanceGuaranteeRequired != eachVersion.SelectedContractItem.IsPerformanceGuaranteeRequired) ? "different-cell" : ""}>{eachVersion.SelectedContractItem.IsPerformanceGuaranteeRequired == true ? "Yes" : "No"}</div></td>
                          <td><div className={(version[index < version.length - 1 ? index + 1 : version.length - 1].SelectedContractItem.PerformanceGuaranteeAmount != eachVersion.SelectedContractItem.PerformanceGuaranteeAmount) ? "different-cell" : ""}>{eachVersion.SelectedContractItem.PerformanceGuaranteeAmount}</div></td>
                          <td><div className={(version[index < version.length - 1 ? index + 1 : version.length - 1].SelectedContractItem.SalesContactPerson != eachVersion.SelectedContractItem.SalesContactPerson) ? "different-cell" : ""}>{eachVersion.SelectedContractItem.SalesContactPerson}</div></td>
                          <td><div className={(version[index < version.length - 1 ? index + 1 : version.length - 1].SelectedContractItem.CreatedOn != eachVersion.SelectedContractItem.CreatedOn) ? "different-cell" : ""}>{formatDateTime(eachVersion.SelectedContractItem.CreatedOn)}</div></td>
                          <td><div className={(version[index < version.length - 1 ? index + 1 : version.length - 1].SelectedContractItem.CreatedBy != eachVersion.SelectedContractItem.CreatedBy) ? "different-cell" : ""}>{eachVersion.SelectedContractItem.CreatedBy}</div></td>
                          <td><div className={(version[index < version.length - 1 ? index + 1 : version.length - 1].SelectedContractItem.UpdatedOn != eachVersion.SelectedContractItem.UpdatedOn) ? "different-cell" : ""}>{eachVersion.SelectedContractItem.UpdatedOn ? formatDateTime(eachVersion.SelectedContractItem.UpdatedOn) : ""}</div></td> 
                          <td><div className={(version[index < version.length - 1 ? index + 1 : version.length - 1].SelectedContractItem.UpdatedBy != eachVersion.SelectedContractItem.UpdatedBy) ? "different-cell" : ""}>{eachVersion.SelectedContractItem.UpdatedBy}</div></td>
                          <td><div className={(version[index < version.length - 1 ? index + 1 : version.length - 1].SelectedContractItem.CallExpiryDate != eachVersion.SelectedContractItem.CallExpiryDate) ? "different-cell" : ""}>{eachVersion.SelectedContractItem.CallExpiryDate ? formatDateTime(eachVersion.SelectedContractItem.CallExpiryDate) : ""}</div></td>
                          <td><div className={(version[index < version.length - 1 ? index + 1 : version.length - 1].SelectedContractItem.CallStopDate != eachVersion.SelectedContractItem.CallStopDate) ? "different-cell" : ""}>{eachVersion.SelectedContractItem.CallStopDate ? formatDateTime(eachVersion.SelectedContractItem.CallStopDate) : ""}</div></td>
                          <td><div className={(version[index < version.length - 1 ? index + 1 : version.length - 1].SelectedContractItem.CallStopReason != eachVersion.SelectedContractItem.CallStopReason) ? "different-cell" : ""}>{eachVersion.SelectedContractItem.CallStopReason}</div></td>
                        </tr>
                      );
                    })} 
                  </tbody>
                </table>
              ) : (
                <div className="text-muted p-0">{t('contracthistory_no_data')}</div>
              )}
            </div>
          </div>
      })}
    </ContainerPage>
  )
}
export default ContractHistory

async function onLoad(ContractId: string) {
  store.dispatch(initializeContractVersion());
  try {
    const result = await getContractVersion(ContractId);
    store.dispatch(loadContractVersions(result))
  } catch (error) {
    console.error(error);
  }
}