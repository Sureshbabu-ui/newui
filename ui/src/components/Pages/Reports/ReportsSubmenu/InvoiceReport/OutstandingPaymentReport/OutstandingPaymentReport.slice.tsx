import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { OutstandingPaymentReportFilter } from '../../../../../../types/invoiceReport';
import { valuesInMasterDataByTableDetailsSelect } from '../../../../../../types/masterData';
import { LoggedUserLocationInfo } from '../../../../../../types/user';

interface MasterDataInterface {
    TenantOffices: valuesInMasterDataByTableDetailsSelect[],
    TenantRegions: valuesInMasterDataByTableDetailsSelect[],
    CustomerGroups: valuesInMasterDataByTableDetailsSelect[],
    Customers: valuesInMasterDataByTableDetailsSelect[]
}

const oneMonthBefore = new Date((new Date()).setDate(1))

export interface OutstandingPaymentReportState {
    PaymentReportFilter: OutstandingPaymentReportFilter,
    MasterData: MasterDataInterface,
    loggeduserinfo: LoggedUserLocationInfo
}

const initialState: OutstandingPaymentReportState = {
    PaymentReportFilter: {
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
    name: 'outstandingpaymentreport',
    initialState,
    reducers: {
        initializeOutstandingPaymentReport: () => initialState,
        loadMasterData: (state, { payload: { name, value: MasterDataList } }: PayloadAction<{ name: keyof OutstandingPaymentReportState['MasterData']; value: valuesInMasterDataByTableDetailsSelect[] }>) => {
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
            { payload: { name, value } }: PayloadAction<{ name: keyof OutstandingPaymentReportState['PaymentReportFilter']; value: any }>
        ) => {
            if (name === "TenantRegionId") {
               state.PaymentReportFilter.TenantOfficeId = null;
               state.PaymentReportFilter.CustomerId = null
            }
            else  if (name === "TenantOfficeId") {
                state.PaymentReportFilter.CustomerId = null
             }
            state.PaymentReportFilter[name] = value as never;
        },
        loadUserDetail: (state, { payload: info }: PayloadAction<LoggedUserLocationInfo>) => {
            state.loggeduserinfo = info;
        }
    },
});

export const {
    initializeOutstandingPaymentReport,
    loadMasterData,
    updateField,
    loadUserDetail
} = slice.actions;
export default slice.reducer;
