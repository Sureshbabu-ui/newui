import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SelectDetails } from '../../../../../types/contract';
import { LoggedUserLocationInfo } from '../../../../../types/user';
import { CustomerSiteReport } from '../../../../../types/customerSite';

interface Select {
    value: any,
    label: any,
}

export interface CustomerSiteState {
    CustomerSiteReport: CustomerSiteReport
    TenantOfficeInfo: Select[],
    TenantRegion: Select[],
    Customer: Select[],
    ContractNumbers: Select[];
    loggeduserinfo: LoggedUserLocationInfo
}

const initialState: CustomerSiteState = {
    CustomerSiteReport: {
        CustomerId:0,
        ContractId:0,
        TenantOfficeId: 0,
        TenantRegionId: 0
    },
    loggeduserinfo: {
        RegionId: 0,
        TenantOfficeId: 0,
        UserCategoryCode: ""
    },
    ContractNumbers:[],
    Customer:[],
    TenantOfficeInfo: [],
    TenantRegion: []
};

const bookingDetailReportSlice = createSlice({
    name: 'customersitereport',
    initialState,
    reducers: {
        initializeCustomerSite: () => initialState,
        updateField: (
            state,
            { payload: { name, value } }: PayloadAction<{ name: keyof CustomerSiteState['CustomerSiteReport']; value: any }>
        ) => {
            if (name === "TenantRegionId") {
                state.CustomerSiteReport.TenantOfficeId = 0;
            }
            state.CustomerSiteReport[name] = value as never;
        },
        loadTenantlocations: (state, { payload: { Select } }: PayloadAction<SelectDetails>) => {
            state.TenantOfficeInfo = Select.map((TenantOfficeInfo) => TenantOfficeInfo);
        },
        loadTenantRegions: (state, { payload: { Select } }: PayloadAction<SelectDetails>) => {
            state.TenantRegion = Select.map((TenantRegions) => TenantRegions);
        },
        loadUserDetail: (state, { payload: info }: PayloadAction<LoggedUserLocationInfo>) => {
            state.loggeduserinfo = info;
        },
        loadCustomerList: (state, { payload: { Select } }: PayloadAction<SelectDetails>) => {
            state.Customer = Select.map((CustomerNames) => CustomerNames);
        },
        loadContractNumbers: (state, { payload: { Select } }: PayloadAction<SelectDetails>) => {
            state.ContractNumbers = Select.map((ContractNumbers) => ContractNumbers);
        },
    },
});

export const { initializeCustomerSite, loadTenantlocations, updateField, loadTenantRegions, loadUserDetail, loadCustomerList, loadContractNumbers } = bookingDetailReportSlice.actions;
export default bookingDetailReportSlice.reducer;
