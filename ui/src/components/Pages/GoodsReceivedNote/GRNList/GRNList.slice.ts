import { None, Option, Some } from '@hqoss/monads';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GRNList, GoodsReceivedNoteList } from '../../../../types/goodsreceivednote';

export interface grnList {
    grnlist: GoodsReceivedNoteList;
}

export interface GRNListState {
    grnlist: Option<readonly grnList[]>;
    currentPage: number;
    search: any;
    totalRows: number;
    perPage: number;
    createDivisionModalStatus: boolean;
}

const initialState: GRNListState = {
    grnlist: None,
    currentPage: 1,
    search: null,
    totalRows: 0,
    perPage: 0,
    createDivisionModalStatus: false,
};
const slice = createSlice({
    name: 'goodsreceivednotelist',
    initialState,
    reducers: {
        initializeGRNList: () => initialState,
        loadGRNList: (state, { payload: { GoodsReceivedNoteList, TotalRows, PerPage } }: PayloadAction<GRNList>) => {
            state.grnlist = Some(GoodsReceivedNoteList.map((grnlist) => ({ grnlist })));
            state.totalRows = TotalRows;
            state.perPage = PerPage;
        },
        changePage: (state, { payload: page }: PayloadAction<number>) => {
            state.currentPage = page;
            state.grnlist = None;
        },
        setSearch: (state, { payload: Searchname }: PayloadAction<string>) => {
            state.search = Searchname;
        },
    },
});

export const { initializeGRNList, loadGRNList, changePage, setSearch } = slice.actions;
export default slice.reducer;


