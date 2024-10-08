import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../../../../../state/storeHooks';
import { ContainerPage } from '../../../../ContainerPage/ContainerPage';
import { store } from '../../../../../state/store';
import {
  initializeContractInvoiceScheduleList,
  loadAppkeyValues,
  loadContractInvoiceSchedules,
  toggleInformationModalStatus,
  updateErrors,
} from './ContractInvoiceScheduleList.slice';
import {
  ContractInvoiceScheduleGenerate,
  approveContractInvoiceSchedule,
  getContractInvoiceScheduleList,
} from '../../../../../services/contractInvoiceSchedule';
import { startPreloader, stopPreloader } from '../../../../Preloader/Preloader.slice';
import {
  convertBackEndErrorsToValidationErrors,
  formatCurrency,
  formatDate,
  getDateDifferenceInDays,
} from '../../../../../helpers/formats';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import SweetAlert from 'react-bootstrap-sweetalert';
import { checkForPermission } from '../../../../../helpers/permissions';
import { ContractInvoiceShare } from '../ContractInvoiceShare/ContractInvoiceShare';
import { loadMailDetails, setInvoiceId, updateInvoiceMailCc, updateInvoiceMailDetail } from '../ContractInvoiceShare/ContractInvoiceShare.slice';
import { getAllMailIdList } from '../../../../../services/contractInvoice';
import { getAppKeyValues } from '../../../../../services/appsettings';
const ContractInvoiceScheduleList = () => {
  const { t } = useTranslation();
  const { ContractId } = useParams<{ ContractId: string }>();
  const [SelectedScheduleId, setSelectedScheduleId] = useState(0);
  const {
    contractinvoiceschedulelist: { contractInvoiceSchedules, displayInformationModal, appvalues },
  } = useStore(({ contractinvoiceschedulelist, app }) => ({ contractinvoiceschedulelist, app }));

  useEffect(() => {
    if (checkForPermission('INVOICE_LIST'))
      onLoad();
  }, []);

  const onLoad = async () => {
    store.dispatch(startPreloader());
    store.dispatch(initializeContractInvoiceScheduleList());
    try {
      const AppSettingsKeyValues = await getAppKeyValues('InvoicePreApprovalDays');
      store.dispatch(loadAppkeyValues(AppSettingsKeyValues));
      const ContractInvoiceSchedules = await getContractInvoiceScheduleList(ContractId);
      store.dispatch(loadContractInvoiceSchedules(ContractInvoiceSchedules));
    } catch (error) {
      console.error(error);
    }
    store.dispatch(stopPreloader());
  };

  const handleConfirm = (Id: number) => {
    setSelectedScheduleId(Id);
  };

  const handleCancel = () => {
    setSelectedScheduleId(0);
  };

  const onSubmit = async () => {
    store.dispatch(startPreloader());
    const result = await ContractInvoiceScheduleGenerate(ContractId);
    result.match({
      ok: () => {
        onLoad();
      },
      err: (e) => {
        const errorMessages = convertBackEndErrorsToValidationErrors(e);
        store.dispatch(updateErrors(errorMessages));
      },
    });
    store.dispatch(stopPreloader());
  };

  const onHandleApprove = async (Id: number) => {
    try {
      const result = await approveContractInvoiceSchedule(Id);
      console.log(result);
      onLoad();
    } catch (error) {
      console.log(error);
    }
    setSelectedScheduleId(0);
  };

  const ConfirmationModal = () => {
    return (
      <SweetAlert
        warning
        showCancel
        confirmBtnText={t('contractinvoiceschedule_approve_confirm')}
        confirmBtnBsStyle='warning'
        title={t('contractinvoiceschedule_approve_title')}
        onConfirm={() => onHandleApprove(SelectedScheduleId)}
        onCancel={handleCancel}
        cancelBtnBsStyle='light'
        focusCancelBtn
      >
        {t('contractinvoiceschedule_approve_question')}
      </SweetAlert>
    );
  };

  async function setClickedInvoiceShare(Id: number) {
    store.dispatch(setInvoiceId(Id));
    const result = await getAllMailIdList(String(Id));
    if (result.InvoiceShareInfo.SecondaryContactEmail != null) {
      store.dispatch(updateInvoiceMailCc({ name: "Cc", value: [result.InvoiceShareInfo.SecondaryContactEmail] }));
    }
    store.dispatch(updateInvoiceMailDetail({ name: "To", value: result.InvoiceShareInfo.PrimaryContactEmail }));
    store.dispatch(updateInvoiceMailDetail({ name: "ContractNumber", value: result.InvoiceShareInfo.ContractNumber }));
    store.dispatch(updateInvoiceMailDetail({ name: "InvoiceDate", value: formatDate(result.InvoiceShareInfo.InvoiceDate) }));
    store.dispatch(updateInvoiceMailDetail({ name: "InvoiceNumber", value: result.InvoiceShareInfo.InvoiceNumber }));
    store.dispatch(updateInvoiceMailDetail({ name: "PrimaryContactName", value: result.InvoiceShareInfo.PrimaryContactName }));
    store.dispatch(loadMailDetails(result));
  }

  return (
    <ContainerPage>
      <>{checkForPermission('INVOICE_LIST') && <>
        {contractInvoiceSchedules.match({
          none: () => <>{t('contractinvoiceschedulelist_loading')}</>,
          some: (ContractInvoiceSchedules) => (
            <div className='ps-3  mt-3'>
              <div className='row mt-1 mb-3 p-0 '>
                {ContractInvoiceSchedules.length > 0 && (
                  <div className='col-md-9 app-primary-color '>
                    <h5 className='ms-0 ps-1'> {t('contractinvoiceschedulelist_title')}</h5>
                  </div>
                )}
              </div>
              <div className='row mt-3 ps-1'>
                {ContractInvoiceSchedules.length > 0 ? (
                  <div className=' table-responsive '>
                    <table className='table table-hover text-nowrap table-bordered '>
                      <thead>
                        <tr>
                          <th scope='col'>{t('contractinvoiceschedulelist_th_sl_no')}</th>
                          <th scope='col'>{t('contractinvoiceschedulelist_th_schedulenumber')}</th>
                          <th scope='col'>{t('contractinvoiceschedulelist_th_startdate')}</th>
                          <th scope='col'>{t('contractinvoiceschedulelist_th_enddate')}</th>
                          <th scope='col'>{t('contractinvoiceschedulelist_th_days')}</th>
                          <th scope='col '>{t('contractinvoiceschedulelist_th_rrperday')}</th>
                          <th scope='col'>{t('contractinvoiceschedulelist_th_totalrrvalue')}</th>
                          <th scope='col'>{t('contractinvoiceschedulelist_th_invoicedate')}</th>
                          <th scope='col'>{t('contractinvoiceschedulelist_th_invoiceamount')}</th>
                          <th scope='col '>{t('contractinvoiceschedulelist_th_actions')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ContractInvoiceSchedules.map((field, index) => (
                          <tr className="mt-2" key={index}>
                            <td scope='row'>{index + 1}</td>
                            <td>{field.contractInvoiceSchedule.ScheduleNumber.toString().padStart(3, '0')}</td>
                            <td>{formatDate(field.contractInvoiceSchedule.StartDate)}</td>
                            <td>{formatDate(field.contractInvoiceSchedule.EndDate)}</td>
                            <td>
                              {getDateDifferenceInDays(
                                field.contractInvoiceSchedule.EndDate,
                                field.contractInvoiceSchedule.StartDate
                              )}
                            </td>
                            <td className='text-end'>{field.contractInvoiceSchedule.RrPerDay}</td>
                            <td className='text-end'>
                              <div
                                className={
                                  getDateDifferenceInDays(
                                    field.contractInvoiceSchedule.EndDate,
                                    field.contractInvoiceSchedule.StartDate
                                  ) *
                                    field.contractInvoiceSchedule.RrPerDay !=
                                    field.contractInvoiceSchedule.TotalRrValue
                                    ? 'different-cell'
                                    : ''
                                }
                              >
                                {field.contractInvoiceSchedule.TotalRrValue}
                              </div>
                            </td>
                            <td>{formatDate(field.contractInvoiceSchedule.ScheduledInvoiceDate)}</td>
                            <td className='text-end'>{formatCurrency(field.contractInvoiceSchedule.ScheduledInvoiceAmount)}</td>
                            <td>
                              {checkForPermission('INVOICE_LIST') && (
                                <>
                                  {field.contractInvoiceSchedule.ContractInvoiceId > 0 ? (
                                    <>
                                      <a
                                        role='button'
                                        className=' ms-0 ps-1'
                                        href={`/invoice/${field.contractInvoiceSchedule.ContractInvoiceId}`}
                                      >
                                        {t('contractinvoiceschedulelist_btn_view')}
                                      </a>
                                      &nbsp;&nbsp;
                                      <a
                                        className='pseudo-href app-primary-color'
                                        onClick={() => setClickedInvoiceShare(field.contractInvoiceSchedule.ContractInvoiceId)}
                                        data-bs-toggle='modal'
                                        data-bs-target='#InvoiceShare'
                                      >
                                        Share
                                      </a>
                                    </>
                                  ) : (field.contractInvoiceSchedule.IsInvoiceApproved == true) ? (
                                    new Date(field.contractInvoiceSchedule.ScheduledInvoiceDate) <=
                                    new Date(
                                      new Date().setDate(
                                        new Date().getDate() + Number(appvalues?.AppValue ?? 0)
                                      )
                                    ) && (
                                      <>{checkForPermission('INVOICE_CREATE') ?
                                        <Link
                                          to={`/contracts/view/${ContractId}/create-invoice/${field.contractInvoiceSchedule.Id}`}
                                          className='text-none ms-0 ps-1'
                                        >
                                          {t('contractinvoiceschedulelist_btn_create')}
                                        </Link> 
                                        : <p className="text-muted mb-0"> {t('invoiceschedulelist_text_approved')}</p>
                                      }</>

                                    )
                                  ) : checkForPermission('INVOICE_APPROVE') && (
                                    new Date(field.contractInvoiceSchedule.ScheduledInvoiceDate) <=
                                    new Date(
                                      new Date().setDate(
                                        new Date().getDate() + Number(appvalues?.AppValue ?? 0)
                                      )
                                    ) && (
                                      <a
                                        className='pseudo-href'
                                        onClick={() => handleConfirm(field.contractInvoiceSchedule.Id)}
                                      >
                                        {t('contractinvoiceschedulelist_btn_approve')}
                                      </a>
                                    )
                                  )}
                                </>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <>
                    <div className='text-muted'>
                      {checkForPermission('CONTRACT_ACCOUNTS') && (
                        <button className='btn app-primary-bg-color text-white' onClick={onSubmit}>
                          {t('contract_invoice_generate_success')}
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
              {SelectedScheduleId ? <ConfirmationModal /> : ' '}
              <ContractInvoiceShare />
            </div>
          ),
        })}
      </>}
      </>
    </ContainerPage>
  );
};

export default ContractInvoiceScheduleList 