import { None, Option, Some } from '@hqoss/monads';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DesignationList, DesignationDetails } from '../../../../../types/designation';

export interface designationList {
    designation: DesignationDetails;
}

export interface DesignationListState {
    designations: Option<readonly designationList[]>;
    currentPage: number;
    search: any;
    totalRows: number;
    perPage:number;
    createDesignationModalStatus: boolean;
}

const initialState: DesignationListState = {
    designations: None,
    currentPage: 1,
    search: null,
    totalRows: 0,
    perPage:0,
    createDesignationModalStatus: false,
};
const slice = createSlice({
    name: 'designationlist',
    initialState,
    reducers: {
        initializeDesignationList: () => initialState,
        loadDesignations: (state, { payload: { Designations, TotalRows, PerPage } }: PayloadAction<DesignationList>) => {
            state.designations = Some(Designations.map((designation) => ({ designation })));
            state.totalRows = TotalRows;
            state.perPage=PerPage;
        },
        changePage: (state, { payload: page }: PayloadAction<number>) => {
            state.currentPage = page;
            state.designations = None;
        },
        setSearch: (state, { payload: Searchname }: PayloadAction<string>) => {
            state.search = Searchname;
        },
    },
});

export const { initializeDesignationList, loadDesignations, changePage, setSearch } = slice.actions;
export default slice.reducer;