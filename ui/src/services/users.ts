import { Err, Ok, Result } from '@hqoss/monads';
import axios from 'axios';
import { guard,object } from 'decoders';
import settings from '../config/settings';
import { GenericErrors, genericErrorsDecoder } from '../types/error';

import {
  multipleRegisteredUsersDecoder,
  MultipleRegisteredUsers,
  multipleLoginHistoryDecoder,
  MultipleLoginHistory,
  UserEditResponse,
  userEditDecoder,
  UserStatusTemplate,
  MultipleUserRoles,
  multipleUserRolesDecoder,
  MultipleUsersCount,
  multipleUsersCountDecoder,
  UserForCreation,
  SelectedUser,
  selectedUserDecoder,
  UserEdit,
  SelectedUserRole,
  selectedUserRoleDecoder,
  Roles,
  rolesDecoder,
  userTenantOfficeInfoNameDecoder,
  UserTenantOfficeNameInfo,
  RoleUserList,
  roleuserDecoder,
  LoggedUserLocationDetail,
  loggedUserLocationDetailDecoder,
  ServiceEngineersCategoryWiseList,
  serviceEngineerslistDecoder,
  usersDeleted,
  usersDeletedDecoder,
  SelectedBusinessUnits,
  selectedBusinessUnitsDecoder,
  usersDisabled,
  usersDisabledDecoder,
  UserPendingDetailWithReview,
  userPendingDetailWithReviewDecoder,
  UserPendingList,
  userPendingListDecoder,
} from '../types/user';
import { ExpiryInfo, PasswordChange, expiryInfoDecoder, passwordChangeDecoder } from '../types/login';
import { userCreateResponseDecoder, UserData} from '../types/createduser';
import { MultipleUsersLoginHistory,  UsersNamesList, multipleUsersLoginHistoryDecoder, usersnameslistDecoder } from '../types/userManagement';
import { UserReviewDetail } from '../components/Pages/PendingApproval/PendingApprovalView/UserRequestView/UserRequestView.slice';
import { ApprovalDeleted, ApproveUser, PendingApprovalEditResponse, UserApprovalDetail, UserApprovalDetailDecoder, approvalDeletedDecoder, approveUserDecoder, pendingApprovalEditResponseDecoder } from '../types/pendingApproval';
import {  appendFormData, getBrowserTimeZone } from '../helpers/formats';
import { setupInterceptorsTo } from "../interceptor";

axios.defaults.baseURL = settings.baseApiUrl;
setupInterceptorsTo(axios) 

/**
 * Get all users list from the database
 * @param index     number  page number to be loaded from the database
 * @param search    string  search key if the user searched for any names
 * @returns
 */

export async function getUsersCount(): Promise<MultipleUsersCount> {
  var url = `user/count`;
  return guard(multipleUsersCountDecoder)((await axios.get(url)).data.data);
}

export async function getUsersList(index?: number, SearchText?: string, SearchWith?: string): Promise<MultipleRegisteredUsers> {
  var url = `user/list?Page=${index}`;
  if (SearchText && SearchWith) {
    url += `&SearchText=${SearchText}&SearchWith=${SearchWith}`;
  } else if (SearchText) {
    url += `&SearchText=${SearchText}`;
  }
  return guard(multipleRegisteredUsersDecoder)((await axios.get(url)).data.data);
}

export async function getUserDetails(UserId: number): Promise<SelectedUser> {
  return guard(selectedUserDecoder)((await axios.get(`user/details?UserId=${UserId}`)).data.data);
}

export async function getUserRoles(UserId: number): Promise<SelectedUserRole> {
  return guard(selectedUserRoleDecoder)((await axios.get(`user/selected/roles?UserId=${UserId}`)).data.data);
}

export async function getSelectedRoles(UserId: string): Promise<Roles> {
  return guard(rolesDecoder)((await axios.get(`user/selected/roles?UserId=${UserId}`)).data.data);
}

