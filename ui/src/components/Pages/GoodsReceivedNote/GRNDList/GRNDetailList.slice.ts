import { None, Option, Some } from '@hqoss/monads';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GRNDList, GRNList, GoodsReceivedNoteDetailList, GoodsReceivedNoteList } from '../../../../types/goodsreceivednote';

export interface grndList {
    grndlist: GoodsReceivedNoteDetailList;
}

export interface GRNListState {
    grndlist: Option<readonly grndList[]>;
    currentPage: number;
    search: any;
    totalRows: number;
    perPage: number;
    createDivisionModalStatus: boolean;
}

const initialState: GRNListState = {
    grndlist: None,
    currentPage: 1,
    search: null,
    totalRows: 0,
    perPage: 0,
    createDivisionModalStatus: false,
};
const slice = createSlice({
    name: 'goodsreceivednotedetaillist',
    initialState,
    reducers: {
        initializeGRNDList: () => initialState,
        loadGRNDList: (state, { payload: { GoodsReceivedNoteDetailList, TotalRows, PerPage } }: PayloadAction<GRNDList>) => {
            state.grndlist = Some(GoodsReceivedNoteDetailList.map((grndlist) => ({ grndlist })));
            state.totalRows = TotalRows;
            state.perPage = PerPage;
        },
        changePage: (state, { payload: page }: PayloadAction<number>) => {
            state.currentPage = page;
            state.grndlist = None;
        },
        setSearch: (state, { payload: Searchname }: PayloadAction<string>) => {
            state.search = Searchname;
        },
    },
});

export const { initializeGRNDList, loadGRNDList, changePage, setSearch } = slice.actions;
export default slice.reducer;


