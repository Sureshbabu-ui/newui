import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NotificationList, NotificationListResponse, NotificationSelectTitle, NotificationSelectTitleDetails } from '../../../../../types/notificationSetting';

export interface RoleWiseState {
  roleTitles: NotificationSelectTitleDetails[],
  notificationSettings: NotificationList[];
  roleId: number;
  isUpdateDisabled: boolean;
  submitting: boolean;
  displayInformationModal: boolean;
}

const initialState: RoleWiseState = {
  roleTitles: [],
  notificationSettings: [],
  roleId: -1,
  isUpdateDisabled: true,
  submitting: false,
  displayInformationModal: false
};

const slice = createSlice({
  name: 'rolewise',
  initialState,
  reducers: {
    initialize: () => initialState,
    loadRoleTitles: (state, { payload: { NotificationTitles } }: PayloadAction<NotificationSelectTitle>) => {
      state.roleTitles = NotificationTitles.map((RoleTitle) => (RoleTitle));
    },
    loadRoleWiseList: (state, { payload: { NotificationList } }: PayloadAction<NotificationListResponse>) => {
      state.notificationSettings = NotificationList.map((List) => List);
    },
    updateCheckbox: (
      state,
      { payload: { name, value, status } }: PayloadAction<{ name: keyof RoleWiseState['notificationSettings']; value: any, status: boolean }>
    ) => {
      state.notificationSettings.map((item, index) => {
        if (index == value)
          item[name] = status
      })
    },
    updateField: (
      state,
      { payload: { name, value } }: PayloadAction<{ name: keyof RoleWiseState; value: any }>
    ) => {
      state[name] = value as never;
    },
    toggleUpdate: (state) => {
      state.isUpdateDisabled = !state.isUpdateDisabled;
    },
    startSubmitting: (state) => {
      state.submitting = true;
    },
    stopSubmitting: (state) => {
      state.submitting = false;
    },
    toggleInformationModalStatus: (state) => {
      state.displayInformationModal = !state.displayInformationModal;
    }
  },
});

export const { initialize,
  loadRoleTitles,
  loadRoleWiseList,
  toggleUpdate,
  startSubmitting,
  stopSubmitting,
  updateCheckbox,
  updateField,
  toggleInformationModalStatus
} = slice.actions;

export default slice.reducer;