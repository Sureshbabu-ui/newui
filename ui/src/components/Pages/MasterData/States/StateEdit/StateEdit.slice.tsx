import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ValidationErrors } from '../../../../../types/error';
import { StateCreate, StateDetailsSelect, StateEdit, StatesSelect } from '../../../../../types/state';
import { CountriesSelect, CountryDetailsSelect } from '../../../../../types/country';

export interface EditState {
    state: StateEdit;
    errors: ValidationErrors;
    submitting: boolean;
    displayInformationModal: boolean;
    countries: CountryDetailsSelect[];
}

const initialState: EditState = {
    state: {
        Id:0,
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
    name: 'stateedit',
    initialState,
    reducers: {
        initializeStateEdit: () => initialState,
        updateField: (
            state,
            { payload: { name, value } }: PayloadAction<{ name: keyof EditState['state']; value: any }>
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
        },
        loadStateDetails: (state, { payload: stateinfo }: PayloadAction<StateEdit>) => {
            state.state = stateinfo
        },
    },
});

export const {
    initializeStateEdit,
    updateErrors,
    toggleInformationModalStatus,
    updateField,
    loadCountries,
    loadStateDetails
} = slice.actions;

export default slice.reducer;