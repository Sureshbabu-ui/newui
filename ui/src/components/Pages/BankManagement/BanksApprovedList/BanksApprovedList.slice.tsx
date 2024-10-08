import { None, Option, Some } from '@hqoss/monads';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ApprovedBankDetail, ApprovedBankDetails } from '../../../../types/bankManagement';

export interface ApprovedList {
  approvedBank: ApprovedBankDetail;
}

export interface BankListState {
  approvedBanks: Option<ApprovedList[]>;
  currentPage: number;
  totalRows: number;
  perPage:number; 
  search: any;
  reviewComment: string;
  approveModalStatus: boolean;
  rejectModalStatus: boolean;
}

const initialState: BankListState = {
  approvedBanks: None,
  currentPage: 1,
  totalRows: 0,
  perPage: 0, 
  search: null,
  reviewComment: '',
  approveModalStatus: false,
  rejectModalStatus: false,
};
const slice = createSlice({
  name: 'banksapproved',
  initialState,
  reducers: {
    initializeApprovedList: () => initialState,
    loadApprovedBanks: (state, { payload: { ApprovedList, TotalRows ,PerPage} }: PayloadAction<ApprovedBankDetails>) => {
      state.approvedBanks = Some(ApprovedList.map((approvedBank) => ({ approvedBank })));
      state.totalRows = TotalRows;
      state.perPage = PerPage;
    },
    changePage: (state, { payload: page }: PayloadAction<number>) => {
      state.currentPage = page;
      state.approvedBanks = None;
    },
    setSearch: (state, { payload: Searchname }: PayloadAction<string>) => {
      state.search = Searchname;
    },
  },
}); 

export const { initializeApprovedList, loadApprovedBanks, changePage, setSearch } = slice.actions;
export default slice.reducer;