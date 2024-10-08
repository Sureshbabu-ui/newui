import { useEffect } from 'react';
import Select from 'react-select';
import { useStore } from '../../../../../state/storeHooks';
import { formatDocumentName, formatSelectInput, formatSelectInputWithThreeArgWithParenthesis } from '../../../../../helpers/formats';
import { store } from '../../../../../state/store';
import { CustomerSiteState, loadTenantRegions, loadTenantlocations, loadUserDetail, updateField, loadCustomerList, loadContractNumbers } from './CustomerSiteReport.slice';
import { getCategoryWiseTenantRegionNames } from '../../../../../services/tenantRegion';
import { getRegionAndCategoryWiseWiseTenantOfficeList } from '../../../../../services/tenantOfficeInfo';
import { useTranslation } from 'react-i18next';
import { downloadCustomerSiteReport } from '../../../../../services/reports';
import FileSaver from 'file-saver';
import { getUserLocationInfo } from '../../../../../services/users';
import { getCustomersNames } from '../../../../../services/customer';
import { getFilteredContractsByCustomer } from '../../../../../services/serviceRequest';

const CustomerSiteReport = () => {
    const { t } = useTranslation();
    const {
        customersitereport: { TenantOfficeInfo, loggeduserinfo, TenantRegion, ContractNumbers, Customer, CustomerSiteReport },
    } = useStore(({ customersitereport }) => ({ customersitereport }));

    useEffect(() => {
        const fetchData = async () => {
            if (CustomerSiteReport.TenantRegionId > 0) {
                const TenantLocations = await getRegionAndCategoryWiseWiseTenantOfficeList(CustomerSiteReport.TenantRegionId.toString());
                const TenantLocation = await formatSelectInput(TenantLocations.TenantOfficeName, 'OfficeName', 'Id');
                if (loggeduserinfo.UserCategoryCode === "UCT_CPTV") {
                    store.dispatch(loadTenantlocations({ Select: TenantLocation }));
                    store.dispatch(updateField({ name: 'TenantOfficeId', value: loggeduserinfo.TenantOfficeId }));
                } else {
                    const filterLocations = [{ label: "All", value: "" }, ...TenantLocation];
                    store.dispatch(loadTenantlocations({ Select: filterLocations }));
                }
            }
            const { CustomersList } = await getCustomersNames();
            const Customers = await formatSelectInputWithThreeArgWithParenthesis(CustomersList, "Name", "CustomerCode", "Id")
            store.dispatch(loadCustomerList({ Select: Customers }));
        };
        fetchData();
    }, [CustomerSiteReport.TenantRegionId]);

    useEffect(() => {
        const fetchContractNumbersData = async () => {
            const { Contracts } = await getFilteredContractsByCustomer(CustomerSiteReport.CustomerId);
            const FormatedContracts = await formatSelectInput(Contracts, "ContractNumber", "Id")
            store.dispatch(loadContractNumbers({ Select: FormatedContracts }));
        };
        fetchContractNumbersData();
    }, [CustomerSiteReport.CustomerId])

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
        const response = await downloadCustomerSiteReport(CustomerSiteReport);
        const url = window.URL.createObjectURL(response.data);
        FileSaver.saveAs(url, formatDocumentName());
    };

    function onFieldChangeSelect(selectedOption: any, actionMeta: any) {
        const name = actionMeta.name;
        const value = selectedOption.value;
        store.dispatch(updateField({ name: name as keyof CustomerSiteState['CustomerSiteReport'], value }));
    }

    return (
        <div className="ps-2 pe-4">
            <div className="">
                <div className="">
                    {/* filter row 1 */}
                    <div className="row">

                        <div className='mt-2 col-md-6'>
                            <label className=''> {t('customersite_report_customer_label')}</label>
                            <div className="">
                                <Select
                                    options={Customer}
                                    onChange={onFieldChangeSelect}
                                    isSearchable
                                    name='CustomerId'
                                    placeholder={t('customersite_report_customer_select_option')}
                                />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <label className="mt-2">{t('customersite_report_contract_numbers')}</label>
                            <Select
                                options={ContractNumbers}
                                value={ContractNumbers && ContractNumbers.find(option => option.value == CustomerSiteReport.ContractId) || null}
                                onChange={onFieldChangeSelect}
                                isSearchable
                                placeholder={t('customersite_report_contract_select_option')}
                                name="ContractId"
                            />
                        </div>
                    </div>
                    {/* filter row 1 ends */}
                    <div className="row">
                        <div className='mt-2 col-md-6'>
                            <label className=''>{t('customersite_tenant_region_label')}</label>
                            <div className="">
                                <Select
                                    options={TenantRegion}
                                    value={TenantRegion && TenantRegion.find(option => option.value == CustomerSiteReport.TenantRegionId) || null}
                                    isSearchable
                                    onChange={onFieldChangeSelect}
                                    name='TenantRegionId'
                                    placeholder={t('customersite_placeholder_tenant_region')}
                                />
                            </div>
                        </div>
                        <div className='mt-2 col-md-6'>
                            <label className=''>{t('customersite_placeholder_tenant_location')}</label>
                            <div className="">
                                <Select
                                    options={TenantOfficeInfo}
                                    value={TenantOfficeInfo && TenantOfficeInfo.find(option => option.value == CustomerSiteReport.TenantOfficeId) || null}
                                    isSearchable
                                    onChange={onFieldChangeSelect}
                                    name='TenantOfficeId'
                                    placeholder={t('customersite_placeholder_tenant_location_placeholder')}
                                />
                            </div>
                        </div>
                    </div>
                    <button
                        type='button'
                        onClick={onDownloadClick}
                        className=' btn app-primary-bg-color text-white mt-3 mb-1 w-100'
                    >
                        {t('customersite_download_button')}
                    </button>
                </div>
            </div>
        </div >
    );
};

export default CustomerSiteReport;
