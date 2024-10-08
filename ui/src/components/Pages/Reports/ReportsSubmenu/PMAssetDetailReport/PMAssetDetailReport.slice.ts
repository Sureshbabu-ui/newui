import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { valuesInMasterDataByTableDetailsSelect } from '../../../../../types/masterData';
import { PMAssetDetailReportFilter } from '../../../../../types/assetReport';
import { LoggedUserLocationInfo } from '../../../../../types/user';

interface MasterDataInterface {
    TenantOffices: valuesInMasterDataByTableDetailsSelect[],
    TenantRegions: valuesInMasterDataByTableDetailsSelect[],
    Customers: valuesInMasterDataByTableDetailsSelect[],
    Contracts: valuesInMasterDataByTableDetailsSelect[],
    CustomerSites:valuesInMasterDataByTableDetailsSelect[],
    AssetProductCategories:valuesInMasterDataByTableDetailsSelect[],
    ProductModels:valuesInMasterDataByTableDetailsSelect[],
    Makes:valuesInMasterDataByTableDetailsSelect[]

}

const oneMonthBefore = new Date((new Date()).setDate(1))

export interface PMAssetDetailReportState {
    PMAssetReportFilter: PMAssetDetailReportFilter,
    MasterData: MasterDataInterface,
    loggeduserinfo: LoggedUserLocationInfo
}

const initialState: PMAssetDetailReportState = {
    PMAssetReportFilter: {
        StatusType:null,
        DateFrom: oneMonthBefore.toISOString().split('T')[0],
        DateTo: `${new Date().toISOString().split('T')[0]}`,
        TenantOfficeId: null,
        TenantRegionId: null,
        CustomerId: null,
        ContractId: null,
        CustomerSiteId:null,
        AssetProductCategoryId:null,
        MakeId:null,
        ProductModelId:null
    },
    MasterData: {
        TenantOffices: [],
        TenantRegions: [],
        Customers: [],
        Contracts: [],
        CustomerSites:[],
        AssetProductCategories:[],
        ProductModels:[],
        Makes:[]
    },
    loggeduserinfo: {
        RegionId: 0,
        TenantOfficeId: 0,
        UserCategoryCode: ""
    }
};



const slice = createSlice({
    name: 'pmassetdetailreport',
    initialState,
    reducers: {
        initializePMAssetDetailReport: () => initialState,
        loadMasterData: (state, { payload: { name, value: MasterDataList } }: PayloadAction<{ name: keyof PMAssetDetailReportState['MasterData']; value: valuesInMasterDataByTableDetailsSelect[] }>) => {
            state.MasterData[name] = MasterDataList
            if (name == 'TenantRegions') {
                state.MasterData.TenantOffices = []
                state.MasterData.Customers = []
                state.MasterData.Contracts = []
            }
            else if (name == 'TenantOffices') {
                state.MasterData.Customers = []
                state.MasterData.Contracts = []
            }
            else if (name == 'Customers') {
                state.MasterData.Contracts = []
            }
            else if (name == "AssetProductCategories" || name == "Makes") {
                state.MasterData.ProductModels =[]
            }
        },
        updateField: (
            state,
            { payload: { name, value } }: PayloadAction<{ name: keyof PMAssetDetailReportState['PMAssetReportFilter']; value: any }>
        ) => {
            if (name === "TenantRegionId") {
                state.PMAssetReportFilter.TenantOfficeId = null;
                state.PMAssetReportFilter.CustomerId = null;
                state.PMAssetReportFilter.ContractId = null;
            }
            else if (name === "TenantOfficeId") {
                state.PMAssetReportFilter.CustomerId = null;
                state.PMAssetReportFilter.ContractId = null
            }
            else if (name === "CustomerId") {
                state.PMAssetReportFilter.ContractId = null
            }
            else if (name === "AssetProductCategoryId" || name === "MakeId") {
                state.PMAssetReportFilter.ProductModelId = null
            }
            state.PMAssetReportFilter[name] = value as never;
        },
        loadUserDetail: (state, { payload: info }: PayloadAction<LoggedUserLocationInfo>) => {
            state.loggeduserinfo = info;
        }
    },
});

export const {
    initializePMAssetDetailReport,
    loadMasterData,
    updateField,
    loadUserDetail
} = slice.actions;
export default slice.reducer;
