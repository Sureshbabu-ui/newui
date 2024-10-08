import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ValidationErrors } from '../../../../types/error';
import { ClickedCustomerDetails, ExistingCustomer, MasterDataItems, SelectedCustomerData } from '../../../../types/customer';
import { TenantInfoDetails, TenantOfficeInfo } from '../../../../types/tenantofficeinfo';
import { None, Option, Some } from '@hqoss/monads';
import { CountriesSelect, IndustriesSelect } from '../../../../types/country';
import { StatesSelect } from '../../../../types/state';
import { CitiesSelect } from '../../../../types/city';
import { valuesInMasterDataByTableDetailsSelect, valuesInMasterDataByTableSelect } from '../../../../types/masterData';

export interface ExistingCustomerList {
  existingCustomer: ExistingCustomer;
}

export interface tenantOffices {
  tenantOffice: TenantInfoDetails;
}

export interface UpdateCustomerState {
  masterDataList: MasterDataItems;
  customer: ClickedCustomerDetails;
  tenantOffices: Option<readonly tenantOffices[]>;
  countries: valuesInMasterDataByTableDetailsSelect[];
  industries: valuesInMasterDataByTableDetailsSelect[];
  billedToStates: valuesInMasterDataByTableDetailsSelect[];
  shippedToStates: valuesInMasterDataByTableDetailsSelect[];
  billedToCities: valuesInMasterDataByTableDetailsSelect[];
  shippedToCities: valuesInMasterDataByTableDetailsSelect[];
  errors: ValidationErrors;
  submitting: boolean;
  isMsme: Boolean;
  draftdisplayInformationModal: boolean;
  approvaldisplayInformationModal: boolean;
}

const initialState: UpdateCustomerState = {
  masterDataList: {
    GstType: []
  },
  customer: {
    Id: 0,
    CustomerId: "",
    CustomerCode: "",
    CustomerGroupId: null,
    Name: '',
    NameOnPrint: '',
    TenantOfficeId: null,
    BilledToAddress: '',
    BilledToCityId: null,
    BilledToStateId: null,
    BilledToCountryId: null,
    BilledToPincode: '',
    BilledToGstNumber: '',
    ShippedToAddress: '',
    ShippedToCityId: null,
    ShippedToStateId: null,
    ShippedToCountryId: null,
    ShippedToPincode: '',
    ShippedToGstNumber: '',
    IsContractCustomer: true,
    PrimaryContactName: '',
    PrimaryContactEmail: '',
    PrimaryContactPhone: '',
    SecondaryContactName: '',
    SecondaryContactEmail: '',
    SecondaryContactPhone: '',
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
  industries: [],
  tenantOffices: None,
  countries: [],
  billedToStates: [],
  shippedToStates: [],
  billedToCities: [],
  shippedToCities: [],
  errors: {},
  submitting: false,
  isMsme: false,
  draftdisplayInformationModal: false,
  approvaldisplayInformationModal: false
};

const slice = createSlice({
  name: 'customerupdate',
  initialState,
  reducers: {
    initializeCustomerEdit: () => initialState,
    updateField: (
      state,
      { payload: { name, value } }: PayloadAction<{ name: keyof UpdateCustomerState['customer']; value: any }>
    ) => {
      state.customer[name] = value as never;
    },
    loadMasterData: (state, { payload: { name, value: { MasterData } } }: PayloadAction<{ name: keyof UpdateCustomerState['masterDataList']; value: valuesInMasterDataByTableSelect }>) => {
      state.masterDataList[name] = MasterData.map((masterData) => (masterData))
    },
    updateErrors: (state, { payload: errors }: PayloadAction<ValidationErrors>) => {
      state.errors = errors;
    },
    loadCustomerDetails: (state, { payload: { CustomerDetails } }: PayloadAction<SelectedCustomerData>) => {
      state.customer = CustomerDetails;
    },
    startSubmitting: (state) => {
      state.submitting = true;
    },
    loadTenantOffices: (state, { payload: { TenantOfficeInfo } }: PayloadAction<TenantOfficeInfo>) => {
      state.tenantOffices = Some(TenantOfficeInfo.map((tenantOffice) => ({ tenantOffice })));
    },
    loadCountries: (state, { payload: { MasterData } }: PayloadAction<valuesInMasterDataByTableSelect>) => {
      state.countries = MasterData.map((Countries) => Countries);
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
    stopSubmitting: (state) => {
      state.submitting = false;
    },
    isMsme: (state, { payload: isMsme }: PayloadAction<Boolean>) => {
      if (isMsme == false) {
        state.customer.MsmeRegistrationNumber = ''
      }
      state.isMsme = isMsme;
    },
    toggleInformationApprovalModalStatus: (state) => {
      state.approvaldisplayInformationModal = !state.approvaldisplayInformationModal;
    },
    toggleInformationDraftModalStatus: (state) => {
      state.draftdisplayInformationModal = !state.draftdisplayInformationModal;
    },
    loadCustomerIndustries: (state, { payload: { Industries } }: PayloadAction<IndustriesSelect>) => {
      state.industries = Industries.map((industries) => industries);
    },
  },
});

export const {
  initializeCustomerEdit,
  updateField,
  updateErrors,
  loadCustomerIndustries,
  startSubmitting,
  toggleInformationApprovalModalStatus,
  toggleInformationDraftModalStatus,
  stopSubmitting,
  loadMasterData,
  isMsme,
  loadTenantOffices,
  loadCountries,
  loadBilledToStates,
  loadShippedToStates,
  loadBilledToCities,
  loadShippedToCities,
  loadCustomerDetails,
} = slice.actions;

export default slice.reducer;