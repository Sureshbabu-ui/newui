import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface DocumentNumberFormatViewState {
  activeTab: number
}

const initialState: DocumentNumberFormatViewState = {
  activeTab: 1
};

const slice = createSlice({
  name: 'documentnumberformathome',
  initialState,
  reducers: {
    initializePendingList: () => initialState,
    setActiveTab: (state, { payload: tabName }: PayloadAction<number>) => {
      state.activeTab = tabName
    }
  },
});

export const {
  setActiveTab
} = slice.actions;
export default slice.reducer;