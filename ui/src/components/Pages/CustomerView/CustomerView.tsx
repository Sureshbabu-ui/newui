import { ContainerPage } from '../../ContainerPage/ContainerPage';
import { customerTabs } from '../../../tabs.json';
import { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { SiteManagement } from '../CustomerSubMenu/Site/SiteManagement';
import { Profile } from '../CustomerSubMenu/Profile/Profile';
import BreadCrumb from '../../BreadCrumbs/BreadCrumb';
import { t } from 'i18next';

export function CustomerView() {
  const [selectedTab, setSelectedTab] = useState(0);
  const location = useLocation();
  const history = useHistory();
  const handleTabClick = (index: any) => {
    setSelectedTab(index);
    // Add the tab information to the URL
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('Tab', index.toString());
    history.push({ search: searchParams.toString() });
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams) {
      const Tab = searchParams.get('Tab');
      if (Tab != undefined && parseInt(Tab) > 0 && parseInt(Tab) <= customerTabs.length) {
        setSelectedTab(Tab ? parseInt(Tab) : 0);
      }
    }
  }, []);
  const breadcrumbItems = [
    { Text: 'breadcrumbs_home', Link: '/' },
    { Text: 'breadcrumbs_manage_customer', Link: '/config/customers' },     
    { Text: 'breadcrumbs_view_customer' }
  ];

  return (
    <div className="">
        <BreadCrumb items={breadcrumbItems} />
      <ContainerPage>
        <div className="d-flex align-items-start ps-0">
          <div className="sidebar">
            <div
              className="nav  nav-pills me-0 d-grid mx-auto"
              id='v-pills-tab'
              role='tablist'
              aria-orientation='vertical'
            >
              {customerTabs.map((customerTab, index) => (
                <button
                  onClick={() => handleTabClick(index)}
                  className={selectedTab == index ? "nav-link active app-primary-color  button-sidebar " : "nav-link button-sidebar "}
                  id={`${customerTab.name}-tab`}
                  data-bs-toggle='pill'
                  key={customerTab.id}
                  data-bs-target={`#${customerTab.name}`}
                  type='button'
                  role='tab'
                  aria-controls={`${customerTab.name}`}
                  aria-selected={customerTab.id == 1 ? true : false}
                >
                  <div className="d-flex justify-content-start">
                    {/* menu icon */}
                    <div className="m-0">
                      <i data-feather={customerTab.icon} className="pseudo-link" style={{ width: '20px', height: '20px' }}></i>
                    </div>
                    {/* menu icon ends */}
                    {/* menu name */}
                    <div className="ms-1 d-flex justify-content-center">
                      <span className="pseudo-link">
                        {customerTab.name}
                      </span>
                    </div>
                    {/* menu name ends */}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="tab-content col-md-10" id='v-pills-tabContent'>
            {customerTabs.map((customerTab, index) => (
              <div
                className={selectedTab === index ? "tab-pane fade show active" : "tab-pane fade"}
                key={customerTab.id}
                id={customerTab.name}
                role='tabpanel'
                aria-labelledby={`${customerTab.name}-tab`}
              >
                {customerTab.id == 1 && <Profile />}
                {customerTab.id == 2 && <SiteManagement />}
              </div>
            ))}
          </div>
        </div>
      </ContainerPage>
    </div>
  );
}
