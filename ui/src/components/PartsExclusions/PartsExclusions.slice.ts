import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface PartsExclusionsState {
    contractPartsExclusions: [],
}

const initialState: PartsExclusionsState = {
    contractPartsExclusions: [],
};

const slice = createSlice({
    name: 'exclusions',
    initialState,
    reducers: {
        initializePartsExclusions: () => initialState,
        loadPartsCategory: (state, { payload: ContractPartExclusions }: PayloadAction<any>) => {
            if (ContractPartExclusions !== ""){
                state.contractPartsExclusions = ContractPartExclusions.split(',');  
            }
                      
        }
    },
});

export const { initializePartsExclusions, loadPartsCategory } = slice.actions;
export default slice.reducer;