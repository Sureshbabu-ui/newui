import { useEffect, useState } from 'react';
import Select from 'react-select';
import FileSaver from 'file-saver';
import { useStoreWithInitializer } from '../../../../../state/storeHooks';
import { getValuesInMasterDataByTable } from '../../../../../services/masterData';
import { downloadBookingDetailReport } from '../../../../../services/reports';
import { formatDocumentName, formatSelectInput, formatSelectInputWithCode } from '../../../../../helpers/formats';
import { store } from '../../../../../state/store';
import { BookingDetailReportState, initializeBookingDetailReport, loadContractStatus, loadCustomers, loadMasterData, loadTenantRegions, loadTenantlocations, updateField } from './BookingDetailReport.slice';
import { getCustomersList } from '../../../../../services/customer';
import { getTenantRegionNames } from '../../../../../services/tenantRegion';
import { getRegionWiseTenantOfficeList } from '../../../../../services/tenantOfficeInfo';
import { useTranslation } from 'react-i18next';
import { ContainerPage } from '../../../../ContainerPage/ContainerPage';

const BookingDetailReport = () => {
    const { t } = useTranslation();
    const {
        bookingdetailreport: { TenantOfficeInfo, ContractStatus, Customer, BookingReports, TenantRegion, AgreementType },
    } = useStoreWithInitializer(({ bookingdetailreport }) => ({ bookingdetailreport }), GetBookingDetailReportFilterData);
    
    useEffect(() => {
        GetBookingDetailReportFilterData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const TenantLocations = await getRegionWiseTenantOfficeList(BookingReports.TenantRegionId.toString());
            const TenantLocation = await formatSelectInput(TenantLocations.TenantOfficeName, 'OfficeName', 'Id');
            store.dispatch(loadTenantlocations({ Select: TenantLocation }));
        };

        fetchData();
    }, [BookingReports.TenantRegionId]);

    async function GetBookingDetailReportFilterData() {
        store.dispatch(initializeBookingDetailReport());
        try {
            var { MasterData } = await getValuesInMasterDataByTable('AgreementType');
            const agreementType = await formatSelectInput(MasterData, 'Name', 'Id');
            store.dispatch(loadMasterData({ Select: agreementType }));

            const Customers = await getCustomersList();
            const customers = await formatSelectInput(Customers.CustomersList, "Name", "Id");
            store.dispatch(loadCustomers({ Select: customers }));

            const TenantRegion = await getTenantRegionNames();
            const regions = await formatSelectInput(TenantRegion.RegionNames, "RegionName", "Id");
            store.dispatch(loadTenantRegions({ Select: regions }));

            var { MasterData } = await getValuesInMasterDataByTable("ContractStatus");
            const ContractStatus = await formatSelectInputWithCode(MasterData, "Name", "Id", "Code");
            const filteredContractStatus = ContractStatus.find(status => status.code=="CTS_APRV")?.value
            store.dispatch(updateField({ name: "ContractStatusId", value :filteredContractStatus}));
            store.dispatch(loadContractStatus({ MasterData: ContractStatus }));

        } catch (error) {
            return;
        }
    }

    const onDownloadClick = async () => {
        const response = await downloadBookingDetailReport(BookingReports);
        const url = window.URL.createObjectURL(response.data);
        FileSaver.saveAs(url, formatDocumentName());
    };

    function onFieldChangeSelect(selectedOption, actionMeta) {
        const name = actionMeta.name;
        const value = selectedOption.value;
        store.dispatch(updateField({ name: name as keyof BookingDetailReportState['BookingReports'], value }));
    }

    const onUpdateField = (ev) => {
        const name = ev.target.name;
        const value = ev.target.value;
        store.dispatch(updateField({ name: name as keyof BookingDetailReportState['BookingReports'], value }));
    };

    return (
        <ContainerPage>
            <div className="ps-2 pe-4 overflow-auto ">
                {/* filter row 1 */}
                <div className='row mb-2'>
                    {/* from date */}
                    <div className='col-md-6'>
                        <div className="">
                            <label className='text-size-13'>{t('booking_detail_report_date_from_label')}</label>
                            <input
                                name='DateFrom'
                                value={BookingReports.DateFrom ? BookingReports.DateFrom : ""}
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
                            <label className='text-size-13'>{t('booking_detail_report_date_to_label')}</label>
                            <input
                                name='DateTo'
                                value={BookingReports.DateTo ? BookingReports.DateTo : ""}
                                onChange={onUpdateField}
                                type='date'
                                className='form-control'
                            ></input>
                        </div>
                    </div>
                    {/* to date ends */}
                </div>
                {/* filter row 1 ends */}

                <div className='mt-2'>
                    <label className='text-size-13'>{t('booking_detail_report_agreement_type_label')}</label>
                    <div className="">
                        <Select
                            options={AgreementType}
                            value={(AgreementType && AgreementType.find((option) => option.value == BookingReports.AgreementTypeId)) || null}
                            isSearchable
                            onChange={onFieldChangeSelect}
                            name='AgreementTypeId'
                            placeholder={t('booking_detail_report_agreementtypeid_select_option')}
                        />
                    </div>
                </div>
                <div className='mt-2'>
                    <label className='text-size-13'>{t('booking_detail_report_accel_region_label')}</label>
                    <div className="">
                        <Select
                            options={TenantRegion}
                            isSearchable
                            onChange={onFieldChangeSelect}
                            name='TenantRegionId'
                            placeholder={t('booking_detail_report_tenantregion_select_option')}
                        />
                    </div>
                </div>
                <div className='mt-2'>
                    <label className='text-size-13'>{t('booking_detail_report_accel_location_label')}</label>
                    <div className="">
                        <Select
                            options={TenantOfficeInfo}
                            isSearchable
                            onChange={onFieldChangeSelect}
                            name='TenantOfficeId'
                            placeholder={t('booking_detail_report_tenantoffice_select_option')}
                        />
                    </div>
                </div>
                <div className='mt-2'>
                    <label className=' text-size-13'> {t('booking_detail_report_customer_label')}</label>
                    <div className="">
                        <Select
                            options={Customer}
                            onChange={onFieldChangeSelect}
                            isSearchable
                            name='CustomerId'
                            placeholder={t('booking_detail_report_customer_select_option')}
                        />
                    </div>
                </div>
                <div className='mt-2'>
                    <label className=' text-size-13'> {t('booking_detail_report_contractstatus_label')}</label>
                    <div className="">
                        <Select
                            options={ContractStatus}
                            value={ContractStatus && ContractStatus.find((option)=>option.value == BookingReports.ContractStatusId) || null}
                            onChange={onFieldChangeSelect}
                            isSearchable
                            name='ContractStatusId' 
                            placeholder={t('booking_detail_report_contractstatus_select_option')}
                        />
                    </div>
                </div>
                <button
                    type='button'
                    onClick={onDownloadClick}
                    className=' btn app-primary-bg-color text-white mt-3 mb-1 w-100'
                >
                    {t('booking_detail_report_download_button')}
                </button>
            </div>
        </ContainerPage>
    );
};

export default BookingDetailReport;
