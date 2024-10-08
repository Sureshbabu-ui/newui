import { useTranslation } from 'react-i18next';
import { lazy, Suspense, useMemo, useState } from 'react';
import { SuspensePreloader } from '../../../../SuspensePreloader/SuspensePreloader';
import { store } from '../../../../../state/store';

function ManpowerView() {
  const { t } = useTranslation();

  const filteredTabs = [
    { Id: 1, name: t('manpowermanagement_title_manage_summary'), component: 'ContractManpowerSummary/ManPowerSummaryList' },
    { Id: 2, name: t('manpowermanagement_title_manage_allocation'), component: 'ContractManpowerAllocation/ManPowerAllocationList' },
   ];

  const [activeTab, setActiveTab] = useState(filteredTabs[0].Id);

  const onSelect = (ev:any) => {
    setActiveTab(ev.target.value)
  }

  const memoizedLazyComponents = useMemo(() => {
    return filteredTabs.reduce((memo, tab) => {
      if (tab.Id == activeTab) {
        memo[tab.Id] = lazy(() => import(`../${tab.component}`));
      }
      return memo;
    }, {});
  }, [activeTab]);

  return (
    <div className="m-0">
      <h5 className="px-0 ps-2 pt-2 bold-text">{t('manpowermanagement_title_manage_contract_manpower')}</h5>
      <div className="mt-2 pt-1">
        <nav className="mx-2">
          <div className="nav nav-tabs" id="nav-tab" role="tablist">
            {filteredTabs.map((tab, index) => (
              <button
                key={index}
                className={`nav-link p-0 me-3 ${tab.Id == activeTab ? "active" : ""}`}
                id={`nav-tab-${tab.Id}`}
                onClick={onSelect}
                type="button"
                role="tab"
                value={tab.Id}
                aria-controls={tab.Id.toString()}
                aria-selected={tab.Id == activeTab ? "true" : "false"}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </nav>
        <div className="tab-content mt-0" id="nav-tabContent">
          {filteredTabs.map((tab) => {
            const LazyComponent = memoizedLazyComponents[tab.Id];
            return (
              tab.Id == activeTab && (
                <Suspense key={tab.Id} fallback={<div><SuspensePreloader /></div>}>
                  <div>
                    <LazyComponent />
                  </div>
                </Suspense>
              )
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ManpowerView 