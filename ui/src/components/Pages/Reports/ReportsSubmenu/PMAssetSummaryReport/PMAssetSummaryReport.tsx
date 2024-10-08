import { useEffect } from 'react';
import Select from 'react-select';
import { useStore } from '../../../../../state/storeHooks';
import { formatDocumentName, formatSelectInput } from '../../../../../helpers/formats';
import { store } from '../../../../../state/store';
import { getCategoryWiseTenantRegionNames } from '../../../../../services/tenantRegion';
import { getRegionAndCategoryWiseWiseTenantOfficeList } from '../../../../../services/tenantOfficeInfo';
import { useTranslation } from 'react-i18next';
import FileSaver from 'file-saver';
import { getUserLocationInfo } from '../../../../../services/users';
import { PMAssetSummaryReportState, loadMasterData, loadUserDetail, updateField } from './PMAssetSummaryReport.slice';
import { getCustomerNamesByLocationGroupFilter } from '../../../../../services/customer';
import { downloadPMAssetSummaryReport } from '../../../../../services/reports';
import { getContractNamesByCustomerFilter } from '../../../../../services/contracts';
import { getCustomerSiteNamesByContractFilter } from '../../../../../services/customerSite';

const PMAssetSummaryReport = () => {
    const { t } = useTranslation();
    const {
        pmassetsummaryreport: { PMAssetReportFilter, MasterData, loggeduserinfo },
    } = useStore(({ pmassetsummaryreport }) => ({ pmassetsummaryreport }));

    useEffect(() => {
        const fetchData = async () => {
                const TenantLocations = await getRegionAndCategoryWiseWiseTenantOfficeList(String(PMAssetReportFilter.TenantRegionId));
                const TenantLocation = await formatSelectInput(TenantLocations.TenantOfficeName, 'OfficeName', 'Id');
                    store.dispatch(loadMasterData({ name: "TenantOffices", value: TenantLocation }));
        };
        fetchData();
    }, [PMAssetReportFilter.TenantRegionId]);

    useEffect(() => {
        const fetchUserData = async () => {
            const info = await getUserLocationInfo()
            store.dispatch(loadUserDetail(info.userLocationInfo));
        };
        fetchUserData();
    }, []);

    useEffect(() => {
        const fetchCustomers = async () => {
            const Customers = await getCustomerNamesByLocationGroupFilter(PMAssetReportFilter.TenantOfficeId);
            const FormattedGroups = await formatSelectInput(Customers.CustomerNamesByFilter, "NameOnPrint", "Id"); 
            store.dispatch(loadMasterData({ name: "Customers", value: FormattedGroups }));
        };
        fetchCustomers();
    }, [ PMAssetReportFilter.TenantOfficeId]);

    useEffect(() => {
        const fetchContracts = async () => {
            const Contracts = await getContractNamesByCustomerFilter(PMAssetReportFilter.CustomerId);
            const FormattedGroups = await formatSelectInput(Contracts.ContractNumbersByCustomer, "ContractNumber", "Id"); 
            store.dispatch(loadMasterData({ name: "Contracts", value: FormattedGroups }));
        };
        fetchContracts();
    }, [PMAssetReportFilter.CustomerId]);

    useEffect(() => {
        const fetchSites = async () => {
            const Sites = await getCustomerSiteNamesByContractFilter(PMAssetReportFilter.ContractId);
            const FormattedSites = await formatSelectInput(Sites.CustomerSiteNames, "SiteName", "Id"); 
            store.dispatch(loadMasterData({ name: "CustomerSites", value: FormattedSites }));
        };
        fetchSites();
    }, [PMAssetReportFilter.ContractId]);

    useEffect(() => {
        const fetchRegions = async () => {
            const TenantRegion = await getCategoryWiseTenantRegionNames();
            const regions = await formatSelectInput(TenantRegion.RegionNames, "RegionName", "Id");
            if (loggeduserinfo.UserCategoryCode === "UCT_FRHO") {
                store.dispatch(loadMasterData({ name: "TenantRegions", value: regions }));

            } else {
                store.dispatch(loadMasterData({ name: "TenantRegions", value: regions }));
                store.dispatch(updateField({ name: 'TenantRegionId', value: loggeduserinfo.RegionId }));
            }
        };
        fetchRegions();
    }, [loggeduserinfo.RegionId]);

    const onDownloadClick = async () => {
        const response = await downloadPMAssetSummaryReport(PMAssetReportFilter);
        const url = window.URL.createObjectURL(response.data);
        FileSaver.saveAs(url, 'assetpmsummary_'+formatDocumentName());
    };

    function onFieldChangeSelect(selectedOption: any, actionMeta: any) {
        const name = actionMeta.name;
        store.dispatch(updateField({ name: name as keyof PMAssetSummaryReportState['PMAssetReportFilter'], value:selectedOption ? selectedOption.value : null}));
    }

    const onUpdateField = (ev) => {
        const name = ev.target.name;
        const value = ev.target.value;
        store.dispatch(updateField({ name: name as keyof PMAssetSummaryReportState['PMAssetReportFilter'], value }));
    };

    return (
        <div className="ps-2 pe-4">
            <div className="">
                <div className="">
                    <div className='row mb-2'>
                        <div className='col-md-6'>
                            <div className="">
                                <label className='text-size-13'>{t('pmassetsummaryreport_date_from_label')}</label>
                                <input
                                    name='DateFrom'
                                    value={PMAssetReportFilter.DateFrom ? PMAssetReportFilter.DateFrom : ""}
                                    onChange={onUpdateField}
                                    type='date'
                                    className='form-control'
                                ></input>
                            </div>
                        </div>
                        <div className='col-md-6'>
                            <div className="">
                                <label className='text-size-13'>{t('pmassetsummaryreport_date_to_label')}</label>
                                <input
                                    name='DateTo'
                                    value={PMAssetReportFilter.DateTo ? PMAssetReportFilter.DateTo : ""}
                                    onChange={onUpdateField}
                                    type='date'
                                    className='form-control'
                                ></input>
                            </div>
                        </div>
                        {/* to date ends */}
                    </div>
                    {/* filter row 1 ends */}
                    <div className="row">
                        <div className='mt-2 col-md-6'>
                            <label className='text-size-13'>{t('pmassetsummaryreport_tenant_region_label')}</label>
                            <div className="">
                                <Select
                                    options={MasterData.TenantRegions}
                                    value={MasterData.TenantRegions && MasterData.TenantRegions.find(option => option.value == PMAssetReportFilter.TenantRegionId) ||''}
                                    isSearchable
                                    isClearable
                                    onChange={onFieldChangeSelect}
                                    name='TenantRegionId'
                                />
                            </div>
                        </div>
                        <div className='mt-2 col-md-6'>
                            <label className='text-size-13'>{t('pmassetsummaryreport_tenant_location_label')}</label>
                            <div className="">
                                <Select
                                    options={MasterData.TenantOffices}
                                    value={MasterData.TenantOffices && MasterData.TenantOffices.find(option => option.value == PMAssetReportFilter.TenantOfficeId) || ''}
                                    isSearchable
                                    isClearable
                                    onChange={onFieldChangeSelect}
                                    name='TenantOfficeId'
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className='mt-2 col-md-6'>
                            <label className='text-size-13'>{t('pmassetsummaryreport_customer_label')}</label>
                            <div className="">
                                <Select
                                    options={MasterData.Customers}
                                    value={MasterData.Customers && MasterData.Customers.find(option => option.value == PMAssetReportFilter.CustomerId) || ''}
                                    isSearchable
                                    isClearable
                                    onChange={onFieldChangeSelect}
                                    name='CustomerId'
                                />
                            </div>
                        </div>
                        <div className='mt-2 col-md-6'>
                            <label className='text-size-13'>{t('pmassetsummaryreport_contract_label')}</label>
                            <div className="">
                                <Select
                                    options={MasterData.Contracts}
                                    value={MasterData.Contracts && MasterData.Contracts.find(option => option.value == PMAssetReportFilter.ContractId) || ''}
                                    isSearchable
                                    isClearable
                                    onChange={onFieldChangeSelect}
                                    name='ContractId'
                                />
                            </div>
                        </div>
                        <div className='mt-2 col-md-6'>
                            <label className='text-size-13'>{t('pmassetsummaryreport_customersite_label')}</label>
                            <div className="">
                                <Select
                                    options={MasterData.CustomerSites}
                                    value={MasterData.CustomerSites && MasterData.CustomerSites.find(option => option.value == PMAssetReportFilter.CustomerSiteId) || ''}
                                    isSearchable
                                    isClearable
                                    onChange={onFieldChangeSelect}
                                    name='CustomerSiteId'
                                />
                            </div>
                        </div>
                    </div>
                    <button
                        type='button'
                        onClick={onDownloadClick}
                        className=' btn app-primary-bg-color text-white mt-3 mb-1 w-100'
                    >
                        {t('pmassetsummaryreport_download_button')}
                    </button>
                </div>
            </div>
        </div >
    );
};

export default PMAssetSummaryReport;
