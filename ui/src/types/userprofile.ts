import { array, number, Decoder, nullable, object, string, iso8601, boolean } from 'decoders';

export interface SelectedProfileDetail {
  FullName: string;
  Email: string;
  Phone: string;
  CreatedOn: string;
  EmployeeCode: string;
  Id: number;
  EngagementType: string;
  Designation: string;
  Department: string;
  Division: string;
  DesignationCode: string;
  IsActive:boolean;
  UserCategory: string;
  EngineerGeolocation: null | string,
  EngineerHomeLocation: null | string,
  ServiceEngineerType: null | string,
  ServiceEngineerLevel: null | string,
  ServiceEngineerCategory: null | string,
  Location: null | string,
  DocumentUrl:string|null;
  BusinessUnits: string | null;
  UserGrade:string|null;
}

export const userDetailDecoder: Decoder<SelectedProfileDetail> = object({
  FullName: string,
  Email: string,
  Phone: string,
  CreatedOn: string,
  EmployeeCode: string,
  IsActive:boolean,
  Id: number,
  EngagementType: string,
  Designation: string,
  DesignationCode: string,
  Department: string,
  Division: string,
  UserCategory: string,
  EngineerGeolocation: nullable(string),
  EngineerHomeLocation: nullable(string),
  ServiceEngineerType: nullable(string),
  ServiceEngineerLevel: nullable(string),
  ServiceEngineerCategory: nullable(string),
  Location:string,
  DocumentUrl:nullable(string),
  BusinessUnits: nullable(string),
  UserGrade:nullable(string)
});

export interface SelectedProfile {
  UserDetails: SelectedProfileDetail[];
}

export const selectedUserDetailsDecoder: Decoder<SelectedProfile> = object({
  UserDetails: array(userDetailDecoder),
});

export interface UserStatus {
  IsActive: boolean;
}
export const userStatusDecoder: Decoder<UserStatus> = object({
  IsActive: boolean
});

export interface SelectedProfileStatus {
  UserStatus: UserStatus[];
}

export const selectedUserStatusDecoder: Decoder<SelectedProfileStatus> = object({
  UserStatus: array(userStatusDecoder),
}); 