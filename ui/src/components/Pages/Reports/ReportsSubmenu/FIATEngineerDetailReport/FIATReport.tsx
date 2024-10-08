import { useEffect } from 'react';
import Select from 'react-select';
import { useStore } from '../../../../../state/storeHooks';
import { formatDocumentName, formatSelectInput } from '../../../../../helpers/formats';
import { store } from '../../../../../state/store';
import { FIATEngDetailReportState, loadTenantRegions, loadTenantlocations, loadUserDetail, updateField } from './FIATReport.slice';
import { getCategoryWiseTenantRegionNames } from '../../../../../services/tenantRegion';
import { getRegionAndCategoryWiseWiseTenantOfficeList } from '../../../../../services/tenantOfficeInfo';
import { useTranslation } from 'react-i18next';
import { downloadFIATEngDetailReport } from '../../../../../services/reports';
import FileSaver from 'file-saver';
import { getUserLocationInfo } from '../../../../../services/users';

const FIATReport = () => {
    const { t } = useTranslation();
    const {
        fiatengreport: { TenantOfficeInfo, loggeduserinfo, FIATEngDetail, TenantRegion },
    } = useStore(({ fiatengreport }) => ({ fiatengreport }));

    useEffect(() => {
        const fetchData = async () => {
            if (FIATEngDetail.TenantRegionId > 0) {
                const TenantLocations = await getRegionAndCategoryWiseWiseTenantOfficeList(FIATEngDetail.TenantRegionId.toString());
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
    }, [FIATEngDetail.TenantRegionId]);

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

    const onDownloadClick = async () => {
        const response = await downloadFIATEngDetailReport(FIATEngDetail);
        const url = window.URL.createObjectURL(response.data);
        FileSaver.saveAs(url, formatDocumentName());
    };

    function onFieldChangeSelect(selectedOption: any, actionMeta: any) {
        const name = actionMeta.name;
        const value = selectedOption.value;
        store.dispatch(updateField({ name: name as keyof FIATEngDetailReportState['FIATEngDetail'], value }));
    }

    const onUpdateField = (ev) => {
        const name = ev.target.name;
        const value = ev.target.value;
        store.dispatch(updateField({ name: name as keyof FIATEngDetailReportState['FIATEngDetail'], value }));
    };

    return (
        <div className="ps-2 pe-4">
            <div className="">
                <div className="">
                    {/* filter row 1 */}
                    {/* TODO:For the time being we were not using this filter */}
                    {/* <div className='row mb-2'>
                        <div className='col-md-6'>
                            <div className="">
                                <label className='text-size-13'>{t('engdetail_report_date_from_label')}</label>
                                <input
                                    name='DateFrom'
                                    value={FIATEngDetail.DateFrom ? FIATEngDetail.DateFrom : ""}
                                    onChange={onUpdateField}
                                    type='date'
                                    className='form-control'
                                ></input>
                            </div>
                        </div>
                        <div className='col-md-6'>
                            <div className="">
                                <label className='text-size-13'>{t('engdetail_report_date_to_label')}</label>
                                <input
                                    name='DateTo'
                                    value={FIATEngDetail.DateTo ? FIATEngDetail.DateTo : ""}
                                    onChange={onUpdateField}
                                    type='date'
                                    className='form-control'
                                ></input>
                            </div>
                        </div>
                    </div> */}
                    {/* filter row 1 ends */}
                    <div className="row">
                        <div className='mt-2 col-md-6'>
                            <label className='text-size-13'>{t('engdetail_report_tenant_region_label')}</label>
                            <div className="">
                                <Select
                                    options={TenantRegion}
                                    value={TenantRegion && TenantRegion.find(option => option.value == FIATEngDetail.TenantRegionId) || null}
                                    isSearchable
                                    onChange={onFieldChangeSelect}
                                    name='TenantRegionId'
                                    placeholder={t('engdetail_report_placeholder_tenant_region')}
                                />
                            </div>
                        </div>
                        <div className='mt-2 col-md-6'>
                            <label className='text-size-13'>{t('engdetail_report_tenant_location_label')}</label>
                            <div className="">
                                <Select
                                    options={TenantOfficeInfo}
                                    value={TenantOfficeInfo && TenantOfficeInfo.find(option => option.value == FIATEngDetail.TenantOfficeId) || null}
                                    isSearchable
                                    onChange={onFieldChangeSelect}
                                    name='TenantOfficeId'
                                    placeholder={t('engdetail_report_placeholder_tenant_location')}
                                />
                            </div>
                        </div>
                    </div>
                    <button
                        type='button'
                        onClick={onDownloadClick}
                        className=' btn app-primary-bg-color text-white mt-3 mb-1 w-100'
                    >
                        {t('engdetail_report_download_button')}
                    </button>
                </div>
            </div>
        </div >
    );
};
export default FIATReport


