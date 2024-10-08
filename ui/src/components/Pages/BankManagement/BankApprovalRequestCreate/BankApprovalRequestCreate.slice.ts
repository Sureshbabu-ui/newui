import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ValidationErrors } from '../../../../types/error';

export interface BankDetails{
  BankCode: string;
  BankName: string;
}

export interface CreateBankApprovalRequestState {
  bank: BankDetails;
  errors: ValidationErrors;
  submitting: boolean;
  displayInformationModal: boolean;
}

const initialState: CreateBankApprovalRequestState = {
  bank: {
    BankCode:"",
    BankName: ""  
  },
  errors: {},
  submitting: false,
  displayInformationModal: false
};

const slice = createSlice({
  name: 'bankapprovalrequestcreate',
  initialState,
  reducers: {
    initializeBank: () => initialState,
    updateField: (
      state,
      { payload: { name, value } }: PayloadAction<{ name: keyof CreateBankApprovalRequestState['bank']; value: string }>
    ) => {
      state.bank[name] = value;
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

export const { initializeBank, updateField, updateErrors, startSubmitting, toggleInformationModalStatus, stopSubmitting } = slice.actions;

export default slice.reducer;