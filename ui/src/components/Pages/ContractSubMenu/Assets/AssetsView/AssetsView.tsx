import { useTranslation } from 'react-i18next';
import { checkForPermission } from '../../../../../helpers/permissions';
import { lazy, useMemo, useState, Suspense } from 'react';
import { SuspensePreloader } from '../../../../SuspensePreloader/SuspensePreloader';
import { store } from '../../../../../state/store';
import { setActiveTab } from './AssetView.slice';
import { useStore } from '../../../../../state/storeHooks';

function AssetsView() {
  const { t } = useTranslation();
  const { assetview: { activeTab } } = useStore(({ assetview }) => ({ assetview }));

  const filteredTabs = [
   { Id: 1, buttonStyle: 'nav-profile-tab', name: t('assetsview_summary'), component: 'AssetsSummary/AssetsSummaryList/AssetsSummaryList' },
   { Id: 2, buttonStyle: 'nav-sitewiseasset-tab', name: t('assetsview_sitewisesummary'), component: 'AssetSiteWiseSummary/AssetSiteWiseSummaryList/ContractAssetSiteWiseSummaryList' },
   { Id: 3, buttonStyle: 'nav-home-tab', name: t('assetsview_list'), component: 'AssetsList' }
  ];

  const onSelect = (ev:any) => {
    store.dispatch(setActiveTab(ev.target.value))
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
      <h5 className="px-0 ps-2 pt-2 bold-text">{t('assetsview_label')}</h5>
      {checkForPermission("CONTRACT_ASSET") && <>
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
      </>}
    </div>
  );
}

export default AssetsView  