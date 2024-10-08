import { None, Option, Some } from '@hqoss/monads';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AssetSiteWiseSummaryListDetail, AssetSitewiseSummaryList } from '../../../../../../types/assetsSummary';

export interface AssetSiteWiseSummary {
    assetSiteWiseSummary: AssetSiteWiseSummaryListDetail;
}

export interface AssetSiteWiseSummaryListState {
    assetSiteWiseSummary: Option<readonly AssetSiteWiseSummary[]>;
    currentPage: number;
    search: any;
    totalRows: number;
    perPage: number;
    createAssetSummaryModalStatus: boolean;
}

const initialState: AssetSiteWiseSummaryListState = {
    assetSiteWiseSummary: None,
    currentPage: 1,
    search: null,
    totalRows: 0,
    perPage:0,
    createAssetSummaryModalStatus: false,
};

const slice = createSlice({
    name: 'contractassetsitewiseummarylist',
    initialState,
    reducers: {
        initializeAssetSiteWiseSummaryList: () => initialState,
        loadAssetSiteWiseSummary: (state, { payload: {SiteWiseSummaryList} }: PayloadAction<AssetSitewiseSummaryList>) => {
            state.assetSiteWiseSummary= Some(SiteWiseSummaryList.map((assetSiteWiseSummary) => ({assetSiteWiseSummary})));
        }
    },
});
 
export const { initializeAssetSiteWiseSummaryList, loadAssetSiteWiseSummary } = slice.actions;
export default slice.reducer;