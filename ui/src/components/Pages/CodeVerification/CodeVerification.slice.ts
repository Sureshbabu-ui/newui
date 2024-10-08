import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ValidationErrors } from '../../../types/error';
import { VerifyCode } from '../../../types/login';

export interface VerifyCodeState {
  credentials: {
    Code: string;
  };
  errors: ValidationErrors;
  submitted: boolean;
}

const initialState: VerifyCodeState = {
  credentials: {
    Code: '',
  },
  errors: {},
  submitted: false,
};

const slice = createSlice({
  name: 'codeverification',
  initialState,
  reducers: {
    initializeVerify: () => initialState,
    updateField: (
      state,
      { payload: { name, value } }: PayloadAction<{ name: keyof VerifyCodeState['credentials']; value: string }>
    ) => {
      state.credentials[name] = value;
    },
    updateErrors: (state, { payload: errors }: PayloadAction<ValidationErrors>) => {
      state.errors = errors;
    },
    updateCodeForPswdReset: (state, { payload: code }: PayloadAction<any>) => {//password epired
      state.credentials.Code = code;
    },
    formSubmitted: (state) => {
      state.submitted = true;
    },
  },
});

export const { initializeVerify, updateField, updateErrors, updateCodeForPswdReset, formSubmitted } = slice.actions;

export default slice.reducer;
