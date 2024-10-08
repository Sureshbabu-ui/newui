import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MultipleCustomerSites } from '../../../../../types/customer';
import { ValidationErrors } from '../../../../../types/error';
import { EngineerList, EngineersNamesList, ManpowerAllocationCreate } from '../../../../../types/contractmanpowerallocation';

export interface CustomerSiteDetails {
  Id: number;
  SiteName: string;
}

export interface CreateManpowerAllocationState {
  EngineersList: EngineerList[];
  CustomerSites: CustomerSiteDetails[];
  manpowerallocation: ManpowerAllocationCreate;
  errors: ValidationErrors;
  submitting: boolean;
  displayInformationModal: boolean;
}

const initialState: CreateManpowerAllocationState = {
  CustomerSites: [],
  EngineersList: [],
  manpowerallocation: {
    ContractId: 0,
    CustomerSiteId: 0,
    EmployeeId: 0,
    StartDate: null,
    EndDate: null,
    CustomerAgreedAmount: 0,
    Remarks: "",
    BudgetedAmount: 0
  },
  errors: {},
  submitting: false,
  displayInformationModal: false,
};

const slice = createSlice({
  name: 'createmanpowerallocation',
  initialState,
  reducers: {
    initializeAllocation: () => initialState,
    loadServiceEngineers: (state, { payload: { EngineersNames } }: PayloadAction<EngineersNamesList>) => {
      state.EngineersList = EngineersNames.map((ServiceEngineers) => ServiceEngineers);
    },
    loadCustomerSite: (state, { payload: { ContractCustomerSites } }: PayloadAction<MultipleCustomerSites>) => {
      state.CustomerSites = ContractCustomerSites.map((customerSite) => customerSite);
    },
    setContractId: (state, { payload: Id }: PayloadAction<any>) => {
      state.manpowerallocation.ContractId = Id;
    },
    updateField: (
      state,
      { payload: { name, value } }: PayloadAction<{ name: keyof CreateManpowerAllocationState['manpowerallocation']; value: any }>
    ) => {
      state.manpowerallocation[name] = value as never;
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
    initializeManpowerAllocation: (state) => {
      state.manpowerallocation.ContractId = initialState.manpowerallocation.ContractId;
      state.manpowerallocation.CustomerSiteId = initialState.manpowerallocation.CustomerSiteId;
      state.manpowerallocation.EmployeeId = initialState.manpowerallocation.EmployeeId;
      state.manpowerallocation.StartDate = initialState.manpowerallocation.StartDate;
      state.manpowerallocation.EndDate = initialState.manpowerallocation.EndDate;
      state.manpowerallocation.CustomerAgreedAmount = initialState.manpowerallocation.CustomerAgreedAmount;
      state.manpowerallocation.BudgetedAmount = initialState.manpowerallocation.BudgetedAmount;
      state.manpowerallocation.Remarks = initialState.manpowerallocation.Remarks;
    },
    toggleInformationModalStatus: (state) => {
      state.displayInformationModal = !state.displayInformationModal;
    },
    initializeManPowerAlloctaion: (state) => {
      state.manpowerallocation = initialState.manpowerallocation;
    },
  },
});

export const {
  initializeAllocation,
  initializeManPowerAlloctaion,
  updateField,
  updateErrors,
  startSubmitting,
  toggleInformationModalStatus,
  stopSubmitting,
  initializeManpowerAllocation,
  loadServiceEngineers,
  loadCustomerSite,
  setContractId
} = slice.actions;

export default slice.reducer;