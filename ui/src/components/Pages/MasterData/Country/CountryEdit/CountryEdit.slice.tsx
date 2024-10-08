import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ValidationErrors } from '../../../../../types/error';
import { StateDetailsSelect, StatesSelect } from '../../../../../types/state';
import { CountriesSelect, CountryDetailsSelect, CountryEdit } from '../../../../../types/country';

export interface EditCountryState {
    countryedit: CountryEdit;
    errors: ValidationErrors;
    submitting: boolean;
    displayInformationModal: boolean;
}

const initialState: EditCountryState = {
    countryedit: {
        Id:0,
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
    name: 'countryedit',
    initialState,
    reducers: {
        initializeCountryEdit: () => initialState,
        updateField: (state, { payload: { name, value } }: PayloadAction<{ name: keyof EditCountryState['countryedit']; value: any }>) => {
            state.countryedit[name] = value as never;
        },
        updateErrors: (state, { payload: errors }: PayloadAction<ValidationErrors>) => {
            state.errors = errors;
        },
        toggleInformationModalStatus: (state) => {
            state.displayInformationModal = !state.displayInformationModal;
        },
        loadCountryDetails: (state, { payload: countryinfo }: PayloadAction<CountryEdit>) => {
            state.countryedit = countryinfo
        }
    },
});

export const {
    initializeCountryEdit,
    updateErrors,
    toggleInformationModalStatus,
    updateField,
    loadCountryDetails
} = slice.actions;

export default slice.reducer;