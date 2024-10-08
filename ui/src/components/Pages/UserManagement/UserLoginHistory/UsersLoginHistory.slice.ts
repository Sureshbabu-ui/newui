import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LoginHistoryDetail, MultipleUsersLoginHistory, UsersNamesList } from '../../../../types/userManagement';

export interface EntitiesDetails {
  Id: number;
  FullName: string;
}

export interface UsersLoginHistoryState {
  loginHistoryDetails: LoginHistoryDetail[];
  UsersList: EntitiesDetails[];
  currentPage: number;
  totalRows: number;
  perPage: number;
  userId: number
  dateFrom: string
  dateTo: string,
  exceluserId: number
  exceldateFrom: string
  exceldateTo: string
}

const initialState: UsersLoginHistoryState = {
  loginHistoryDetails: [],
  UsersList: [],
  totalRows: 0,
  perPage: 0,
  currentPage: 1,
  userId: 0,
  dateFrom: "",
  dateTo: "",
  exceluserId: 0,
  exceldateFrom: "",
  exceldateTo: ""
};
const slice = createSlice({
  name: 'allusersloginhistory',
  initialState,
  reducers: {
    initializeAllUsersLoginHistoryList: () => initialState,
    loadLoginHistory: (state, { payload: { usersLoginHistory, totalRows, perPage } }: PayloadAction<MultipleUsersLoginHistory>) => {
      state.loginHistoryDetails = usersLoginHistory.map((loginData) => (loginData));
      state.totalRows = totalRows;
      state.perPage = perPage;
    },
    loadUsers: (state, { payload: { UsersNames } }: PayloadAction<UsersNamesList>) => {
      state.UsersList = UsersNames.map((ServiceEngineers) => ServiceEngineers);
    },
    changePage: (state, { payload: page }: PayloadAction<number>) => {
      state.currentPage = page;
      state.loginHistoryDetails = []
    },
    setFilterUsers: (state, { payload: { Value, Name } }: PayloadAction<{ Value: string, Name: keyof UsersLoginHistoryState }>) => {
      state[Name] = Value as never;
    },
    setFilterDateFrom: (state, { payload: { Value, Name } }: PayloadAction<{ Value: string, Name: keyof UsersLoginHistoryState }>) => {
      state[Name] = Value as never;
    },
    setFilterDateTo: (state, { payload: { Value, Name } }: PayloadAction<{ Value: string, Name: keyof UsersLoginHistoryState }>) => {
      state[Name] = Value as never;
    },
    setIntialDateFromDateTo: (state, { payload: { DateFrom, DateTo } }: PayloadAction<any>) => {
      state.dateFrom = DateFrom;
      state.dateTo = DateTo;
    },
    setExcelFilterValues: (state) => {
      state.exceldateFrom = state.dateFrom;
      state.exceldateTo = state.dateTo;
      state.exceluserId = state.userId;
    }
  },
});

export const { initializeAllUsersLoginHistoryList, setExcelFilterValues, setIntialDateFromDateTo, loadLoginHistory, loadUsers, changePage, setFilterUsers, setFilterDateFrom, setFilterDateTo } = slice.actions;
export default slice.reducer;
