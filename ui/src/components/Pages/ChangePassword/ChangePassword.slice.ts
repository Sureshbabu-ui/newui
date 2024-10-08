import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ValidationErrors } from '../../../types/error';

export interface ForgotPasswordState {
  credentials: {
    PassCode: string;
    ConfirmPassword: string;
  };
  errors: ValidationErrors;
  submitted: boolean; 
}

const initialState: ForgotPasswordState = {
  credentials: {
    PassCode: '',
    ConfirmPassword: '',
  },
  errors: {},
  submitted: false,
};

const slice = createSlice({
  name: 'changePassword',
  initialState,
  reducers: {
    initializePasswordChange: () => initialState,
    updateField: (
      state,
      { payload: { name, value } }: PayloadAction<{ name: keyof ForgotPasswordState['credentials']; value: string }>
    ) => {
      state.credentials[name] = value;
    },
    updateErrors: (state, { payload: errors }: PayloadAction<ValidationErrors>) => {
      state.errors = errors;
    },
    formSubmitted: (state) => {
      state.submitted = true;
    }
  },
});

export const { initializePasswordChange, updateField, formSubmitted, updateErrors } = slice.actions;

export default slice.reducer;
