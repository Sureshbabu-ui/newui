import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SelectDetails } from '../../../../../types/contract';
import { BookingDetailReport, RegionNames } from '../../../../../types/bookingDetailReport';
import { valuesInMasterDataByTableDetailsSelect, valuesInMasterDataByTableSelect } from '../../../../../types/masterData';

interface Select {
    value: any,
    label: any,
}

export interface BookingDetailReportState {
    BookingReports: BookingDetailReport
    TenantOfficeInfo: Select[],
    TenantRegion: Select[],
    Customer: Select[],
    AgreementType: Select[],
    ContractStatus: valuesInMasterDataByTableDetailsSelect[]
}

const initialState: BookingDetailReportState = {
    BookingReports: {
        DateFrom: "",
        DateTo: "",
        CustomerId: 0,
        TenantOfficeId: 0,
        TenantRegionId: 0,
        AgreementTypeId: 0,
        ContractStatusId:0
    },
    TenantOfficeInfo: [],
    Customer: [],
    TenantRegion: [],
    AgreementType:[],
    ContractStatus:[]
};

const bookingDetailReportSlice = createSlice({
    name: 'bookingdetailreport',
    initialState,
    reducers: {
        initializeBookingDetailReport: () => initialState,
        updateField: (
            state,
            { payload: { name, value } }: PayloadAction<{ name: keyof BookingDetailReportState['BookingReports']; value: any }>
        ) => {
            state.BookingReports[name] = value as never;
        },
        loadMasterData: (state, { payload: {  Select  } }: PayloadAction<SelectDetails>) => {
            state.AgreementType = Select.map((agreementtype) => (agreementtype))
        },
        loadTenantlocations: (state, { payload: { Select } }: PayloadAction<SelectDetails>) => {
            state.TenantOfficeInfo = Select.map((TenantOfficeInfo) => TenantOfficeInfo);
        },
        loadCustomers: (state, { payload: { Select } }: PayloadAction<SelectDetails>) => {
            state.Customer = Select.map((Customers) => Customers);
        },
        loadTenantRegions: (state, { payload: { Select } }: PayloadAction<SelectDetails>) => {
            state.TenantRegion = Select.map((TenantRegions) => TenantRegions);
        },
        loadContractStatus: (state, { payload: { MasterData } }: PayloadAction<valuesInMasterDataByTableSelect>) => {
            state.ContractStatus = MasterData.map((ContractStatuses) => ContractStatuses);
        },
    },
});

export const { initializeBookingDetailReport,loadContractStatus, loadTenantlocations, loadMasterData, loadCustomers, updateField, loadTenantRegions } = bookingDetailReportSlice.actions;
export default bookingDetailReportSlice.reducer;
