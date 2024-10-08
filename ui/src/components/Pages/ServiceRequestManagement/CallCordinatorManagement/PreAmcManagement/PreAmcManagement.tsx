import React from 'react'
import { store } from '../../../../../state/store';
import { initializePreAmcManagement, setActiveTab, setPreAMCPendingCount } from './PreAmcManagement.slice';
import PreAmcPendingAssets from './PreAmcPendingAssets/PreAmcPendingAssets';
import PreAmcContracts from './PreAmcContracts/PreAmcContracts';
import { useStore, useStoreWithInitializer } from '../../../../../state/storeHooks';
import { ContainerPage } from '../../../../ContainerPage/ContainerPage';
import { startPreloader, stopPreloader } from '../../../../Preloader/Preloader.slice';
import { getPreAMCPendingCount } from '../../../../../services/contractPreAmc';
import { useTranslation } from 'react-i18next';
import PreAmcPendingSites from './PreAmcPendingSites/PreAmcPendingSites';
import { ExcelUploadManagement } from './ExcelUploadManagement/ExcelUploadManagement';

const PreAmcManagement = () => {
    const { t, i18n } = useTranslation();
    const onLoad = async () => {
        store.dispatch(initializePreAmcManagement());
        store.dispatch(startPreloader())
        try {
            const result = await getPreAMCPendingCount();
            store.dispatch(setPreAMCPendingCount(result));
        } catch (error) {
            return error;
        }
        store.dispatch(stopPreloader())
    }
    const SitefileName = "SiteUploadSample";
    const AssetfileName = "AssetUploadSample";
    const preamcdonefileName = "PreAMCDoneUploadSample";
    const pmfileName = "PMUploadSample";
    const backtobackvendor = "BackToBackVendorUploadSample";

    const { activeTab, preAMCPendingCount } = useStoreWithInitializer(({ preamcmanagement }) => (preamcmanagement), onLoad);
    const tabComponents = [
        { component: <PreAmcPendingAssets />, name: "Pre AMC Pending Assets", Code: "PPA" },
        { component: <PreAmcContracts />, name: "Pre AMC Pending Contracts", Code: "PPC" },
        { component: <PreAmcPendingSites />, name: "Pre AMC Pending Sites", Code: "PPS" },
    ];

    const handleTabClick = (index) => {
        store.dispatch(setActiveTab(index))
    };

    return (
        <ContainerPage>
            <div className="mt-3">
                <div className='row'>
                    <div className="col-md-8">
                        <ul className="nav">
                            {tabComponents.map((tab, index) => (
                                <li key={index} className="nav-item ms-2">
                                    <div className={`border p-1 ${activeTab == index && 'border-4'}`} role="button" onClick={() => handleTabClick(index)}>
                                        <div className="card-body text-center">
                                            <div className="fw-700">{tab.name}</div>
                                            <div className="fw-bold fs-3">{tab.Code == "PPA" ? preAMCPendingCount.PreAmcPendingAssets : tab.Code == "PPC" ? preAMCPendingCount.TotalContract : preAMCPendingCount.TotalSite}</div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="col-md-4 p-0 d-flex justify-content-end">
                        <div className="dropdown">
                            <button className="btn btn-light app-primary-color fw-bold float-end border h-50 dropdown-toggle" type='button' id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                                <span className="material-symbols-outlined align-middle"> download </span>
                                {t('customer_site_management_download_template')}
                            </button>
                            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                <li><a className="dropdown-item" href={`${process.env.REACT_APP_DOWNLOAD_TEMPLATE}${SitefileName}.xlsx`} download>{t('customer_site_management_download_customersitetemplate')}</a></li>
                                <li><a className="dropdown-item" href={`${process.env.REACT_APP_DOWNLOAD_TEMPLATE}${AssetfileName}.xlsx`} download>{t('customer_site_management_download_assettemplate')}</a></li>
                                <li><a className="dropdown-item" href={`${process.env.REACT_APP_DOWNLOAD_TEMPLATE}${preamcdonefileName}.xlsx`} download>{t('customer_site_management_download_preamcdonetemplate')}</a></li>
                                <li><a className="dropdown-item" href={`${process.env.REACT_APP_DOWNLOAD_TEMPLATE}${backtobackvendor}.xlsx`} download>{t('customer_site_management_download_backtobackvendor_template')}</a></li>
                                <li><a className="dropdown-item" href={`${process.env.REACT_APP_DOWNLOAD_TEMPLATE}${pmfileName}.xlsx`} download>{t('customer_site_management_download_pmdonetemplate')}</a></li>
                            </ul>
                        </div>
                        <button
                            className="btn app-primary-bg-color text-white ms-1 h-50 me-3"
                            data-bs-toggle='modal'
                            data-bs-target='#ExcelUploadManagement'
                        >
                            {t('preamc_management_excel_upload')}
                        </button>
                    </div>
                    <ExcelUploadManagement />
                </div>
            </div>
            {/* Right Side Content */}
            <div className="row pe-0">
                {tabComponents[activeTab].component}
            </div>
        </ContainerPage >
    )
}

export default PreAmcManagement