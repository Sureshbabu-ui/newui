import { None, Option, Some } from '@hqoss/monads';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { StockBinDetails, StockBinList } from '../../../../../types/stockbin';

export interface stockBinList {
    stockbin: StockBinDetails;
}

export interface RoleListState {
    stockbin: Option<readonly stockBinList[]>;
    currentPage: number;
    search: any;
    totalRows: number;
    perPage:number;
    createRoleModalStatus: boolean;
}

const initialState: RoleListState = {
    stockbin: None,
    currentPage: 1,
    search: null,
    totalRows: 0,
    perPage:0,
    createRoleModalStatus: false,
};
const slice = createSlice({
    name: 'stockbinlist',
    initialState,
    reducers: {
        initializeStockBinList: () => initialState,
        loadStockBins: (state, { payload: { StockBins, TotalRows ,PerPage} }: PayloadAction<StockBinList>) => {
            state.stockbin = Some(StockBins.map((stockbin) => ({ stockbin })));
            state.totalRows = TotalRows;
            state.perPage=PerPage;
        },
        changePage: (state, { payload: page }: PayloadAction<number>) => {
            state.currentPage = page;
            state.stockbin = None;
        },
        setSearch: (state, { payload: Searchname }: PayloadAction<string>) => {
            state.search = Searchname;
        },
    },
});

export const { initializeStockBinList, loadStockBins, changePage, setSearch } = slice.actions;
export default slice.reducer;