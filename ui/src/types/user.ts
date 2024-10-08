import axios from 'axios';
import { array, number, Decoder, nullable, object, string, boolean } from 'decoders';
import { loadUser } from '../components/App/App.slice';
import { getUserProfile } from '../services/login';
import { store } from '../state/store';
import { UserLogin } from './login';
import { UpdatedRoles } from '../components/Pages/UserManagement/EditUser/EditUser.slice';
import { ApprovalRequestReviewListDetail, approvalRequestReviewListDetailDecoder } from './pendingApproval';
import { getLookupList } from '../services/lookup';

export interface UsersFilters {
  limit?: number;
  offset?: number;
}

export interface FeedFilters {
  limit?: number;
  offset?: number;
}

export interface PublicUser {
  fullName: string;
  phone: string;
  image: string | null;
}

export interface User extends PublicUser {
  email: string;
  token: string;
}

export const userDecoder: Decoder<User> = object({
  email: string,
  token: string,
  phone: string,
  fullName: string,
  image: nullable(string),
});

export interface UserSettings extends PublicUser {
  email: string;
  password: string | null;
  phone: string;
}

export interface RegisteredUser {
  Id: number;
  FullName: string;
  EmployeeCode: string;
  Department: String;
  Email: string;
  Phone: string;
  Designation: string;
  IsDeleted: Boolean;
  Gender: string;
  Location: string;
  UserInfoStatus: Boolean;
  UserLoginStatus: Boolean;
  UserCategory: string;
  DocumentUrl:string| null;
}

export const registeredUserDecoder: Decoder<RegisteredUser> = object({
  Id: number,
  FullName: string,
  EmployeeCode: string,
  Department: string,
  Designation: string,
  Gender: string,
  Location: string,
  Email: string,
  Phone: string,
  UserInfoStatus: boolean,
  UserLoginStatus: boolean,
  IsDeleted: boolean,
  UserCategory: string,
  DocumentUrl:nullable(string)
});

export interface MultipleRegisteredUsers {
  users: RegisteredUser[];
  totalRows: number;
  PerPage: number;
}

export const multipleRegisteredUsersDecoder: Decoder<MultipleRegisteredUsers> = object({
  users: array(registeredUserDecoder),
  totalRows: number,
  PerPage: number
});


export interface MultipleUsersCount {
  totalRows: number;
}
export const multipleUsersCountDecoder: Decoder<MultipleUsersCount> = object({
  totalRows: number
});
export interface RoleUserDetails {
  Id: number;
  FullName: string;
}

export const roleusersDetailsDecoder: Decoder<RoleUserDetails> = object({
  Id: number,
  FullName: string,
});


export interface RoleUserList {
  Roleusers: RoleUserDetails[];
}

export const roleuserDecoder: Decoder<RoleUserList> = object({
  Roleusers: array(roleusersDetailsDecoder),
});


export interface LoginHistory {
  ClientInfo: string;
  CreatedOn: string;
  UserId: number;
  LoggedOutOn: null | string;
}

export const loginHistoryDecoder: Decoder<LoginHistory> = object({
  ClientInfo: string,
  CreatedOn: string,
  UserId: number,
  LoggedOutOn: nullable(string)
});

export interface MultipleLoginHistory {
  history: LoginHistory[];
}

export const multipleLoginHistoryDecoder: Decoder<MultipleLoginHistory> = object({
  history: array(loginHistoryDecoder)
});

interface Select {
  value: any,
  label: any,
  Code?: any,
}

export interface SelectDetails {
  Select: Select[]
}

export interface MasterDataItems {
  EngagementType: Select[],
  Department: Select[],
  UserCategory: Select[],
  Gender: Select[],
  EngineerLevel: Select[],
  EngineerCategory: Select[],
  EngineerType: Select[],
  BusinessUnit: Select[],
  Grade: Select[]
}

export interface UserRole {
  Id: number;
  RoleName: string;
}

export const userRoleDecoder: Decoder<UserRole> = object({
  Id: number,
  RoleName: string
});

export interface MultipleUserRoles {
  Roles: UserRole[];
}

export const multipleUserRolesDecoder: Decoder<MultipleUserRoles> = object({
  Roles: array(userRoleDecoder),
});

