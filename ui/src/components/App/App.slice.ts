import { None, Option, Some } from '@hqoss/monads';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types/login';
import { ValidationErrors } from '../../types/error';

export interface AppState {
  user: Option<User>;
  loading: boolean;
  permissionString:string|null;
  isUserLoggedIn: boolean;
  isUserAboutToLogout: boolean;
  validationErrors:ValidationErrors,
  apiErrorCode: string
}

const initialState: AppState = {
  user: None,
  permissionString:"",
  loading: true,
  isUserLoggedIn: false,
  isUserAboutToLogout: false,
  validationErrors: {},
  apiErrorCode: ""
};

const slice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    initializeApp: () => {
      initialState;
    },
    loadUser: (state, { payload: user }: PayloadAction<User>) => {
      state.user = Some(user);
      state.loading = false;
      state.permissionString=state.user.unwrap().user[0].Permissions
    },
    logout: (state) => {
      state.user = None;
    },
    endLoad: (state) => {
      state.loading = false; 
    },
    setUserLoggedInStatus: (state) => {
      state.isUserLoggedIn = true;
    },
    updateUserLogoutStatus: (state) => {
      state.isUserAboutToLogout = !state.isUserAboutToLogout;
    },
    updateValidationErrors: (state, { payload: errors }: PayloadAction<{ [key: string]: string }>) => {
      state.validationErrors = errors
    },
    updateApiErrorStatusCode: (state, { payload: errorCode }: PayloadAction<string>) => {
      state.apiErrorCode = errorCode
    }
  },
});

export const { loadUser,
  logout,
  endLoad,
  initializeApp,
  setUserLoggedInStatus,
  updateUserLogoutStatus,
  updateValidationErrors,
  updateApiErrorStatusCode
} = slice.actions;

export default slice.reducer;
