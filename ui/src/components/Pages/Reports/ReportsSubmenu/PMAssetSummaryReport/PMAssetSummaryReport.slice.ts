import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { valuesInMasterDataByTableDetailsSelect } from '../../../../../types/masterData';
import { PMAssetSummaryReportFilter } from '../../../../../types/assetReport';
import { LoggedUserLocationInfo } from '../../../../../types/user';

interface MasterDataInterface {
    TenantOffices: valuesInMasterDataByTableDetailsSelect[],
    TenantRegions: valuesInMasterDataByTableDetailsSelect[],
    CustomerGroups: valuesInMasterDataByTableDetailsSelect[],
    Customers: valuesInMasterDataByTableDetailsSelect[],
    Contracts: valuesInMasterDataByTableDetailsSelect[]
    CustomerSites:valuesInMasterDataByTableDetailsSelect[]
}

const oneMonthBefore = new Date((new Date()).setDate(1))

export interface PMAssetSummaryReportState {
    PMAssetReportFilter: PMAssetSummaryReportFilter,
    MasterData: MasterDataInterface,
    loggeduserinfo: LoggedUserLocationInfo
}

const initialState: PMAssetSummaryReportState = {
    PMAssetReportFilter: {
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
        CustomerGroups: [],
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
    name: 'pmassetsummaryreport',
    initialState,
    reducers: {
        initializePMAssetSummaryReport: () => initialState,
        loadMasterData: (state, { payload: { name, value: MasterDataList } }: PayloadAction<{ name: keyof PMAssetSummaryReportState['MasterData']; value: valuesInMasterDataByTableDetailsSelect[] }>) => {
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
            { payload: { name, value } }: PayloadAction<{ name: keyof PMAssetSummaryReportState['PMAssetReportFilter']; value: any }>
        ) => {
            if (name === "TenantRegionId") {
                state.PMAssetReportFilter.TenantOfficeId = null;
                state.PMAssetReportFilter.CustomerId = null;
                state.PMAssetReportFilter.ContractId = null;
                state.PMAssetReportFilter.CustomerSiteId = null;
            }
            else if (name === "TenantOfficeId") {
                state.PMAssetReportFilter.CustomerId = null;
                state.PMAssetReportFilter.ContractId = null;
                state.PMAssetReportFilter.CustomerSiteId = null;
            }

            else if (name === "CustomerId") {
                state.PMAssetReportFilter.ContractId = null;
                state.PMAssetReportFilter.CustomerSiteId = null;
            }
            else if (name === "ContractId") {
                state.PMAssetReportFilter.CustomerSiteId = null;
            }
            state.PMAssetReportFilter[name] =value as never;
        },
        loadUserDetail: (state, { payload: info }: PayloadAction<LoggedUserLocationInfo>) => {
            state.loggeduserinfo = info;
        }
    },
});

export const {
    initializePMAssetSummaryReport,
    loadMasterData,
    updateField,
    loadUserDetail
} = slice.actions;
export default slice.reducer;
