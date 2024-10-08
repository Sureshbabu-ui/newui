import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import SweetAlert from 'react-bootstrap-sweetalert';
import { useStore } from '../../../../state/storeHooks';
import { store } from '../../../../state/store';
import { startPreloader, stopPreloader } from '../../../Preloader/Preloader.slice';
import { InvoiceSchedulesListState, changePage, initializeInvoiceScheduleList, loadInvoiceSchedules, setFilter, updateField } from './InvoiceScheduleList.slice';
import { getInvoiceScheduleList } from '../../../../services/invoice';
import { formatCurrency, formatDate, getDateDifferenceInDays } from '../../../../helpers/formats';
import { checkForPermission } from '../../../../helpers/permissions';
import { ContainerPage } from '../../../ContainerPage/ContainerPage';
import { approveContractInvoiceSchedule } from '../../../../services/contractInvoiceSchedule';
import { ContractInvoiceShare } from '../../ContractSubMenu/ContractInvoiceSchedule/ContractInvoiceShare/ContractInvoiceShare';
import { loadMailDetails, setInvoiceId, updateInvoiceMailCc, updateInvoiceMailDetail } from '../../ContractSubMenu/ContractInvoiceSchedule/ContractInvoiceShare/ContractInvoiceShare.slice';
import { getAllMailIdList } from '../../../../services/contractInvoice';
import { Pagination } from '../../../Pagination/Pagination';
import Select from 'react-select';
import { string } from 'decoders';
import { InvoiceSearchForFilter } from '../../../../types/invoice';

