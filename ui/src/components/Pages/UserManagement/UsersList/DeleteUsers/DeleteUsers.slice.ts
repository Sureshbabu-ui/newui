import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GenericErrors } from '../../../../../types/error';

export interface UserStatusState {
  userIdList: number[];
  deleteUsers: string;
  confirmString: string;
  errors: GenericErrors;
  submitting: boolean;
  displayInformationModal: boolean;
}

const initialState: UserStatusState = {
  deleteUsers: "",
  userIdList: [],
  confirmString: '',
  errors: {},
  submitting: false,
  displayInformationModal: false,
};

const slice = createSlice({
  name: 'deleteusers',
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
    deleteSingleUser: (state, { payload: Id }: PayloadAction<number>) => {
      state.userIdList.push(Id);
      state.deleteUsers = state.userIdList.join(",");
    },
    setdeleteUsers: (state, { payload: { UserId, Action } }: PayloadAction<{ UserId: number, Action: string }>) => {
      const existingPart = state.userIdList.find(part => part === UserId);
      if (Action == 'remove') {
        if (existingPart) {
          state.userIdList = state.userIdList.filter(item => item != UserId)
        }
      } else if (Action == 'add') {
        state.userIdList.push(UserId);
      }
      state.deleteUsers = state.userIdList.join(",");
    },
  },
});

export const { initializeToggleUserStatus, setdeleteUsers, setConfirmString, updateErrors, deleteSingleUser, startSubmitting, stopSubmitting, toggleInformationModalStatus } = slice.actions;

export default slice.reducer;
