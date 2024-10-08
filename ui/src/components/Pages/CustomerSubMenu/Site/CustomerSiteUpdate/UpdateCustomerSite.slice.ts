import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ValidationErrors } from '../../../../../types/error';
import { CountryDetailsSelect } from '../../../../../types/country';
import { StateDetailsSelect, StatesSelect } from '../../../../../types/state';
import { CitiesSelect, CityDetailsSelect } from '../../../../../types/city';
import { TenantInfoDetails, TenantOfficeInfo } from '../../../../../types/tenantofficeinfo';
import { ClickedCustomerSiteDetails, SelectedCustomerSiteData } from '../../../../../types/customerSite';
import { None, Option, Some } from '@hqoss/monads';


export interface tenantOffices {
  tenantOffice: TenantInfoDetails;}
  
export interface UpdateCustomerSiteState {
  customerSite: ClickedCustomerSiteDetails;
  countries: CountryDetailsSelect[],
  states: StateDetailsSelect[],
  cities: CityDetailsSelect[],
  tenantOffices: Option<readonly tenantOffices[]>;
  errors: ValidationErrors;
  submitting: boolean;
  displayInformationModal: boolean;
}

const initialState: UpdateCustomerSiteState = {
  customerSite: {
    Id:0,
    CustomerId: 0,
    SiteName: '',
    Address: '',
    CityId: 0,
    StateId: 0,
    Pincode: '',
    GeoLocation: '',
    TenantOfficeId: 0,
    PrimaryContactEmail: '',
    PrimaryContactPhone: '',
    PrimaryContactName: '',
    SecondaryContactEmail: '',
    SecondaryContactPhone: '',
    SecondaryContactName: '',
  },
  countries: [],
  states: [],
  cities: [],
  tenantOffices: None,
  errors: {},
  submitting: false,
  displayInformationModal: false,
};

const slice = createSlice({
  name: 'customersiteupdate',
  initialState,
  reducers: {
    initializeUpdateCustomerSite: () => initialState,
    updateField: (
      state,
      { payload: { name, value } }: PayloadAction<{ name: keyof UpdateCustomerSiteState['customerSite']; value: any }>
    ) => {
      state.customerSite[name] = value as never;
    },
    loadCustomerSiteDetails: (state, { payload: { CustomerSiteDetails } }: PayloadAction<SelectedCustomerSiteData>) => {
      state.customerSite = CustomerSiteDetails;
    },
    loadStates: (state, { payload: { States } }: PayloadAction<StatesSelect>) => {
      state.states = States.map((States) => States);
      state.customerSite.CityId = 0
    },
    loadCities: (state, { payload: { Cities } }: PayloadAction<CitiesSelect>) => {
      state.cities = Cities.map((Cities) => Cities);
    },
    loadTenantOffices: (state, { payload: { TenantOfficeInfo } }: PayloadAction<TenantOfficeInfo>) => {
      state.tenantOffices = Some(TenantOfficeInfo.map((tenantOffice) => ({ tenantOffice })));
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
  },
});

export const {
  initializeUpdateCustomerSite,
  updateField,
  loadCities,
  loadStates,
  updateError,
  startSubmitting,
  loadTenantOffices,
  toggleInformationModalStatus,
  stopSubmitting,
  loadCustomerSiteDetails
} = slice.actions;  

export default slice.reducer;