import { useTranslation } from 'react-i18next';
import { useState, Suspense, lazy, useMemo } from 'react';
import { SuspensePreloader } from '../../../../SuspensePreloader/SuspensePreloader';

function GeneralContractView() {
  const { t } = useTranslation();
  const filteredTabs = [
    {
      Id: 1,
      label: 'Current',
      component: 'General',
    },
    {
      Id: 2,
      label: 'History',
      component: 'ContractHistory/ContractHistory',
    }
  ];
  
  const [selectedTabId, setSelectedTabId] = useState(filteredTabs[0].Id);

  const memoizedLazyComponents = useMemo(() => {
    return filteredTabs.reduce((memo, tab) => {
      if (tab.Id === selectedTabId) {
        memo[tab.Id] = lazy(() => import(`../${tab.component}`));
      }
      return memo;
    }, {});
  }, [filteredTabs, selectedTabId]);

  return (
    <div className="contract">
      <div className="my-2">
        {/* Section 1 */}
        <div className="row m-2">
          {/* Header */}
          <div className="col-md-10 p-0 app-primary-color">
            <h5>{t('generaldetails_view_heading')}</h5>
          </div>
          {/* Header ends */}
        </div>
        {/* Section 1 ends */}
        <nav className="m-2 mt-2">
          <div className="nav nav-tabs" id="nav-tab" role="tablist">
            {filteredTabs.map((tab) => (
              <button
                key={tab.Id}
                className={`nav-link ${tab.Id === selectedTabId ? 'active' : ''}`}
                id={`nav-${tab.Id}-tab`}
                data-bs-toggle="tab"
                data-bs-target={`#nav-${tab.Id}`}
                type="button"
                role="tab"
                aria-controls={`nav-${tab.Id}`}
                aria-selected={tab.Id === selectedTabId}
                onClick={() => setSelectedTabId(tab.Id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </nav>
        <div className="tab-content mt-3" id="nav-tabContent">
          {filteredTabs.map((tab) => {
            const LazyComponent = memoizedLazyComponents[tab.Id];
            return (
              tab.Id === selectedTabId && LazyComponent && (
                <div
                  key={tab.Id}
                  className={`tab-pane fade ${tab.Id === selectedTabId ? 'show active' : ''}`}
                  id={`nav-${tab.Id}`}
                  role="tabpanel"
                  aria-labelledby={`nav-${tab.Id}-tab`}
                >
                  <Suspense key={tab.Id} fallback={<SuspensePreloader />}>
                    <div>
                      <LazyComponent />
                    </div>
                  </Suspense>
                </div>
              )
            );
          })}
        </div>
      </div>
    </div>
  );
}
export default GeneralContractView