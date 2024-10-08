import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SelectDetails } from '../../../../../types/contract';
import { FIATReport, LoggedUserLocationInfo } from '../../../../../types/user';

interface Select {
    value: any,
    label: any,
}

export interface FIATEngDetailReportState {
    FIATEngDetail: FIATReport;
    TenantOfficeInfo: Select[];
    TenantRegion: Select[];
    ServiceEngineers: Select[];
    ReturnedPartType: Select[];
    loggeduserinfo: LoggedUserLocationInfo;
}

const initialState: FIATEngDetailReportState = {
    FIATEngDetail: {
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
    ServiceEngineers: [],
    TenantRegion: [],
    ReturnedPartType: []

};

const fiatengDetailReportSlice = createSlice({
    name: 'fiatengreport',
    initialState,
    reducers: {
        initializeFIATEngDetailReport: () => initialState,
        updateField: (
            state,
            { payload: { name, value } }: PayloadAction<{ name: keyof FIATEngDetailReportState['FIATEngDetail']; value: any }>
        ) => {
            if (name === "TenantRegionId") {
                state.FIATEngDetail.TenantOfficeId = 0;
            }
            state.FIATEngDetail[name] = value as never;
        },
        loadMasterData: (state, { payload: { Select } }: PayloadAction<SelectDetails>) => {
            state.ReturnedPartType = Select.map((parttype) => (parttype))
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

export const { initializeFIATEngDetailReport, loadTenantlocations, updateField, loadTenantRegions, loadUserDetail } = fiatengDetailReportSlice.actions;
export default fiatengDetailReportSlice.reducer;
