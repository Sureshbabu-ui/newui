import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ValidationErrors } from '../../../../types/error';
import { None, Option, Some } from '@hqoss/monads';
import { AppSettingDetail, AppSettings } from '../../../../types/appSetting';

export interface AppSettingDetailData {
  appsettings: AppSettingDetail;
}

export interface AppSettingsState {
  appsettings: Option<AppSettingDetailData[]>;
  appEditDetail: AppSettingDetail;
  displayInformationModal: boolean;
  errors: ValidationErrors;
  submitting: boolean;
  isUpdateDisabled: boolean;
  appKey: string;
}

const initialState: AppSettingsState = {
  appsettings: None,
  appEditDetail: {
    Id: 0,
    Appkey: "",
    AppValue: ""
  },
  displayInformationModal: false,
  errors: {},
  submitting: false,
  isUpdateDisabled: true,
  appKey: ""
};

const slice = createSlice({
  name: 'appsetting',
  initialState,
  reducers: {
    initializeAppDetails: () => initialState,
    appSettings: (state, { payload: { AppSettings } }: PayloadAction<AppSettings>) => {
      state.appsettings = Some(AppSettings.map((setting) => ({ appsettings: setting })));
    },
    updateField: (
      state,
      { payload: { name, value } }: PayloadAction<{ name: keyof AppSettingsState['appEditDetail']; value: any }>
    ) => {
      state.appEditDetail[name] = value
    },
    toggleInformationModalStatus: (state) => {
      state.displayInformationModal = !state.displayInformationModal;
    },
    updateErrors: (state, { payload: errors }: PayloadAction<ValidationErrors>) => {
      state.errors = errors;
    }, startSubmitting: (state) => {
      state.submitting = true;
    },
    stopSubmitting: (state) => {
      state.submitting = false;
    },
    toggleUpdate: (state) => {
      state.isUpdateDisabled = !state.isUpdateDisabled;
    },
    toggleAppKey: (state, action) => {
      state.appKey = action.payload.appKey
      state.appEditDetail.Appkey = action.payload.appKey;
      state.appEditDetail.AppValue = action.payload.appValue;
    }
  },
});

export const {
  initializeAppDetails,
  appSettings,
  updateField,
  toggleInformationModalStatus,
  updateErrors,
  startSubmitting,
  stopSubmitting,
  toggleUpdate,
  toggleAppKey
} = slice.actions;

export default slice.reducer;