import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ContractAssetDownloadFilter } from '../../../../../types/assets';
import { ValidationErrors } from '../../../../../types/error';

export interface ContractAssetDownloadState {
    ContractAssetFilter: ContractAssetDownloadFilter,
    errors: ValidationErrors;
    submitting: boolean;
}

const initialState: ContractAssetDownloadState = {
    ContractAssetFilter: {
        PreAmcStatus: 2,
        SupportType: 2
    },
    errors: {},
    submitting: false,
};

const slice = createSlice({
    name: 'contractassetdownload',
    initialState,
    reducers: {
        initializeContractAssetDownload: () => initialState,

        updateField: (
            state,
            { payload: { name, value } }: PayloadAction<{ name: keyof ContractAssetDownloadState['ContractAssetFilter']; value: any }>
        ) => {

            state.ContractAssetFilter[name] = value as never;
        },
        updateErrors: (state, { payload: errors }: PayloadAction<ValidationErrors>) => {
            state.errors = errors;
        }
    },
});

export const {
    initializeContractAssetDownload,
    updateField,
    updateErrors
} = slice.actions;
export default slice.reducer;