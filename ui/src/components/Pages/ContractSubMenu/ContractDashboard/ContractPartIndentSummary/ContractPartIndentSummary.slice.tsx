import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ContractPartIndentCount } from "../../../../../types/partIndent";

export interface ContractPartIndentSummaryState{
    partIndentCountDetail: ContractPartIndentCount,
}

const initialState: ContractPartIndentSummaryState = {
    partIndentCountDetail: {
        TotalPartIndentCount: 0,
        ApprovedPartIndentCount: 0,
        RejectedPartIndentCount: 0,
        PendingPartIndentCount:0
    }
};
const slice = createSlice({
    name: 'contractpartindentsummary',
    initialState,
    reducers: {
        initializePartIndentSummary: () => initialState,
        loadPartIndentSummaryDetail: (state, { payload: partIndentDetail }: PayloadAction<ContractPartIndentCount>) => {
            state.partIndentCountDetail = partIndentDetail;
        }, 
    },
});
export const { initializePartIndentSummary, loadPartIndentSummaryDetail } = slice.actions;
export default slice.reducer; 