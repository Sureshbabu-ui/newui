import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RegisteredUser, MultipleRegisteredUsers } from '../../../../types/userManagement';

export interface UsersListState {
  users: RegisteredUser[];
  currentPage: number;
  SearchText: any;
  SearchWith: any;
  totalRows: number;
  perPage: number;
  createUserModalStatus: boolean;
  activeTab: string
}

const initialState: UsersListState = {
  users: [],
  currentPage: 1,
  SearchText: null,
  SearchWith: null,
  totalRows: 0,
  perPage: 0,
  createUserModalStatus: false,
  activeTab: "nav-approved"
};
const slice = createSlice({
  name: 'usermanagement',
  initialState,
  reducers: {
    initializeUsersList: () => initialState,
    loadUsers: (state, { payload: { users, totalRows, PerPage } }: PayloadAction<MultipleRegisteredUsers>) => {
      state.users = users.map((user) => ( user ));
      state.totalRows = totalRows;
      state.perPage = PerPage;
    },
    changePage: (state, { payload: page }: PayloadAction<number>) => {
      state.currentPage = page;
      state.users = [];
    },
    setSearch: (state, { payload: Searchname }: PayloadAction<string>) => {
      state.SearchText = Searchname;
    },
    setFilter: (state, { payload: SearchWith }: PayloadAction<any>) => {
      state.SearchWith = SearchWith.value;
    },
    setActiveTab: (state, { payload: tabName }: PayloadAction<string>) => {
      state.activeTab = tabName
    }
  },
});

export const { initializeUsersList, loadUsers,setSearch, changePage, setFilter, setActiveTab } = slice.actions;
export default slice.reducer;
