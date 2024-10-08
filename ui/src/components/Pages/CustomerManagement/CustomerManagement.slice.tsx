import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface BankManagementState {
  activeTab: string
}

const initialState: BankManagementState = {
  activeTab: "nav-approved"
};

const slice = createSlice({
  name: 'customermanagement',
  initialState,
  reducers: {
    initializeCustomerManagement: () => initialState,
    setActiveTab: (state, { payload: tabName }: PayloadAction<string>) => {
      state.activeTab = tabName
    }
  },
});

export const {
  setActiveTab,
  initializeCustomerManagement
} = slice.actions;

export default slice.reducer;