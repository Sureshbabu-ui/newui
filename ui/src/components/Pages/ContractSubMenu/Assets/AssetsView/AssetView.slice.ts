import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AssetViewState {
 activeTab:number
}

const initialState: AssetViewState = {
 activeTab:1
};

const slice = createSlice({
  name: 'assetview',
  initialState,
  reducers: {
    initializePendingList: () => initialState,
      setActiveTab: (state, { payload: tabName}: PayloadAction<number>) => {
      state.activeTab = tabName      
    }
  },
});

export const {
 setActiveTab
} = slice.actions;
export default slice.reducer;