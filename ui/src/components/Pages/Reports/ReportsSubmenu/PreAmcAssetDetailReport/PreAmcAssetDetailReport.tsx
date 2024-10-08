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
import { PreAmcAssetDetailReportState, loadMasterData, loadUserDetail, updateField } from './PreAmcAssetDetailReport.slice';
import { getCustomerNamesByLocationGroupFilter } from '../../../../../services/customer';
import { downloadPreAmcAssetDetailReport } from '../../../../../services/reports';
import { getContractNamesByCustomerFilter } from '../../../../../services/contracts';
import { getAssetProductCategoryNames } from '../../../../../services/assetProductCategory';
import { getPartMake } from '../../../../../services/part';
import { getProductModelNames } from '../../../../../services/serviceRequest';
import { getCustomerSiteNamesByContractFilter } from '../../../../../services/customerSite';
import { getValuesInMasterDataByTable } from '../../../../../services/masterData';

const PreAmcAssetDetailReport = () => {
    const { t } = useTranslation();
    const {
        preamcassetdetailreport: { PreAmcAssetReportFilter, MasterData, loggeduserinfo },
    } = useStore(({ preamcassetdetailreport }) => ({ preamcassetdetailreport }));

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

            const ConditionList = await getValuesInMasterDataByTable("ProductPreAmcCondition");
            const FilteredConditions = await formatSelectInput(ConditionList.MasterData, "Name", "Id")
            store.dispatch(loadMasterData({ name: "AssetConditions", value: FilteredConditions }));
      
        }
        catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        const fetchCustomers = async () => {
            const Customers = await getCustomerNamesByLocationGroupFilter(PreAmcAssetReportFilter.TenantOfficeId);
            const FormattedCustomers = await formatSelectInput(Customers.CustomerNamesByFilter, "NameOnPrint", "Id");
            store.dispatch(loadMasterData({ name: "Customers", value: FormattedCustomers }));
        };
        fetchCustomers();
    }, [PreAmcAssetReportFilter.TenantOfficeId]);

    useEffect(() => {
        const fetchContracts = async () => {
            const Contracts = await getContractNamesByCustomerFilter(PreAmcAssetReportFilter.CustomerId);
            const FormattedContracts = await formatSelectInput(Contracts.ContractNumbersByCustomer, "ContractNumber", "Id");
            store.dispatch(loadMasterData({ name: "Contracts", value: FormattedContracts }));
        };
        fetchContracts();
    }, [PreAmcAssetReportFilter.CustomerId]);

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
            const { ModelNames } = await getProductModelNames(String(PreAmcAssetReportFilter.AssetProductCategoryId), String(PreAmcAssetReportFilter.MakeId))
            const FormattedModelNames = await (formatSelectInput(ModelNames, "ModelName", "Id"))
            store.dispatch(loadMasterData({ name: "ProductModels", value: FormattedModelNames }));
        }
        if (PreAmcAssetReportFilter.AssetProductCategoryId != null && PreAmcAssetReportFilter.MakeId != null)
            fetchModels()
    }, [PreAmcAssetReportFilter.AssetProductCategoryId, PreAmcAssetReportFilter.MakeId])

    const onDownloadClick = async () => {
        const response = await downloadPreAmcAssetDetailReport(PreAmcAssetReportFilter);
        const url = window.URL.createObjectURL(response.data);
        FileSaver.saveAs(url, 'preamcassetdetail_'+formatDocumentName());
    };

    function onFieldChangeSelect(selectedOption: any, actionMeta: any) {
        const name = actionMeta.name;
        store.dispatch(updateField({ name: name as keyof PreAmcAssetDetailReportState['PreAmcAssetReportFilter'], value: selectedOption ? selectedOption.value : null }));
    }

    const onUpdateField = (ev) => {
        const name = ev.target.name;
        const value = ev.target.value==''?null:ev.target.value;
        store.dispatch(updateField({ name: name as keyof PreAmcAssetDetailReportState['PreAmcAssetReportFilter'], value }));
    };

    useEffect(() => {
        const fetchSites = async () => {
            const CustomerSites = await getCustomerSiteNamesByContractFilter(PreAmcAssetReportFilter.ContractId);
            const FormattedSites = await formatSelectInput(CustomerSites.CustomerSiteNames, "SiteName", "Id");
            store.dispatch(loadMasterData({ name: "CustomerSites", value: FormattedSites }));
        };
        fetchSites();
    }, [PreAmcAssetReportFilter.ContractId]);
    return (
        <div className="ps-2 pe-4">
            <div className="">
                <div className="">
                    <div className='row mb-2'>
                        <div className="col-12"> 
                             <label className='text-size-13'>{t('preamcassetdetailreport_daterange_label')}</label>
                        </div>
                        <div className='col-md-6'>
                            <div className="">
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
                                <input
                                    name='DateTo'
                                    value={PreAmcAssetReportFilter.DateTo ? PreAmcAssetReportFilter.DateTo : ""}
                                    onChange={onUpdateField}
                                    type='date'
                                    className='form-control'
                                ></input>
                            </div>
                        </div>
                        <div className="col-md-6 mt-3">
                            <label className='text-size-13'>{t('preamcassetdetailreport_outsource_label')}</label>
                            <div className="mb-0">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    value=''
                                    onChange={onUpdateField}
                                     checked={PreAmcAssetReportFilter.OutSourceNeeded==null}
                                    name="OutSourceNeeded"
                                />
                                <label className="form-check-label pe-2 ms-1">{t('preamcassetdetailreport_all_label')}</label>
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    onChange={onUpdateField}
                                    value="1"
                                    checked={PreAmcAssetReportFilter.OutSourceNeeded=="1"}
                                    name="OutSourceNeeded"
                                />
                                <label className="form-check-label ms-1 pe-2">{t('preamcassetdetailreport_needed_label')}</label>
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    onChange={onUpdateField}
                                    value="0"
                                    checked={PreAmcAssetReportFilter.OutSourceNeeded=="0"}
                                    name="OutSourceNeeded"
                                />
                                <label className="form-check-label  ms-1">{t('preamcassetdetailreport_notneeded_label')}</label>

                            </div>
                        </div>

                  
                    {/* filter row 1 ends */}
                        <div className='col-md-6'>
                            <label className='text-size-13'>{t('preamcassetdetailreport_tenant_region_label')}</label>
                            <div className="">
                                <Select
                                    options={MasterData.TenantRegions}
                                    value={MasterData.TenantRegions && MasterData.TenantRegions.find(option => option.value == PreAmcAssetReportFilter.TenantRegionId) || ''}
                                    isSearchable
                                    isClearable
                                    onChange={onFieldChangeSelect}
                                    name='TenantRegionId'
                                />
                            </div>
                        </div>
                        <div className='mt-2 col-md-6'>
                            <label className='text-size-13'>{t('preamcassetdetailreport_tenant_location_label')}</label>
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
                        <div className='mt-2 col-md-6'>
                            <label className='text-size-13'>{t('preamcassetdetailreport_customer_label')}</label>
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
                            <label className='text-size-13'>{t('preamcassetdetailreport_contract_label')}</label>
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
                            <label className='text-size-13'>{t('preamcassetdetailreport_customersite_label')}</label>
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
                        <div className='mt-2 col-md-6'>
                            <label className='text-size-13'>{t('preamcassetdetailreport_assetproductcategory_label')}</label>
                            <div className="">
                                <Select
                                    options={MasterData.AssetProductCategories}
                                    value={MasterData.AssetProductCategories && MasterData.AssetProductCategories.find(option => option.value == PreAmcAssetReportFilter.AssetProductCategoryId) || ''}
                                    isSearchable
                                    isClearable
                                    onChange={onFieldChangeSelect}
                                    name='AssetProductCategoryId'
                                />
                            </div>
                        </div>

                        <div className='mt-2 col-md-6'>
                            <label className='text-size-13'>{t('preamcassetdetailreport_make_label')}</label>
                            <div className="">
                                <Select
                                    options={MasterData.Makes}
                                    value={MasterData.Makes && MasterData.Makes.find(option => option.value == PreAmcAssetReportFilter.MakeId) || ''}
                                    isSearchable
                                    isClearable
                                    onChange={onFieldChangeSelect}
                                    name='MakeId'
                                />
                            </div>
                        </div>
                        <div className='mt-2 col-md-6'>
                            <label className='text-size-13'>{t('preamcassetdetailreport_model_label')}</label>
                            <div className="">
                                <Select
                                    options={MasterData.ProductModels}
                                    value={MasterData.ProductModels && MasterData.ProductModels.find(option => option.value == PreAmcAssetReportFilter.ProductModelId) || ''}
                                    isSearchable
                                    isClearable
                                    onChange={onFieldChangeSelect}
                                    name='ProductModelId'
                                />
                            </div>
                        </div>
                        <div className='mt-2 col-md-6'>
                            <label className='text-size-13'>{t('preamcassetdetailreport_assetcondition_label')}</label>
                            <div className="">
                                <Select
                                    options={MasterData.AssetConditions}
                                    value={MasterData.AssetConditions && MasterData.AssetConditions.find(option => option.value == PreAmcAssetReportFilter.AssetConditionId) || ''}
                                    isSearchable
                                    isClearable
                                    onChange={onFieldChangeSelect}
                                    name='AssetConditionId'
                                />
                            </div>
                        </div>
                    </div>
                    <button
                        type='button'
                        onClick={onDownloadClick}
                        className=' btn app-primary-bg-color text-white mt-3 mb-1 w-100'
                    >
                        {t('preamcassetdetailreport_download_button')}
                    </button>
                </div>
            </div>
        </div >
    );
};

export default PreAmcAssetDetailReport;
