import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface BankManagementState {
 activeTab:string
}

const initialState: BankManagementState = {
 activeTab:"nav-home"
};

const slice = createSlice({
  name: 'bankmanagement',
  initialState,
  reducers: {
    initializePendingList: () => initialState,
      setActiveTab: (state, { payload: tabName}: PayloadAction<string>) => {
      state.activeTab=tabName
    }
  },
});

export const {
 setActiveTab
} = slice.actions;
export default slice.reducer;