export async function getUsersRolesList(): Promise<MultipleUserRoles> {
  return guard(multipleUserRolesDecoder)((await axios.get('role/list')).data.data);
}

export async function getUserLoginHistoryList(Id: string): Promise<MultipleLoginHistory> {
  return guard(multipleLoginHistoryDecoder)((await axios.get(`user/userloginhistory?UserId=${Id}`)).data.data);
}

export async function getLoginHistoryList(): Promise<MultipleLoginHistory> {
  return guard(multipleLoginHistoryDecoder)((await axios.get('user/loginhistory')).data.data);
}
export async function getUsersByRolesList(TenantOfficeId: number | null | string, Role: String[]): Promise<RoleUserList> {
  const serializedRole = JSON.stringify(Role);
  const encodedRole = encodeURIComponent(serializedRole);
  return guard(roleuserDecoder)((await axios.get(`user/getuserbyrole?TenantOfficeId=${TenantOfficeId}&Role=${encodedRole}`)).data.data);
}

export async function editUser(user: UserEdit): Promise<Result<UserEditResponse, GenericErrors>> {
  try {
    // Append all fields to the formData
    const formData = new FormData();
    appendFormData(formData, user);
    const { data } = await axios.put('user/update', formData);
    return Ok(guard(object({ data: userEditDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}

export async function editUserPendingApproval(ContentParsed: UserEdit, Id?: number | string): Promise<Result<PendingApprovalEditResponse, GenericErrors>> {
  try {
    const user = { ...ContentParsed, ReviewStatus: 'ARS_SMTD' }
    const formData = new FormData();
    appendFormData(formData, user);
    const { data } = await axios.put(`approvalrequest/user/${Id}`, formData);
    return Ok(guard(object({ data: pendingApprovalEditResponseDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}

export async function toggleUserStatus(user: UserStatusTemplate): Promise<{ IsUpdated: Boolean }> {
  const { data } = await axios.post('user/toggle/status', { Id: user.Id, IsActive: user.UserInfoStatus });
  return data.data.isInserted;
}

export async function UserpasswordUpdate(NewPasscode: string,ConfirmPasscode: string,IsActive: Boolean,UserId: string): Promise<Result<PasswordChange, GenericErrors>> {
  try {
    const details = await userInfo();
    const { data } = await axios.put('user/changeuserpasscode', { NewPasscode, ConfirmPasscode, IsActive, UserId, details });
    return Ok(guard(object({ data: passwordChangeDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}

export async function userCreate(user: UserForCreation): Promise<Result<UserData, GenericErrors>> {
  try {
    // Append all fields to the formData
    const formData = new FormData();
    appendFormData(formData, user);
    const { data } = await axios.post("approvalrequest/user", formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return Ok(guard(object({ data: userCreateResponseDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}


const userInfo = async () => {
  const response = await axios.get(process.env.REACT_APP_URL_USER_IP_ADDRESS_FINDER_SERVICE as string, { headers: '' });
  return {
    browser: navigator.userAgent,
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    ipAddress: response.data.ip,
  };
};

// get user tenant offices
export async function getUserTenantOfficeName(): Promise<UserTenantOfficeNameInfo> {
  return guard(userTenantOfficeInfoNameDecoder)((await axios.get(`user/category/tenantoffice/list`)).data.data);
}


// get user tenant offices according to selected category
export async function getUserCategoryFilteredTenantOfficeName(UserCategoryCode: string): Promise<UserTenantOfficeNameInfo> {
  return guard(userTenantOfficeInfoNameDecoder)((await axios.get(`user/category/filtered/tenantoffice/list?UserCategoryCode=${UserCategoryCode}`)).data.data);
}

//get all users login history
export async function getAllUsersLoginHistoryList(index?: number, userId?: number, dateFrom?: string, dateTo?: string): Promise<MultipleUsersLoginHistory> {
  let url = `user/usersloginhistory?Page=${index}`
  if (userId) {
    url += `&userId=${userId}`
  }
  if (dateFrom) {
    url += `&dateFrom=${dateFrom}`
  }
  if (dateTo) {
    url += `&dateTo=${dateTo}`
  }
  return guard(multipleUsersLoginHistoryDecoder)((await axios.get(url)).data.data);
}

//get all users list
export async function getUsersNames(): Promise<UsersNamesList> {
  return guard(usersnameslistDecoder)((await axios.get('user/names')).data.data);
}

export async function getAllUsersNames(): Promise<UsersNamesList> {
  return guard(usersnameslistDecoder)((await axios.get('user/allnames')).data.data);
}

export const downloadUserLoginHistoryList = async (userId?: number, dateFrom?: string, dateTo?: string) => {
  let url = `user/loginhistory/download?&TimeZone=${getBrowserTimeZone()}`;
  if (userId) {
    url += `&userId=${userId}`
  }
  if (dateFrom) {
    url += `&dateFrom=${dateFrom}`
  }
  if (dateTo) {
    url += `&dateTo=${dateTo}`
  }
  return await axios.get(url, {
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json',
    }
  });
}

export async function getUserLocationInfo(): Promise<LoggedUserLocationDetail> {
  return guard(loggedUserLocationDetailDecoder)((await axios.get(`user/location/details/for/report`)).data.data);
}

export async function getCategoryWiseServiceEngineers(): Promise<ServiceEngineersCategoryWiseList> {
  return guard(serviceEngineerslistDecoder)((await axios.get(`user/categorywise/se/list`)).data.data);
}

export async function getRegionWiseServiceEngineers(): Promise<ServiceEngineersCategoryWiseList> {
  return guard(serviceEngineerslistDecoder)((await axios.get(`user/regionwise/se/list`)).data.data);
}

export async function DeleteSelectedUsers(useridList: string): Promise<Result<usersDeleted, GenericErrors>> {
  try {
    const { data } = await axios.post('user/delete', { useridList });
    return Ok(guard(object({ data: usersDeletedDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}

export async function getUserBusinessUnits(UserId: number): Promise<SelectedBusinessUnits> {
  return guard(selectedBusinessUnitsDecoder)((await axios.get(`user/selected/businessunits?UserId=${UserId}`)).data.data);
}

// approve user
export async function approveUser(
  ApprovalRequestDetailId: number|null,
  FetchTime: string | null,
  ReviewComment: string|null,
): Promise<Result<ApproveUser, GenericErrors>> {
  try {
    const { data } = await axios.post('approvalrequest/user/approve', { ApprovalRequestDetailId, FetchTime, ReviewComment });
    return Ok(guard(object({ data: approveUserDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}

export async function getUserPendingList(index: number, SearchText?: string, SearchWith?: string): Promise<UserPendingList> {
  var url = `approvalrequest/user/pending?Page=${index}`;
  if (SearchText && SearchWith) {
    url += `&SearchText=${SearchText}&SearchWith=${SearchWith}`;
  } else if (SearchText) {
    url += `&SearchText=${SearchText}`;
  }
  return guard(userPendingListDecoder)((await axios.get(url)).data.data);
}

export async function DisableUsers(useridList: string): Promise<Result<usersDisabled, GenericErrors>> {
  try {
    const { data } = await axios.post('user/disble/status', { useridList });
    return Ok(guard(object({ data: usersDisabledDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}
// Password expiry info
export async function UserPasscodeExpiryNotice(): Promise<ExpiryInfo> {
  const { data } = await axios.get('user/passcode/expiry/notice');
  return guard(object({ data: expiryInfoDecoder }))(data).data;
}

export async function getUserPendingDetails(Id: number | string): Promise<UserPendingDetailWithReview> {
  return guard(userPendingDetailWithReviewDecoder)((await axios.get(`approvalrequest/user/pending/${Id}`)).data.data);
}

export async function deleteUserApprovalRequest(Id: number): Promise<Result<ApprovalDeleted, GenericErrors>> {
  try {
    const { data } = await axios.delete(`approvalrequest/user/${Id}`);
    return Ok(guard(object({ data: approvalDeletedDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}