const InvoiceScheduleList = () => {
  const { t } = useTranslation();
  const [SelectedScheduleId, setSelectedScheduleId] = useState(0);
  const {
    invoiceschedulelist: { InvoiceSchedules, searchWith, filters, totalRows, currentPage, perPage },
  } = useStore(({ invoiceschedulelist, app }) => ({ invoiceschedulelist, app }));

  useEffect(() => {
    onLoad();
  }, []);


  const fetchInvoiceList = async (CurrentPage: number, SearchWith?: string, Filters?: InvoiceSearchForFilter) => {
    if (checkForPermission('INVOICE_LIST')) {
      store.dispatch(startPreloader());
      try {
        const ContractInvoiceSchedules = await getInvoiceScheduleList(CurrentPage, SearchWith, Filters);
        store.dispatch(loadInvoiceSchedules(ContractInvoiceSchedules));
      } catch (error) {
        console.error(error);
      }
      store.dispatch(stopPreloader());
    }
  }

  const onLoad = async () => {
    store.dispatch(initializeInvoiceScheduleList());
    fetchInvoiceList(1)
  };

  useEffect(() => {
    fetchInvoiceList(currentPage, searchWith, filters)
  }, [currentPage])

  const options = [
    { value: 'ContractNumber', label: 'Contract Number' },
    { value: 'CustomerName', label: 'Customer Name' },
    { value: 'DateBetween', label: 'Date Between ' },
    { value: 'InvoiceNumber', label: 'Invoice Number ' }
  ]

  const searchFilter = async (selectedOption: any) => {
    var value = selectedOption.value
    if (value) {
      await fetchInvoiceList(1, searchWith,)
    }
    store.dispatch(setFilter({ value }));
  }

  const onUpdateField = async (ev: any) => {
    if (ev.target.value == "") {
      if (currentPage == 1)
        fetchInvoiceList(1)
      store.dispatch(changePage(1))
    }
    var name = ev.target.name;
    var value = ev.target.value;
    store.dispatch(updateField({ name: name as keyof InvoiceSchedulesListState['filters'], value }));
  }

  const handleConfirm = (Id: number) => {
    setSelectedScheduleId(Id);
  };

  const handleCancel = () => {
    setSelectedScheduleId(0);
  };

  const onHandleApprove = async (Id: number) => {
    try {
      const result = await approveContractInvoiceSchedule(Id);
      await fetchInvoiceList(currentPage, searchWith, filters);
    } catch (error) {
      console.log(error);
    }
    setSelectedScheduleId(0);
  };

  const onPageChange = async (index: number) => {
    store.dispatch(changePage(index));
  }

  const ConfirmationModal = () => {
    return (
      <SweetAlert
        warning
        showCancel
        confirmBtnText={t('invoiceschedulelist_approve_confirm')}
        confirmBtnBsStyle='warning'
        title={t('invoiceschedulelist_approve_title')}
        onConfirm={() => onHandleApprove(SelectedScheduleId)}
        onCancel={handleCancel}
        cancelBtnBsStyle='light'
        focusCancelBtn
      >
        {t('invoiceschedulelist_approve_question')}
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

  const filterInvoiceList = () => {
    store.dispatch(changePage(1));
    fetchInvoiceList(1, searchWith, filters)
  }

  return (

    <ContainerPage>
      <>{checkForPermission('INVOICE_LIST') && <>
        {InvoiceSchedules.match({
          none: () => <>{t('invoiceschedulelist_loading')}</>,
          some: (ContractInvoiceSchedules) => (
            <div className="px-3">
              <div className="row mb-3 p-0">
                {ContractInvoiceSchedules.length > 0 && (
                  <div className="col-md-9 app-primary-color">
                    <h5 className="ms-0 ps-0"> {t('invoiceschedulelist_title')}</h5>
                  </div>
                )}
              </div>
              {/* filters */}
              <div className="row py-0 pb-3 mx-0">
                {/* column selector */}
                <div className="col-md-4 p-0 " >
                  <Select
                    options={options}
                    onChange={searchFilter}
                    placeholder="Select Filter"
                    value={options && options.find(item => item.value == searchWith)}
                    defaultValue={options ? options[0] : null}
                    isSearchable
                    classNamePrefix="react-select"
                  />
                </div>
                {/* column selector end */}
                {/* search */}
                <div className='col-md-7'>
                  {searchWith == "DateBetween" ? (
                    <div className="row m-0">
                      <div className='col-md-6'>
                        <input
                          name='StartDate'
                          type='date'
                          className='form-control'
                          value={filters.StartDate}
                          onChange={onUpdateField}
                        />
                      </div>
                      <div className='col-md-6'>
                        <input
                          name='EndDate'
                          type='date'
                          className='form-control'
                          value={filters.EndDate}
                          onChange={onUpdateField}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className=" ">
                      <input type='search' className="form-control col-md-6 " name="SearchText"
                        value={filters.SearchText}
                        placeholder={t('contract_management_search_placeholder') ?? ''} onChange={onUpdateField}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            filterInvoiceList()
                          }
                        }} />
                    </div>
                  )}
                </div>
                {/* search ends */}
                {/* search button */}
                <div className='col-md-1 float-end px-1 ' >
                  <button className="btn app-primary-bg-color float-end text-white" type="button" onClick={() => fetchInvoiceList(1, searchWith, filters)}>
                    {t('invoiceschedulelist_btn_search')}
                  </button>
                </div>
                {/* search button ends */}

              </div>
              {/* filters end */}
              <div className="row ps-0 pe-2 mx-0">
                {ContractInvoiceSchedules.length > 0 ? (
                  <div className="table-responsive overflow-auto border px-0">
                    <table className="table text-nowrap table-bordered table-hover">
                      <thead>
                        <tr>
                          <th scope='col'>{t('invoiceschedulelist_th_sl_no')}</th>
                          <th scope='col'>{t('invoiceschedulelist_th_customer')}</th>
                          <th scope='col'>{t('invoiceschedulelist_th_contractno')}</th>
                          <th scope='col'>{t('invoiceschedulelist_th_invoicenumber')}</th>
                          <th scope='col'>{t('invoiceschedulelist_th_startdate')}</th>
                          <th scope='col'>{t('invoiceschedulelist_th_enddate')}</th>
                          <th scope='col'>{t('invoiceschedulelist_th_days')}</th>
                          <th scope='col'>{t('invoiceschedulelist_th_invoicedate')}</th>
                          <th scope='col'>{t('invoiceschedulelist_th_invoiceamount')}</th>
                          <th scope='col'>{t('invoiceschedulelist_th_netinvoiceamount')}</th>
                          <th scope='col'>{t('invoiceschedulelist_th_collectedamount')}</th>
                          <th scope='col '>{t('invoiceschedulelist_th_actions')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ContractInvoiceSchedules.map((field, index) => (
                          <tr className="mt-2" key={index}>
                            <td scope="row" className="text-center">{(currentPage - 1) * 10 + index + 1}</td>
                            <td>{field.invoiceSchedule.CustomerName}</td>
                            <td>{field.invoiceSchedule.ContractNumber}</td>
                            <td>{field.invoiceSchedule.InvoiceNumber}</td>
                            <td>{formatDate(field.invoiceSchedule.StartDate)}</td>
                            <td>{formatDate(field.invoiceSchedule.EndDate)}</td>
                            <td className="text-center">
                              {getDateDifferenceInDays(
                                field.invoiceSchedule.EndDate,
                                field.invoiceSchedule.StartDate
                              )}
                            </td>
                            <td>{formatDate(field.invoiceSchedule.ScheduledInvoiceDate)}</td>
                            <td className='text-end'>{formatCurrency(field.invoiceSchedule.ScheduledInvoiceAmount)}</td>
                            <td className='text-end'>{field.invoiceSchedule.NetInvoiceAmount ? formatCurrency(field.invoiceSchedule.NetInvoiceAmount) : ''}</td>
                            <td className='text-end'>{field.invoiceSchedule.CollectedAmount ? formatCurrency(field.invoiceSchedule.CollectedAmount) : ''}</td>
                            <td>
                              {checkForPermission('INVOICE_LIST') && (
                                <>
                                  {
                                    field.invoiceSchedule.ContractInvoiceId > 0 ? (
                                      <>
                                        <a
                                          role='button'
                                          className=' ms-0 ps-1'
                                          href={`/invoice/${field.invoiceSchedule.ContractInvoiceId}`}
                                        >
                                          {t('invoiceschedulelist_btn_view')}
                                        </a>
                                        
                                 {field.invoiceSchedule.ContractInvoiceId ? <span className="mx-2"><Link className="mx-0 px-0" to={`/finance/invoices/collection/${field.invoiceSchedule.ContractInvoiceId}`}> {t('invoiceschedulelist_link_collection')}</Link></span> :<></>}       
                                        &nbsp;&nbsp;
                                        <a
                                          className='pseudo-href app-primary-color'
                                          onClick={() => setClickedInvoiceShare(field.invoiceSchedule.ContractInvoiceId)}
                                          data-bs-toggle='modal'
                                          data-bs-target='#InvoiceShare'
                                        >
                                          Share
                                        </a>
                                      </>

                                    ) : field.invoiceSchedule.IsInvoiceApproved == true ? (
                                      <>
                                      {checkForPermission('INVOICE_CREATE') ? <Link
                                        to={`/finance/invoices/create/${field.invoiceSchedule.Id}`}
                                        className='text-none ms-0 ps-1'
                                      >
                                        {' '}
                                        {t('invoiceschedulelist_btn_create')}
                                      </Link>: <p className="text-muted mb-0"> {t('invoiceschedulelist_text_approved')}</p>
                                      }
                                      </>
                                    ) : checkForPermission('INVOICE_APPROVE')&& (
                                      <a
                                        className='pseudo-href'
                                        onClick={() => handleConfirm(field.invoiceSchedule.Id)}
                                      >
                                        {t('invoiceschedulelist_btn_approve')}
                                      </a>
                                    )}
                                </>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="m-0">
                      <Pagination currentPage={currentPage} count={totalRows} itemsPerPage={perPage} onPageChange={onPageChange} />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className='text-muted'>

                      {t('invoiceschedulelist__nodata')}

                    </div>
                  </>
                )}
              </div>
              {SelectedScheduleId ? <ConfirmationModal /> : ' '}
              <ContractInvoiceShare />
            </div>
          ),
        })}
      </>}</>
    </ContainerPage>

  );
};

export default InvoiceScheduleList 