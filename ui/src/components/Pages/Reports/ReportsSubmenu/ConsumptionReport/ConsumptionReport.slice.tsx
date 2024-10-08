import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SelectDetails } from '../../../../../types/contract';
import { LoggedUserLocationInfo } from '../../../../../types/user';
import { ConsumptionReport } from '../../../../../types/partStock';

interface Select {
    value: any,
    label: any,
}

export interface ConsumptionReportState {
    consumptionreport: ConsumptionReport;
    TenantOfficeInfo: Select[];
    TenantRegion: Select[];
    ServiceEngineers: Select[];
    ReturnedPartType: Select[];
    loggeduserinfo: LoggedUserLocationInfo;
}

const initialState: ConsumptionReportState = {
    consumptionreport: {
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

const fiatreCountReportSlice = createSlice({
    name: 'consumptionreport',
    initialState,
    reducers: {
        initializeConsumptionReport: () => initialState,
        updateField: (
            state,
            { payload: { name, value } }: PayloadAction<{ name: keyof ConsumptionReportState['consumptionreport']; value: any }>
        ) => {
            if (name === "TenantRegionId") {
                state.consumptionreport.TenantOfficeId = 0;
            }
            state.consumptionreport[name] = value as never;
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

export const { initializeConsumptionReport, loadTenantlocations, updateField, loadTenantRegions, loadUserDetail } = fiatreCountReportSlice.actions;
export default fiatreCountReportSlice.reducer;
