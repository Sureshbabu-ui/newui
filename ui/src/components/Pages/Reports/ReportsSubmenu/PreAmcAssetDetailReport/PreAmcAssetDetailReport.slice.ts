import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { valuesInMasterDataByTableDetailsSelect } from '../../../../../types/masterData';
import { PreAmcAssetDetailReportFilter } from '../../../../../types/assetReport';
import { LoggedUserLocationInfo } from '../../../../../types/user';

interface MasterDataInterface {
    TenantOffices: valuesInMasterDataByTableDetailsSelect[],
    TenantRegions: valuesInMasterDataByTableDetailsSelect[],
    Customers: valuesInMasterDataByTableDetailsSelect[],
    Contracts: valuesInMasterDataByTableDetailsSelect[],
    CustomerSites:valuesInMasterDataByTableDetailsSelect[],
    AssetProductCategories:valuesInMasterDataByTableDetailsSelect[],
    ProductModels:valuesInMasterDataByTableDetailsSelect[],
    Makes:valuesInMasterDataByTableDetailsSelect[],
    AssetConditions:valuesInMasterDataByTableDetailsSelect[]

}

const oneMonthBefore = new Date((new Date()).setDate(1))

export interface PreAmcAssetDetailReportState {
    PreAmcAssetReportFilter: PreAmcAssetDetailReportFilter,
    MasterData: MasterDataInterface,
    loggeduserinfo: LoggedUserLocationInfo
}

const initialState: PreAmcAssetDetailReportState = {
    PreAmcAssetReportFilter: {
        AssetConditionId:null,
        OutSourceNeeded:null,
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
        Makes:[],
        AssetConditions:[]
    },
    loggeduserinfo: {
        RegionId: 0,
        TenantOfficeId: 0,
        UserCategoryCode: ""
    }
};



const slice = createSlice({
    name: 'preamcassetdetailreport',
    initialState,
    reducers: {
        initializePreAmcAssetDetailReport: () => initialState,
        loadMasterData: (state, { payload: { name, value: MasterDataList } }: PayloadAction<{ name: keyof PreAmcAssetDetailReportState['MasterData']; value: valuesInMasterDataByTableDetailsSelect[] }>) => {
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
            { payload: { name, value } }: PayloadAction<{ name: keyof PreAmcAssetDetailReportState['PreAmcAssetReportFilter']; value: any }>
        ) => {
            if (name === "TenantRegionId") {
                state.PreAmcAssetReportFilter.TenantOfficeId = null;
                state.PreAmcAssetReportFilter.CustomerId = null;
                state.PreAmcAssetReportFilter.ContractId = null;
            }
            else if (name === "TenantOfficeId") {
                state.PreAmcAssetReportFilter.CustomerId = null;
                state.PreAmcAssetReportFilter.ContractId = null
            }
            else if (name === "CustomerId") {
                state.PreAmcAssetReportFilter.ContractId = null
            }
            else if (name === "AssetProductCategoryId" || name === "MakeId") {
                state.PreAmcAssetReportFilter.ProductModelId = null
            }
            state.PreAmcAssetReportFilter[name] = value as never;
        },
        loadUserDetail: (state, { payload: info }: PayloadAction<LoggedUserLocationInfo>) => {
            state.loggeduserinfo = info;
        }
    },
});

export const {
    initializePreAmcAssetDetailReport,
    loadMasterData,
    updateField,
    loadUserDetail
} = slice.actions;
export default slice.reducer;
