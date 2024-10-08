import { useEffect } from 'react';
import { store } from '../../../../../state/store';
import { useStore } from '../../../../../state/storeHooks';
import { ContainerPage } from '../../../../ContainerPage/ContainerPage';
import { Pagination } from '../../../../Pagination/Pagination';
import { loadManPowerAllocations, changePage, setSearch, initializeManPowerAllocationsList, setVisibleModal } from './ManPowerAllocationList.slice';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getManPowerAllocationList, getSelectedManpowerAllocation } from '../../../../../services/contractmanowerallocation';
import { ManPowerAllocationCreate } from './CreateManPowerAllocation';
import { formatCurrency, formatDate, formatDocumentName } from '../../../../../helpers/formats';
import { setManPowerAllocation } from './EditManPowerAllocation.slice';
import { EditManPowerAllocation } from './EditManpowerAllocation';
import FeatherIcon from 'feather-icons-react';
import BreadCrumb from '../../../../BreadCrumbs/BreadCrumb';
import FileSaver from 'file-saver';
import { downloadContractManpowerAllocationListReport } from '../../../../../services/reports';

 function ManPowerAllocationList() {
  const { t, i18n } = useTranslation();
  const { manpowerallocation: { manpowerallocation, totalRows, CurrentPage, search, perPage } } = useStore(({ manpowerallocation, app }) => ({ manpowerallocation, app }));

  const { ContractId } = useParams<{ ContractId: string }>();
  useEffect(() => {
    onLoad(ContractId);
  }, [ContractId]);

  const filterManpowerAllocations = async (event: any) => {
    const result = await getManPowerAllocationList(event.target.value, store.getState().manpowerallocation.CurrentPage, ContractId);
    store.dispatch(loadManPowerAllocations(result));
  }
  const addData = async (event: any) => {
    store.dispatch(setSearch(event.target.value));
    if (event.target.value == "") {
      const result = await getManPowerAllocationList(store.getState().manpowerallocation.search, store.getState().manpowerallocation.CurrentPage, ContractId);
      store.dispatch(loadManPowerAllocations(result));
    }
  }

  async function onPageChange(index: number) {
    store.dispatch(changePage(index));
    const searchKey = store.getState().manpowerallocation.search;
    const result = await getManPowerAllocationList(searchKey, index, ContractId);
    store.dispatch(loadManPowerAllocations(result));
  }
  const breadcrumbItems = [
    { Text: 'breadcrumbs_home', Link: '/' },
    { Text: 'breadcrumbs_masters', Link: '/config/masters' },
    { Text: 'breadcrumbs_masters_manpower_allocation_list' }
  ];

  const onDownloadClick = async () => {
    const response = await downloadContractManpowerAllocationListReport(ContractId);
    const url = window.URL.createObjectURL(response.data);
    FileSaver.saveAs(url, formatDocumentName());
  };

  async function loadClickedManPowerAllocationDetails(Id: string) {
    store.dispatch(setVisibleModal("editManpowerAllocation"))
    const manpowerallocation = await getSelectedManpowerAllocation(Id);
    store.dispatch(setManPowerAllocation(manpowerallocation.AllocationDetails));
  }

  async function onLoad(ContractId: string) {
    store.dispatch(initializeManPowerAllocationsList());
    try {
      const CurrentPage = store.getState().manpowerallocation.CurrentPage;
      const searchKey = store.getState().manpowerallocation.search;
      const employees = await getManPowerAllocationList(searchKey, CurrentPage, ContractId);
      store.dispatch(loadManPowerAllocations(employees));
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <ContainerPage>
      <>
        <BreadCrumb items={breadcrumbItems} />
        {manpowerallocation.match({
          none: () => <div className="row ps-5">{t('manpowerallocation_loading_manpower')}</div>,
          some: (manpowerallocation) =>
            <div className="">
              <div className="d-flex bd-highlight">
                <div className="p-2 bd-highlight">
                  <div className="dropdown nav-link">
                    <span className="material-symbols-outlined align-middle" role="button" data-bs-toggle="dropdown" aria-expanded="false">menu</span>
                    <div className="dropdown-menu">
                      {store.getState().generalcontractdetails.singlecontract.ContractStatusCode !== 'CTS_PNDG' &&
                        <a onClick={() => store.dispatch(setVisibleModal("createManpowerAllocation"))} className="dropdown-item" role='button' data-bs-toggle="modal" data-bs-target="#createManpowerAllocation">
                          {t('manpowermanagement_button_add_manpower')}
                        </a>
                      }
                      <a className="dropdown-item" onClick={() => onDownloadClick()} role='button'>
                        {t('manpowerallocation_asset_download')}
                      </a>
                    </div>
                  </div>
                </div>
                <div className="p-2 w-50 bd-highlight  d-flex justify-content-start fw-bold app-primary-color"><h5>{t('manpowerallocation_main_heading')}</h5></div>
                <div className="p-2 w-50 bd-highlight ">
                  <div className="input-group ">
                    <input type='search' className="form-control custom-input" value={search} placeholder={t('manpowerallocation_search_placeholder') ?? ''} onChange={addData}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          filterManpowerAllocations(e);
                        }
                      }} />
                    <button className="btn app-primary-bg-color text-white float-end " type="button" onClick={filterManpowerAllocations}>
                      {t('manpowerallocation_summary_search_button')}
                    </button>
                  </div>
                </div>
              </div>


              <div className="row mt-3 ps-1">
                {manpowerallocation.length > 0 ? (
                  <div className=" table-responsive ">
                    <table className="table table-hover  table-bordered ">
                      <thead>
                        <tr>
                          <th scope="col">{t('manpowerallocation_header_th_sl_no')}</th>
                          <th scope="col">{t('manpowerallocation_header_customer_site')}</th>
                          <th scope="col">{t('manpowerallocation_header_allocation_status')}</th>
                          <th scope="col">{t('manpowerallocation_header_employeename')}</th>
                          <th scope="col">{t('manpowerallocation_header_startdate')}</th>
                          <th scope="col">{t('manpowerallocation_header_enddate')}</th>
                          <th scope="col">{t('manpowerallocation_header_customer_agreed_amount')}</th>
                          <th scope="col">{t('manpowerallocation_header_budgeted_amount')}</th>
                          <th scope="col">{t('manpowerallocation_header_margin_amount')}</th>
                          <th scope="col">{t('manpowerallocation_header_remarks')}</th>
                          <th scope="col">{t('manpowermanagement_header_actions_table')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {manpowerallocation.map((field, index) => (
                          <tr className={""} key={index}>
                            <th scope="row">{(CurrentPage - 1) * 10 + (index + 1)}</th>
                            <td>{field.manpowerallocation.CustomerSite}</td>
                            <td>{field.manpowerallocation.AllocationStatus}</td>
                            <td>{field.manpowerallocation.EmployeeName}</td>
                            <td>{field.manpowerallocation.StartDate ? formatDate(field.manpowerallocation.StartDate) : ""}</td>
                            <td>{field.manpowerallocation.EndDate ? formatDate(field.manpowerallocation.EndDate) : ""}</td>
                            <td>{formatCurrency(field.manpowerallocation.CustomerAgreedAmount)}</td>
                            <td>{formatCurrency(field.manpowerallocation.BudgetedAmount)}</td>
                            <td>{formatCurrency(field.manpowerallocation.MarginAmount)}</td>
                            <td>{field.manpowerallocation.Remarks}</td>
                            <td>
                              <a
                                className="pseudo-href app-primary-color"
                                onClick={() => loadClickedManPowerAllocationDetails(field.manpowerallocation.Id.toString())}
                                data-bs-toggle="modal"
                                data-bs-target="#editManpowerAllocation"
                              >
                                <FeatherIcon icon="edit" size="16" />
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="row m-0">
                      <Pagination currentPage={CurrentPage} count={totalRows} itemsPerPage={perPage} onPageChange={onPageChange} />
                    </div>
                  </div>
                ) : (
                  <div className="text-muted row ps-3">{t('divisionlist_no_data')}</div>
                )}
              </div>
              <EditManPowerAllocation />
              <ManPowerAllocationCreate />
            </div>
        })}
      </>
    </ContainerPage>
  );
}
export default ManPowerAllocationList
