import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserPendingList, UserPendingListDetail } from '../../../../types/user';

export interface CustomerListState {
  users: UserPendingListDetail[];
  currentPage: number;
  totalRows: number;
  perPage: number;
  SearchText: any;
  SearchWith: any;
}

const initialState: CustomerListState = {
  users: [],
  currentPage: 1,
  totalRows: 0,
  perPage: 0,
  SearchText:"",
  SearchWith:""
};
const slice = createSlice({
  name: 'userspending',
  initialState,
  reducers: {
    initializePendingList: () => initialState,
    loadPendingUsers: (state, { payload: { PendingList, TotalRows, PerPage } }: PayloadAction<UserPendingList>) => {
      state.users = PendingList.map((user) =>  user );
      state.totalRows = TotalRows;
      state.perPage = PerPage
    },
    UserPendingchangePage: (state, { payload: page }: PayloadAction<number>) => {
      state.currentPage = page;
      state.users = [];
    },
    setUserPendingSearch: (state, { payload: Searchname }: PayloadAction<string>) => {
      state.SearchText = Searchname;
    },
    setUserPendingFilter: (state, { payload: SearchWith }: PayloadAction<any>) => {
      state.SearchWith = SearchWith.value;
    },
  },
});

export const {
  initializePendingList,
  loadPendingUsers,
  UserPendingchangePage,
  setUserPendingFilter,
  setUserPendingSearch
} = slice.actions;
export default slice.reducer;