export interface UserForCreation {
  FullName: string;
  Email: string;
  Phone: string;
  UserCategoryId: string;
  DivisionId: number;
  EmployeeCode: string;
  DepartmentId: string;
  DesignationId: number;
  TenantOfficeId: number | null;
  ReportingManagerId: number | null;
  EngagementTypeId: string;
  GenderId: number;
  UserRoles: string;
  EngineerLevel: string | null;
  EngineerCategory: string | null;
  EngineerType: string | null;
  EngineerAddress: string;
  EngineerCityId: number | null;
  EngineerCountryId: string | null;
  EngineerStateId: number | null;
  EngineerPincode: string;
  EngineerGeolocation: string;
  DocumentSize: number;
  DocumentFile: File | null;
  IsConcurrentLoginAllowed: boolean;
  IsTemporaryUser: boolean;
  UserExpiryDate: string | null;
  BusinessUnits: string;
  CustomerInfoId: number | null | string;
  ContractId: number | null | string;
  CustomerSiteId: number | null | string;
  CustomerAgreedAmount: number | null | string;
  StartDate: number | null | string;
  EndDate: number | null | string;
  BudgetedAmount: number | null | string;
  UserGradeId:number|null;
}

export interface UserEdit {
  UserId: number | string;
  FullName: string | number;
  EmployeeCode: string;
  Email: string;
  Phone: string | number;
  UserCategoryId: number | string;
  DivisionId: string | number;
  DepartmentId: string | number;
  DesignationId: string | number;
  TenantOfficeId: string | number;
  ReportingManagerId: string | number | null;
  EngagementTypeId: string | number;
  GenderId: string | number;
  UserRoles: string;
  EngineerLevel: string | null;
  EngineerCategory: string | null;
  EngineerType: string | null;
  EngineerAddress: string | null;
  EngineerCityId: string | null;
  EngineerCountryId: string | null;
  EngineerStateId: string | null;
  EngineerPincode: string | null;
  EngineerGeolocation: string | null;
  IsConcurrentLoginAllowed: boolean;
  DocumentUrl: string;
  DocumentSize: number;
  DocumentFile: string | null;
  BusinessUnits: string | null;
  BusinessUnitsRevoked: string | null;
  UserRoleRevoked: string;
  UserRoleAssigned: string;
  CustomerInfoId: number | null | string;
  ContractId: number | null | string;
  CustomerSiteId: number | null | string;
  CustomerAgreedAmount: number | null | string;
  StartDate: null | string;
  EndDate: null | string;
  BudgetedAmount: number | null | string;
  UserGradeId:null|number;
}

export const userEditsDecoder: Decoder<UserEdit> = object({
  UserId: number,
  FullName: string,
  Email: string,
  Phone: string,
  UserCategoryId: number,
  DivisionId: number,
  DepartmentId: number,
  DesignationId: number,
  TenantOfficeId: number,
  ReportingManagerId: nullable(number),
  EngagementTypeId: number,
  GenderId: number,
  UserRoles: string,
  EngineerLevel: nullable(string),
  EngineerCategory: nullable(string),
  EngineerType: nullable(string),
  EngineerAddress: nullable(string),
  EngineerCityId: nullable(string),
  EngineerCountryId: nullable(string),
  EngineerStateId: nullable(string),
  EngineerPincode: nullable(string),
  EngineerGeolocation: nullable(string),
  IsConcurrentLoginAllowed: boolean,
  BusinessUnits: nullable(string),
  BusinessUnitsRevoked: nullable(string),
  CustomerInfoId: nullable(number),
  ContractId: nullable(number),
  CustomerSiteId: nullable(number),
  CustomerAgreedAmount: nullable(string),
  StartDate: nullable(string),
  EndDate: nullable(string),
  BudgetedAmount: nullable(string),
  UserRoleRevoked: string,
  UserRoleAssigned: string,
  DocumentSize: number,
  DocumentFile: string,
  DocumentUrl: string,
  EmployeeCode: string,
  UserGradeId:nullable(number)
});

export interface UserEditTemplate {
  UserId: number | string;
  FullName: string | number;
  Email: string;
  Phone: string | number;
  UserCategoryId: number | string;
  UserRoles: string;
}

