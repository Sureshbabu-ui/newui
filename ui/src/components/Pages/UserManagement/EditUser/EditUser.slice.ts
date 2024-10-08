import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ValidationErrors } from '../../../../types/error';
import {
  DesignationSelectDetails,
  MasterDataItems,
  MastersConfiguration,
  MultipleUserRoles,
  SelectDetails,
  SelectTenantOffice,
  UserEdit,
  UserRole,
} from '../../../../types/user';
import { GetDivisions } from '../../../../types/division';
import { ManagersList } from '../../../../types/tenantofficeinfo';
import { AppKeyValue, AppSettingAppKeyValues } from '../../../../types/appSetting';
import { StateDetailsSelect, StatesSelect } from '../../../../types/state';
import { CitiesSelect, CityDetailsSelect } from '../../../../types/city';
import { CountriesSelect, CountryDetailsSelect } from '../../../../types/country';

export interface UsersRoleList {
  role: UserRole;
}

export interface UpdatedRoles {
  UserRoleAssigned: number[];
  UserRoleRevoked: number[];
}
export interface Select {
  value: any;
  label: any;
}
export interface Select {
  value: any;
  label: any;
  code?: any;
}

export interface selectDetails {
  SelectDetails: Select[];
}

export interface EditUserState {
  entitiesList: MastersConfiguration;
  masterDataList: MasterDataItems;
  TenantOffices: SelectTenantOffice[];
  user: UserEdit;
  updatedRoles: UpdatedRoles;
  roles: UsersRoleList[];
  errors: ValidationErrors;
  signingUp: boolean;
  submitting: boolean;
  displayInformationModal: boolean;
  appvalues: AppKeyValue;
  States: StateDetailsSelect[];
  Cities: CityDetailsSelect[];
  Countries: CountryDetailsSelect[];
  selectedRoles: number[];
  Customer: Select[];
  ContractNumbers: Select[];
  CustomerSiteNames: Select[];
}

const initialState: EditUserState = {
  user: {
    UserId: 0,
    FullName: '',
    EmployeeCode: '',
    Email: '',
    Phone: '',
    DivisionId: 0,
    DepartmentId: '',
    DesignationId: 0,
    TenantOfficeId: 0,
    ReportingManagerId: 0,
    EngagementTypeId: '',
    GenderId: 0,
    UserCategoryId: 0,
    EngineerCategory: null,
    EngineerGeolocation: '',
    EngineerAddress: '',
    EngineerCityId: null,
    EngineerCountryId: '',
    EngineerPincode: '',
    EngineerStateId: null,
    EngineerLevel: null,
    EngineerType: null,
    IsConcurrentLoginAllowed: false,
    DocumentSize: 0,
    DocumentUrl: '',
    DocumentFile: null,
    BusinessUnits: '',
    BusinessUnitsRevoked: '',
    UserRoles: '',
    UserRoleRevoked: '',
    UserRoleAssigned: '',
    BudgetedAmount: '',
    CustomerInfoId: null,
    ContractId: null,
    CustomerSiteId: null,
    CustomerAgreedAmount: null,
    StartDate: null,
    EndDate: null,
    UserGradeId: null,
  },
  selectedRoles: [],
  Cities: [],
  States: [],
  Countries: [],
  TenantOffices: [],
  entitiesList: {
    Divison: [],
    Designation: [],
    Managers: [],
  },
  appvalues: {
    AppKey: '',
    AppValue: '',
  },
  masterDataList: {
    Department: [],
    EngagementType: [],
    UserCategory: [],
    Gender: [],
    EngineerCategory: [],
    EngineerLevel: [],
    EngineerType: [],
    BusinessUnit: [],
    Grade: [],
  },
  roles: [],
  updatedRoles: {
    UserRoleAssigned: [],
    UserRoleRevoked: [],
  },
  errors: {},
  signingUp: false,
  submitting: false,
  displayInformationModal: false,
  Customer: [],
  ContractNumbers: [],
  CustomerSiteNames: [],
};

