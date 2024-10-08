import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { VendorBranchCreation, VendorBranchSelectDetails, SelectDetails } from '../../../../../../types/vendorBranch';
import { ValidationErrors } from '../../../../../../types/error';

export interface CreateVendorBranchState {
  vendorBranch: VendorBranchCreation;
  errors: ValidationErrors;
  displayInformationModal: boolean;
  selectDetails: VendorBranchSelectDetails
}

const initialState: CreateVendorBranchState = {
  vendorBranch:
  {
    Name: '',
    TenantOfficeId: 0,
    Address: '',
    CityId: 0,
    VendorId: 0,
    StateId: 0,
    Pincode: '',
    ContactName: '',
    Email: '',
    ContactNumberOneCountryCode: '',
    ContactNumberOne: '',
    ContactNumberTwoCountryCode: '',
    ContactNumberTwo: '',
    CreditPeriodInDays: '',
    GstNumber: '',
    GstVendorTypeId: 0,
    Code: '',
    CountryId: 1,
    GstArn: '',
    Remarks: '',
    TollfreeNumber: ''
  },
  selectDetails: {
    Cities: [],
    GstVendorType: [],
    Location: [],
    States: [],
    Countrys: [],
    PrimaryCountryCode:[]
  },
  errors: {},
  displayInformationModal: false,
};

const slice = createSlice({
  name: 'vendorbranchcreate',
  initialState,
  reducers: {
    initializeVendorBranchCreate: () => initialState,
    updateField: (
      state,
      { payload: { name, value } }: PayloadAction<{ name: keyof CreateVendorBranchState['vendorBranch']; value: any }>) => {
      state.vendorBranch[name] = value as never;
    },
    loadSelectDetails: (state, { payload: { name, value: { Select } } }: PayloadAction<{ name: keyof CreateVendorBranchState['selectDetails']; value: SelectDetails }>) => {
      state.selectDetails[name] = Select.map((selectDetails) => (selectDetails))
    },
    updateErrors: (state, { payload: errors }: PayloadAction<ValidationErrors>) => {
      state.errors = errors;
    },
    toggleInformationModalStatus: (state) => {
      state.displayInformationModal = !state.displayInformationModal;
    },
  },
});

export const { initializeVendorBranchCreate, updateField, updateErrors, loadSelectDetails, toggleInformationModalStatus } = slice.actions;
export default slice.reducer;