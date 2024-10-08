import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface BankManagementState {
    selectedTabName: string
}

const initialState: BankManagementState = {
    selectedTabName: 'COMPANYINFO'
};

const slice = createSlice({
    name: 'tenantview',
    initialState,
    reducers: {
        initializeTenantView: () => initialState,
        setSelectedTabName: (state, { payload: tabName }: PayloadAction<string>) => {
            state.selectedTabName = tabName
        }
    },
});
export const {
    setSelectedTabName
} = slice.actions;
export default slice.reducer;