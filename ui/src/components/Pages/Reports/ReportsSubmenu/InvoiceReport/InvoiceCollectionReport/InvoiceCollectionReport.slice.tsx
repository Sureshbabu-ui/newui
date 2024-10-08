import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { InvoiceCollectionReportFilter } from '../../../../../../types/invoiceReport';
import { valuesInMasterDataByTableDetailsSelect } from '../../../../../../types/masterData';
import { LoggedUserLocationInfo } from '../../../../../../types/user';

interface MasterDataInterface {
    TenantOffices: valuesInMasterDataByTableDetailsSelect[],
    TenantRegions: valuesInMasterDataByTableDetailsSelect[],
    CustomerGroups: valuesInMasterDataByTableDetailsSelect[],
    Customers: valuesInMasterDataByTableDetailsSelect[]
}

const oneMonthBefore = new Date((new Date()).setDate(1))

export interface InvoiceCollectionReportState {
    CollectionReportFilter: InvoiceCollectionReportFilter,
    MasterData: MasterDataInterface,
    loggeduserinfo: LoggedUserLocationInfo
}

const initialState: InvoiceCollectionReportState = {
    CollectionReportFilter: {
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
    name: 'invoicecollectionreport',
    initialState,
    reducers: {
        initializeInvoiceCollectionReport: () => initialState,
        loadMasterData: (state, { payload: { name, value: MasterDataList } }: PayloadAction<{ name: keyof InvoiceCollectionReportState['MasterData']; value: valuesInMasterDataByTableDetailsSelect[] }>) => {
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
            { payload: { name, value } }: PayloadAction<{ name: keyof InvoiceCollectionReportState['CollectionReportFilter']; value: any }>
        ) => {
            if (name === "TenantRegionId") {
               state.CollectionReportFilter.TenantOfficeId = null;
               state.CollectionReportFilter.CustomerId = null
            }
            else  if (name === "TenantOfficeId") {
                state.CollectionReportFilter.CustomerId = null
             }
            state.CollectionReportFilter[name] = value as never;
        },
        loadUserDetail: (state, { payload: info }: PayloadAction<LoggedUserLocationInfo>) => {
            state.loggeduserinfo = info;
        }
    },
});

export const {
    initializeInvoiceCollectionReport,
    loadMasterData,
    updateField,
    loadUserDetail
} = slice.actions;
export default slice.reducer;
