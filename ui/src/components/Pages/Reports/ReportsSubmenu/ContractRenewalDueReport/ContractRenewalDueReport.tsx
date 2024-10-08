import { useEffect } from 'react';
import Select from 'react-select';
import { useStore } from '../../../../../state/storeHooks';
import { formatDocumentName, formatSelectInput } from '../../../../../helpers/formats';
import { store } from '../../../../../state/store';
import { ContractRenewDueReportState, loadTenantRegions, loadTenantlocations, loadUserDetail, updateField } from './ContractRenewalDueReport.slice';
import { getCategoryWiseTenantRegionNames } from '../../../../../services/tenantRegion';
import { getRegionAndCategoryWiseWiseTenantOfficeList } from '../../../../../services/tenantOfficeInfo';
import { useTranslation } from 'react-i18next';
import { downloadContractRenewDueReport } from '../../../../../services/reports';
import FileSaver from 'file-saver';
import { getUserLocationInfo } from '../../../../../services/users';

const ContractRenewalDueReport = () => {
    const { t } = useTranslation();
    const {
        contractrenewduereport: { TenantOfficeInfo, loggeduserinfo, RenewDueReport, TenantRegion },
    } = useStore(({ contractrenewduereport }) => ({ contractrenewduereport }));

    useEffect(() => {
        const fetchData = async () => {
            if (RenewDueReport.TenantRegionId > 0) {
                const TenantLocations = await getRegionAndCategoryWiseWiseTenantOfficeList(RenewDueReport.TenantRegionId.toString());
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
    }, [RenewDueReport.TenantRegionId]);

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
        const response = await downloadContractRenewDueReport(RenewDueReport);
        const url = window.URL.createObjectURL(response.data);
        FileSaver.saveAs(url, formatDocumentName());
    };

    function onFieldChangeSelect(selectedOption: any, actionMeta: any) {
        const name = actionMeta.name;
        const value = selectedOption.value;
        store.dispatch(updateField({ name: name as keyof ContractRenewDueReportState['RenewDueReport'], value }));
    }

    const onUpdateField = (ev) => {
        const name = ev.target.name;
        const value = ev.target.value;
        store.dispatch(updateField({ name: name as keyof ContractRenewDueReportState['RenewDueReport'], value }));
    };

    return (
        <div className="ps-2 pe-4">
            {/* filter row 1 */}
            <div className='row mb-2'>
                {/* from date */}
                <div className='col-md-6'>
                    <div>
                        <label className='text-size-13'>{t('renewdue_report_date_from_label')}</label>
                        <input
                            name='DateFrom'
                            value={RenewDueReport.DateFrom ? RenewDueReport.DateFrom : ""}
                            onChange={onUpdateField}
                            type='date'
                            className='form-control'
                        ></input>
                    </div>
                </div>
                {/* from date ends */}
                {/* to date */}
                <div className='col-md-6'>
                    <div>
                        <label className='text-size-13'>{t('renewdue_report_date_to_label')}</label>
                        <input
                            name='DateTo'
                            value={RenewDueReport.DateTo ? RenewDueReport.DateTo : ""}
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
                    <label className='text-size-13'>{t('renewdue_report_tenant_region_label')}</label>
                    <div>
                        <Select
                            options={TenantRegion}
                            value={TenantRegion && TenantRegion.find(option => option.value == RenewDueReport.TenantRegionId) || null}
                            isSearchable
                            onChange={onFieldChangeSelect}
                            name='TenantRegionId'
                            placeholder={t('renewdue_report_placeholder_tenant_region')}
                        />
                    </div>
                </div>
                <div className='mt-2 col-md-6'>
                    <label className='text-size-13'>{t('renewdue_report_tenant_location_label')}</label>
                    <div>
                        <Select
                            options={TenantOfficeInfo}
                            value={TenantOfficeInfo && TenantOfficeInfo.find(option => option.value == RenewDueReport.TenantOfficeId) || null}
                            isSearchable
                            onChange={onFieldChangeSelect}
                            name='TenantOfficeId'
                            placeholder={t('renewdue_report_placeholder_tenant_location')}
                        />
                    </div>
                </div>
            </div>
            <button
                type='button'
                onClick={onDownloadClick}
                className=' btn app-primary-bg-color text-white mt-3 mb-1 w-100'
            >
                {t('renewdue_report_download_button')}
            </button>
        </div >
    );
};

export default ContractRenewalDueReport;
