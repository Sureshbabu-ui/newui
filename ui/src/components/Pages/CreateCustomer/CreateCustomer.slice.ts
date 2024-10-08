import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ValidationErrors } from '../../../types/error';
import { CustomerForCreation, ExistingCustomer, MasterDataItems, MultipleExistingCustomer, SelectDetails } from '../../../types/customer';
import { CountriesSelect, IndustriesSelect } from '../../../types/country';
import { StatesSelect } from '../../../types/state';
import { CitiesSelect } from '../../../types/city';
import { valuesInMasterDataByTableDetailsSelect, valuesInMasterDataByTableSelect } from '../../../types/masterData';

export interface ExistingCustomerList {
  existingCustomer: ExistingCustomer;
}

export interface CreateCustomerState {
  masterDataList: MasterDataItems;
  existingCustomers: ExistingCustomerList[];
  customer: CustomerForCreation;
  customerCodeExist: Boolean;
  TenantOfficeInfo: valuesInMasterDataByTableDetailsSelect[];
  countries: valuesInMasterDataByTableDetailsSelect[];
  industries: valuesInMasterDataByTableDetailsSelect[];
  billedToStates: valuesInMasterDataByTableDetailsSelect[];
  shippedToStates: valuesInMasterDataByTableDetailsSelect[];
  billedToCities: valuesInMasterDataByTableDetailsSelect[];
  shippedToCities: valuesInMasterDataByTableDetailsSelect[];
  errors: ValidationErrors;
  submitting: boolean;
  isMsme: Boolean;
  displayInformationModal: boolean;
  displayInformationDraftModal: boolean;
  displayConformationModal: boolean;
}

const initialState: CreateCustomerState = {
  customerCodeExist: false,
  masterDataList: {
    GstType: []
  },
  existingCustomers: [],
  industries: [],
  customer: {
    Id: null,
    Name: '',
    CustomerId: null,
    NameOnPrint: '',
    IsContractCustomer: true,
    TenantOfficeId: null,
    BilledToAddress: '',
    BilledToCityId: null,
    BilledToStateId: null,
    BilledToCountryId: 1,
    BilledToPincode: '',
    BilledToGstNumber: '',
    ShippedToAddress: '',
    ShippedToCityId: 0,
    ShippedToStateId: null,
    ShippedToCountryId: 1,
    ShippedToPincode: '',
    ShippedToGstNumber: '',
    CustomerGroupId: null,
    CreditPeriod: '',
    EffectiveFrom: '',
    PrimaryContactName: '',
    PrimaryContactEmail: '',
    PrimaryContactPhone: '',
    SecondaryContactName: null,
    SecondaryContactEmail: null,
    SecondaryContactPhone: null,
    PanNumber: '',
    TinNumber: '',
    TanNumber: '',
    CinNumber: '',
    IsMsme: false,
    MsmeRegistrationNumber: '',
    CustomerIndustryId: null,
    GstTypeId: null,
    GstTypeCode: null
  },
  TenantOfficeInfo: [],
  countries: [],
  billedToStates: [],
  shippedToStates: [],
  billedToCities: [],
  shippedToCities: [],
  errors: {},
  submitting: false,
  isMsme: false,
  displayInformationModal: false,
  displayConformationModal: false,
  displayInformationDraftModal: false
};

const slice = createSlice({
  name: 'customercreate',
  initialState,
  reducers: {
    initializeCustomer: () => initialState,
    updateField: (
      state,
      { payload: { name, value } }: PayloadAction<{ name: keyof CreateCustomerState['customer']; value: any }>
    ) => {
      state.customer[name] = value as never;
    },
    loadMasterData: (state, { payload: { name, value: { MasterData } } }: PayloadAction<{ name: keyof CreateCustomerState['masterDataList']; value: valuesInMasterDataByTableSelect }>) => {
      state.masterDataList[name] = MasterData.map((masterData) => (masterData))
    },
    updateErrors: (state, { payload: errors }: PayloadAction<ValidationErrors>) => {
      state.errors = errors;
    },
    startSubmitting: (state) => {
      state.submitting = true;
    },
    customerCodeExist: (state, { payload: customercode }: PayloadAction<Boolean>) => {
      state.customerCodeExist = customercode;
    },
    loadTenantOffices: (state, { payload: { MasterData } }: PayloadAction<valuesInMasterDataByTableSelect>) => {
      state.TenantOfficeInfo = MasterData.map((TenantOfficeInfo) => TenantOfficeInfo);
    },
    loadCountries: (state, { payload: { MasterData } }: PayloadAction<valuesInMasterDataByTableSelect>) => {
      state.countries = MasterData.map((Countries) => Countries);
      (state.customer.BilledToStateId = null),
        (state.customer.BilledToCityId = null),
        (state.customer.ShippedToStateId = null);
      state.customer.ShippedToCityId = null;
    },
    loadBilledToStates: (state, { payload: { MasterData } }: PayloadAction<valuesInMasterDataByTableSelect>) => {
      state.billedToStates = MasterData.map((States) => States);
    },
    loadShippedToStates: (state, { payload: { MasterData } }: PayloadAction<valuesInMasterDataByTableSelect>) => {
      state.shippedToStates = MasterData.map((States) => States);
    },
    loadBilledToCities: (state, { payload: { MasterData } }: PayloadAction<valuesInMasterDataByTableSelect>) => {
      state.billedToCities = MasterData.map((Cities) => Cities);
    },
    loadShippedToCities: (state, { payload: { MasterData } }: PayloadAction<valuesInMasterDataByTableSelect>) => {
      state.shippedToCities = MasterData.map((Cities) => Cities);
    },
    customerNamesExist: (state, { payload: { ExistingCustomerDetails } }: PayloadAction<MultipleExistingCustomer>) => {
      state.existingCustomers = ExistingCustomerDetails.map((existingCustomer) => ({ existingCustomer }));
    },
    stopSubmitting: (state) => {
      state.submitting = false;
    },
    isMsme: (state, { payload: isMsme }: PayloadAction<Boolean>) => {
      if (isMsme == false) {
        state.customer.MsmeRegistrationNumber = '';
      }
      state.isMsme = isMsme;
    },
    toggleInformationModalStatus: (state) => {
      state.displayInformationModal = !state.displayInformationModal;
    },
    toggleConformationModalStatus: (state) => {
      state.displayConformationModal = !state.displayConformationModal;
    },
    loadCustomerIndustries: (state, { payload: { Industries } }: PayloadAction<IndustriesSelect>) => {
      state.industries = Industries.map((industries) => industries);
    },
    toggleInformationModalDraftStatus: (state) => {
      state.displayInformationDraftModal = !state.displayInformationDraftModal;
    }
  },
});

export const {
  initializeCustomer,
  updateField,
  loadMasterData,
  updateErrors,
  startSubmitting,
  toggleInformationModalStatus,
  toggleConformationModalStatus,
  toggleInformationModalDraftStatus,
  stopSubmitting,
  customerCodeExist,
  customerNamesExist,
  isMsme,
  loadCustomerIndustries,
  loadTenantOffices,
  loadCountries,
  loadBilledToStates,
  loadShippedToStates,
  loadBilledToCities,
  loadShippedToCities,
} = slice.actions;

export default slice.reducer;
