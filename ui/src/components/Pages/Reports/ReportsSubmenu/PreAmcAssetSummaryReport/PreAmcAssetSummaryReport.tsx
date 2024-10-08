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
import { PreAmcAssetSummaryReportState, loadMasterData, loadUserDetail, updateField } from './PreAmcAssetSummaryReport.slice';
import { getCustomerNamesByLocationGroupFilter } from '../../../../../services/customer';
import { downloadPreAmcAssetSummaryReport } from '../../../../../services/reports';
import { getContractNamesByCustomerFilter } from '../../../../../services/contracts';
import { getCustomerSiteNamesByContractFilter } from '../../../../../services/customerSite';

const PreAmcAssetSummaryReport = () => {
    const { t } = useTranslation();
    const {
        preamcassetsummaryreport: { PreAmcAssetReportFilter, MasterData, loggeduserinfo },
    } = useStore(({ preamcassetsummaryreport }) => ({ preamcassetsummaryreport }));

    useEffect(() => {
        const fetchData = async () => {
                const TenantLocations = await getRegionAndCategoryWiseWiseTenantOfficeList(String(PreAmcAssetReportFilter.TenantRegionId));
                const TenantLocation = await formatSelectInput(TenantLocations.TenantOfficeName, 'OfficeName', 'Id');
                    store.dispatch(loadMasterData({ name: "TenantOffices", value: TenantLocation }));
        };
        fetchData();
    }, [PreAmcAssetReportFilter.TenantRegionId]);

    useEffect(() => {
        const fetchUserData = async () => {
            const info = await getUserLocationInfo()
            store.dispatch(loadUserDetail(info.userLocationInfo));
        };
        fetchUserData();
    }, []);

    useEffect(() => {
        const fetchCustomers = async () => {
            const Customers = await getCustomerNamesByLocationGroupFilter(PreAmcAssetReportFilter.TenantOfficeId);
            const FormattedGroups = await formatSelectInput(Customers.CustomerNamesByFilter, "NameOnPrint", "Id"); 
            store.dispatch(loadMasterData({ name: "Customers", value: FormattedGroups }));
        };
        fetchCustomers();
    }, [ PreAmcAssetReportFilter.TenantOfficeId]);

    useEffect(() => {
        const fetchContracts = async () => {
            const Contracts = await getContractNamesByCustomerFilter(PreAmcAssetReportFilter.CustomerId);
            const FormattedGroups = await formatSelectInput(Contracts.ContractNumbersByCustomer, "ContractNumber", "Id"); 
            store.dispatch(loadMasterData({ name: "Contracts", value: FormattedGroups }));
        };
        fetchContracts();
    }, [PreAmcAssetReportFilter.CustomerId]);

    useEffect(() => {
        const fetchSites = async () => {
            const Sites = await getCustomerSiteNamesByContractFilter(PreAmcAssetReportFilter.ContractId);
            const FormattedSites = await formatSelectInput(Sites.CustomerSiteNames, "SiteName", "Id"); 
            store.dispatch(loadMasterData({ name: "CustomerSites", value: FormattedSites }));
        };
        fetchSites();
    }, [PreAmcAssetReportFilter.ContractId]);

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
        const response = await downloadPreAmcAssetSummaryReport(PreAmcAssetReportFilter);
        const url = window.URL.createObjectURL(response.data);
        FileSaver.saveAs(url, 'preamcassetsummary_'+formatDocumentName());
    };

    function onFieldChangeSelect(selectedOption: any, actionMeta: any) {
        const name = actionMeta.name;
        store.dispatch(updateField({ name: name as keyof PreAmcAssetSummaryReportState['PreAmcAssetReportFilter'], value:selectedOption ? selectedOption.value : null}));
    }

    const onUpdateField = (ev) => {
        const name = ev.target.name;
        const value = ev.target.value;
        store.dispatch(updateField({ name: name as keyof PreAmcAssetSummaryReportState['PreAmcAssetReportFilter'], value }));
    };

    return (
        <div className="ps-2 pe-4">
            <div className="">
                <div className="">
                    <div className='row mb-2'>
                        <div className='col-md-6'>
                            <div className="">
                                <label className='text-size-13'>{t('preamcassetsummaryreport_date_from_label')}</label>
                                <input
                                    name='DateFrom'
                                    value={PreAmcAssetReportFilter.DateFrom ? PreAmcAssetReportFilter.DateFrom : ""}
                                    onChange={onUpdateField}
                                    type='date'
                                    className='form-control'
                                ></input>
                            </div>
                        </div>
                        <div className='col-md-6'>
                            <div className="">
                                <label className='text-size-13'>{t('preamcassetsummaryreport_date_to_label')}</label>
                                <input
                                    name='DateTo'
                                    value={PreAmcAssetReportFilter.DateTo ? PreAmcAssetReportFilter.DateTo : ""}
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
                            <label className='text-size-13'>{t('preamcassetsummaryreport_tenant_region_label')}</label>
                            <div className="">
                                <Select
                                    options={MasterData.TenantRegions}
                                    value={MasterData.TenantRegions && MasterData.TenantRegions.find(option => option.value == PreAmcAssetReportFilter.TenantRegionId) ||''}
                                    isSearchable
                                    isClearable
                                    onChange={onFieldChangeSelect}
                                    name='TenantRegionId'
                                />
                            </div>
                        </div>
                        <div className='mt-2 col-md-6'>
                            <label className='text-size-13'>{t('preamcassetsummaryreport_tenant_location_label')}</label>
                            <div className="">
                                <Select
                                    options={MasterData.TenantOffices}
                                    value={MasterData.TenantOffices && MasterData.TenantOffices.find(option => option.value == PreAmcAssetReportFilter.TenantOfficeId) || ''}
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
                            <label className='text-size-13'>{t('preamcassetsummaryreport_customer_label')}</label>
                            <div className="">
                                <Select
                                    options={MasterData.Customers}
                                    value={MasterData.Customers && MasterData.Customers.find(option => option.value == PreAmcAssetReportFilter.CustomerId) || ''}
                                    isSearchable
                                    isClearable
                                    onChange={onFieldChangeSelect}
                                    name='CustomerId'
                                />
                            </div>
                        </div>
                        <div className='mt-2 col-md-6'>
                            <label className='text-size-13'>{t('preamcassetsummaryreport_contract_label')}</label>
                            <div className="">
                                <Select
                                    options={MasterData.Contracts}
                                    value={MasterData.Contracts && MasterData.Contracts.find(option => option.value == PreAmcAssetReportFilter.ContractId) || ''}
                                    isSearchable
                                    isClearable
                                    onChange={onFieldChangeSelect}
                                    name='ContractId'
                                />
                            </div>
                        </div>
                        <div className='mt-2 col-md-6'>
                            <label className='text-size-13'>{t('preamcassetsummaryreport_customersite_label')}</label>
                            <div className="">
                                <Select
                                    options={MasterData.CustomerSites}
                                    value={MasterData.CustomerSites && MasterData.CustomerSites.find(option => option.value == PreAmcAssetReportFilter.CustomerSiteId) || ''}
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
                        {t('preamcassetsummaryreport_download_button')}
                    </button>
                </div>
            </div>
        </div >
    );
};

export default PreAmcAssetSummaryReport;
