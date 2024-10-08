import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ValidationErrors } from '../../../../../types/error';
import { StateCreate, StateDetailsSelect, StatesSelect } from '../../../../../types/state';
import { CountriesSelect, CountryDetailsSelect } from '../../../../../types/country';

export interface CreateState {
    state: StateCreate;
    errors: ValidationErrors;
    submitting: boolean;
    displayInformationModal: boolean;
    countries: CountryDetailsSelect[];
}

const initialState: CreateState = {
    state: {
        Code: "",
        Name: "",
        CountryId: 0,
        GstStateCode:"",
        GstStateName:""
    },
    countries:[],
    errors: {},
    submitting: false,
    displayInformationModal: false,
};

const slice = createSlice({
    name: 'statecreate',
    initialState,
    reducers: {
        initializeStateCreate: () => initialState,
        updateField: (
            state,
            { payload: { name, value } }: PayloadAction<{ name: keyof CreateState['state']; value: any }>
        ) => {
            state.state[name] = value as never;
        },
        updateErrors: (state, { payload: errors }: PayloadAction<ValidationErrors>) => {
            state.errors = errors;
        },
        toggleInformationModalStatus: (state) => {
            state.displayInformationModal = !state.displayInformationModal;
        },
        loadCountries: (state, { payload: { Countries } }: PayloadAction<CountriesSelect>) => {
            state.countries = Countries.map((selectDetails) => (selectDetails))
        }
    },
});

export const {
    initializeStateCreate,
    updateErrors,
    toggleInformationModalStatus,
    updateField,
    loadCountries
} = slice.actions;

export default slice.reducer;