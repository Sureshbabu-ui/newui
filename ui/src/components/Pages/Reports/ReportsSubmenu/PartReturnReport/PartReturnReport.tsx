import { useEffect } from 'react';
import Select from 'react-select';
import { useStoreWithInitializer } from '../../../../../state/storeHooks';
import { getValuesInMasterDataByTable } from '../../../../../services/masterData';
import { formatDocumentName, formatSelectInput } from '../../../../../helpers/formats';
import { store } from '../../../../../state/store';
import { PartReturnReportReportState, initializePartReturnReportReport, loadUserDetail, loadEngineers, loadMasterData, loadTenantRegions, loadTenantlocations, updateField } from './PartReturnReport.slice';
import { getCategoryWiseTenantRegionNames } from '../../../../../services/tenantRegion';
import { getRegionAndCategoryWiseWiseTenantOfficeList, getRegionWiseTenantOfficeList } from '../../../../../services/tenantOfficeInfo';
import { useTranslation } from 'react-i18next';
import { downloadPartReturnReport } from '../../../../../services/reports';
import FileSaver from 'file-saver';
import { getCategoryWiseServiceEngineers, getUserLocationInfo } from '../../../../../services/users';

const PartReturnReport = () => {
    const { t } = useTranslation();
    const {
        partreturnreport: { TenantOfficeInfo, ReturnedPartType, loggeduserinfo, ServiceEngineers, PartReturnReport, TenantRegion },
    } = useStoreWithInitializer(({ partreturnreport }) => ({ partreturnreport }), GetPartReturnFilterData);

    useEffect(() => {
        GetPartReturnFilterData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            if (PartReturnReport.TenantRegionId > 0) {
                const TenantLocations = await getRegionAndCategoryWiseWiseTenantOfficeList(PartReturnReport.TenantRegionId.toString());
                const TenantLocation = await formatSelectInput(TenantLocations.TenantOfficeName, 'OfficeName', 'Id');
                if (loggeduserinfo.UserCategoryCode === "UCT_CPTV") {
                    store.dispatch(loadTenantlocations({ Select: TenantLocation }));
                    store.dispatch(updateField({ name: 'TenantOfficeId', value: loggeduserinfo.TenantOfficeId }));
                } else {
                    const filterLocations = [{ label: "All", value: "" }, ...TenantLocation];
                    store.dispatch(loadTenantlocations({ Select: filterLocations }));
                }
            }
        };
        fetchData();
    }, [PartReturnReport.TenantRegionId]);

    useEffect(() => {
        const fetchUserData = async () => {
            const info = await getUserLocationInfo()
            store.dispatch(loadUserDetail(info.userLocationInfo));
        };
        fetchUserData();
    }, []);

    useEffect(() => {
        const fetchRegions = async () => {
            const TenantRegion = await getCategoryWiseTenantRegionNames();
            const regions = await formatSelectInput(TenantRegion.RegionNames, "RegionName", "Id");
            if (loggeduserinfo.UserCategoryCode === "UCT_FRHO") {
                const filteredRegions = [{ label: "All", value: "" }, ...regions];
                store.dispatch(loadTenantRegions({ Select: filteredRegions }));
            } else {
                store.dispatch(loadTenantRegions({ Select: regions }));
                store.dispatch(updateField({ name: 'TenantRegionId', value: loggeduserinfo.RegionId }));
            }
        };
        fetchRegions();
    }, [loggeduserinfo]);

    async function GetPartReturnFilterData() {
        store.dispatch(initializePartReturnReportReport());
        try {
            var { MasterData } = await getValuesInMasterDataByTable('ReturnedPartType');
            const partType = await formatSelectInput(MasterData, 'Name', 'Id');
            const filteredpartTypes = [{ label: "All", value: "" }, ...partType];
            store.dispatch(loadMasterData({ Select: filteredpartTypes }));

            const { ServiceEngineers } = await getCategoryWiseServiceEngineers()
            const EngineersName = await (formatSelectInput(ServiceEngineers, "FullName", "Id"))
            const engnames = [{ label: "All", value: "" }, ...EngineersName];
            store.dispatch(loadEngineers({ Select: engnames }));
        } catch (error) {
            return
        }
    }

    const onDownloadClick = async () => {
        const response = await downloadPartReturnReport(PartReturnReport);
        const url = window.URL.createObjectURL(response.data);
        FileSaver.saveAs(url, formatDocumentName());
    };

    function onFieldChangeSelect(selectedOption: any, actionMeta: any) {
        const name = actionMeta.name;
        const value = selectedOption.value;
        store.dispatch(updateField({ name: name as keyof PartReturnReportReportState['PartReturnReport'], value }));
    }

    const onUpdateField = (ev) => {
        const name = ev.target.name;
        const value = ev.target.value;
        store.dispatch(updateField({ name: name as keyof PartReturnReportReportState['PartReturnReport'], value }));
    };

    const Warrantycheck = [
        { value: '', label: "All" },
        { value: '1', label: "Under Warranty" },
        { value: '0', label: "Warranty Expired" }
    ];

    function handleCheckbox(value: string) {
        store.dispatch(updateField({ name: 'IsUnderWarranty', value }));
    }

    return (
        <div className="ps-2 pe-4">
            <div className="">
                <div className="">
                    {/* filter row 1 */}
                    <div className='row mb-2'>
                        {/* from date */}
                        <div className='col-md-6'>
                            <div className="">
                                <label className='text-size-13'>{t('partreturn_detail_report_date_from_label')}</label>
                                <input
                                    name='DateFrom'
                                    value={PartReturnReport.DateFrom ? PartReturnReport.DateFrom : ""}
                                    onChange={onUpdateField}
                                    type='date'
                                    className='form-control'
                                ></input>
                            </div>
                        </div>
                        {/* from date ends */}
                        {/* to date */}
                        <div className='col-md-6'>
                            <div className="">
                                <label className='text-size-13'>{t('partreturn_detail_report_date_to_label')}</label>
                                <input
                                    name='DateTo'
                                    value={PartReturnReport.DateTo ? PartReturnReport.DateTo : ""}
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
                            <label className='text-size-13'>{t('partreturn_detail_report_tenant_region_label')}</label>
                            <div className="">
                                <Select
                                    options={TenantRegion}
                                    value={TenantRegion && TenantRegion.find(option => option.value == PartReturnReport.TenantRegionId) || null}
                                    isSearchable
                                    onChange={onFieldChangeSelect}
                                    name='TenantRegionId'
                                    placeholder={t('partreturn_detail_report_placeholder_tenant_region')}
                                />
                            </div>
                        </div>
                        <div className='mt-2 col-md-6'>
                            <label className='text-size-13'>{t('partreturn_detail_report_tenant_location_label')}</label>
                            <div className="">
                                <Select
                                    options={TenantOfficeInfo}
                                    value={TenantOfficeInfo && TenantOfficeInfo.find(option => option.value == PartReturnReport.TenantOfficeId) || null}
                                    isSearchable
                                    onChange={onFieldChangeSelect}
                                    name='TenantOfficeId'
                                    placeholder={t('partreturn_detail_report_placeholder_tenant_location')}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className='mt-2 col-md-6'>
                            <label className='text-size-13'>{t('partreturn_detail_report_service_engineer_label')}</label>
                            <div className="">
                                <Select
                                    options={ServiceEngineers}
                                    value={ServiceEngineers && ServiceEngineers.find(option => option.value == PartReturnReport.ServiceEngineerId) || null}
                                    onChange={onFieldChangeSelect}
                                    isSearchable
                                    name="ServiceEngineerId"
                                    placeholder={t('partreturn_detail_report_placeholder_se')}
                                />
                            </div>
                        </div>
                        <div className='mt-2 col-md-6'>
                            <label className='text-size-13'>{t('partreturn_detail_report_parttype_label')}</label>
                            <div className="">
                                <Select
                                    options={ReturnedPartType}
                                    value={(ReturnedPartType && ReturnedPartType.find((option) => option.value == PartReturnReport.ReturnedPartTypeId)) || null}
                                    isSearchable
                                    onChange={onFieldChangeSelect}
                                    name='ReturnedPartTypeId'
                                    placeholder={t('partreturn_detail_report_placeholder_returned_part_type')}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="mx-0 mt-3 d-flex flex-row">
                        {Warrantycheck.map((item) => (
                            <div key={item.value} className="ps-0 pe-4 pb-2">
                                <input
                                    type="radio"
                                    className={`form-check-input border-secondary`}
                                    onChange={(ev) => handleCheckbox(item.value)}
                                    value={item.value}
                                    name="IsUnderWarranty"
                                    data-testid={`create_user_input_checkbox_${item.label}`}
                                    checked={PartReturnReport.IsUnderWarranty == item.value}
                                />
                                <label className="text-size-13 ms-2">{item.label}</label>
                            </div>
                        ))}
                    </div>
                    <button
                        type='button'
                        onClick={onDownloadClick}
                        className=' btn app-primary-bg-color text-white mt-3 mb-1 w-100'
                    >
                        {t('partreturn_detail_report_download_button')}
                    </button>
                </div>
            </div>
        </div >
    );
};

export default PartReturnReport;
