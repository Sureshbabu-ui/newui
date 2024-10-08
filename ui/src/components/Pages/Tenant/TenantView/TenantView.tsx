import { ContainerPage } from '../../../ContainerPage/ContainerPage';
import { tenantViewTabs } from '../../../../tabs.json';
import { useState, useEffect, Suspense, useMemo, lazy } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useStore } from '../../../../state/storeHooks';
import { store } from '../../../../state/store';
import FeatherIcon from 'feather-icons-react';
import BreadCrumb from '../../../BreadCrumbs/BreadCrumb';
import { t } from 'i18next';
import { SuspensePreloader } from '../../../SuspensePreloader/SuspensePreloader';
import { setSelectedTabName } from './TenantView.slice';

export const TenantView = () => {

  const { selectedTabName } = useStore(({ tenantview }) => tenantview);

  const location = useLocation();
  const history = useHistory();

  const handleTabClick = (tabName: string) => {
    store.dispatch(setSelectedTabName(tabName))
    // Add the tab information to the URL
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("Tab", tabName); // Set the tab name as the parameter
    history.push({ search: searchParams.toString() });
  }

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams) {
      const Tab = searchParams.get("Tab");
      if (Tab != undefined) {
        store.dispatch(setSelectedTabName(Tab ? Tab : 'COMPANYINFO'));
      } else {
        const searchParams = new URLSearchParams(location.search);
        searchParams.set("Tab", "COMPANYINFO");
        history.push({ search: searchParams.toString() });
      }
    }
  }, [location.search]);

  const memoizedLazyComponents = useMemo(() => {
    return tenantViewTabs.reduce((memo, tab) => {
      if (tab.name == selectedTabName) {
        memo[tab.id] = lazy(() => import(`../TenantSubmenu/${tab.component}`));
      }
      return memo;
    }, {});
  }, [selectedTabName]);

  const breadcrumbItems = [
    { Text: 'breadcrumbs_home', Link: '/' },
    { Text: 'breadcrumbs_accel' }
  ];

  return (
    <>
      <BreadCrumb items={breadcrumbItems} />
      <ContainerPage>
        <div className="d-flex align-items-start ps-0">
          <div className="sidebar mt-2">
            <div
              className="nav nav-pills me-0 d-grid mx-auto"
              id='v-pills-tab'
              role='tablist'
              aria-orientation='vertical'
            >
              {tenantViewTabs.map((tenantTab) => (
                <button
                  onClick={() => handleTabClick(tenantTab.name)}
                  className={selectedTabName === tenantTab.name ? "nav-link active app-primary-color button-sidebar" : "nav-link button-sidebar"}
                  id={`${tenantTab.name}-tab`}
                  key={tenantTab.id}
                  data-bs-target={`#${tenantTab.name}`}
                  type='button'
                  role='tab'
                  aria-controls={`${tenantTab.name}`}
                  aria-selected={selectedTabName === tenantTab.name}
                >
                  <div className="d-flex justify-content-start">
                    {/* menu icon */}
                    <div className="m-0">
                      <FeatherIcon icon={tenantTab.icon ?? ""} size="16" />
                    </div>
                    {/* menu name */}
                    <div className="ms-1 d-flex justify-content-center">
                      <span className="pseudo-link">
                        {tenantTab.displaytext}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
          <div className="tab-content col-md-10" id='v-pills-tabContent'>
            {tenantViewTabs.map((tenantTab) => {
              const LazyComponent = memoizedLazyComponents[tenantTab.id];
              return (
                selectedTabName === tenantTab?.name && (
                  <Suspense key={tenantTab.id} fallback={<div><SuspensePreloader /></div>}>
                    <div id={tenantTab.name} role='tabpanel' aria-labelledby={`${tenantTab.name}-tab`}>
                      <LazyComponent />
                    </div>
                  </Suspense>
                )
              );
            })}
          </div>
        </div>
      </ContainerPage>
    </>
  );
}
