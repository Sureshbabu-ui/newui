import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BillingDetailReportFilter } from '../../../../../../types/invoiceReport';
import { valuesInMasterDataByTableDetailsSelect } from '../../../../../../types/masterData';
import { LoggedUserLocationInfo } from '../../../../../../types/user';

interface MasterDataInterface {
    TenantOffices: valuesInMasterDataByTableDetailsSelect[],
    TenantRegions: valuesInMasterDataByTableDetailsSelect[],
    CustomerGroups: valuesInMasterDataByTableDetailsSelect[],
    Customers: valuesInMasterDataByTableDetailsSelect[]
}

const oneMonthBefore = new Date((new Date()).setDate(1))

export interface BillingDetailReportState {
    BillingReportFilter: BillingDetailReportFilter,
    MasterData: MasterDataInterface,
    loggeduserinfo: LoggedUserLocationInfo
}

const initialState: BillingDetailReportState = {
    BillingReportFilter: {
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
    name: 'billingdetailreport',
    initialState,
    reducers: {
        initializeBillingDetailReport: () => initialState,
        loadMasterData: (state, { payload: { name, value: MasterDataList } }: PayloadAction<{ name: keyof BillingDetailReportState['MasterData']; value: valuesInMasterDataByTableDetailsSelect[] }>) => {
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
            { payload: { name, value } }: PayloadAction<{ name: keyof BillingDetailReportState['BillingReportFilter']; value: any }>
        ) => {
            if (name === "TenantRegionId") {
               state.BillingReportFilter.TenantOfficeId = null;
               state.BillingReportFilter.CustomerId = null
            }
            else  if (name === "TenantOfficeId") {
                state.BillingReportFilter.CustomerId = null
             }
            state.BillingReportFilter[name] = value as never;
        },
        loadUserDetail: (state, { payload: info }: PayloadAction<LoggedUserLocationInfo>) => {
            state.loggeduserinfo = info;
        }
    },
});

export const {
    initializeBillingDetailReport,
    loadMasterData,
    updateField,
    loadUserDetail
} = slice.actions;
export default slice.reducer;
