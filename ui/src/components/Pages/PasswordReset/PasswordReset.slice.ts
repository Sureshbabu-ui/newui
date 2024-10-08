import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GenericErrors } from '../../../types/error';
import {  ValidationErrors } from '../../../types/error';

export interface PasswordChangeState {
  credential: {
    OldPassword: string;
    NewPassword: string;
    ConfirmPassword: string;
  };
  errors: ValidationErrors;
  submitted: boolean;
  displayInformationModal: boolean;
}

const initialState: PasswordChangeState = {
  credential: {
    OldPassword: '',
    NewPassword: '',
    ConfirmPassword: '',
  },
  errors: {},
  submitted: false,
  displayInformationModal: false,
};

const slice = createSlice({
  name: 'passwordReset',
  initialState,
  reducers: {
    initializePasswordReset: () => initialState,
    updateField: (
      state,
      { payload: { name, value } }: PayloadAction<{ name: keyof PasswordChangeState['credential']; value: string }>
    ) => {
      state.credential[name] = value;
    },
    updateErrors: (state, { payload: errors }: PayloadAction<ValidationErrors>) => {
      state.errors = errors;
      state.submitted = false;
    },
    formSubmitted: (state) => {
      state.submitted = true;
    },
  },
});

export const { initializePasswordReset, updateField, formSubmitted, updateErrors } = slice.actions;

export default slice.reducer;
