import { None, Option, Some } from '@hqoss/monads';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RegisteredUser, MultipleRegisteredUsers } from '../../types/userManagement';
import { MultipleUsersCount } from '../../types/user';

export interface UsersListState {
  totalRows: number;
}

const initialState: UsersListState = {
  totalRows: 0
};
const slice = createSlice({
  name: 'usercount',
  initialState,
  reducers: {
    initializeUsersList: () => initialState,
    loadcount: (state, { payload: { totalRows } }: PayloadAction<MultipleUsersCount>) => {
      state.totalRows = totalRows;
    },
  },
});

export const { initializeUsersList, loadcount } = slice.actions;
export default slice.reducer;
