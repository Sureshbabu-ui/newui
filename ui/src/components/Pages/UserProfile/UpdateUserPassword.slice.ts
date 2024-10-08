import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { None, Option, Some } from '@hqoss/monads';
import { SelectedProfileStatus, UserStatus } from '../../../types/userprofile';
import { ValidationErrors } from '../../../types/error';

export interface UserProfileStatus {
  SelectedProfileItem: UserStatus;
}

export interface ViewProfileState {
  IsActive: Option<readonly UserProfileStatus[]>;
}

export interface UserPasswordState {
  credentials: {
    NewPasscode: string;
    ConfirmPasscode: string;
    IsActive: Boolean;
  };
  errors: ValidationErrors;
  displayInformationModal: boolean;
  IsActive: Option<readonly UserProfileStatus[]>
}

const initialState: UserPasswordState = {
  credentials: {
    NewPasscode: '',
    ConfirmPasscode: '',
    IsActive: false,
  },
  errors: {},
  displayInformationModal: false,
  IsActive: None
};

const slice = createSlice({
  name: 'changeuserPassword',
  initialState,
  reducers: {
    initializeUserPasswordUpdate: () => initialState,
    updateField: (
      state,
      { payload: { name, value } }: PayloadAction<{ name: keyof UserPasswordState['credentials']; value: any }>
    ) => {
      state.credentials[name] = value;
    },
    updateErrors: (state, { payload: errors }: PayloadAction<ValidationErrors>) => {
      state.errors = errors;
    },
    toggleInformationModalStatus: (state) => {
      state.displayInformationModal = !state.displayInformationModal;
    },
    setUserStatus: (state, { payload: status }) => {
      state.credentials.IsActive = status;
    },
    loadUserStatus: (state, { payload: { UserStatus } }: PayloadAction<SelectedProfileStatus>) => {
      state.IsActive = Some(UserStatus.map((SelectedProfileItem) => ({ SelectedProfileItem })));
    },
  },
});

export const { initializeUserPasswordUpdate, loadUserStatus, setUserStatus, updateField, updateErrors, toggleInformationModalStatus } = slice.actions;

export default slice.reducer;
