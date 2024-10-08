import { ContainerPage } from '../../ContainerPage/ContainerPage';
import { contractTabs } from '../../../tabs.json'
import { useState, useEffect, lazy, Suspense, useMemo, useRef } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import ApprovalRequest from '../ContractSubMenu/General/ContractApprovalRequest/ApprovalRequestStatus';
import { store } from '../../../state/store';
import { useStoreWithInitializer } from '../../../state/storeHooks';
import { initializeContract, setContractStatus } from './ContractView.slice';
import { ContractTab } from '../../../types/contract';
import { useParams } from 'react-router-dom';
import { getClickedContractDetails } from '../../../services/contracts';
import { loadReviewDetails, setTenantId } from '../ContractSubMenu/General/ContractApprovalRequest/RequestApproval/RequestApproval.slice';
import { loadContracts } from '../ContractSubMenu/General/General.slice';
import BreadCrumb from '../../BreadCrumbs/BreadCrumb';
import { SuspensePreloader } from '../../SuspensePreloader/SuspensePreloader';
import { formatDate } from '../../../helpers/formats';
import { useTranslation } from 'react-i18next';
export function ContractView() {

  const { singlecontract } = useStoreWithInitializer(
    ({ generalcontractdetails }) => generalcontractdetails, onLoad);

  const { ContractId } = useParams<{ ContractId: string }>();
  const [filteredTabs, setFilteredTabs] = useState<ContractTab[]>([]);
  const [selectedTabName, setSelectedTabName] = useState('');
  const location = useLocation();
  const history = useHistory();
  const { t } = useTranslation();

  const handleTabClick = (tabName: string) => {
    setSelectedTabName(tabName);
    // Add the tab information to the URL
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("Tab", tabName); // Set the tab name as the parameter
    history.push({ search: searchParams.toString() });
  }

  const [Tab, setTab] = useState('')
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams) {
      const Tab = searchParams.get("Tab");
      setTab(Tab ? Tab : '')
    }
  }, [location.search]);

  useEffect(() => {
    if (Tab !== undefined && Tab !== '' && filteredTabs.length > 0) {
      setSelectedTabName(Tab);
    } else {
      // If Tab is not defined or is an empty string, set it to the first element in the array
      const initialTab = filteredTabs[0];
      if (initialTab && initialTab.name) {
        const searchParams = new URLSearchParams(location.search);
        searchParams.set("Tab", initialTab.name);
        history.push({ search: searchParams.toString() });
      }
    }
  }, [Tab, filteredTabs]);

  async function onLoad() {
    store.dispatch(initializeContract());
    try {
      const result = await getClickedContractDetails(ContractId);
      await store.dispatch(setContractStatus(result.ContractDetails.ContractStatusCode))
      await store.dispatch(setTenantId(result.ContractDetails.TenantOfficeId))
      result.ContractDetails.ReviewComment ? await store.dispatch(loadReviewDetails(JSON.parse(result.ContractDetails.ReviewComment))) : ""
      store.dispatch(loadContracts(result));
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    //TODOS THIS FUNCTIONALITY NEED TO REWORK
    let indexesToKeep;
    if (singlecontract.ContractStatusCode == 'CTS_PGRS' || singlecontract.ContractStatusCode == 'CTS_PNDG') {
      indexesToKeep = ['DETAILS', 'REVIEWHISTORY', 'PREAMC', 'CUSTOMER', 'CUSTOMERSITE', 'DOCUMNETS', 'BANKGUARANTEE', 'FUTUREPDATES', 'PMSCHEDULE'];
      if (singlecontract.AgreementTypeCode !== 'AGT_FMSO') {
        indexesToKeep.push('ASSETS');
      }
      if (singlecontract.AgreementTypeCode && ['AGT_FMSO', 'AGT_AFMS', 'AGT_NFMS'].includes(singlecontract.AgreementTypeCode)) {
        indexesToKeep.push('MANPOWER');
      }
      setFilteredTabs(contractTabs.filter((tabs) => indexesToKeep.includes(tabs.name)));
    }
    else if (singlecontract.ContractStatusCode !== 'CTS_PGRS') {
      if (singlecontract.ContractStatusCode == 'CTS_APRV') {
        indexesToKeep = ['DASHBOARD', 'DETAILS', 'REVIEWHISTORY', 'REVENUE', 'PREAMC', 'CUSTOMER', 'CUSTOMERSITE', 'DOCUMNETS', 'INVOICESCHEDULE', 'SETTING', 'BANKGUARANTEE', 'FUTUREPDATES', 'PMSCHEDULE']
        if (singlecontract.AgreementTypeCode !== 'AGT_FMSO') {
          indexesToKeep.push('ASSETS');
        }
        if (singlecontract.AgreementTypeCode && ['AGT_FMSO', 'AGT_AFMS', 'AGT_NFMS'].includes(singlecontract.AgreementTypeCode)) {
          indexesToKeep.push('MANPOWER');
        }
      } else {
        indexesToKeep = ['DASHBOARD', 'DETAILS', 'REVIEWHISTORY', 'PREAMC', 'CUSTOMER', 'CUSTOMERSITE', 'DOCUMNETS', 'SETTING', 'BANKGUARANTEE', 'FUTUREPDATES', 'PMSCHEDULE'];
        if (singlecontract.AgreementTypeCode !== 'AGT_FMSO') {
          indexesToKeep.push('ASSETS');
        }
        if (singlecontract.AgreementTypeCode && ['AGT_FMSO', 'AGT_AFMS', 'AGT_NFMS'].includes(singlecontract.AgreementTypeCode)) {
          indexesToKeep.push('MANPOWER');
        }
      }
      setFilteredTabs(contractTabs.filter((tabs) => indexesToKeep.includes(tabs.name)));
    }
  }, [singlecontract.ContractStatusCode, singlecontract.AgreementTypeId, singlecontract.IsMultiSite, singlecontract.SiteCount]);
  const breadcrumbItems = [
    { Text: 'breadcrumbs_home', Link: '/' },
    { Text: 'breadcrumbs_contracts', Link: '/contracts' },
    { Text: 'breadcrumbs_contract_view' }
  ];

  const memoizedLazyComponents = useMemo(() => {
    return filteredTabs.reduce((memo, tab) => {
      if (tab.name === selectedTabName) {
        memo[tab.id] = lazy(() => import(`../ContractSubMenu/${tab.component}`));
      } 
      return memo;
    }, {});
  }, [filteredTabs, selectedTabName]);

  // Get the current date
  const currentDate: Date = new Date();
  const startDate: Date = new Date(store.getState().generalcontractdetails.singlecontract.StartDate);
  const endDate: Date = new Date(store.getState().generalcontractdetails.singlecontract.EndDate);

  // Calculate the total duration and duration from start date to current date in milliseconds
  const totalDuration: number = endDate.getTime() - startDate.getTime();
  const currentDuration: number = currentDate.getTime() - startDate.getTime();

  // Calculate the percentage
  const percentage: number = (currentDuration / totalDuration) * 100;

  // Calculate remaining days
  const remainingTime = endDate.getTime() - currentDate.getTime();
  const remainingDays = Math.ceil(remainingTime / (1000 * 3600 * 24));

  return (
    <div className="row mx-0 mt-4">
      <BreadCrumb items={breadcrumbItems} />
      {/* contract info starts */}
      <div className="bg-light text-dark">
        <div className="row mx-2">
          {singlecontract.ContractStatusCode == 'CTS_APRV' && (
            <div className='col-3 pt-1 p-0 '>
              <h5 className='app-primary-color small fw-bold' style={{ display: 'inline-block' }}>
                {store.getState().generalcontractdetails.singlecontract.ContractNumber}
              </h5>
              <span className={`material-symbols-outlined ms-2 mt-1 align-top color-tranquil-green`} style={{ display: 'inline-block', fontSize: '16px' }}>
                verified
              </span>
            </div>
          )}
          <div className={`${singlecontract.ContractStatusCode == 'CTS_APRV' ? 'col-5' : 'col-6'} pt-1`}>
            <span className='small p-0'>
              <span className="me-1 fw-bold">{store.getState().generalcontractdetails.singlecontract.CustomerName}</span>
              <span className="text-muted d-block">{store.getState().generalcontractdetails.singlecontract.BilledToAddress}</span>
            </span>

          </div>
          {/* percentage */}
          <div className={`contract-progress p-0 ${singlecontract.ContractStatusCode == 'CTS_APRV' ? 'col-4' : 'col-6'} pt-1`}>
            <div className="row mx-1">
              <div className="col small ps-0">{formatDate(store.getState().generalcontractdetails.singlecontract.StartDate)}</div>
              <div className="col d-flex justify-content-end small pe-0">{formatDate(store.getState().generalcontractdetails.singlecontract.EndDate)}</div>
              <div className="progress border p-0 rounded-0">
                <div className="progress-bar bg-success" style={{ width: `${percentage}%` }} aria-valuenow={percentage} aria-valuemin={0} aria-valuemax={100}>{percentage.toFixed(0)}%</div>
              </div>
              <div className="col d-flex pe-0 justify-content-end text-size-11">{remainingDays} Days Left</div>
            </div>
          </div>
        </div>
      </div>
      {/* contract info ends */}
      {/* Content starts */}
      <div className="row mx-0 contractview">
        {/* Section 1 */}
        <div className="col-md-12 ">
          <nav className="mt-2">
            <div className="nav nav-tabs" id="nav-tab" role="tablist">
              {filteredTabs.length > 0 && (
                <>
                  {filteredTabs.slice(0, 5).map((contractTab, index) => (
                    <span
                      key={index}
                      onClick={() => handleTabClick(contractTab.name)}
                      className={`nav-link ${selectedTabName === contractTab.name ? 'active' : ''}`}
                      id={`nav-tab-${index}`}
                      data-bs-toggle="tab"
                      data-bs-target={`#nav-${contractTab.name}`}
                      role="button"
                      aria-controls={`nav-${contractTab.name}`}
                      aria-selected={selectedTabName === contractTab.name}
                    >
                      {contractTab.displaytext}
                    </span>
                  ))}

                  {!filteredTabs.slice(0, 5).some(tab => tab.name === selectedTabName) && (
                    <span
                      className={`nav-link ${selectedTabName != null ? 'active' : ''}`}
                      id="nav-tab-5"
                      data-bs-toggle="tab"
                      data-bs-target={`#nav-${selectedTabName}`}
                      role="button"
                      aria-controls={`nav-${selectedTabName}`}
                      aria-selected={selectedTabName != null}
                    >
                      {filteredTabs.find(tab => tab.name === selectedTabName)?.displaytext || selectedTabName}
                    </span>
                  )}

                  {filteredTabs.length > 5 && (
                    <li className="nav-link dropdown me-2">
                      <span
                        className="dropdown-toggle"
                        id="moreTabsDropdown"
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        {t('contract_view_more')}
                      </span>
                      <ul className="dropdown-menu" aria-labelledby="moreTabsDropdown">
                        {filteredTabs.slice(5).map((contractTab, index) => (
                          <li key={index + 5}>
                            <button
                              className={`dropdown-item ${selectedTabName === contractTab.name ? 'active' : ''}`}
                              onClick={() => handleTabClick(contractTab.name)}
                              data-bs-toggle="tab"
                              data-bs-target={`#nav-${contractTab.name}`}
                              role="button"
                              aria-controls={`nav-${contractTab.name}`}
                            >
                              {contractTab.displaytext}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </li>
                  )}
                </>
              )}
            </div>
          </nav>

        </div>
        {/* Section 1 ends */}

        {/* Section 2 */}
        <div className="col-md-12 p-1 tab-content overflow-hidden" id="nav-tabContent">
          {/* Pending approve contract warning */}
          {singlecontract.ContractStatusCode === "CTS_PNDG" && (
            <div className="mx-2 row">
              <div className="alert alert-warning rounded-0 py-0 mt-1" role="alert">
                <div className="p-2">
                  <span className="material-symbols-outlined align-bottom">warning</span>
                  &nbsp;
                  <span>{t("contractview_pendingapprove_contract_warning")}</span>
                </div>
              </div>
            </div>
          )}
          {/* Pending approve contract warning ends */}

          {/* Contract approval button */}
          <ApprovalRequest />

          {/* Content Info starts */}
          {filteredTabs.map((tab) => {
            const LazyComponent = memoizedLazyComponents[tab.id];
            return (
              tab.name === selectedTabName && (
                  <div className='row mb-5'>
                    <Suspense key={tab.id} fallback={<div><SuspensePreloader /></div>}>
                      <div>
                        <LazyComponent />
                      </div>
                    </Suspense>
                  </div>
              )
            );
          })}
          {/* Content Info Ends */}
        </div>
        {/* Section 2 ends */}
      </div>

      {/* Content Ends */}
    </div >
  );
}