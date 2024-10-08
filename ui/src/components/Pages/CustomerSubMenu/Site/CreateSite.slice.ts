import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ValidationErrors } from '../../../../types/error';
import { CustomerSiteCreate } from '../../../../types/customer';
import { CountryDetailsSelect } from '../../../../types/country';
import { StateDetailsSelect, StatesSelect } from '../../../../types/state';
import { CitiesSelect, CityDetailsSelect } from '../../../../types/city';
import { SelectDetails, SelectTenantOffice } from '../../../../types/user';
import { PostalCodeDetails, PostalCodeList } from '../../../../types/postalcode';

interface CityCustomDetails {
  value: any,
  label: any,
  TenantOfficeId: any
}

export interface CreateCustomerSiteState {
  customerSite: CustomerSiteCreate;
  countries: CountryDetailsSelect[],
  states: StateDetailsSelect[],
  cities: CityCustomDetails[],
  location: SelectTenantOffice[],
  errors: ValidationErrors;
  submitting: boolean;
  displayInformationModal: boolean;
  pincodecheck: boolean;
  postalcodelist: PostalCodeDetails[];
}

const initialState: CreateCustomerSiteState = {
  customerSite: {
    CustomerId: '',
    SiteName: '',
    Address: '',
    CityId: null,
    StateId: null,
    Pincode: '',
    GeoLocation: '',
    TenantOfficeId: 0,
    PrimaryContactName: '',
    PrimaryContactPhone: '',
    PrimaryContactEmail: '',
    SecondaryContactName: '',
    SecondaryContactPhone: '',
    SecondaryContactEmail: '',
  },
  countries: [],
  states: [],
  cities: [],
  location: [],
  errors: {},
  submitting: false,
  displayInformationModal: false,
  postalcodelist: [],
  pincodecheck: false
};

const slice = createSlice({
  name: 'customersitecreate',
  initialState,
  reducers: {
    initializeCreateCustomerSite: () => initialState,
    updateField: (
      state,
      { payload: { name, value } }: PayloadAction<{ name: keyof CreateCustomerSiteState['customerSite']; value: any }>
    ) => {
      state.customerSite[name] = value as never;
    },
    loadStates: (state, { payload: { States } }: PayloadAction<StatesSelect>) => {
      state.states = States.map((States) => States);
      state.customerSite.CityId = null
    },
    loadCities: (state, { payload: Cities }: PayloadAction<CityCustomDetails[]>) => {
      state.cities = Cities.map((Cities) => Cities);
    },
    loadOfficeLocations: (state, { payload: { Select } }: PayloadAction<SelectDetails>) => {
      state.location = Select.map((TenantOfficeInfo) => TenantOfficeInfo);
    },
    updateError: (state, { payload: errors }: PayloadAction<ValidationErrors>) => {
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
    loadPostalCodeList: (state, { payload: { PostalCodeList } }: PayloadAction<PostalCodeList>) => {
      state.postalcodelist = PostalCodeList.map((postalcodelist) => postalcodelist);
    },
    clearPostalCodeList: (state) => {
      state.postalcodelist = [];
      state.customerSite.CityId = null;
      state.customerSite.StateId = null;
      state.customerSite.Pincode = ""
    },
  },
});

export const {
  initializeCreateCustomerSite,
  updateField,
  loadCities,
  loadStates,
  updateError,
  startSubmitting,
  loadOfficeLocations,
  toggleInformationModalStatus,
  clearPostalCodeList,
  loadPostalCodeList,
  stopSubmitting,
} = slice.actions;

export default slice.reducer;