export const userEditTemplateDecoder: Decoder<UserEditTemplate> = object({
  UserId: number,
  FullName: string,
  Email: string,
  Phone: string,
  UserCategoryId: number,
  UserRoles: string
});

export interface UserStatusTemplate {
  Id: number | string;
  FullName: string;
  Email: string;
  Phone: string;
  IsDeleted: Boolean;
  UserInfoStatus: Boolean;
}

export interface UserEditResponse {
  isUpdated: Boolean;
}

export const userEditDecoder: Decoder<UserEditResponse> = object({
  isUpdated: boolean,
});

export interface EntitiesDetails {
  Id: number;
  Name: string;
}

export interface TenantInfoDetails {
  Id: number;
  Address: string;
}

export interface Configurations {
  UserCategory: EntitiesDetails[],
  Divison: EntitiesDetails[],
  Designation: EntitiesDetails[],
  TenantOfficeInfo: TenantInfoDetails[],
  Managers: ReportingManagers[],
  Gender: EntitiesDetails[]
}

export interface SelectTenantOffice {
  value: any,
  label: any,
  Code?: any
}

export interface SelectDetails {
  Select: SelectTenantOffice[]
}

export interface DesignationEntityDetails {
  label: string,
  value: any,
  code?: null | string
}

export interface DesignationSelectDetails {
  Select: DesignationEntityDetails[]
}

export interface MastersConfiguration {
  Divison: EntitiesDetails[],
  Designation: DesignationEntityDetails[],
  Managers: ReportingManagers[],
}

export interface ReportingManagers {
  Id: number;
  FullName: string;
}
export async function loadUserIntoApp(loginResponse: UserLogin) {
  localStorage.setItem('token', loginResponse.Token);
  axios.defaults.headers.Authorization = `Bearer ${loginResponse.Token}`;
  axios.defaults.headers.common["Accept-Language"] = 'fr';
  const lookup = await getLookupList();
  localStorage.setItem('bsmasterdata', JSON.stringify(lookup));
  store.dispatch(loadUser(await getUserProfile()));
}

export interface SelectedUserDetails {
  Id: number;
  FullName: string;
  Email: string;
  Phone: string;
  UserCategoryId: number;
  DivisionId: string | number;
  EmployeeCode: string | number;
  DepartmentId: string | number;
  DesignationId: string | number;
  TenantOfficeId: string | number;
  ReportingManagerId: string | number | null;
  EngagementTypeId: string | number;
  GenderId: string | number;
  EngineerLevel: null | number;
  EngineerCategory: null | number;
  EngineerType: null | number;
  EngineerAddress: string | null;
  EngineerCityId: number | null;
  EngineerCountryId: number | null;
  EngineerStateId: number | null;
  EngineerPincode: string | null;
  EngineerGeolocation: string | null;
  IsConcurrentLoginAllowed: boolean | null;
  DocumentUrl: string | null;
  DocumentSize: string | number | null;
  ContractId: string | null | number,
  CustomerSiteId: string | null | number,
  CustomerAgreedAmount: string | null | number,
  StartDate: string | null | number,
  EndDate: string | null | number,
  BudgetedAmount: string | null | number,
  CustomerInfoId: string | null | number,
}

export const selectedUserDetailsDecoder: Decoder<SelectedUserDetails> = object({
  Id: number,
  FullName: string,
  Email: string,
  Phone: string,
  UserCategoryId: number,
  DivisionId: number,
  EmployeeCode: string,
  DepartmentId: number,
  DesignationId: number,
  TenantOfficeId: number,
  ReportingManagerId: nullable(number),
  EngagementTypeId: number,
  GenderId: number,
  EngineerLevel: nullable(number),
  EngineerCategory: nullable(number),
  EngineerType: nullable(number),
  EngineerAddress: nullable(string),
  EngineerCityId: nullable(number),
  EngineerCountryId: nullable(number),
  EngineerStateId: nullable(number),
  EngineerPincode: nullable(string),
  EngineerGeolocation: nullable(string),
  IsConcurrentLoginAllowed: nullable(boolean),
  DocumentUrl: nullable(string),
  DocumentSize: nullable(number),
  ContractId: nullable(number),
  CustomerSiteId: nullable(number),
  CustomerAgreedAmount: nullable(number),
  StartDate: nullable(string),
  EndDate: nullable(string),
  BudgetedAmount: nullable(number),
  CustomerInfoId: nullable(number)
});

