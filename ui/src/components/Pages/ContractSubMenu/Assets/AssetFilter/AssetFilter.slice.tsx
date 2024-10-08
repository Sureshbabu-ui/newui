import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ValidationErrors } from '../../../../../types/error';
import { AssetFilter } from '../../../../../types/assets';
import { SelectDetails } from '../../../../../types/contract';

export interface LoggedUserLocationInfo {
    RegionId: number | null;
    TenantOfficeId: number | null;
    UserCategoryCode: string;
}

interface Select {
    value: any,
    label: any,
}

export interface AssetFilterState {
    AssetFilters: AssetFilter;
    errors: ValidationErrors;
    displayInformationModal: boolean;
    TenantOfficeInfo: Select[],
    TenantRegion: Select[],
    loggeduserinfo: LoggedUserLocationInfo,
    AssetProductCategory: Select[]
}

const initialState: AssetFilterState = {
    AssetFilters: {
        TenantOfficeId: null,
        TenantRegionId: null,
        PreAmcStatus: null,
        AssetProductCategoryId: null
    },
    loggeduserinfo: {
        RegionId: null,
        TenantOfficeId: null,
        UserCategoryCode: ""
    },
    TenantOfficeInfo: [],
    TenantRegion: [],
    errors: {},
    displayInformationModal: false,
    AssetProductCategory: []
};

const slice = createSlice({
    name: 'assetfilters',
    initialState,
    reducers: {
        initializeAssetFilter: () => initialState,
        updateField: (
            state,
            { payload: { name, value } }: PayloadAction<{ name: keyof AssetFilterState['AssetFilters']; value: any }>
        ) => {
            state.AssetFilters[name] = value as never;
            if (name === "TenantRegionId") {
                state.AssetFilters.TenantOfficeId = null;
            }
        },
        updateErrors: (state, { payload: errors }: PayloadAction<ValidationErrors>) => {
            state.errors = errors;
        },
        toggleInformationModalStatus: (state) => {
            state.displayInformationModal = !state.displayInformationModal;
        },
        loadTenantlocations: (state, { payload: { Select } }: PayloadAction<SelectDetails>) => {
            state.TenantOfficeInfo = Select.map((TenantOfficeInfo) => TenantOfficeInfo);
        },
        loadTenantRegions: (state, { payload: { Select } }: PayloadAction<SelectDetails>) => {
            state.TenantRegion = Select.map((TenantRegions) => TenantRegions);
        },
        loadUserDetail: (state, { payload: info }: PayloadAction<LoggedUserLocationInfo>) => {
            state.loggeduserinfo = info;
        },
        loadProductCategoryName: (state, { payload: { Select } }: PayloadAction<SelectDetails>) => {
            state.AssetProductCategory = Select.map((ProductCategoryName) => ProductCategoryName);
        },
        updateAssetProductCategory: (state, { payload: category }: PayloadAction<number>) => {
            state.AssetFilters.AssetProductCategoryId = category;
        },
        initializeFilter: (state) => {
            state.AssetFilters = initialState.AssetFilters;
        },
    },
});

export const {
    initializeAssetFilter,
    updateErrors,
    initializeFilter,
    toggleInformationModalStatus,
    updateField,
    loadUserDetail,
    loadTenantlocations,
    loadTenantRegions,
    loadProductCategoryName,
    updateAssetProductCategory
} = slice.actions;

export default slice.reducer;