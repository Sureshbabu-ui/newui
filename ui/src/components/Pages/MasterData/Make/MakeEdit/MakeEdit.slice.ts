import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ValidationErrors } from '../../../../../types/error';
import { MakeEditDetails } from '../../../../../types/make';

export interface UpdateMakeState {
    make: MakeEditDetails;
    errors: ValidationErrors;
    displayInformationModal: boolean;
}

const initialState: UpdateMakeState = {
    make: {
        Code: '',
        Id: 0,
        Name: ''
    },
    errors: {},
    displayInformationModal: false,
};

const slice = createSlice({
    name: 'makeupdate',
    initialState,
    reducers: {
        initializeMakeUpdate: () => initialState,
        loadMakeDetails: (state, { payload: makeEditDetails }: PayloadAction<MakeEditDetails>) => {
            state.make = makeEditDetails;
        },
        updateField: (
            state,
            { payload: { name, value } }: PayloadAction<{ name: keyof UpdateMakeState['make']; value: string }>
        ) => {
            state.make[name] = value;
        },
        updateErrors: (state, { payload: errors }: PayloadAction<ValidationErrors>) => {
            state.errors = errors;
        },
        toggleInformationModalStatus: (state) => {
            state.displayInformationModal = !state.displayInformationModal;
        },
    },
});

export const {
    initializeMakeUpdate,
    updateErrors,
    toggleInformationModalStatus,
    updateField,
    loadMakeDetails
} = slice.actions;

export default slice.reducer;