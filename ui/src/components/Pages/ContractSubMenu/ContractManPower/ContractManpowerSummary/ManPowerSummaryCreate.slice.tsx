import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Configurations, ManpowerSummaryCreation, SelectMasterDataDetails, } from '../../../../../types/manpower';
import { MultipleCustomerSites } from '../../../../../types/customer';
import { SelectTenantOffice } from '../../../../../types/employee';
import { ValidationErrors } from '../../../../../types/error';
import { SelectDetails } from '../../../../../types/user';

export interface CustomerSiteDetails {
  Id: number;
  SiteName: string;
}

export interface CreateEmployeeState {
  masterDataList: Configurations;
  TenantOffices: SelectTenantOffice[],
  CustomerSites: CustomerSiteDetails[];
  manpowersummary: ManpowerSummaryCreation;
  errors: ValidationErrors;
  submitting: boolean;
  displayInformationModal: boolean;
}

const initialState: CreateEmployeeState = {
  TenantOffices: [],
  CustomerSites: [],
  masterDataList: {
    EngineerLevel: [],
    EngineerType: []
  },
  manpowersummary: {
    ContractId: "",
    CustomerSiteId: 0,
    TenantOfficeInfoId: 0,
    DurationInMonth: "",
    EngineerMonthlyCost: "",
    EngineerTypeId: 0,
    EngineerLevelId: 0,
    CustomerAgreedAmount: "",
    Remarks: "",
    EngineerCount: ""
  },
  errors: {},
  submitting: false,
  displayInformationModal: false,
};

const slice = createSlice({
  name: 'manpowersummarycreate',
  initialState,
  reducers: {
    initializeManpower: () => initialState,
    loadTenantlocations: (state, { payload: { Select } }: PayloadAction<SelectDetails>) => {
      state.TenantOffices = Select.map((TenantOfficeInfo) => TenantOfficeInfo);
    },
    loadMasterData: (state, { payload: { name, value: { Select } } }: PayloadAction<{ name: keyof CreateEmployeeState['masterDataList']; value: SelectMasterDataDetails }>) => {
      state.masterDataList[name] = Select.map((masterData) => (masterData))
    },
    loadCustomerSite: (state, { payload: { ContractCustomerSites } }: PayloadAction<MultipleCustomerSites>) => {
      state.CustomerSites = ContractCustomerSites.map((customerSite) => customerSite);
    },
    updateField: (
      state,
      { payload: { name, value } }: PayloadAction<{ name: keyof CreateEmployeeState['manpowersummary']; value: any }>
    ) => {
      state.manpowersummary[name] = value;
    },
    updateErrors: (state, { payload: errors }: PayloadAction<ValidationErrors>) => {
      state.errors = errors;
      //state.signingUp = false;
    },
    startSubmitting: (state) => {
      state.submitting = true;
    },
    stopSubmitting: (state) => {
      state.submitting = false;
    },
    initializeManpowerSummary: (state) => {
      state.manpowersummary = initialState.manpowersummary;
    },
    toggleInformationModalStatus: (state) => {
      state.displayInformationModal = !state.displayInformationModal;
    },
  },
});

export const {
  initializeManpower,
  updateField,
  updateErrors,
  initializeManpowerSummary,
  startSubmitting,
  toggleInformationModalStatus,
  stopSubmitting,
  loadTenantlocations,
  loadCustomerSite,
  loadMasterData
} = slice.actions;

export default slice.reducer;