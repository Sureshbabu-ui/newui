import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ValidationErrors } from '../../../../types/error';
import { CustomerSiteListArray, CustomerSiteNameArray } from '../../../../types/customer';

export interface selectedCustomeSite {
  contractId: string
  customerSiteId: string,
}

export interface CreateCustomerSiteState {
  customerSiteList: CustomerSiteListArray;
  selectedCustomerSiteName: CustomerSiteListArray;
  selectedCustomerSiteId: number[];
  customerSiteCreate: selectedCustomeSite;
  errors: ValidationErrors;
  submitting: boolean;
  displayInformationModal: boolean;
}

const initialState: CreateCustomerSiteState = {
  customerSiteList: [],
  selectedCustomerSiteName: [],
  selectedCustomerSiteId: [],
  customerSiteCreate: {
    contractId: '',
    customerSiteId: ''
  },
  errors: {},
  submitting: false,
  displayInformationModal: false,
};

const slice = createSlice({
  name: 'contractcustomersitecreate',
  initialState,
  reducers: {
    initializeCreateCustomerSite: () => initialState,
    loadCustomerSite: (state, { payload: siteList }: PayloadAction<CustomerSiteNameArray>) => {
      state.customerSiteList = (siteList.map((customerSite) => (customerSite)));
    },
    updateField: (state, { payload: contractId }: PayloadAction<string>) => {
      state.customerSiteCreate.contractId = contractId
    },
    customerSiteSelected: (
      state, { payload: customerSiteName }: PayloadAction<any>) => {
      state.selectedCustomerSiteName = (customerSiteName);
    },
    addSelectedCustomerSiteId: (state, { payload: id }: PayloadAction<any>) => {
      if (state.selectedCustomerSiteId.includes(id) == false) {
        state.selectedCustomerSiteId.push(id);
      }
      state.customerSiteCreate.customerSiteId = state.selectedCustomerSiteId.join(",");
    },
    removeSelectedCustomerSiteId: (state, { payload: id }: PayloadAction<any>) => {
      var index = state.selectedCustomerSiteId.indexOf(id);
      if (index !== -1) {
        state.selectedCustomerSiteId.splice(index, 1);
      }
      state.customerSiteCreate.customerSiteId = state.selectedCustomerSiteId.join(",");
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
  },
});

export const {
  initializeCreateCustomerSite,
  updateErrors,
  startSubmitting,
  toggleInformationModalStatus,
  stopSubmitting,
  updateField,
  loadCustomerSite,
  customerSiteSelected,
  addSelectedCustomerSiteId,
  removeSelectedCustomerSiteId
} = slice.actions;

export default slice.reducer;
