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
import { PMAssetDetailReportState, loadMasterData, loadUserDetail, updateField } from './PMAssetDetailReport.slice';
import { getCustomerNamesByLocationGroupFilter } from '../../../../../services/customer';
import { downloadPMAssetDetailReport } from '../../../../../services/reports';
import { getContractNamesByCustomerFilter } from '../../../../../services/contracts';
import { getAssetProductCategoryNames } from '../../../../../services/assetProductCategory';
import { getPartMake } from '../../../../../services/part';
import { getProductModelNames } from '../../../../../services/serviceRequest';
import { getCustomerSiteNamesByContractFilter } from '../../../../../services/customerSite';

const PMAssetDetailReport = () => {
    const { t } = useTranslation();
    const {
        pmassetdetailreport: { PMAssetReportFilter, MasterData, loggeduserinfo },
    } = useStore(({ pmassetdetailreport }) => ({ pmassetdetailreport }));

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
        onLoad()

    }, []);

    const onLoad = async () => {
        try {
            const { AssetProductCategoryNames } = await getAssetProductCategoryNames()
            const FilteredCategories = formatSelectInput(AssetProductCategoryNames, 'CategoryName', 'Id')
            store.dispatch(loadMasterData({ name: "AssetProductCategories", value: FilteredCategories }));

            const { MakeNames } = await getPartMake()
            const FilteredMakeList = formatSelectInput(MakeNames, "Name", "Id")
            store.dispatch(loadMasterData({ name: "Makes", value: FilteredMakeList }));
        }
        catch (err) {
            console.log(err)
        }
    }


    useEffect(() => {
        const fetchCustomers = async () => {
            const Customers = await getCustomerNamesByLocationGroupFilter(PMAssetReportFilter.TenantOfficeId);
            const FormattedCustomers = await formatSelectInput(Customers.CustomerNamesByFilter, "NameOnPrint", "Id");
            store.dispatch(loadMasterData({ name: "Customers", value: FormattedCustomers }));
        };
        fetchCustomers();
    }, [PMAssetReportFilter.TenantOfficeId]);

    useEffect(() => {
        const fetchContracts = async () => {
            const Contracts = await getContractNamesByCustomerFilter(PMAssetReportFilter.CustomerId);
            const FormattedContracts = await formatSelectInput(Contracts.ContractNumbersByCustomer, "ContractNumber", "Id");
            store.dispatch(loadMasterData({ name: "Contracts", value: FormattedContracts }));
        };
        fetchContracts();
    }, [PMAssetReportFilter.CustomerId]);

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

    useEffect(() => {
        const fetchModels = async () => {
            const { ModelNames } = await getProductModelNames(String(PMAssetReportFilter.AssetProductCategoryId), String(PMAssetReportFilter.MakeId))
            const FormattedModelNames = await (formatSelectInput(ModelNames, "ModelName", "Id"))
            store.dispatch(loadMasterData({ name: "ProductModels", value: FormattedModelNames }));
        }
        if (PMAssetReportFilter.AssetProductCategoryId != null && PMAssetReportFilter.MakeId != null)
            fetchModels()
    }, [PMAssetReportFilter.AssetProductCategoryId, PMAssetReportFilter.MakeId])

    const onDownloadClick = async () => {
        const response = await downloadPMAssetDetailReport(PMAssetReportFilter);
        const url = window.URL.createObjectURL(response.data);
        FileSaver.saveAs(url, formatDocumentName());
    };

    function onFieldChangeSelect(selectedOption: any, actionMeta: any) {
        const name = actionMeta.name;
        store.dispatch(updateField({ name: name as keyof PMAssetDetailReportState['PMAssetReportFilter'], value: selectedOption ? selectedOption.value : null }));
    }

    const onUpdateField = (ev) => {
        const name = ev.target.name;
        const value = ev.target.value==''?null:ev.target.value;
        store.dispatch(updateField({ name: name as keyof PMAssetDetailReportState['PMAssetReportFilter'], value }));
    };

    useEffect(() => {
        const fetchSites = async () => {
            const CustomerSites = await getCustomerSiteNamesByContractFilter(PMAssetReportFilter.ContractId);
            const FormattedSites = await formatSelectInput(CustomerSites.CustomerSiteNames, "SiteName", "Id");
            store.dispatch(loadMasterData({ name: "CustomerSites", value: FormattedSites }));
        };
        fetchSites();
    }, [PMAssetReportFilter.ContractId]);
    return (
        <div className="ps-2 pe-4">
            <div className="">
                <div className="">
                    <div className='row mb-2'>
                        <div className="col-12"> 
                             <label className='text-size-13'>{t('pmassetdetailreport_daterange_label')}</label>
                        </div>
                        <div className='col-md-6'>
                            <div className="">
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
                                <input
                                    name='DateTo'
                                    value={PMAssetReportFilter.DateTo ? PMAssetReportFilter.DateTo : ""}
                                    onChange={onUpdateField}
                                    type='date'
                                    className='form-control'
                                ></input>
                            </div>
                        </div>
                        <div className="row mt-3">
                            <label className='text-size-13'>{t('pmassetdetailreport_completionstatus_label')}</label>
                            <div className="mb-0">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    onChange={onUpdateField}
                                    value=""
                                    checked={PMAssetReportFilter.StatusType==null}
                                    name="StatusType"
                                />
                                <label className="form-check-label pe-2 ms-1">{t('pmassetdetailreport_all_label')}</label>
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    onChange={onUpdateField}
                                    value="1"
                                    checked={PMAssetReportFilter.StatusType=="1"}
                                    name="StatusType"
                                />
                                <label className="form-check-label ms-1 pe-2">{t('pmassetdetailreport_completed_label')}</label>
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    onChange={onUpdateField}
                                    value="0"
                                    checked={PMAssetReportFilter.StatusType=="0"}
                                    name="StatusType"
                                />
                                <label className="form-check-label  ms-1">{t('pmassetdetailreport_notcompleted_label')}</label>

                            </div>
                        </div>

                    </div>
                    {/* filter row 1 ends */}
                    <div className="row">
                        <div className='col-md-6'>
                            <label className='text-size-13'>{t('pmassetdetailreport_tenant_region_label')}</label>
                            <div className="">
                                <Select
                                    options={MasterData.TenantRegions}
                                    value={MasterData.TenantRegions && MasterData.TenantRegions.find(option => option.value == PMAssetReportFilter.TenantRegionId) || ''}
                                    isSearchable
                                    isClearable
                                    onChange={onFieldChangeSelect}
                                    name='TenantRegionId'
                                />
                            </div>
                        </div>
                        <div className='mt-2 col-md-6'>
                            <label className='text-size-13'>{t('pmassetdetailreport_tenant_location_label')}</label>
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
                            <label className='text-size-13'>{t('pmassetdetailreport_customer_label')}</label>
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
                            <label className='text-size-13'>{t('pmassetdetailreport_contract_label')}</label>
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
                            <label className='text-size-13'>{t('pmassetdetailreport_customersite_label')}</label>
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
                        <div className='mt-2 col-md-6'>
                            <label className='text-size-13'>{t('pmassetdetailreport_assetproductcategory_label')}</label>
                            <div className="">
                                <Select
                                    options={MasterData.AssetProductCategories}
                                    value={MasterData.AssetProductCategories && MasterData.AssetProductCategories.find(option => option.value == PMAssetReportFilter.AssetProductCategoryId) || ''}
                                    isSearchable
                                    isClearable
                                    onChange={onFieldChangeSelect}
                                    name='AssetProductCategoryId'
                                />
                            </div>
                        </div>

                        <div className='mt-2 col-md-6'>
                            <label className='text-size-13'>{t('pmassetdetailreport_make_label')}</label>
                            <div className="">
                                <Select
                                    options={MasterData.Makes}
                                    value={MasterData.Makes && MasterData.Makes.find(option => option.value == PMAssetReportFilter.MakeId) || ''}
                                    isSearchable
                                    isClearable
                                    onChange={onFieldChangeSelect}
                                    name='MakeId'
                                />
                            </div>
                        </div>
                        <div className='mt-2 col-md-6'>
                            <label className='text-size-13'>{t('pmassetdetailreport_model_label')}</label>
                            <div className="">
                                <Select
                                    options={MasterData.ProductModels}
                                    value={MasterData.ProductModels && MasterData.ProductModels.find(option => option.value == PMAssetReportFilter.ProductModelId) || ''}
                                    isSearchable
                                    isClearable
                                    onChange={onFieldChangeSelect}
                                    name='ProductModelId'
                                />
                            </div>
                        </div>
                    </div>
                    <button
                        type='button'
                        onClick={onDownloadClick}
                        className=' btn app-primary-bg-color text-white mt-3 mb-1 w-100'
                    >
                        {t('pmassetdetailreport_download_button')}
                    </button>
                </div>
            </div>
        </div >
    );
};

export default PMAssetDetailReport;
