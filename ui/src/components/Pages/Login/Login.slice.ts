import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ValidationErrors } from '../../../types/error';

export interface LoginState {
  credentials: {
    EmployeeCode: string;
    Passcode: string;
  };
  errors: ValidationErrors;
  loginIn: boolean;
  passwordExpired: boolean;
}

const initialState: LoginState = {
  credentials: {
    EmployeeCode: '',
    Passcode: '',
  },
  errors: {},
  loginIn: false,
  passwordExpired: false
};

const slice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    initializeLogin: () => initialState,
    updateField: (
      state,
      { payload: { name, value } }: PayloadAction<{ name: keyof LoginState['credentials']; value: string }>
    ) => {
      state.credentials[name] = value;
    },
    updateErrors: (state, { payload: errors }: PayloadAction<ValidationErrors>) => {
      state.errors = errors;
      state.loginIn = false;
    },
    startLoginIn: (state) => {
      state.loginIn = true;
    },
    setPasswordExpiry: (state, { payload: isexpired }: PayloadAction<any>) => {
      state.passwordExpired = isexpired      
    }
  },
});

export const { initializeLogin, updateField, updateErrors, startLoginIn, setPasswordExpiry } = slice.actions;

export default slice.reducer;
