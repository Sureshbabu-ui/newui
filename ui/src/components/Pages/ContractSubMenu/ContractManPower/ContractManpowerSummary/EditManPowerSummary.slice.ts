import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Configurations, SelectMasterDataDetails } from '../../../../../types/manpower';
import { ValidationErrors } from '../../../../../types/error';
import { ManPowerEditTemplate } from '../../../../../types/manpower';
import { SelectDetails, SelectTenantOffice } from '../../../../../types/employee';
import { MultipleCustomerSites } from '../../../../../types/customer';

export interface EditManPower {
  manpower: ManPowerEditTemplate;
}
export interface CustomerSiteDetails {
  Id: number;
  SiteName: string;
}

export interface EditManPowerSummaryState {
  masterDataList: Configurations;
  TenantOffices: SelectTenantOffice[],
  CustomerSites: CustomerSiteDetails[];
  manpowersummary: ManPowerEditTemplate;
  errors: ValidationErrors;
  signingUp: boolean;
  submitting: boolean;
  displayInformationModal: boolean;
}
const initialState: EditManPowerSummaryState = {
  masterDataList: {
    EngineerLevel: [],
    EngineerType: []
  },
  TenantOffices: [],
  CustomerSites: [],
  manpowersummary: {
    Id: 0,
    ContractId: 0,
    CustomerSiteId: 0,
    TenantOfficeInfoId: 0,
    DurationInMonth: 0,
    EngineerMonthlyCost: 0,
    EngineerTypeId: 0,
    EngineerLevelId: 0,
    CustomerAgreedAmount: 0,
    Remarks: "",
    EngineerCount: 0
  },
  errors: {},
  signingUp: false,
  submitting: false,
  displayInformationModal: false,
};
const slice = createSlice({
  name: 'manpoweredit',
  initialState,
  reducers: {
    initializeManPower: () => initialState,
    loadMasterData: (state, { payload: { name, value: { Select } } }: PayloadAction<{ name: keyof EditManPowerSummaryState['masterDataList']; value: SelectMasterDataDetails }>) => {
      state.masterDataList[name] = Select.map((masterData) => (masterData))
    },
    updateField: (
      state,
      { payload: { name, value } }: PayloadAction<{ name: keyof EditManPowerSummaryState['manpowersummary']; value: string | number }>
    ) => {
      state.manpowersummary[name] = value as never;
    },
    loadTenantOffices: (state, { payload: { Select } }: PayloadAction<SelectDetails>) => {
      state.TenantOffices = Select.map((TenantOfficeInfo) => TenantOfficeInfo);
    },
    loadCustomerSite: (state, { payload: { ContractCustomerSites } }: PayloadAction<MultipleCustomerSites>) => {
      state.CustomerSites = ContractCustomerSites.map((customerSite) => customerSite);
    },
    setManPower: (state, { payload: manPowerDeails }: PayloadAction<any>) => {
      state.manpowersummary = manPowerDeails;
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
    initializeManPowerUpdate: (state) => {
      state.manpowersummary = initialState.manpowersummary
    },
    toggleInformationModalStatus: (state) => {
      state.displayInformationModal = !state.displayInformationModal;
    },
  },
});
export const {
  initializeManPower,
  initializeManPowerUpdate,
  updateField,
  loadTenantOffices,
  loadMasterData,
  setManPower,
  loadCustomerSite,
  updateErrors,
  startSubmitting,
  toggleInformationModalStatus,
  stopSubmitting
} = slice.actions;
export default slice.reducer;
