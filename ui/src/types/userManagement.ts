import axios from 'axios';
import { array, number, Decoder, nullable, object, string, boolean } from 'decoders';
import { loadUser } from '../components/App/App.slice';
import { getUserProfile } from '../services/login';
import { store } from '../state/store';
import { UserLogin } from './login';

export interface RegisteredUser {
  Id: number;
  FullName: string;
  EmployeeCode:string;
  Department:String;
  Email: string;
  Phone: string;
  Designation: string;
  IsDeleted:Boolean;
  Gender:string;
  Location: string;
  UserInfoStatus: Boolean;
  UserLoginStatus: Boolean;
  UserCategory:string;
  DocumentUrl:string | null;
}

export const registeredUserDecoder: Decoder<RegisteredUser> = object({
  Id: number,
  FullName: string,
  EmployeeCode:string,
  Department:string,
  Designation:string,
  Gender: string,
  Location:string,
  Email: string,
  Phone: string,
  UserInfoStatus: boolean,
  UserLoginStatus: boolean,
  IsDeleted: boolean,
  UserCategory:string,
  DocumentUrl:nullable(string)
});

export interface MultipleRegisteredUsers {
  users: RegisteredUser[];
  totalRows: number;
  PerPage:number;
}

export const multipleRegisteredUsersDecoder: Decoder<MultipleRegisteredUsers> = object({
  users: array(registeredUserDecoder),
  totalRows: number,
  PerPage:number
});

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

export interface Users {
  Email: string;
  token: string;
  isInserted: boolean;
}

export const usersDecoder: Decoder<Users> = object({
  Email: string,
  token: string,
  Phone: string,
  FullName: string,
  PassCode: string,
  RoleName:string,
  isInserted: boolean,
});

export interface UserDetails {
  id: string;
  username: string;
  email: string;
  password: string | null;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
}

export const userDecoder: Decoder<User> = object({
  email: string,
  token: string,
  phone: string,
  RoleName:string,
  fullName: string,
  image: nullable(string),
});

export interface UserSettings extends PublicUser {
  email: string;
  password: string | null;
  phone: string;
}

export interface UserForCreation {
  FullName: string;
  Email: string;
  PassCode: string | null;
  Phone: string;
  RoleName:string;
}

export async function loadUserIntoApp(loginResponse: UserLogin) {
  localStorage.setItem('token', loginResponse.Token);
  axios.defaults.headers.Authorization = `Bearer ${loginResponse.Token}`;
  store.dispatch(loadUser(await getUserProfile()));
}

export interface LoginHistoryDetail {
  EmployeeName: string;
  EmployeeCode:string;
  LoginDate:string;
  Location: string;
  Designation: string;
  LoggedOutOn:null|string;
  ClientInfo:string
}

export const loginHistoryDetailsDecoder: Decoder<LoginHistoryDetail> = object({
  EmployeeName: string,
  EmployeeCode:string,
  LoginDate:string,
  Location: string,
  Designation: string,
  LoggedOutOn:nullable(string),
  ClientInfo:string
});

export interface MultipleUsersLoginHistory {
  usersLoginHistory: LoginHistoryDetail[]; 
    totalRows: number
    perPage: number
}

export const multipleUsersLoginHistoryDecoder: Decoder<MultipleUsersLoginHistory> = object({
  usersLoginHistory: array(loginHistoryDetailsDecoder),
  totalRows: number,
  perPage: number
});


export interface UserName {
  value: any;
  label: any;
}
  
export interface UserNamesList {
  Names: UserName[];
}

export interface UserNames {
  Id: number;
  FullName: string;
}

export const usersnamesDecoder: Decoder<UserNames> = object({
  Id: number,
  FullName: string,
});

export interface UsersNamesList {
  UsersNames: UserNames[];
}

export const usersnameslistDecoder: Decoder<UsersNamesList> = object({
  UsersNames: array(usersnamesDecoder),
});