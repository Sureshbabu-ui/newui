import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ValidationErrors } from '../../../../types/error';

export interface BankEditDetails{
  Id: number;
  BankName: string;
}

export interface BankEditState {
  bank: BankEditDetails;
  errors: ValidationErrors;
  submitting: boolean;
  displayInformationModal: boolean;
}

const initialState: BankEditState = {
  bank: {
    Id:0,
    BankName: ""  
  },
  errors: {},
  submitting: false,
  displayInformationModal: false
};

const slice = createSlice({
  name: 'bankedit',
  initialState,
  reducers: {
    initializeBank: () => initialState,
    updateField: (
      state,
      { payload: { name, value } }: PayloadAction<{ name: keyof BankEditState['bank']; value:any }>
    ) => {
      state.bank[name] = value as never;
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
    loadBankDetails: (state, { payload: { Id ,BankName } }: PayloadAction<BankEditDetails>) => {
      state.bank.Id = Id;
      state.bank.BankName = BankName;
    },
  },
}); 

export const { initializeBank, updateField, updateErrors, startSubmitting, toggleInformationModalStatus, stopSubmitting, loadBankDetails } = slice.actions;

export default slice.reducer;
