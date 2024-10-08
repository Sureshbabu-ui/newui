import { None, Option, Some } from '@hqoss/monads';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {   BankBranchList, BankBranchListDetails } from '../../../../../types/bankBranch';
import { DeliveryChallanData, ListOfDeliveryChallan } from '../../../../../types/deliverychallan';

export interface DeliveryChallanListState {
    dclist: Option<readonly DeliveryChallanData[]>;
    currentPage: number;
    search: any;
    totalRows: number;
    perPage:number;
    createBankBranchModalStatus: boolean;
}

const initialState: DeliveryChallanListState = {
    dclist: None,
    currentPage: 1,
    search: null,
    totalRows: 0,
    perPage:0,
    createBankBranchModalStatus: false,
};

const slice = createSlice({
    name: 'deliverychallans',
    initialState,
    reducers: {
        initializeDeliveryChallanList: () => initialState,
        loadDeliveryChallanList: (state, { payload: { DeliveryChallanList, TotalRows, PerPage } }: PayloadAction<ListOfDeliveryChallan>) => {
            state.dclist = Some(DeliveryChallanList.map((dclist) => (dclist )));
            state.totalRows = TotalRows;
            state.perPage= PerPage;
        },
        changePage: (state, { payload: page }: PayloadAction<number>) => {
            state.currentPage = page;
            state.dclist = None;
        },
        setSearch: (state, { payload: Searchname }: PayloadAction<string>) => {
            state.search = Searchname;
        },
    },
});
 
export const { initializeDeliveryChallanList, loadDeliveryChallanList, changePage, setSearch } = slice.actions;
export default slice.reducer;