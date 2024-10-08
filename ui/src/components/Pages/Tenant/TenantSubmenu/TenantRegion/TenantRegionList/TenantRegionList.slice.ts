import { None, Option, Some } from '@hqoss/monads';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TenantRegionList, TenantRegions } from '../../../../../../types/tenantRegion';

export interface RegionList {
    tenantregion: TenantRegionList;
}

export interface TenantRegionListState {
    tenantregions: Option<readonly RegionList[]>;
    currentPage: number;
    search: any;
    totalRows: number;
    perPage: number;
    createTenantOfficeInfoModalStatus: boolean;
    visibleModal: string
}

const initialState: TenantRegionListState = {
    tenantregions: None,
    currentPage: 1,
    search: null,
    totalRows: 0,
    perPage: 0,
    createTenantOfficeInfoModalStatus: false,
    visibleModal: ""
};
const slice = createSlice({
    name: 'tenantregionlist',
    initialState,
    reducers: {
        initializeTenantRegionList: () => initialState,
        loadTeantRegions: (state, { payload: { TenantRegions, totalRows, PerPage } }: PayloadAction<TenantRegions>) => {
            state.tenantregions = Some(TenantRegions.map((tenantregion) => ({ tenantregion })));
            state.totalRows = totalRows;
            state.perPage = PerPage;
        },
        changePage: (state, { payload: page }: PayloadAction<number>) => {
            state.currentPage = page;
            state.tenantregions = None;
        },
        setSearch: (state, { payload: Searchname }: PayloadAction<string>) => {
            state.search = Searchname;
        },
        setVisibleModal: (state, { payload: ModalName }: PayloadAction<string>) => {
            state.visibleModal = ModalName;
        },
    },
});

export const { initializeTenantRegionList, setVisibleModal, loadTeantRegions, changePage, setSearch } = slice.actions;
export default slice.reducer;