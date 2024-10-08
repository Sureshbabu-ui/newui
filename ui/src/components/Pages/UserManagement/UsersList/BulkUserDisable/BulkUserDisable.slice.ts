import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GenericErrors } from '../../../../../types/error';

export interface UserStatusState {
  userIdList: number[];
  disableUsers: string;
  confirmString: string;
  errors: GenericErrors;
  submitting: boolean;
  displayInformationModal: boolean;
}

const initialState: UserStatusState = {
  disableUsers: "",
  userIdList: [],
  confirmString: '',
  errors: {},
  submitting: false,
  displayInformationModal: false,
};

const slice = createSlice({
  name: 'disableusers',
  initialState,
  reducers: {
    initializeToggleUserStatus: () => initialState,
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
    disableSingleUser: (state, { payload: Id }: PayloadAction<number>) => {
      state.userIdList.push(Id);
      state.disableUsers = state.userIdList.join(",");
    },
    setdisableUsers: (state, { payload: { UserId, Action } }: PayloadAction<{ UserId: number, Action: string }>) => {
      const existingPart = state.userIdList.find(part => part === UserId);
      if (Action == 'remove') {
        if (existingPart) {
          state.userIdList = state.userIdList.filter(item => item != UserId)
        }
      } else if (Action == 'add') {
        state.userIdList.push(UserId);
      }
      state.disableUsers = state.userIdList.join(",");
    },
  },
});

export const { initializeToggleUserStatus, setdisableUsers, setConfirmString, updateErrors, disableSingleUser, startSubmitting, stopSubmitting, toggleInformationModalStatus } = slice.actions;

export default slice.reducer;
