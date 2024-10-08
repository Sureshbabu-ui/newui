import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SelectDetails } from '../../../../../types/contract';
import { ContractRenewDueReport } from '../../../../../types/contractRenewDueReport';
import { LoggedUserLocationInfo } from '../../../../../types/user';

interface Select {
    value: any,
    label: any,
}

export interface ContractRenewDueReportState {
    RenewDueReport: ContractRenewDueReport
    TenantOfficeInfo: Select[],
    TenantRegion: Select[],
    loggeduserinfo: LoggedUserLocationInfo
}

const initialState: ContractRenewDueReportState = {
    RenewDueReport: {
        DateFrom: "",
        DateTo: `${new Date().toISOString().split('T')[0]}`,
        TenantOfficeId: 0,
        TenantRegionId: 0
    },
    loggeduserinfo: {
        RegionId: 0,
        TenantOfficeId: 0,
        UserCategoryCode: ""
    },
    TenantOfficeInfo: [],
    TenantRegion: [],
};

const bookingDetailReportSlice = createSlice({
    name: 'contractrenewduereport',
    initialState,
    reducers: {
        initializeContractRenewDueReport: () => initialState,
        updateField: (
            state,
            { payload: { name, value } }: PayloadAction<{ name: keyof ContractRenewDueReportState['RenewDueReport']; value: any }>
        ) => {
            if (name === "TenantRegionId") {
                state.RenewDueReport.TenantOfficeId = 0;
            }
            state.RenewDueReport[name] = value as never;
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
    },
});

export const { initializeContractRenewDueReport, loadTenantlocations, updateField, loadTenantRegions, loadUserDetail } = bookingDetailReportSlice.actions;
export default bookingDetailReportSlice.reducer;
