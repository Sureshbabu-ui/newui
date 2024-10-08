import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ValidationErrors } from '../../../../../types/error';
import { CityCreate } from '../../../../../types/city';
import { StateDetailsSelect, StatesSelect } from '../../../../../types/state';
import { CountriesSelect, CountryDetailsSelect } from '../../../../../types/country';
import { valuesInMasterDataByTableDetailsSelect, valuesInMasterDataByTableSelect } from '../../../../../types/masterData';

export interface CreateCityState {
    city: CityCreate;
    errors: ValidationErrors;
    submitting: boolean;
    displayInformationModal: boolean;
    CountryId:number;
    States: StateDetailsSelect[];
    countries: CountryDetailsSelect[];
    Location:valuesInMasterDataByTableDetailsSelect[],
}

const initialState: CreateCityState = {
    city: {
        Code: "",
        Name: "",
        StateId: 0,
        TenantOfficeId:0
    },
    Location:[],
    countries:[],
    States:[],
    CountryId:0,
    errors: {},
    submitting: false,
    displayInformationModal: false,
};

const slice = createSlice({
    name: 'citycreate',
    initialState,
    reducers: {
        initializeCityCreate: () => initialState,
        updateField: (
            state,
            { payload: { name, value } }: PayloadAction<{ name: keyof CreateCityState['city']; value: any }>
        ) => {
            state.city[name] = value as never;
        },
        updateErrors: (state, { payload: errors }: PayloadAction<ValidationErrors>) => {
            state.errors = errors;
        },
        startSubmitting: (state) => {
            state.submitting = true;
        },
        stopSubmitting: (state) => {
            state.submitting = false;
        },
        toggleInformationModalStatus: (state) => {
            state.displayInformationModal = !state.displayInformationModal;
        },
        loadStates: (state, { payload: { States } }: PayloadAction<StatesSelect>) => {
            state.States = States.map((States) => States);
        },
        loadCountries: (state, { payload: { Countries } }: PayloadAction<CountriesSelect>) => {
            state.countries = Countries.map((selectDetails) => (selectDetails))
        },
        setCountryId: (state, { payload: Id }: PayloadAction<any>) => {
            state.CountryId = Id;
        },
        loadTenantOffices: (state, { payload: { MasterData } }: PayloadAction<valuesInMasterDataByTableSelect>) => {
            state.Location = MasterData.map((selectDetails) => (selectDetails))
        },
    },
});

export const {
    initializeCityCreate,
    updateErrors,
    startSubmitting,
    toggleInformationModalStatus,
    updateField,
    stopSubmitting,
    loadStates,
    loadCountries,
    setCountryId,
    loadTenantOffices
} = slice.actions;

export default slice.reducer;