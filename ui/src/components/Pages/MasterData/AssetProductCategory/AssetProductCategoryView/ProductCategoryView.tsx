import { ContainerPage } from '../../../../ContainerPage/ContainerPage';
import { pcViewTabs } from '../../../../../tabs.json';
import { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { checkForPermission } from '../../../../../helpers/permissions';
import FeatherIcon from 'feather-icons-react';
import { ProductCategoryDetails } from '../AssetProductCategorySubMenu/ProductCategoryDetails/Details';
import { ProductCategoryPartsNotCovered } from '../AssetProductCategorySubMenu/ProductCategoryPartsNotCovered/ProductCategoryPartsNotCovered';

export const ProductCategoryView = () => {
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
      if (Tab != undefined && parseInt(Tab) > 0 && parseInt(Tab) <= pcViewTabs.length) {
        setSelectedTab(Tab ? parseInt(Tab) : 0);
      }
    }
  }, []);

  return (
    <div className="">
      <ContainerPage>

        <div className="d-flex align-items-start ps-0 mt-1">
        {checkForPermission('ASSETPRODUCTCATEGORY_VIEW') && <>
          <div className="sidebar">
            <div
              className="nav  nav-pills me-0 d-grid mx-auto"
              id='v-pills-tab'
              role='tablist'
              aria-orientation='vertical'
            >
              {pcViewTabs.map((pcTab, index) => (
                <button
                  onClick={() => handleTabClick(index)}
                  className={selectedTab == index ? "nav-link active app-primary-color  button-sidebar " : "nav-link button-sidebar "}
                  id={`${pcTab.name}-tab`}
                  data-bs-toggle='pill'
                  key={pcTab.id}
                  data-bs-target={`#${pcTab.name}`}
                  type='button'
                  role='tab'
                  aria-controls={`${pcTab.name}`}
                  aria-selected={pcTab.id == 1 ? true : false}
                >
                  <div className="d-flex justify-content-start">
                    {/* menu icon */}
                    <div className="m-0 ">
                      <FeatherIcon icon={pcTab.icon ?? ""} size="16" />
                    </div>
                    {/* menu icon ends */}
                    {/* menu name */}
                    <div className="ms-1 d-flex justify-content-center">
                      <span className="pseudo-link">
                        {pcTab.name}
                      </span>
                    </div>
                    {/* menu name ends */}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </> }
          <div className="tab-content col-md-10" id='v-pills-tabContent'>
            {pcViewTabs.map((pcTab, index) => (
              <div
                className={selectedTab === index ? "tab-pane fade show active" : "tab-pane fade"}
                key={pcTab.id}
                id={pcTab.name}
                role='tabpanel'
                aria-labelledby={`${pcTab.name}-tab`}
              >
                {pcTab.id == 1 && <ProductCategoryDetails />}
                {pcTab.id == 2 && <ProductCategoryPartsNotCovered />}
              </div>
            ))}
          </div>
        </div>
      </ContainerPage>
    </div>
  );
}
