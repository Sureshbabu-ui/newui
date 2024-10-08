import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ValidationErrors } from '../../../types/error';
import { ForgotPassword } from '../../../types/login';

export interface ForgotPasswordState {
  credentials: {
    employeecode: string;
  };
  errors: ValidationErrors;
  submitted: boolean;
  response: ForgotPassword;
}

const initialState: ForgotPasswordState = {
  credentials: {
    employeecode: '',
  },
  errors: {},
  submitted: false,
  response: {
    IsCodeGenerated: false,
  },
};

const slice = createSlice({
  name: 'forgotPassword',
  initialState,
  reducers: {
    initializeForgot: () => initialState,
    updateField: (
      state,
      { payload: { name, value } }: PayloadAction<{ name: keyof ForgotPasswordState['credentials']; value: string }>
    ) => {
      state.credentials[name] = value;
    },
    updateErrors: (state, { payload: errors }: PayloadAction<ValidationErrors>) => {
      state.errors = errors;
      state.submitted = false
    },
    updateCode: (state, { payload: data }: PayloadAction<ForgotPassword>) => {
      state.response = data;
    },
    setEmployeeCode: (state, { payload: empcode }: PayloadAction<string>) => {
      state.credentials.employeecode = empcode;
    },
    formSubmitted: (state) => {
      state.submitted = true;
    },
  },
});

export const { initializeForgot, updateField, updateCode, formSubmitted, updateErrors, setEmployeeCode } = slice.actions;

export default slice.reducer;
