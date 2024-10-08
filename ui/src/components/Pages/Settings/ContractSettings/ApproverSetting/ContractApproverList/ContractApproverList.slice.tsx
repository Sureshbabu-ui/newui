import { None, Option, Some } from '@hqoss/monads';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ApproverDetails, ApproverList } from '../../../../../../types/contractApproverSetting';

export interface RoleListState {
    approverDetails: Option<readonly ApproverDetails[]>;
    currentPage: number;
    search: any;
    totalRows: number;
    perPage:number;
}

const initialState: RoleListState = {
    approverDetails: None,
    currentPage: 1,
    search: null,
    totalRows: 0,
    perPage:0,
};
const slice = createSlice({
    name: 'contractapproverlist',
    initialState,
    reducers: {
        initializeApproverList: () => initialState,
        loadApproverDetails: (state, { payload: { ApproverDetails, TotalRows,PerPage } }: PayloadAction<ApproverList>) => {
            state.approverDetails = Some(ApproverDetails.map((approverDetails) => ( approverDetails )));
            state.totalRows = TotalRows;
            state.perPage = PerPage;
        },
        changePage: (state, { payload: page }: PayloadAction<number>) => {
            state.currentPage = page;
            state.approverDetails = None;
        },
        setSearch: (state, { payload: Searchname }: PayloadAction<string>) => {
            state.search = Searchname;
        },
    },
});

export const { initializeApproverList, loadApproverDetails, changePage, setSearch } = slice.actions;
export default slice.reducer;