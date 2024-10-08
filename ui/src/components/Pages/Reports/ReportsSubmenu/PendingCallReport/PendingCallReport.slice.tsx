import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SelectDetails } from '../../../../../types/contract';
import { PendingCallReportReport } from '../../../../../types/pendingCallReport';
import { LoggedUserLocationInfo } from '../../../../../types/user';

interface Select {
    value: any,
    label: any,
}

export interface PendingCallReportReportState {
    PendingCallReport: PendingCallReportReport
    TenantOfficeInfo: Select[],
    TenantRegion: Select[],
    loggeduserinfo: LoggedUserLocationInfo
}

const initialState: PendingCallReportReportState = {
    PendingCallReport: {
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
    TenantRegion: []
};

const bookingDetailReportSlice = createSlice({
    name: 'pendingcallreport',
    initialState,
    reducers: {
        initializePendingCallReportReport: () => initialState,
        updateField: (
            state,
            { payload: { name, value } }: PayloadAction<{ name: keyof PendingCallReportReportState['PendingCallReport']; value: any }>
        ) => {
            if (name === "TenantRegionId") {
                state.PendingCallReport.TenantOfficeId = 0;
            }
            state.PendingCallReport[name] = value as never;
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

export const { initializePendingCallReportReport, loadTenantlocations, updateField, loadTenantRegions, loadUserDetail } = bookingDetailReportSlice.actions;
export default bookingDetailReportSlice.reducer;
