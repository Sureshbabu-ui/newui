import FeatherIcon from "feather-icons-react";
import { masterDataDetails } from "../../../tabs.json";
import { useTranslation } from 'react-i18next';
import { checkForPermission } from "../../../helpers/permissions";
import { useState } from 'react';
import BreadCrumb from "../../BreadCrumbs/BreadCrumb";
import { ContainerPage } from "../../ContainerPage/ContainerPage";

export const MasterView = () => {
  const { t, i18n } = useTranslation();
  const [searchvalue, setSearchValue] = useState('');
  const [filteredData, setFilteredData] = useState(masterDataDetails.filter(item => checkForPermission(item.permission)).sort((a, b) => a.name.localeCompare(b.name)));

  const updateFilteredData = (value) => {
    const filtered = masterDataDetails
      .filter((item) => item.name.toLowerCase().includes(value.toLowerCase()) && checkForPermission(item.permission))
      .sort((a, b) => a.name.localeCompare(b.name));
    setFilteredData(filtered);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    updateFilteredData(value);
  };
  const breadcrumbItems = [
    { Text: 'breadcrumbs_home', Link: '/' },
    { Text: 'breadcrumbs_masters' },
  ];

  return (
    <ContainerPage >
      <>
        <div className="p-2">
          <BreadCrumb items={breadcrumbItems} />
          <div className="mx-2 ps-1">
            <div className="">
              <h5 className="app-primary-color">
                {t('masterdata_management_title')}
              </h5>
            </div>
            <div className="">
              <p>
                {t('masterdata_management_helpertext')}
              </p>
            </div>

            {/* search */}
            <div className="row mx-0 me-2">
              <input className="form-control form-control-lg fs-6" value={searchvalue} type="Search" placeholder={t('masterdata_management_search_placeholder') ?? ""} aria-label=".form-control-lg" onChange={handleSearchChange} />
            </div>
            <div className="row m-0 px-0 mt-2">
              {filteredData.length > 0 ? (
                <>
                  {filteredData.map((item, index) => (
                    <div key={index} className="col-md-1 col-sm-1 bg-light col-12 my-2 me-2">
                      <a href={item.link} className="mastermenucard text-center">
                        <div className="d-flex justify-content-center pt-3">
                          <FeatherIcon icon={item.icon} size="32" />
                        </div>
                        <div className="card-content mt-2">
                          <p>{item.name}</p>
                        </div>
                      </a>
                    </div>
                  ))}
                </>
              ) : (
                <div>Menu Not Found</div>
              )}
            </div>
          </div>
        </div>
      </>
    </ContainerPage>
  )
};
