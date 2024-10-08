import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RevenueDueReportFilter } from '../../../../../../types/invoiceReport';
import { valuesInMasterDataByTableDetailsSelect } from '../../../../../../types/masterData';
import { LoggedUserLocationInfo } from '../../../../../../types/user';

interface MasterDataInterface {
    TenantOffices: valuesInMasterDataByTableDetailsSelect[],
    TenantRegions: valuesInMasterDataByTableDetailsSelect[],
    CustomerGroups: valuesInMasterDataByTableDetailsSelect[],
    Customers: valuesInMasterDataByTableDetailsSelect[]
}

const oneMonthBefore = new Date((new Date()).setDate(1))

export interface RevenueDueReportState {
    DueReportFilter: RevenueDueReportFilter,
    MasterData: MasterDataInterface,
    loggeduserinfo: LoggedUserLocationInfo
}

const initialState: RevenueDueReportState = {
    DueReportFilter: {
        DateFrom: oneMonthBefore.toISOString().split('T')[0],
        DateTo: `${new Date().toISOString().split('T')[0]}`,
        TenantOfficeId: null,
        TenantRegionId: null,
        CustomerGroupId: null,
        CustomerId: null
    },
    MasterData: {
        TenantOffices: [],
        TenantRegions: [],
        CustomerGroups: [],
        Customers: []
    },
    loggeduserinfo: {
        RegionId: 0,
        TenantOfficeId: 0,
        UserCategoryCode: ""
    }
};

const slice = createSlice({
    name: 'revenueduereport',
    initialState,
    reducers: {
        initializeRevenueDueReport: () => initialState,
        loadMasterData: (state, { payload: { name, value: MasterDataList } }: PayloadAction<{ name: keyof RevenueDueReportState['MasterData']; value: valuesInMasterDataByTableDetailsSelect[] }>) => {
            state.MasterData[name] = MasterDataList
            if (name == 'TenantRegions') {
                state.MasterData.TenantOffices = []
                state.MasterData.Customers = []
            }
            else if (name == 'TenantOffices') {
                state.MasterData.Customers = []
            }
        }, 
        updateField: (
            state,
            { payload: { name, value } }: PayloadAction<{ name: keyof RevenueDueReportState['DueReportFilter']; value: any }>
        ) => {
            if (name === "TenantRegionId") {
               state.DueReportFilter.TenantOfficeId = null;
               state.DueReportFilter.CustomerId = null
            }
            else  if (name === "TenantOfficeId") {
                state.DueReportFilter.CustomerId = null
             }
            state.DueReportFilter[name] = value as never;
        },
        loadUserDetail: (state, { payload: info }: PayloadAction<LoggedUserLocationInfo>) => {
            state.loggeduserinfo = info;
        }
    },
});

export const {
    initializeRevenueDueReport,
    loadMasterData,
    updateField,
    loadUserDetail
} = slice.actions;
export default slice.reducer;
