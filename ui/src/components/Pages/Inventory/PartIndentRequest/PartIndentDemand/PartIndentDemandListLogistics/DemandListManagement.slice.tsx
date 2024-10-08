import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface DemandManagementState {
  activeTab: string
}

const initialState: DemandManagementState = {
  activeTab: "nav-not-allocated"
};

const slice = createSlice({
  name: 'demandsmanagement',
  initialState,
  reducers: {
    initializeDemandManagement: () => initialState,
    setActiveTab: (state, { payload: tabName }: PayloadAction<string>) => {
      state.activeTab = tabName
    }
  },
});

export const {
  setActiveTab,
  initializeDemandManagement
} = slice.actions;

export default slice.reducer;