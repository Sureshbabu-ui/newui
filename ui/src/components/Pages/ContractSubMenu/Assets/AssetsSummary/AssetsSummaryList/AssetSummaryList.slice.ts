import { None, Option, Some } from '@hqoss/monads';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AssetsSummaryList, MultipleAssetsSummaryList } from '../../../../../../types/assetsSummary';

export interface assetsSummaryList {
    assetSummary: AssetsSummaryList;
}

export interface AssetsSummaryListState {
    assetsSummary: Option<readonly assetsSummaryList[]>;
    currentPage: number;
    search: string | null;
    totalRows: number;
    perPage: number;
    createAssetSummaryModalStatus: boolean;
    visibleModal: string
    activeTab: string
}

const initialState: AssetsSummaryListState = {
    assetsSummary: None,
    currentPage: 1,
    search: null,
    totalRows: 0,
    perPage: 0,
    createAssetSummaryModalStatus: false,
    visibleModal: "",
    activeTab: "nav-home"
};

const slice = createSlice({
    name: 'assetsummarylist',
    initialState,
    reducers: {
        initializeAssetSummaryList: () => initialState,
        loadAssetSummary: (state, { payload: { ContractAssetsSummaryList, TotalRows, PerPage } }: PayloadAction<MultipleAssetsSummaryList>) => {
            state.assetsSummary = Some(ContractAssetsSummaryList.map((assetSummary) => ({ assetSummary })));
            state.totalRows = TotalRows;
            state.perPage = PerPage
        },
        changePage: (state, { payload: page }: PayloadAction<number>) => {
            state.currentPage = page;
            state.assetsSummary = None;
        },
        setSearch: (state, { payload: Searchname }: PayloadAction<string>) => {
            state.search = Searchname;
            state.currentPage = 1;
        },
        setVisibleModal: (state, { payload: ModalName }: PayloadAction<string>) => {
            state.visibleModal = ModalName;
        },
        setActiveTab: (state, { payload: tabName }: PayloadAction<string>) => {
            state.activeTab = tabName
        }
    },
});

export const { initializeAssetSummaryList, setVisibleModal, setActiveTab, loadAssetSummary, changePage, setSearch } = slice.actions;
export default slice.reducer;