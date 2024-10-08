import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ContractsCount } from '../../types/contract';

export interface UsersListState {
  totalRows: number;
}

const initialState: UsersListState = {
  totalRows: 0
};
const slice = createSlice({
  name: 'contractcount',
  initialState,
  reducers: {
    initializeUsersList: () => initialState,
    loadcount: (state, { payload: { totalRows } }: PayloadAction<ContractsCount>) => {
      state.totalRows = totalRows;   
    },
  },
});

export const { initializeUsersList, loadcount } = slice.actions;
export default slice.reducer;
