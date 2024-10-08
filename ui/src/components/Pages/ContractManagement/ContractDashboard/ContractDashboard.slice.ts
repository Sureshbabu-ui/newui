import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { valuesInMasterDataByTableDetailsSelect } from '../../../../types/masterData';
import { LoggedUserLocationInfo } from '../../../../types/user';
import { ContractDashboardFilter } from '../../../../types/contracts/contractDashboard';


interface MasterDataInterface {
    TenantOffices: valuesInMasterDataByTableDetailsSelect[],
    TenantRegions: valuesInMasterDataByTableDetailsSelect[],
}
const oneMonthBefore = new Date((new Date()).setDate(1))

export interface ContractDashboardFilterState {
    ChangeDashboardFilter: ContractDashboardFilter,
    MasterData: MasterDataInterface,
    loggeduserinfo: LoggedUserLocationInfo
}

const initialState:ContractDashboardFilterState={
    ChangeDashboardFilter: {
        DateFrom: oneMonthBefore.toISOString().split('T')[0],
        DateTo: `${new Date().toISOString().split('T')[0]}`,
        TenantOfficeId: null,
        TenantRegionId: null,
    },
    MasterData: {
        TenantOffices: [],
        TenantRegions: [],
       
    },
    loggeduserinfo: {
        RegionId: 0,
        TenantOfficeId: 0,
        UserCategoryCode: ""
    }
}

const slice = createSlice({
    name: 'contractdashboardfilter',
    initialState,
    reducers: {
        initializeContractDashboard: () => initialState,
        loadMasterData: (state, { payload: { name, value: MasterDataList } }: PayloadAction<{ name: keyof ContractDashboardFilterState['MasterData']; value: valuesInMasterDataByTableDetailsSelect[] }>) => {
            state.MasterData[name] = MasterDataList
            if (name == 'TenantRegions') {
                state.MasterData.TenantOffices = []
            }
        },
        updateField: (
            state,
            { payload: { name, value } }: PayloadAction<{ name: keyof ContractDashboardFilterState['ChangeDashboardFilter']; value: any }>
        ) => {
            if (name === "TenantRegionId") {
                state.ChangeDashboardFilter.TenantOfficeId = null;

            }
            state.ChangeDashboardFilter[name] =value as never;
        },
        loadUserDetail: (state, { payload: info }: PayloadAction<LoggedUserLocationInfo>) => {
            state.loggeduserinfo = info;
        }
    },
});
export const {
    initializeContractDashboard,
    loadMasterData,
    updateField,
    loadUserDetail
} = slice.actions;
export default slice.reducer;