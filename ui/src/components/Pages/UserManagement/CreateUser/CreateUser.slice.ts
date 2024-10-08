import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ValidationErrors } from '../../../../types/error';
import { UserForCreation, MultipleUserRoles, UserRole, MastersConfiguration, MasterDataItems, SelectDetails, SelectTenantOffice, DesignationEntityDetails, DesignationSelectDetails } from '../../../../types/user';
import { GetDivisions } from '../../../../types/division';
import { ManagersList } from '../../../../types/tenantofficeinfo';
import { AppKeyValue, AppSettingAppKeyValues } from '../../../../types/appSetting';
import { StateDetailsSelect, StatesSelect } from '../../../../types/state';
import { CitiesSelect, CityDetailsSelect } from '../../../../types/city';
import { CountriesSelect, CountryDetailsSelect } from '../../../../types/country';

export interface UsersRoleList {
  role: UserRole;
}
export interface Select {
  value: any,
  label: any
}
export interface Select {
  value: any,
  label: any,
  code?: any
}

export interface selectDetails {
  SelectDetails: Select[];
}
export interface CreateUserState {
  masterDataList: MasterDataItems;
  TenantOffices: SelectTenantOffice[],
  entitiesList: MastersConfiguration;
  roles: UsersRoleList[];
  user: UserForCreation;
  Customer: Select[],
  selectedUserRoles: number[];
  errors: ValidationErrors;
  signingUp: boolean;
  submitting: boolean;
  appvalues: AppKeyValue
  displayInformationModal: boolean;
  States: StateDetailsSelect[],
  Cities: CityDetailsSelect[],
  Countries: CountryDetailsSelect[]
  ContractNumbers: Select[];
  CustomerSiteNames: Select[];
}

const initialState: CreateUserState = {
  entitiesList: {
    Divison: [],
    Designation: [],
    Managers: [],
  },
  Cities: [],
  States: [],
  Countries: [],
  TenantOffices: [],
  masterDataList: {
    Department: [],
    EngagementType: [],
    UserCategory: [],
    Gender: [],
    EngineerCategory: [],
    EngineerLevel: [],
    EngineerType: [],
    BusinessUnit: [],
    Grade:[]
  },
  user: {
    FullName: '',
    Email: '',
    Phone: '',
    UserCategoryId: "53",
    DivisionId: 0,
    EmployeeCode: '',
    DepartmentId: '',
    DesignationId: 0,
    TenantOfficeId: 0,
    ReportingManagerId: 0,
    EngagementTypeId: '',
    GenderId: 0,
    UserRoles: '',
    EngineerCategory: null,
    EngineerGeolocation: "",
    EngineerAddress: "",
    EngineerCityId: null,
    EngineerCountryId: "",
    EngineerPincode: "",
    EngineerStateId: null,
    EngineerLevel: null,
    EngineerType: null,
    DocumentFile: null,
    DocumentSize: 0,
    IsConcurrentLoginAllowed: false,
    BusinessUnits: '',
    CustomerInfoId: null,
    ContractId: null,
    CustomerSiteId: null,
    CustomerAgreedAmount: null,
    StartDate: null,
    EndDate: null,
    BudgetedAmount: null,
    IsTemporaryUser: false,
    UserExpiryDate: null,
    UserGradeId:null
  },
  appvalues: {
    AppKey: '',
    AppValue: ''
  },
  roles: [],
  selectedUserRoles: [],
  errors: {},
  signingUp: false,
  submitting: false,
  displayInformationModal: false,
  Customer: [],
  ContractNumbers: [],
  CustomerSiteNames: [],
};

const slice = createSlice({
  name: 'usercreate',
  initialState,
  reducers: {
    initializeUser: () => initialState,
    loadMasterData: (state, { payload: { name, value: { Select } } }: PayloadAction<{ name: keyof CreateUserState['masterDataList']; value: SelectDetails }>) => {
      state.masterDataList[name] = Select.map((masterData) => (masterData))
    },
    updateField: (
      state,
      { payload: { name, value } }: PayloadAction<{ name: keyof CreateUserState['user']; value: any }>) => {
      if (name == "DesignationId") {
        state.user.EngineerCategory = ""
        state.user.EngineerGeolocation = ""
        state.user.EngineerAddress = ""
        state.user.EngineerStateId = null
        state.user.EngineerCityId = null
        state.user.EngineerPincode = ""
        state.user.EngineerLevel = ""
        state.user.EngineerType = ""
      }
      state.user[name] = value as never;
    },
    loadCountries: (state, { payload: { Countries } }: PayloadAction<CountriesSelect>) => {
      state.Countries = Countries.map((Countries) => Countries);
      state.user.EngineerCityId = null,
        state.user.EngineerStateId = null
    },
    loadStates: (state, { payload: { States } }: PayloadAction<StatesSelect>) => {
      state.States = States.map((States) => States);
    },
    loadCities: (state, { payload: { Cities } }: PayloadAction<CitiesSelect>) => {
      state.Cities = Cities.map((Cities) => Cities);
    },
    userCategorySelect: (
      state,
      { payload: { value } }: PayloadAction<{ name: keyof CreateUserState['user']['UserCategoryId']; value: string }>) => {
      state.user.UserCategoryId = value;
    },
    loadUsersRoles: (state, { payload: { Roles } }: PayloadAction<MultipleUserRoles>) => {
      state.roles = Roles.map((role) => ({ role }));
    },
    loadUserDesignation: (state, { payload: { Select } }: PayloadAction<DesignationSelectDetails>) => {
      state.entitiesList.Designation = Select.map((Designation) => (Designation));
    },
    loadDivisions: (state, { payload: { Divisions } }: PayloadAction<GetDivisions>) => {
      state.entitiesList.Divison = Divisions.map((Division) => Division);
    },
    loadTenantOffices: (state, { payload: { Select } }: PayloadAction<SelectDetails>) => {
      state.TenantOffices = Select.map((TenantOfficeInfo) => TenantOfficeInfo);
    },
    loadReportingManagers: (state, { payload: { Managers } }: PayloadAction<ManagersList>) => {
      state.entitiesList.Managers = Managers.map((Managers) => Managers);
    },
    userRoleSelected: (
      state, { payload: roleId }: PayloadAction<any>) => {
      if (state.selectedUserRoles.includes(roleId) == false) {
        state.selectedUserRoles.push(roleId);
      }
      state.user.UserRoles = state.selectedUserRoles.join(",");
    },
    userRoleUnSelected: (state, { payload: roleId }: PayloadAction<any>) => {
      var index = state.selectedUserRoles.indexOf(roleId);
      if (index !== -1) {
        state.selectedUserRoles.splice(index, 1);
      }
      state.user.UserRoles = state.selectedUserRoles.join(",");
    },
    loadAppkeyValues: (state, { payload: { AppKeyValues } }: PayloadAction<AppSettingAppKeyValues>) => {
      state.appvalues = AppKeyValues;
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
  initializeUser, loadMasterData,
  loadUserDesignation, loadTenantOffices,
  updateField, loadUsersRoles,
  loadDivisions, loadAppkeyValues,
  userCategorySelect, userRoleSelected,
  userRoleUnSelected, loadReportingManagers,
  updateErrors, startSubmitting,
  toggleInformationModalStatus, stopSubmitting,
  loadCountries, loadCities, loadStates,loadCustomers,loadContractNumbers,loadCustomerSites
} = slice.actions;

export default slice.reducer;
