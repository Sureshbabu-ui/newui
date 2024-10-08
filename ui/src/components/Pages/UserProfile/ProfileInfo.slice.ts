import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SelectedProfileDetail } from '../../../types/userprofile';
import { SelectedRoles } from '../../../types/user';
import { AppKeyValue, AppSettingAppKeyValues } from '../../../types/appSetting';

export interface ViewProfileState {
  singleprofile: SelectedProfileDetail;
  roles: SelectedRoles;
  appvalues: AppKeyValue
}

const initialState: ViewProfileState = {
  singleprofile: {
    Id: 0,
    FullName: '',
    Email: '',
    Phone: '',
    CreatedOn: '',
    EmployeeCode: '',
    EngagementType: '',
    Designation: '',
    Department: '',
    Division: '',
    UserCategory: '',
    EngineerGeolocation: "",
    EngineerHomeLocation: "",
    ServiceEngineerCategory: "",
    ServiceEngineerLevel: "",
    ServiceEngineerType: "",
    DesignationCode:"",
    Location:"",
    DocumentUrl:"",
    BusinessUnits: "",
    IsActive:false,
    UserGrade:""
  },
  roles: {
    RoleNames: ''
  },
  appvalues: {
    AppKey: '',
    AppValue: ''
  },
};

const slice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    initializeProfile: () => initialState,
    loadUserProfile: (state, { payload: UserDetails }: PayloadAction<any>) => {
      state.singleprofile = UserDetails
    },
    setSelectedRoles: (state, { payload: Roles }: PayloadAction<any>) => {
      state.roles = Roles;
    },
    loadAppkeyValues: (state, { payload: { AppKeyValues } }: PayloadAction<AppSettingAppKeyValues>) => {
      state.appvalues = AppKeyValues;
    },
  },
});

export const {
  initializeProfile,
  loadUserProfile,
  loadAppkeyValues,
  setSelectedRoles
} = slice.actions;

export default slice.reducer;