export interface SelectedUser {
  UserDetails: SelectedUserDetails[];
}

export const selectedUserDecoder: Decoder<SelectedUser> = object({
  UserDetails: array(selectedUserDetailsDecoder)
});

export interface SelectedUserRoles {
  UserRoles: string;
}

export const selectedUserRolesDecoder: Decoder<SelectedUserRoles> = object({
  UserRoles: string
});

export interface SelectedUserRole {
  SelectedUserRoles: SelectedUserRoles[];
}

export const selectedUserRoleDecoder: Decoder<SelectedUserRole> = object({
  SelectedUserRoles: array(selectedUserRolesDecoder)
});

// user profile

export interface SelectedRoles {
  RoleNames: string;
}

export const selectedRolesDecoder: Decoder<SelectedRoles> = object({
  RoleNames: string
});

export interface Roles {
  SelectedUserRoles: SelectedRoles[];
}

export const rolesDecoder: Decoder<Roles> = object({
  SelectedUserRoles: array(selectedRolesDecoder)
});

// user tenant office
export interface UserTenantInfoName {
  Id: number;
  OfficeName: string;
  Address: string;
}

export const userTenantinfoNameDecoder: Decoder<UserTenantInfoName> = object({
  Id: number,
  OfficeName: string,
  Address: string
});

export interface UserTenantOfficeNameInfo {
  TenantOfficeName: UserTenantInfoName[];
}

export const userTenantOfficeInfoNameDecoder: Decoder<UserTenantOfficeNameInfo> = object({
  TenantOfficeName: array(userTenantinfoNameDecoder),
});

export interface LoggedUserLocationInfo {
  RegionId: number;
  TenantOfficeId: number;
  UserCategoryCode: string;
}

export const loggedUserLocationInfoDecoder: Decoder<LoggedUserLocationInfo> = object({
  RegionId: number,
  TenantOfficeId: number,
  UserCategoryCode: string
});

export interface LoggedUserLocationDetail {
  userLocationInfo: LoggedUserLocationInfo;
}

export const loggedUserLocationDetailDecoder: Decoder<LoggedUserLocationDetail> = object({
  userLocationInfo: loggedUserLocationInfoDecoder
});

export interface ServiceEngineersList {
  Id: number;
  FullName: string;
  Address: string | null;
}

export const serviceEngineersnamesDecoder: Decoder<ServiceEngineersList> = object({
  Id: number,
  FullName: string,
  Address: nullable(string)
});

export interface ServiceEngineersCategoryWiseList {
  ServiceEngineers: ServiceEngineersList[];
}

export const serviceEngineerslistDecoder: Decoder<ServiceEngineersCategoryWiseList> = object({
  ServiceEngineers: array(serviceEngineersnamesDecoder),
});

// user tenant office
export interface CWHLocation {
  Id: number;
  OfficeName: string;
  Address: string;
  GstStateCode: string;
}

export const CWHLocationDecoder: Decoder<CWHLocation> = object({
  Id: number,
  OfficeName: string,
  Address: string,
  GstStateCode: string
});

export interface CWHLocationNames {
  TenantOfficeName: UserTenantInfoName[];
}

export const CWHLocationNamesDecoder: Decoder<CWHLocationNames> = object({
  TenantOfficeName: array(CWHLocationDecoder),
});

export interface FIATReport {
  DateFrom: string;
  DateTo: string;
  TenantRegionId: number;
  TenantOfficeId: number;
}

export interface usersDeleted {
  IsDeleted: boolean;
}

export const usersDeletedDecoder: Decoder<usersDeleted> = object({
  IsDeleted: boolean,
});

export interface SelectedUserBusinessUnits {
  BusinessUnit: string | null;
  BusinessUnitId: number | null;
}

export const selectedUserBusinessUnitsDecoder: Decoder<SelectedUserBusinessUnits> = object({
  BusinessUnit: nullable(string),
  BusinessUnitId: nullable(number),
});

export interface SelectedBusinessUnits {
  SelectedBusinessUnits: SelectedUserBusinessUnits[];
}

