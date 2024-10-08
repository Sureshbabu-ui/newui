import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ValidationErrors } from '../../../../../types/error';
import { StateDetailsSelect, StatesSelect } from '../../../../../types/state';
import { CountriesSelect, CountryCreate, CountryDetailsSelect } from '../../../../../types/country';

export interface CreateCountryState {
    countrycreate: CountryCreate;
    errors: ValidationErrors;
    submitting: boolean;
    displayInformationModal: boolean;
}

const initialState: CreateCountryState = {
    countrycreate: {
        CallingCode:"",
        CurrencyCode:"",
        CurrencyName:"",
        CurrencySymbol:"",
        IsoThreeCode:"",
        IsoTwoCode:"",
        Name:""
    },
    errors: {},
    submitting: false,
    displayInformationModal: false,
};

const slice = createSlice({
    name: 'countrycreate',
    initialState,
    reducers: {
        initializeCountryCreate: () => initialState,
        updateField: (
            state,
            { payload: { name, value } }: PayloadAction<{ name: keyof CreateCountryState['countrycreate']; value: any }>
        ) => {
            state.countrycreate[name] = value as never;
        },
        updateErrors: (state, { payload: errors }: PayloadAction<ValidationErrors>) => {
            state.errors = errors;
        },
        toggleInformationModalStatus: (state) => {
            state.displayInformationModal = !state.displayInformationModal;
        }
    },
});

export const {
    initializeCountryCreate,
    updateErrors,
    toggleInformationModalStatus,
    updateField
} = slice.actions;

export default slice.reducer;