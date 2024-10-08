import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ValidationErrors } from '../../../../../types/error';
import { BankBranchCreate } from '../../../../../types/bankBranch';
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

export interface CreateBankBranchState {
  bankBranch: BankBranchCreate;
  states: StateDetailsSelect[],
  cities: CityDetailsSelect[],
  countries: CountryDetailsSelect[],
  errors: ValidationErrors;
  submitting: boolean;
  displayInformationModal: boolean;
  selectDetails: CountryCodeSelectDetails;
  pincodecheck: boolean;
  postalcodelist: PostalCodeDetails[];
}

const initialState: CreateBankBranchState = {
  bankBranch: {
    BankId: 0,
    BranchCode: "",
    BranchName: "",
    Address: "",
    CityId: null,
    StateId: null,
    CountryId: null,
    Pincode: "",
    ContactPerson: "",
    ContactNumberOneCountryCode: "",
    ContactNumberOne: "",
    ContactNumberTwoCountryCode: "",
    ContactNumberTwo: "",
    Email: "",
    Ifsc: "",
    MicrCode: "",
    SwiftCode: ""
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
  postalcodelist: [],
  pincodecheck: false
};

const slice = createSlice({
  name: 'bankbranchcreate',
  initialState,
  reducers: {
    initializeBankBranchCreate: () => initialState,
    updateField: (
      state,
      { payload: { name, value } }: PayloadAction<{ name: keyof CreateBankBranchState['bankBranch']; value: any }>
    ) => {
      state.bankBranch[name] = value as never;
      if (name == "CountryId" && state.bankBranch.CountryId != value) {
        state.bankBranch.StateId = null
        state.bankBranch.CityId = null
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
    loadSelectDetails: (state, { payload: { name, value: { Select } } }: PayloadAction<{ name: keyof CreateBankBranchState['selectDetails']; value: SelectDetails }>) => {
      state.selectDetails[name] = Select.map((selectDetails) => (selectDetails))
    },
    loadPostalCodeList: (state, { payload: { PostalCodeList } }: PayloadAction<PostalCodeList>) => {
      state.postalcodelist = PostalCodeList.map((postalcodelist) => postalcodelist);
    },
    clearPostalCodeList: (state) => {
      state.postalcodelist = [];
      state.bankBranch.CityId = null;
      state.bankBranch.CountryId = null;
      state.bankBranch.StateId = null;
      state.bankBranch.Pincode = ""
    },
  },
});

export const {
  initializeBankBranchCreate,
  updateErrors,
  startSubmitting,
  toggleInformationModalStatus,
  updateField,
  loadStates,
  loadCities,
  stopSubmitting,
  loadCountries,
  loadSelectDetails,
  clearPostalCodeList,
  loadPostalCodeList
} = slice.actions;

export default slice.reducer;