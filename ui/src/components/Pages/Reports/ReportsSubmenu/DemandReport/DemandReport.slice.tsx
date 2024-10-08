import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SelectDetails } from '../../../../../types/contract';
import { DemandReport } from '../../../../../types/partindentdemand';
import { LoggedUserLocationInfo } from '../../../../../types/user';

interface Select {
    value: any,
    label: any,
}

export interface DemandReportState {
    DemandReport: DemandReport
    TenantOfficeInfo: Select[],
    TenantRegion: Select[],
    loggeduserinfo: LoggedUserLocationInfo
}

const initialState: DemandReportState = {
    DemandReport: {
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
    name: 'demandreport',
    initialState,
    reducers: {
        initializeDemandReport: () => initialState,
        updateField: (
            state,
            { payload: { name, value } }: PayloadAction<{ name: keyof DemandReportState['DemandReport']; value: any }>
        ) => {
            if (name === "TenantRegionId") {
                state.DemandReport.TenantOfficeId = 0;
            }
            state.DemandReport[name] = value as never;
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

export const { initializeDemandReport, loadTenantlocations, updateField, loadTenantRegions, loadUserDetail } = bookingDetailReportSlice.actions;
export default bookingDetailReportSlice.reducer;
