import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SelectMasterDataDetails } from '../../../../../types/manpower';
import { ValidationErrors } from '../../../../../types/error';
import { ManPowerEditTemplate } from '../../../../../types/manpower';
import { SelectDetails, SelectTenantOffice } from '../../../../../types/employee';
import { MultipleCustomerSites } from '../../../../../types/customer';
import { Configurations, EngineerList, EngineersNamesList, ManpowerAllocationDetails } from '../../../../../types/contractmanpowerallocation';

export interface CustomerSiteDetails {
  Id: number;
  SiteName: string;
}

export interface EditManPowerAllocationState {
  masterDataList: Configurations;
  EngineersList: EngineerList[];
  CustomerSites: CustomerSiteDetails[];
  manpowerallocation: ManpowerAllocationDetails;
  errors: ValidationErrors;
  signingUp: boolean;
  submitting: boolean;
  displayInformationModal: boolean;
}
const initialState: EditManPowerAllocationState = {
  masterDataList: {
    ManpowerAllocationStatus: []
  },
  EngineersList: [],
  CustomerSites: [],
  manpowerallocation: {
    Id: 0,
    ContractId: 0,
    CustomerSiteId: 0,
    EmployeeId: 0,
    AllocationStatusId: 0,
    StartDate: "",
    EndDate: "",
    BudgetedAmount: 0,
    CustomerAgreedAmount: 0,
    Remarks: "",
  },
  errors: {},
  signingUp: false,
  submitting: false,
  displayInformationModal: false,
};
const slice = createSlice({
  name: 'editmanpowerallocation',
  initialState,
  reducers: {
    initializeManPowerAlloctaion: () => initialState,
    loadMasterData: (state, { payload: { name, value: { Select } } }: PayloadAction<{ name: keyof EditManPowerAllocationState['masterDataList']; value: SelectMasterDataDetails }>) => {
      state.masterDataList[name] = Select.map((masterData) => (masterData))
    },
    loadServiceEngineers: (state, { payload: { EngineersNames } }: PayloadAction<EngineersNamesList>) => {
      state.EngineersList = EngineersNames.map((ServiceEngineers) => ServiceEngineers);
    },
    updateField: (
      state,
      { payload: { name, value } }: PayloadAction<{ name: keyof EditManPowerAllocationState['manpowerallocation']; value: string | number }>
    ) => {
      state.manpowerallocation[name] = value as never;
    },
    loadCustomerSite: (state, { payload: { ContractCustomerSites } }: PayloadAction<MultipleCustomerSites>) => {
      state.CustomerSites = ContractCustomerSites.map((customerSite) => customerSite);
    },
    setManPowerAllocation: (state, { payload: manPowerDeails }: PayloadAction<any>) => {
      state.manpowerallocation = manPowerDeails;
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
    initializeManPowerAlloctaionUpdate: (state) => {
      state.manpowerallocation = initialState.manpowerallocation;
    },
    toggleInformationModalStatus: (state) => {
      state.displayInformationModal = !state.displayInformationModal;
    },
  },
});
export const {
  initializeManPowerAlloctaion,
  updateField,
  loadMasterData,
  initializeManPowerAlloctaionUpdate,
  setManPowerAllocation,
  loadCustomerSite,
  updateErrors,
  startSubmitting,
  toggleInformationModalStatus,
  stopSubmitting,
  loadServiceEngineers
} = slice.actions;
export default slice.reducer;
