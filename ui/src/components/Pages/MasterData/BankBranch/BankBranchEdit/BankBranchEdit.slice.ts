import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ValidationErrors } from '../../../../../types/error';
import { BankBranchInfo, SelectedBankBranch } from '../../../../../types/bankBranch';
import { StateDetailsSelect, StatesSelect } from '../../../../../types/state';
import { CitiesSelect, CityDetailsSelect } from '../../../../../types/city';
import { CountriesSelect, CountryDetailsSelect } from '../../../../../types/country';
import { PostalCodeDetails, PostalCodeList } from '../../../../../types/postalcode';

export interface Select {
    value: any,
    label: any,
    code?: any
}

export interface SelectDetails {
    Select: Select[]
}

export interface CountryCodeSelectDetails {
    PrimaryCountryCode: Select[]
}

export interface EditBankBranchState {
    selectedBranch: BankBranchInfo
    states: StateDetailsSelect[],
    cities: CityDetailsSelect[],
    countries: CountryDetailsSelect[],
    errors: ValidationErrors;
    submitting: boolean;
    displayInformationModal: boolean;
    selectDetails: CountryCodeSelectDetails;
    postalcodelist: PostalCodeDetails[];
}

const initialState: EditBankBranchState = {
    selectedBranch: {
        Id: 0,
        BankId: 0,
        StateId: 0,
        CityId: 0,
        CountryId: 0,
        BankName: "",
        BranchCode: "",
        BranchName: "",
        City: "",
        State: "",
        Country: "",
        Address: "",
        Pincode: "",
        ContactNumberOne: "",
        ContactNumberOneCountryCode: "",
        ContactNumberTwo: "",
        ContactNumberTwoCountryCode: "",
        ContactPerson: "",
        Ifsc: "",
        MicrCode: "",
        SwiftCode: "",
        Email: "",
        CreatedBy: "",
        CreatedOn: "",
        BranchId: 0
    },
    states: [],
    countries: [],
    cities: [],
    errors: {},
    submitting: false,
    displayInformationModal: false,
    selectDetails: {
        PrimaryCountryCode: []
    },
    postalcodelist: []
};

const slice = createSlice({
    name: 'bankbranchedit',
    initialState,
    reducers: {
        initializeBankBranchEdit: () => initialState,
        updateField: (
            state,
            { payload: { name, value } }: PayloadAction<{ name: keyof EditBankBranchState['selectedBranch']; value: any }>
        ) => {
            state.selectedBranch[name] = value as never;
            if (name == "CountryId" && state.selectedBranch.CountryId != value) {
                state.selectedBranch.StateId = -1
                state.selectedBranch.CityId = -1
            }
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
            state.states = States.map((States) => States);
        },
        loadCities: (state, { payload: { Cities } }: PayloadAction<CitiesSelect>) => {
            state.cities = Cities.map((Cities) => Cities);
        },
        loadCountries: (state, { payload: { Countries } }: PayloadAction<CountriesSelect>) => {
            state.countries = Countries.map((selectDetails) => (selectDetails))
        },
        loadBranchDetails: (state, { payload: { BankBranchDetails } }: PayloadAction<SelectedBankBranch>) => {
            state.selectedBranch = BankBranchDetails
        },
        loadSelectDetails: (state, { payload: { name, value: { Select } } }: PayloadAction<{ name: keyof EditBankBranchState['selectDetails']; value: SelectDetails }>) => {
            state.selectDetails[name] = Select.map((selectDetails) => (selectDetails))
        },
        loadBankBranchPostalCodeList: (state, { payload: { PostalCodeList } }: PayloadAction<PostalCodeList>) => {
            state.postalcodelist = PostalCodeList.map((postalcodelist) => postalcodelist);
        },
        clearBankBranchPostalCodeList: (state) => {
            state.postalcodelist = [];
        }
    },
});

export const {
    initializeBankBranchEdit,
    updateErrors,
    startSubmitting,
    toggleInformationModalStatus,
    updateField,
    loadStates,
    loadCities,
    stopSubmitting,
    loadCountries,
    loadBranchDetails,
    loadSelectDetails,
    clearBankBranchPostalCodeList,
    loadBankBranchPostalCodeList
} = slice.actions;

export default slice.reducer;