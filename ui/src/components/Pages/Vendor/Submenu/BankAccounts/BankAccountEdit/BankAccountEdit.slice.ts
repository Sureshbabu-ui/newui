import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { VendorBankAccountEdit, VendorBankAccountEditDetails, VendorBankAccountSelectDetails, SelectDetails } from '../../../../../../types/vendorBankAccount';
import { ValidationErrors } from '../../../../../../types/error';

export interface EditVendorBankAccountState {
  vendorBankAccount: VendorBankAccountEdit;
  errors: ValidationErrors;
  displayInformationModal: boolean;
  selectDetails: VendorBankAccountSelectDetails
}

const initialState: EditVendorBankAccountState = {
  vendorBankAccount: {
    Id: 0,
    BankId:0,
    AccountNumber: "",
    BankAccountTypeId: 0,
    BankBranchId: 0,
    IsActive: false,
    VendorBranchId: 0
  },
  selectDetails: {
    BankAccountTypes: [],
    BankBranches: [],
    VendorBranches: [],
    Banks:[]
  },
  errors: {},
  displayInformationModal: false,
};

const slice = createSlice({
  name: 'vendorbankaccountedit',
  initialState,
  reducers: {
    initializeVendorBankAccountEdit: () => initialState,
    updateField: (
      state,
      { payload: { name, value } }: PayloadAction<{ name: keyof EditVendorBankAccountState['vendorBankAccount']; value: any }>) => {
      state.vendorBankAccount[name] = value as never;
    },
    loadVendorBankAccountDetails: (state, { payload: { VendorBankAccountDetails } }: PayloadAction<VendorBankAccountEditDetails>) => {
      state.vendorBankAccount = VendorBankAccountDetails;
    },
    loadSelectDetails: (state, { payload: { name, value: { Select } } }: PayloadAction<{ name: keyof EditVendorBankAccountState['selectDetails']; value: SelectDetails }>) => {
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

export const { initializeVendorBankAccountEdit, updateField, loadVendorBankAccountDetails, updateErrors, toggleInformationModalStatus, loadSelectDetails } = slice.actions;
export default slice.reducer;