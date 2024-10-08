import { useEffect } from 'react';
import { store } from '../../../../../state/store';
import { useStore } from '../../../../../state/storeHooks';
import { ContainerPage } from '../../../../ContainerPage/ContainerPage';
import { Pagination } from '../../../../Pagination/Pagination';
import { loadManPower, changePage, setSearch, initializeManPowersList, setVisibleModal } from './ManPowerSummaryList.slice';
import { EditManPowerSummary } from './EditManPowerSummary';
import { ManPowerSummaryCreate } from './ManPowerSummaryCreate';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getManPowerSummaryList, getSelectedManpowerSummary } from '../../../../../services/manpowers';
import { setManPower } from './EditManPowerSummary.slice';
import FeatherIcon from 'feather-icons-react';
import { formatCurrency } from '../../../../../helpers/formats';
import { checkForPermission } from '../../../../../helpers/permissions';

 function ManPowerManagement() {
  const { t, i18n } = useTranslation();
  const { manpowermanagement: { manpowersummary, totalRows, perPage, CurrentPage, search } } = useStore(({ manpowermanagement, app }) => ({ manpowermanagement, app }));
  const { ContractId } = useParams<{ ContractId: string }>();
  useEffect(() => {
    onLoad(ContractId);
  }, [ContractId]);

  const filterManPowersList = async (event: any) => {
    const result = await getManPowerSummaryList(event.target.value, store.getState().manpowermanagement.CurrentPage, ContractId);
    store.dispatch(loadManPower(result));
  }
  const addData = async (event: any) => {
    store.dispatch(setSearch(event.target.value));
    if (event.target.value == "") {
      const result = await getManPowerSummaryList(store.getState().manpowermanagement.search, store.getState().manpowermanagement.CurrentPage, ContractId);
      store.dispatch(loadManPower(result));
    }
  }

  async function onPageChange(index: number) {
    store.dispatch(changePage(index));
    const searchKey = store.getState().manpowermanagement.search;
    const result = await getManPowerSummaryList(searchKey, index, ContractId);
    store.dispatch(loadManPower(result));
  }
  return (
    <ContainerPage>
      <div className="row m-0 ps-2">
        <div className="d-flex justify-content-between ps-0 pe-0  ms-0">
          <div className="col-md-7">
            <h5 className=" pt-1 ms-0 app-primary-color">{t('manpowermanagement_summary_main_heading')}</h5>
          </div>
          {store.getState().generalcontractdetails.singlecontract.ContractStatusCode !== 'CTS_PNDG' &&
            <div className="col-md-4">
              <button onClick={() => store.dispatch(setVisibleModal("createNewManpower"))} disabled={store.getState().generalcontractdetails.singlecontract.ContractStatusCode === 'CTS_PNDG'} className="btn app-primary-bg-color text-white d-flex justify-content-center float-end" data-bs-toggle="modal" data-bs-target="#createNewManpower">
                {t('manpowermanagement_button_add_manpower')}
              </button>
            </div>
          }
        </div>
        <div className="mb-3 mt-2 p-0">
          <div className="input-group ">
            <input type='search' className="form-control custom-input" value={search} placeholder={t('manpowermanagement_search_placeholder') ?? ''} onChange={addData}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  filterManPowersList(e);
                }
              }} />
            <button className="btn app-primary-bg-color text-white float-end " type="button" onClick={filterManPowersList}>
              {t('manpowermanagement_summary_search_button')}
            </button>
          </div>
        </div>
        <ManPowerSummaryCreate />
        <EditExistingManPower />
      </div>
      {manpowersummary.match({
        none: () =>
          <div className="row m-2 ps-3">{t('manpowermanagement_loading_manpower')}</div>,
        some: (manpowersummary) =>
          <div className="row m-0 ps-2 ">
            <div className="row m-0 pe-0 ps-0 ms-0 mt-2">
              {manpowersummary.length > 0 ? (
                <div className='ps-0 table-responsive overflow-auto pe-0'>
                  <table className="table table-bordered text-nowrap">
                    <thead>
                      <tr>
                        <th scope="col">{t('manpowermanagement_header_th_sl_no')}</th>
                        <th scope="col">{t('manpowermanagement_header_customer_site_table')}</th>
                        <th scope="col">{t('manpowermanagement_header_location_table')}</th>
                        <th scope="col">{t('manpowermanagement_header_engineertype_table')}</th>
                        <th scope="col">{t('manpowermanagement_header_engineerlevel_table')}</th>
                        <th scope="col">{t('manpowermanagement_header_engineermonthlycost_table')}</th>
                        <th scope="col">{t('manpowermanagement_header_engineercount_table')}</th>
                        <th scope="col">{t('manpowermanagement_header_duration_in_month_table')}</th>
                        <th scope="col">{t('manpowermanagement_header_customer_agreed_amount_table')}</th>
                        <th scope="col">{t('manpowermanagement_header_budgeted_amount_table')}</th>
                        <th scope="col">{t('manpowermanagement_header_margin_amount_table')}</th>
                        <th scope="col">{t('manpowermanagement_header_remarks_table')}</th>
                        <th scope="col">{t('manpowermanagement_header_actions_table')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {manpowersummary.map((field, index) => (
                        <tr className={""} key={index}>
                          <th scope="row">{(CurrentPage - 1) * 10 + (index + 1)}</th>
                          <td>{field.manpowersummary.CustomerSite}</td>
                          <td>{field.manpowersummary.TenantOffice}</td>
                          <td>{field.manpowersummary.EngineerType}</td>
                          <td>{field.manpowersummary.EngineerLevel}</td>
                          <td>{formatCurrency(field.manpowersummary.EngineerMonthlyCost)}</td>
                          <td>{field.manpowersummary.EngineerCount}</td>
                          <td>{field.manpowersummary.DurationInMonth}</td>
                          <td>{formatCurrency(field.manpowersummary.CustomerAgreedAmount)}</td>
                          <td>{formatCurrency(field.manpowersummary.BudgetedAmount)}</td>
                          <td>{formatCurrency(field.manpowersummary.MarginAmount)}</td>
                          <td>{field.manpowersummary.Remarks}</td>
                          <td>
                            <a
                              className="pseudo-href app-primary-color"
                              onClick={() => loadClickedManPowerDetails(field.manpowersummary.Id.toString())}
                              data-bs-toggle="modal"
                              data-bs-target="#manpoweredit"
                            >
                              <FeatherIcon className="ms-3" icon={"edit"} size="16" />
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-muted p-0">{t('manpowermanagement_no_manpower_data_found')}</div>
              )}
            </div>
            <div className="row m-0 pe-0 ps-0 ms-0 mt-4">
              <Pagination currentPage={CurrentPage} count={totalRows} itemsPerPage={perPage} onPageChange={onPageChange} />
            </div>
          </div>
      })}
    </ContainerPage>
  );
}

async function loadClickedManPowerDetails(Id: string) {
  store.dispatch(setVisibleModal("manpoweredit"))
  const manpowersummary = await getSelectedManpowerSummary(Id);
  store.dispatch(setManPower(manpowersummary.ContractManpowerSummary));
}

function EditExistingManPower() {
  const { t, i18n } = useTranslation();
  return (
    <div className="modal fade px-0" id="manpoweredit" data-bs-backdrop="static" data-bs-keyboard="false" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title app-primary-color">{t('manpowermanagement_modal_title_update_manpower_summary')}</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              id="closeEditManPowerModal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <EditManPowerSummary />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManPowerManagement
async function onLoad(ContractId: string) {
  store.dispatch(initializeManPowersList());
  try {
    const CurrentPage = store.getState().manpowermanagement.CurrentPage;
    const searchKey = store.getState().manpowermanagement.search;
    const employees = await getManPowerSummaryList(searchKey, CurrentPage, ContractId);
    store.dispatch(loadManPower(employees));
  } catch (error) {
    console.error(error);
  }
}