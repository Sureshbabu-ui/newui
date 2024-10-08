import { None, Option, Some } from '@hqoss/monads';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {   BankBranchList, BankBranchListDetails } from '../../../../../types/bankBranch';

export interface bankBranchList {
    bankBranch: BankBranchListDetails;
}

export interface BankBranchListState {
    bankBranches: Option<readonly bankBranchList[]>;
    currentPage: number;
    search: any;
    totalRows: number;
    perPage:number;
    createBankBranchModalStatus: boolean;
}

const initialState: BankBranchListState = {
    bankBranches: None,
    currentPage: 1,
    search: null,
    totalRows: 0,
    perPage:0,
    createBankBranchModalStatus: false,
};

const slice = createSlice({
    name: 'bankbranchlist',
    initialState,
    reducers: {
        initializeBankBranchList: () => initialState,
        loadBankBranches: (state, { payload: { BankBranches, TotalRows,PerPage } }: PayloadAction<BankBranchList>) => {
            state.bankBranches = Some(BankBranches.map((bankBranch) => ({ bankBranch })));
            state.totalRows = TotalRows;
            state.perPage= PerPage;
        },
        changePage: (state, { payload: page }: PayloadAction<number>) => {
            state.currentPage = page;
            state.bankBranches = None;
        },
        setSearch: (state, { payload: Searchname }: PayloadAction<string>) => {
            state.search = Searchname;
        },
    },
});
 
export const { initializeBankBranchList, loadBankBranches, changePage, setSearch } = slice.actions;
export default slice.reducer;