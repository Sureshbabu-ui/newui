import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SelectDetails } from '../../../../../types/contract';
import { LoggedUserLocationInfo } from '../../../../../types/user';
import { BarcodeReport } from '../../../../../types/partStock';

interface Select {
    value: any,
    label: any,
}

export interface BarcodeReportState {
    BarcodeReport: BarcodeReport;
    TenantOfficeInfo: Select[],
    TenantRegion: Select[],
    ServiceEngineers: Select[],
    ReturnedPartType: Select[],
    loggeduserinfo: LoggedUserLocationInfo
}

const initialState: BarcodeReportState = {
    BarcodeReport: {
        DateFrom: "",
        DateTo: `${new Date().toISOString().split('T')[0]}`,
        TenantOfficeId: 0,
        TenantRegionId: 0,
        IsUnderWarranty: null
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

const barcodeReportSlice = createSlice({
    name: 'barcodereport',
    initialState,
    reducers: {
        initializeBarcodeReport: () => initialState,
        updateField: (
            state,
            { payload: { name, value } }: PayloadAction<{ name: keyof BarcodeReportState['BarcodeReport']; value: any }>
        ) => {
            if (name === "TenantRegionId") {
                state.BarcodeReport.TenantOfficeId = 0;
            }
            state.BarcodeReport[name] = value as never;
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

export const { initializeBarcodeReport, loadTenantlocations, updateField, loadTenantRegions, loadUserDetail } = barcodeReportSlice.actions;
export default barcodeReportSlice.reducer;
