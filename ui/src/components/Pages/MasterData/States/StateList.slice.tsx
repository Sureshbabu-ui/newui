import { None, Option, Some } from "@hqoss/monads";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { MultipleStates, StatesList } from "../../../../types/state";

export interface StateListState {
    stateinfo: Option<readonly StatesList[]>;
    currentPage: number;
    totalRows: number;
    perPage: number;
    search: string;
}
const initialState: StateListState = {
    stateinfo: None,
    currentPage: 1,
    totalRows: 0,
    perPage: 0,
    search:""
};
const slice = createSlice({
    name: 'statelist',
    initialState,
    reducers: {
        initializeStateList: () => initialState,
        loadStates: (state, { payload: { States, totalRows, PerPage } }: PayloadAction<MultipleStates>) => {
            state.stateinfo = Some(States.map((state) => ( state )));
            state.totalRows = totalRows;
            state.perPage = PerPage;
        },
        changePage: (state, { payload: page }: PayloadAction<number>) => {
            state.currentPage = page;
            state.stateinfo = None;
        },
        setFilter: (state, { payload: Search }: PayloadAction<string>) => {  
            state.search = Search;
            state.currentPage = 1;
        },
    },
});
export const { initializeStateList, setFilter, loadStates, changePage } = slice.actions;
export default slice.reducer;