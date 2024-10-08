import { useEffect } from 'react';
import Select from 'react-select';
import { useStore } from '../../../../../../state/storeHooks';
import { formatDocumentName, formatSelectInput } from '../../../../../../helpers/formats';
import { store } from '../../../../../../state/store';
import { getCategoryWiseTenantRegionNames } from '../../../../../../services/tenantRegion';
import { getRegionAndCategoryWiseWiseTenantOfficeList } from '../../../../../../services/tenantOfficeInfo';
import { useTranslation } from 'react-i18next';
import FileSaver from 'file-saver';
import { getUserLocationInfo } from '../../../../../../services/users';
import { RevenueDueReportState, loadMasterData, loadUserDetail, updateField } from './RevenueDueReport.slice';
import { getCustomerGroupNames } from '../../../../../../services/customerGroup';
import { getCustomerNamesByLocationGroupFilter } from '../../../../../../services/customer';
import { downloadRevenueDueReport } from '../../../../../../services/invoiceReport';

const RevenueDueReport = () => {
    const { t } = useTranslation();
    const {
        revenueduereport: { DueReportFilter, MasterData, loggeduserinfo },
    } = useStore(({ revenueduereport }) => ({ revenueduereport }));

    useEffect(() => {
        const fetchData = async () => {
                const TenantLocations = await getRegionAndCategoryWiseWiseTenantOfficeList(String(DueReportFilter.TenantRegionId));
                const TenantLocation = await formatSelectInput(TenantLocations.TenantOfficeName, 'OfficeName', 'Id');
                if (loggeduserinfo.UserCategoryCode === "UCT_CPTV") {
                    store.dispatch(loadMasterData({ name: "TenantOffices", value: TenantLocation }));
                } else {
                    const filterLocations = [{ label: "All", value: ''}, ...TenantLocation];
                    store.dispatch(loadMasterData({ name: "TenantOffices", value: filterLocations }));
                }
        };
        fetchData();
    }, [DueReportFilter.TenantRegionId]);

    useEffect(() => {
        const fetchUserData = async () => {
            const info = await getUserLocationInfo()
            store.dispatch(loadUserDetail(info.userLocationInfo));
        };
        fetchUserData();
    }, []);

    useEffect(() => {
        const fetchCustomerGroups = async () => {
            const CustomerGroups = await getCustomerGroupNames();
            const FormattedGroups = await formatSelectInput(CustomerGroups.CustomerGroupNames, "GroupName", "Id");
            const FilteredGroups = [{ label: "All", value: '' }, ...FormattedGroups];
            store.dispatch(loadMasterData({ name: "CustomerGroups", value: FilteredGroups }));
        };
        fetchCustomerGroups();
    }, []);

    useEffect(() => {
        const fetchCustomers = async () => {
            const Customers = await getCustomerNamesByLocationGroupFilter(DueReportFilter.TenantOfficeId);
            let FormattedGroups = await formatSelectInput(Customers.CustomerNamesByFilter, "NameOnPrint", "Id"); 
            if(FormattedGroups.length>0)
            FormattedGroups = [{ label: "All", value: '' }, ...FormattedGroups];
            store.dispatch(loadMasterData({ name: "Customers", value: FormattedGroups }));
        };
        fetchCustomers();
    }, [DueReportFilter.TenantOfficeId,DueReportFilter.CustomerGroupId]);

    useEffect(() => {
        const fetchRegions = async () => {
            const TenantRegion = await getCategoryWiseTenantRegionNames();
            const regions = await formatSelectInput(TenantRegion.RegionNames, "RegionName", "Id");
            if (loggeduserinfo.UserCategoryCode === "UCT_FRHO") {
                const filteredRegions = [{ label: "All", value: ''}, ...regions];
                store.dispatch(loadMasterData({ name: "TenantRegions", value: filteredRegions }));

            } else {
                store.dispatch(loadMasterData({ name: "TenantRegions", value: regions }));
                store.dispatch(updateField({ name: 'TenantRegionId', value: loggeduserinfo.RegionId }));
            }
        };
        fetchRegions();
    }, [loggeduserinfo.RegionId]);

    const onDownloadClick = async () => {
        const response = await downloadRevenueDueReport(DueReportFilter);
        const url = window.URL.createObjectURL(response.data);
        FileSaver.saveAs(url, formatDocumentName());
    };

    function onFieldChangeSelect(selectedOption: any, actionMeta: any) {
        const name = actionMeta.name;
        const value = selectedOption.value;
        store.dispatch(updateField({ name: name as keyof RevenueDueReportState['DueReportFilter'], value }));
    }

    const onUpdateField = (ev) => {
        const name = ev.target.name;
        const value = ev.target.value;
        store.dispatch(updateField({ name: name as keyof RevenueDueReportState['DueReportFilter'], value }));
    };

    return (
        <div className="ps-2 pe-4">
            <div className="">
                <div className="">
                    <div className='row mb-2'>
                        <div className='col-md-6'>
                            <div className="">
                                <label className='text-size-13'>{t('revenueduereport_date_from_label')}</label>
                                <input
                                    name='DateFrom'
                                    value={DueReportFilter.DateFrom ? DueReportFilter.DateFrom : ""}
                                    onChange={onUpdateField}
                                    type='date'
                                    className='form-control'
                                ></input>
                            </div>
                        </div>
                        <div className='col-md-6'>
                            <div className="">
                                <label className='text-size-13'>{t('revenueduereport_date_to_label')}</label>
                                <input
                                    name='DateTo'
                                    value={DueReportFilter.DateTo ? DueReportFilter.DateTo : ""}
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
                            <label className='text-size-13'>{t('revenueduereport_tenant_region_label')}</label>
                            <div className="">
                                <Select
                                    options={MasterData.TenantRegions}
                                    value={MasterData.TenantRegions && MasterData.TenantRegions.find(option => option.value == DueReportFilter.TenantRegionId) ||''}
                                    isSearchable
                                    onChange={onFieldChangeSelect}
                                    name='TenantRegionId'
                                />
                            </div>
                        </div>
                        <div className='mt-2 col-md-6'>
                            <label className='text-size-13'>{t('revenueduereport_tenant_location_label')}</label>
                            <div className="">
                                <Select
                                    options={MasterData.TenantOffices}
                                    value={MasterData.TenantOffices && MasterData.TenantOffices.find(option => option.value == DueReportFilter.TenantOfficeId) || ''}
                                    isSearchable
                                    onChange={onFieldChangeSelect}
                                    name='TenantOfficeId'
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className='mt-2 col-md-6'>
                            <label className='text-size-13'>{t('revenueduereport_customergroup_label')}</label>
                            <div className="">
                                <Select
                                    options={MasterData.CustomerGroups}
                                    value={MasterData.CustomerGroups && MasterData.CustomerGroups.find(option => option.value == DueReportFilter.CustomerGroupId) || ''}
                                    isSearchable
                                    onChange={onFieldChangeSelect}
                                    name='CustomerGroupId'
                                />
                            </div>
                        </div>
                        <div className='mt-2 col-md-6'>
                            <label className='text-size-13'>{t('revenueduereport_customer_label')}</label>
                            <div className="">
                                <Select
                                    options={MasterData.Customers}
                                    value={MasterData.Customers && MasterData.Customers.find(option => option.value == DueReportFilter.CustomerId) || ''}
                                    isSearchable
                                    onChange={onFieldChangeSelect}
                                    name='CustomerId'
                                />
                            </div>
                        </div>
                    </div>
                    <button
                        type='button'
                        onClick={onDownloadClick}
                        className=' btn app-primary-bg-color text-white mt-3 mb-1 w-100'
                    >
                        {t('revenueduereport_download_button')}
                    </button>
                </div>
            </div>
        </div >
    );
};

export default RevenueDueReport;