export const selectedBusinessUnitsDecoder: Decoder<SelectedBusinessUnits> = object({
  SelectedBusinessUnits: array(selectedUserBusinessUnitsDecoder)
});

export interface UserPendingListDetail {
  Id: number;
  TableName: string;
  Content: string;
  ReviewStatus: string;
  UserCategory: string;
  Department: string;
  Location: string;
  Designation: string;
  CreatedBy: number;
}

export const userPendingListDetailDecoder: Decoder<UserPendingListDetail> = object({
  Id: number,
  TableName: string,
  Content: string,
  ReviewStatus: string,
  UserCategory: string,
  Department: string,
  Location: string,
  Designation: string,
  CreatedBy: number,
});

export interface UserPendingList {
  PendingList: UserPendingListDetail[];
  TotalRows: number;
  CurrentPage: number;
  PerPage: number
}

export const userPendingListDecoder: Decoder<UserPendingList> = object({
  PendingList: array(userPendingListDetailDecoder),
  TotalRows: number,
  CurrentPage: number,
  PerPage: number
});
export interface usersDisabled {
  IsDisabled: boolean;
}

export const usersDisabledDecoder: Decoder<usersDisabled> = object({
  IsDisabled: boolean,
});

export interface UserPendingDetail {
  Id: number;
  CaseId: number;
  TableName: string;
  FullName:string;
  EmployeeCode:String;
  FetchTime?: string | null;
  Email: string;
  Phone: string;
  Content:string;
  UserCategory: string;
  Division: string | null;
  Department: string;
  EngagementType: string;
  Gender: string;
  Designation: string;
  ReportingManager: string;
  Location: string;
  ServiceEngineerType: string | null;
  ServiceEngineerLevel: string | null;
  ServiceEngineerCategory: string | null;
  Country: string | null;
  State: string | null;
  City: string | null;
  ReviewStatus: string;
  ReviewStatusName:string;
  CreatedBy: number;
  CreatedOn: string;
  CreatedUserName: string;
  UserRole: string;
  DocumentUrl:string;
  CustomerName:string|null;
  ContractNumber:string|null;
  CustomerSite:string|null;
  BudgetedAmount:number|null;
  CustomerAgreedAmount:number|null;
  StartDate:string|null;
  EndDate:string|null;
  EngineerPincode:string|null;
  EngineerGeolocation:string|null;
  EngineerAddress:string|null;
  UserGrade:string|null;
}

export const userPendingDetailDecoder: Decoder<UserPendingDetail> = object({
  Id: number,
  CaseId: number,
  TableName: string,
  FullName: string,
  EmployeeCode:string,
  Email:string,
  Phone:string,
  Content:string,
  FetchTime: nullable(string),
  UserCategory: string,
  Division: nullable(string),
  Department: string,
  EngagementType: string,
  Gender: string,
  Designation: string,
  ReportingManager: string,
  Location: string,
  ServiceEngineerType: nullable(string),
  ServiceEngineerLevel: nullable(string),
  ServiceEngineerCategory: nullable(string),
  Country: nullable(string),
  State: nullable(string),
  City: nullable(string),
  ReviewStatus: string,
  ReviewStatusName:string,
  CreatedBy: number,
  CreatedOn: string,
  CreatedUserName: string,
  UserRole: string,
  DocumentUrl:string,
  CustomerName:nullable(string),
  ContractNumber:nullable(string),
  CustomerSite:nullable(string),
  BudgetedAmount:nullable(number),
  CustomerAgreedAmount:nullable(number),
  StartDate:nullable(string),
  EndDate:nullable(string),
  EngineerPincode:nullable(string),
  EngineerGeolocation:nullable(string),
  EngineerAddress:nullable(string),
  UserGrade:nullable(string)
});

export interface UserPendingDetailWithReview {
  UserPendingDetail: UserPendingDetail;
  ApprovalRequestReviewList:ApprovalRequestReviewListDetail[]
}

export const userPendingDetailWithReviewDecoder: Decoder<UserPendingDetailWithReview> = object({  
  UserPendingDetail:userPendingDetailDecoder,
  ApprovalRequestReviewList:array(approvalRequestReviewListDetailDecoder)
}); 
 