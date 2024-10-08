import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MultiplePreAmcPenidngCount, PreAmcPenidngCount } from '../../../../../types/contractPreAmc';

export interface PreAmcManagementState {
  preAMCPendingCount: PreAmcPenidngCount
  activeTab: number,
}

const initialState: PreAmcManagementState = {
  preAMCPendingCount: {
    PreAmcPendingAssets: 0,
    TotalContract: 0,
    TotalSite: 0
  },
  activeTab: 0
};
const slice = createSlice({
  name: 'preamcmanagement',
  initialState,
  reducers: {
    initializePreAmcManagement: () => initialState,
    setPreAMCPendingCount: (state, { payload: { PreAmcPendingCount } }: PayloadAction<MultiplePreAmcPenidngCount>) => {
      state.preAMCPendingCount = PreAmcPendingCount;
    },
    setActiveTab: (state, { payload: index }: PayloadAction<number>) => {
      state.activeTab = index;
    },
  },
});

export const { initializePreAmcManagement, setPreAMCPendingCount, setActiveTab } = slice.actions;
export default slice.reducer;