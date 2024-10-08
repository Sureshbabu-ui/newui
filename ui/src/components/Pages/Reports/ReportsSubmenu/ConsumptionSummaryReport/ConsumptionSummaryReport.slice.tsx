import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SelectDetails } from '../../../../../types/contract';
import { FIATReport, LoggedUserLocationInfo } from '../../../../../types/user';
import { ConsumptionSummaryReport } from '../../../../../types/partStock';

interface Select {
    value: any,
    label: any,
}

export interface ConsumptionSummaryReportState {
    consumptionsummaryreport: ConsumptionSummaryReport;
    TenantOfficeInfo: Select[];
    TenantRegion: Select[];
    ServiceEngineers: Select[];
    ReturnedPartType: Select[];
    loggeduserinfo: LoggedUserLocationInfo;
}

const initialState: ConsumptionSummaryReportState = {
    consumptionsummaryreport: {
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
    name: 'consumptionsummaryreport',
    initialState,
    reducers: {
        initializeConsumptionSummaryReport: () => initialState,
        updateField: (
            state,
            { payload: { name, value } }: PayloadAction<{ name: keyof ConsumptionSummaryReportState['consumptionsummaryreport']; value: any }>
        ) => {
            if (name === "TenantRegionId") {
                state.consumptionsummaryreport.TenantOfficeId = 0;
            }
            state.consumptionsummaryreport[name] = value as never;
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

export const { initializeConsumptionSummaryReport, loadTenantlocations, updateField, loadTenantRegions, loadUserDetail } = fiatreCountReportSlice.actions;
export default fiatreCountReportSlice.reducer;
