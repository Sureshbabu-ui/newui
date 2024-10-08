import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { VendorBranchEdit, VendorBranchEditDetails, VendorBranchSelectDetails, SelectDetails } from '../../../../../../types/vendorBranch';
import { ValidationErrors } from '../../../../../../types/error';

export interface EditVendorBranchState {
  vendorBranch: VendorBranchEdit;
  errors: ValidationErrors;
  displayInformationModal: boolean;
  selectDetails: VendorBranchSelectDetails
}

const initialState: EditVendorBranchState = {
  vendorBranch:
  {
    Id: 0,
    Code: '',
    Name: '',
    TenantOfficeId: 0,
    Address: '',
    CityId: 0,
    StateId: 0,
    Pincode: '',
    ContactName: '',
    Email: '',
    ContactNumberOneCountryCode: '',
    ContactNumberOne: '',
    ContactNumberTwoCountryCode: '',
    ContactNumberTwo: '',
    CreditPeriodInDays: 0,
    GstNumber: '',
    GstVendorTypeId: 0,
    CountryId: 0,
    GstArn: '',
    Remarks: '',
    TollfreeNumber: '',
    IsActive:false
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
  name: 'vendorbranchedit',
  initialState,
  reducers: {
    initializeVendorBranchEdit: () => initialState,
    updateField: (
      state,
      { payload: { name, value } }: PayloadAction<{ name: keyof EditVendorBranchState['vendorBranch']; value: any }>) => {
      state.vendorBranch[name] = value as never;
    },
    loadVendorBranchDetails: (state, { payload: { VendorBranchDetails } }: PayloadAction<VendorBranchEditDetails>) => {
      state.vendorBranch = VendorBranchDetails;
    },
    loadSelectDetails: (state, { payload: { name, value: { Select } } }: PayloadAction<{ name: keyof EditVendorBranchState['selectDetails']; value: SelectDetails }>) => {
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

export const { initializeVendorBranchEdit, updateField, loadVendorBranchDetails, updateErrors, toggleInformationModalStatus, loadSelectDetails } = slice.actions;
export default slice.reducer;