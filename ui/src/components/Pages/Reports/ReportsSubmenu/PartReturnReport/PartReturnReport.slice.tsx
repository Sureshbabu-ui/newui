import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SelectDetails } from '../../../../../types/contract';
import { PartReturnReportReport } from '../../../../../types/patreturn';
import { LoggedUserLocationInfo } from '../../../../../types/user';

interface Select {
    value: any,
    label: any,
}

export interface PartReturnReportReportState {
    PartReturnReport: PartReturnReportReport
    TenantOfficeInfo: Select[],
    TenantRegion: Select[],
    ServiceEngineers: Select[],
    ReturnedPartType: Select[],
    loggeduserinfo: LoggedUserLocationInfo
}

const initialState: PartReturnReportReportState = {
    PartReturnReport: {
        DateFrom: "",
        DateTo: `${new Date().toISOString().split('T')[0]}`,
        ReturnedPartTypeId: 0,
        TenantOfficeId: 0,
        TenantRegionId: 0,
        ServiceEngineerId: 0,
        IsUnderWarranty: ''
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

const bookingDetailReportSlice = createSlice({
    name: 'partreturnreport',
    initialState,
    reducers: {
        initializePartReturnReportReport: () => initialState,
        updateField: (
            state,
            { payload: { name, value } }: PayloadAction<{ name: keyof PartReturnReportReportState['PartReturnReport']; value: any }>
        ) => {
            if (name === "TenantRegionId") {
                state.PartReturnReport.TenantOfficeId = 0;
            }
            state.PartReturnReport[name] = value as never;
        },
        loadMasterData: (state, { payload: { Select } }: PayloadAction<SelectDetails>) => {
            state.ReturnedPartType = Select.map((parttype) => (parttype))
        },
        loadTenantlocations: (state, { payload: { Select } }: PayloadAction<SelectDetails>) => {
            state.TenantOfficeInfo = Select.map((TenantOfficeInfo) => TenantOfficeInfo);
        },
        loadEngineers: (state, { payload: { Select } }: PayloadAction<SelectDetails>) => {
            state.ServiceEngineers = Select.map((ServiceEngineerss) => ServiceEngineerss);
        },
        loadTenantRegions: (state, { payload: { Select } }: PayloadAction<SelectDetails>) => {
            state.TenantRegion = Select.map((TenantRegions) => TenantRegions);
        },
        loadUserDetail: (state, { payload: info }: PayloadAction<LoggedUserLocationInfo>) => {
            state.loggeduserinfo = info;
        },
    },
});

export const { initializePartReturnReportReport, loadTenantlocations, loadUserDetail, loadMasterData, loadEngineers, updateField, loadTenantRegions } = bookingDetailReportSlice.actions;
export default bookingDetailReportSlice.reducer;
