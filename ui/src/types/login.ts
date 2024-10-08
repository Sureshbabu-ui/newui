import { array, boolean, Decoder, nullable, number, object, string } from 'decoders';
import { DateTime } from 'luxon';

export interface UserLogin {
  IsLoggedIn: boolean;
  Token: string;
}

export const loginDecoder: Decoder<UserLogin> = object({
  IsLoggedIn: boolean,
  Token: string,
});

export interface UserDetail {
  FullName: string;
  Email: string;
  Phone: string;
  CreatedOn: string;
  Id: number;
  Permissions: null | string;
}

export const userDetailDecoder: Decoder<UserDetail> = object({
  FullName: string,
  Email: string,
  Phone: string,
  CreatedOn: string,
  Id: number,
  Permissions: nullable(string)
});

export interface User {
  user: UserDetail[];
}

export const userDecoder: Decoder<User> = object({
  user: array(userDetailDecoder),
});

export interface ForgotPassword {
  IsCodeGenerated: boolean;
}

export const forgotPasswordDecoder: Decoder<ForgotPassword> = object({
  IsCodeGenerated: boolean,
});

export interface VerifyCode {
  IsVerified: boolean;
}

export const verifyCodeDecoder: Decoder<VerifyCode> = object({
  IsVerified: boolean,
});

export interface PasswordChange {
  IsPasswordUpdated: boolean;
}

export const passwordChangeDecoder: Decoder<PasswordChange> = object({
  IsPasswordUpdated: boolean,
});

export interface PasswordValidityExpire {
  isExpired: boolean;
}

export const passwordValidityExpireDecoder: Decoder<PasswordValidityExpire> = object({
  isExpired: boolean,
});

export interface UserLogout {
  IsLoggedOut: boolean;
}

export const userLogoutDecoder: Decoder<UserLogout> = object({
  IsLoggedOut: boolean,
});

export interface PasscodeExpiryInfo {
  DaysUntilExpiry:number| null;
}

export const PasscodeExpiryInfoDecoder: Decoder<PasscodeExpiryInfo> = object({
  DaysUntilExpiry: nullable(number),
});

export interface ExpiryInfo {
  ExpiryInfo: PasscodeExpiryInfo;
}

export const expiryInfoDecoder: Decoder<ExpiryInfo> = object({
  ExpiryInfo: PasscodeExpiryInfoDecoder
});