const slice = createSlice({
  name: 'useredit',
  initialState,
  reducers: {
    initializeUser: () => initialState,
    updateField: (
      state,
      { payload: { name, value } }: PayloadAction<{ name: keyof EditUserState['user']; value: any }>
    ) => {
      state.user[name] = value as never;
      if (name == 'DesignationId') {
        state.user.EngineerCategory = null;
        state.user.EngineerGeolocation = '';
        state.user.EngineerAddress = '';
        state.user.EngineerStateId = '';
        state.user.EngineerCityId = '';
        state.user.EngineerPincode = '';
        state.user.EngineerLevel = null;
        state.user.EngineerType = null;
      }
    },
    userRoleAssigned: (state, { payload: roleId }: PayloadAction<number>) => {
      const assignedRole = state.updatedRoles.UserRoleAssigned.find((item: number) => item === roleId);
      if (!assignedRole) {
        state.updatedRoles.UserRoleAssigned.push(roleId);
      }
      state.user.UserRoles = state.updatedRoles.UserRoleAssigned.join(',');
    },
    userRoleRevoked: (state, { payload: roleId }: PayloadAction<number>) => {
      const isAssigned = state.selectedRoles.includes(roleId);
      if (isAssigned) {
        if (!state.updatedRoles.UserRoleRevoked.includes(roleId)) {
          state.updatedRoles.UserRoleRevoked.push(roleId);
        }
      }
      state.updatedRoles.UserRoleAssigned = state.updatedRoles.UserRoleAssigned.filter((item) => item != roleId);
      state.user.UserRoles = state.updatedRoles.UserRoleAssigned.join(',');
      state.user.UserRoleRevoked = state.updatedRoles.UserRoleRevoked.join(',');
    },
    loadMasterData: (
      state,
      {
        payload: {
          name,
          value: { Select },
        },
      }: PayloadAction<{ name: keyof EditUserState['masterDataList']; value: SelectDetails }>
    ) => {
      state.masterDataList[name] = Select.map((masterData) => masterData);
    },
    userCategorySelect: (
      state,
      { payload: { value } }: PayloadAction<{ name: keyof EditUserState['user']['UserCategoryId']; value: number }>
    ) => {
      state.user.UserCategoryId = value;
    },
    loadUserDesignation: (state, { payload: { Select } }: PayloadAction<DesignationSelectDetails>) => {
      state.entitiesList.Designation = Select.map((Designation) => Designation);
    },
    loadDivisions: (state, { payload: { Divisions } }: PayloadAction<GetDivisions>) => {
      state.entitiesList.Divison = Divisions.map((Division) => Division);
    },
    loadCountries: (state, { payload: { Countries } }: PayloadAction<CountriesSelect>) => {
      state.Countries = Countries.map((Countries) => Countries);
    },
    loadStates: (state, { payload: { States } }: PayloadAction<StatesSelect>) => {
      state.States = States.map((States) => States);
    },
    loadCities: (state, { payload: { Cities } }: PayloadAction<CitiesSelect>) => {
      state.Cities = Cities.map((Cities) => Cities);
    },
    loadTenantOffices: (state, { payload: { Select } }: PayloadAction<SelectDetails>) => {
      state.TenantOffices = Select.map((TenantOfficeInfo) => TenantOfficeInfo);
    },
    loadReportingManagers: (state, { payload: { Managers } }: PayloadAction<ManagersList>) => {
      state.entitiesList.Managers = Managers.map((Managers) => Managers);
    },
    loadUsersRoles: (state, { payload: { Roles } }: PayloadAction<MultipleUserRoles>) => {
      state.roles = Roles.map((role) => ({ role }));
    },
    setUser: (state, { payload: userDeails }: PayloadAction<any>) => {
      state.user = userDeails;
    },
    loadAppkeyValues: (state, { payload: { AppKeyValues } }: PayloadAction<AppSettingAppKeyValues>) => {
      state.appvalues = AppKeyValues;
    },
    setUserRole: (state, { payload: userRole }: PayloadAction<any>) => {
      state.user.UserRoles = userRole;
      const roleArray: string[] = userRole.split(',');
      state.selectedRoles = userRole.split(',');
      state.updatedRoles.UserRoleAssigned = userRole.split(',');
    },
    updateErrors: (state, { payload: errors }: PayloadAction<ValidationErrors>) => {
      state.errors = errors;
      state.signingUp = false;
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
    loadCustomers: (state, { payload: { Select } }: PayloadAction<SelectDetails>) => {
      state.Customer = Select.map((Customers) => Customers);
    },
    loadContractNumbers: (state, { payload: { SelectDetails } }: PayloadAction<selectDetails>) => {
      state.ContractNumbers = SelectDetails.map((ContractNumbers) => ContractNumbers);
    },
    loadCustomerSites: (state, { payload: { SelectDetails } }: PayloadAction<selectDetails>) => {
      state.CustomerSiteNames = SelectDetails.map((CustomerSiteNames) => CustomerSiteNames);
    },
  },
});

export const {
  initializeUser,
  updateField,
  loadMasterData,
  setUser,
  updateErrors,
  startSubmitting,
  loadAppkeyValues,
  toggleInformationModalStatus,
  stopSubmitting,
  loadUsersRoles,
  userCategorySelect,
  userRoleAssigned,
  userRoleRevoked,
  setUserRole,
  loadUserDesignation,
  loadTenantOffices,
  loadReportingManagers,
  loadDivisions,
  loadCities,
  loadCountries,
  loadStates,
  loadContractNumbers,
  loadCustomerSites,
  loadCustomers,
} = slice.actions;

export default slice.reducer;
