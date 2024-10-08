import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GenericErrors } from '../../../types/error';
import { UserStatusTemplate } from '../../../types/user';

export interface UserStatusState {
  user: UserStatusTemplate;
  confirmString: string;
  errors: GenericErrors;
  submitting: boolean;
  displayInformationModal: boolean;
}

const initialState: UserStatusState = {
  user: {
    Id: 0,
    FullName: '',
    Email: '',
    Phone: '',
    IsDeleted: false,
    UserInfoStatus: false
  },
  confirmString: '',
  errors: {},
  submitting: false,
  displayInformationModal: false,
};

const slice = createSlice({
  name: 'userstatus',
  initialState,
  reducers: {
    initializeToggleUserStatus: () => initialState,
    setUserDetails: (state, { payload: user }: PayloadAction<UserStatusTemplate>) => {
      state.user = user;
    },
    setConfirmString: (state, { payload: userEnteredConfirmString }) => {
      state.confirmString = userEnteredConfirmString;
    },
    updateErrors: (state, { payload: errors }: PayloadAction<GenericErrors>) => {
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
    selectUserDetails: (state, { payload: { Id, FullName, Email, Phone, UserInfoStatus, IsDeleted } }: PayloadAction<UserStatusTemplate>) => {
      state.user.Email = Email;
      state.user.Id = Id;
      state.user.FullName = FullName;
      state.user.Phone = Phone;
      state.user.UserInfoStatus = UserInfoStatus;
      state.user.IsDeleted = IsDeleted;
    },
  },
});

export const { initializeToggleUserStatus, selectUserDetails, setUserDetails, setConfirmString, updateErrors, startSubmitting, stopSubmitting, toggleInformationModalStatus } = slice.actions;

export default slice.reducer;
