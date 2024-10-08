import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { VendorBankAccountCreation, VendorBankAccountSelectDetails, SelectDetails } from '../../../../../../types/vendorBankAccount';
import { ValidationErrors } from '../../../../../../types/error';

export interface CreateVendorBankAccountState {
  vendorBankAccount: VendorBankAccountCreation;
  errors: ValidationErrors;
  displayInformationModal: boolean;
  selectDetails: VendorBankAccountSelectDetails
}

const initialState: CreateVendorBankAccountState = {
  vendorBankAccount:
  {
    BankId:0,
    AccountNumber: "",
    BankAccountTypeId: 0,
    BankBranchId: 0,
    VendorId: 0,
    VendorBranchId: null
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
  name: 'vendorbankaccountcreate',
  initialState,
  reducers: {
    initializeVendorBankAccountCreate: () => initialState,
    updateField: (
      state,
      { payload: { name, value } }: PayloadAction<{ name: keyof CreateVendorBankAccountState['vendorBankAccount']; value: any }>) => {
      state.vendorBankAccount[name] = value as never;
    },
    loadSelectDetails: (state, { payload: { name, value: { Select } } }: PayloadAction<{ name: keyof CreateVendorBankAccountState['selectDetails']; value: SelectDetails }>) => {
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

export const { initializeVendorBankAccountCreate, updateField, updateErrors, loadSelectDetails, toggleInformationModalStatus } = slice.actions;
export default slice.reducer;