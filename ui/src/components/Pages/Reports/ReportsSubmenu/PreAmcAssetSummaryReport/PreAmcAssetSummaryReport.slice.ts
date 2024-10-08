import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { valuesInMasterDataByTableDetailsSelect } from '../../../../../types/masterData';
import { PreAmcAssetSummaryReportFilter } from '../../../../../types/assetReport';
import { LoggedUserLocationInfo } from '../../../../../types/user';

interface MasterDataInterface {
    TenantOffices: valuesInMasterDataByTableDetailsSelect[],
    TenantRegions: valuesInMasterDataByTableDetailsSelect[],
    Customers: valuesInMasterDataByTableDetailsSelect[],
    Contracts: valuesInMasterDataByTableDetailsSelect[]
    CustomerSites:valuesInMasterDataByTableDetailsSelect[]
}

const oneMonthBefore = new Date((new Date()).setDate(1))

export interface PreAmcAssetSummaryReportState {
    PreAmcAssetReportFilter: PreAmcAssetSummaryReportFilter,
    MasterData: MasterDataInterface,
    loggeduserinfo: LoggedUserLocationInfo
}

const initialState: PreAmcAssetSummaryReportState = {
    PreAmcAssetReportFilter: {
        DateFrom: oneMonthBefore.toISOString().split('T')[0],
        DateTo: `${new Date().toISOString().split('T')[0]}`,
        TenantOfficeId: null,
        TenantRegionId: null,
        CustomerId: null,
        ContractId: null,
        CustomerSiteId:null
    },
    MasterData: {
        TenantOffices: [],
        TenantRegions: [],
        Customers: [],
        Contracts: [],
        CustomerSites:[]
    },
    loggeduserinfo: {
        RegionId: 0,
        TenantOfficeId: 0,
        UserCategoryCode: ""
    }
};

const slice = createSlice({
    name: 'preamcassetsummaryreport',
    initialState,
    reducers: {
        initializePreAmcAssetSummaryReport: () => initialState,
        loadMasterData: (state, { payload: { name, value: MasterDataList } }: PayloadAction<{ name: keyof PreAmcAssetSummaryReportState['MasterData']; value: valuesInMasterDataByTableDetailsSelect[] }>) => {
            state.MasterData[name] = MasterDataList
            if (name == 'TenantRegions') {
                state.MasterData.TenantOffices = []
                state.MasterData.Customers = []
                state.MasterData.Contracts = []
                state.MasterData.CustomerSites = []
            }
            else if (name == 'TenantOffices') {
                state.MasterData.Customers = []
                state.MasterData.Contracts = []
                state.MasterData.CustomerSites = []
            }
            else if (name == 'Customers') {
                state.MasterData.Contracts = []
                state.MasterData.CustomerSites = []
            }
            else if (name == 'Contracts') {
                state.MasterData.CustomerSites = []
            }
        },
        updateField: (
            state,
            { payload: { name, value } }: PayloadAction<{ name: keyof PreAmcAssetSummaryReportState['PreAmcAssetReportFilter']; value: any }>
        ) => {
            if (name === "TenantRegionId") {
                state.PreAmcAssetReportFilter.TenantOfficeId = null;
                state.PreAmcAssetReportFilter.CustomerId = null;
                state.PreAmcAssetReportFilter.ContractId = null;
                state.PreAmcAssetReportFilter.CustomerSiteId = null;
            }
            else if (name === "TenantOfficeId") {
                state.PreAmcAssetReportFilter.CustomerId = null;
                state.PreAmcAssetReportFilter.ContractId = null;
                state.PreAmcAssetReportFilter.CustomerSiteId = null;
            }

            else if (name === "CustomerId") {
                state.PreAmcAssetReportFilter.ContractId = null;
                state.PreAmcAssetReportFilter.CustomerSiteId = null;
            }
            else if (name === "ContractId") {
                state.PreAmcAssetReportFilter.CustomerSiteId = null;
            }
            state.PreAmcAssetReportFilter[name] =value as never;
        },
        loadUserDetail: (state, { payload: info }: PayloadAction<LoggedUserLocationInfo>) => {
            state.loggeduserinfo = info;
        }
    },
});

export const {
    initializePreAmcAssetSummaryReport,
    loadMasterData,
    updateField,
    loadUserDetail
} = slice.actions;
export default slice.reducer;
