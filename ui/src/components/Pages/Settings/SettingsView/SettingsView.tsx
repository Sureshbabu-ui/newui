import { useTranslation } from "react-i18next";
import { settingsTabs } from '../../../../tabs.json'
import { lazy, Suspense, useEffect, useState } from 'react';
import { SuspensePreloader } from "../../../SuspensePreloader/SuspensePreloader";
import FeatherIcon from 'feather-icons-react';
import { useHistory, useLocation } from "react-router-dom";
import BreadCrumb from "../../../BreadCrumbs/BreadCrumb";
import { t } from "i18next";

export const SettingsView = () => {
  const [activeTab, setActiveTab] = useState(0);

  const location = useLocation();
  const history = useHistory();
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams) {
      const Tab = searchParams.get("Tab");
      if (Tab != undefined && parseInt(Tab) >= 0 && parseInt(Tab) <= settingsTabs.length) {
        setActiveTab(Tab ? parseInt(Tab) : 0);
      } else {
        // Redirect to tab 0 
        const searchParams = new URLSearchParams(location.search);
        searchParams.set("Tab", "0");
        history.push({ search: searchParams.toString() });
      }
    }
  }, [location.search]);

  const handleTabClick = (index: any) => {
    setActiveTab(index);
    // Add the tab information to the URL
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("Tab", index.toString());
    history.push({ search: searchParams.toString() });
  }
  const breadcrumbItems = [
    { Text: 'breadcrumbs_home', Link: '/' },
    { Text: 'breadcrumbs_settings' }
  ];

  return (<>
    <BreadCrumb items={breadcrumbItems} />
    < div className="d-flex align-items-start ps-0 pe-3">
      <div className="col-md-2">
        <div className="sidebar">
          <div className="nav position-fixed nav-pills me-0 d-grid mx-auto" id="v-pills-tab" role="tablist" aria-orientation="vertical">
            <div>
              <span className="ms-5 app-primary-color">Settings</span>
            </div>
            {settingsTabs.map((settingsTab, index) => (
              <div key={index}>
                <div onClick={() => handleTabClick(index)}
                  className={activeTab == index ? "nav-link active button-sidebar app-primary-color " : "nav-link button-sidebar"}
                  id={`${settingsTab.icon}-tab`} data-bs-toggle="pill"
                  key={settingsTab.id}
                  data-bs-target={`#${settingsTab.icon}`} role="tab"
                  aria-controls={`${settingsTab.icon}`}
                  aria-selected={settingsTab.id == 1 ? true : false}
                >
                  <div className="d-flex justify-content-start">
                    {/* menu icon */}
                    <div className="m-0 ">
                      <FeatherIcon icon={settingsTab.icon ?? ""} size="16" />
                    </div>
                    {/* menu icon ends */}
                    {/* menu name */}
                    <div className="ms-1 d-flex justify-content-center">
                      <span className="pseudo-link">
                        {settingsTab.menuname}
                      </span>
                    </div>
                    {/* menu name ends */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="col-10 mt-3">
        <div
          data-bs-spy="scroll"
          data-bs-target="#settings-menu-wrapper"
          data-bs-smooth-scroll="true"
          tabIndex={0}
        >
          {settingsTabs.map(({ id, component }) => {
            const LazyComponent = lazy(() => import(`../${component}/${component}`));
            return (
              activeTab + 1 === id && (
                <Suspense key={id} fallback={<div><SuspensePreloader /></div>}>
                  <div className="pb-4">
                    <LazyComponent />
                  </div>
                </Suspense>
              )
            );
          })}
        </div>
      </div>
    </div></>
  );
};