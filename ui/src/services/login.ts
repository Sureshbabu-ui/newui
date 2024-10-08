import { Err, Ok, Result } from '@hqoss/monads';
import axios from 'axios';
import { guard, object } from 'decoders';
import settings from '../config/settings';
import { GenericErrors, genericErrorsDecoder } from '../types/error';
import {
  UserLogin,
  loginDecoder,
  User,
  userDecoder,
  ForgotPassword,
  forgotPasswordDecoder,
  VerifyCode,
  verifyCodeDecoder,
  PasswordChange,
  passwordChangeDecoder,
  PasswordValidityExpire,
  passwordValidityExpireDecoder,
  UserLogout,
  userLogoutDecoder,
} from '../types/login';
import { setupInterceptorsTo } from '../interceptor';
import { store } from '../state/store';
import { setPasswordExpiry } from '../components/Pages/Login/Login.slice';
axios.defaults.baseURL = settings.baseApiUrl;
setupInterceptorsTo(axios)

export async function login(employeecode: string, passcode: string): Promise<Result<UserLogin, GenericErrors>> {
  try {
    const details = await userInfo();
    const { data } = await axios.post('auth/login', { employeecode, passcode, details });
    return Ok(guard(object({ data: loginDecoder }))(data).data);
  } catch (error: any) {
    if (!error.response || !error.response.data) {
      return Err({ "NoResponse": ["404"] });
    }
    const { data } = error.response;
    store.dispatch(setPasswordExpiry((data).IsPasswordExpired))  
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}

export async function getUserProfile(): Promise<User> {
  const { data } = await axios.get('user/profile');
  return guard(object({ data: userDecoder }))(data).data;
}

export async function PasswordReset(employeecode: string): Promise<Result<ForgotPassword, GenericErrors>> {
  try {
    const details = await userInfo();
    const { data } = await axios.post('auth/forgot', { employeecode, details });
    return Ok(guard(object({ data: forgotPasswordDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}

export async function ConfirmCode(employeecode: string, Code: string): Promise<Result<VerifyCode, GenericErrors>> {
  try {
    const details = await userInfo();
    const { data } = await axios.post('auth/verifycode', { employeecode, Code, details });
    return Ok(guard(object({ data: verifyCodeDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}

export async function updatePassword(
  Passcode: string,
  ConfirmPasscode: string,
  EmployeeCode: string,
  Code: string
): Promise<Result<PasswordChange, GenericErrors>> {
  try {
    const details = await userInfo();
    const { data } = await axios.put('auth/changepassword', { Passcode, ConfirmPasscode, EmployeeCode, Code, details });
    return Ok(guard(object({ data: passwordChangeDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}

//after login password Change

export async function passwordUpdate(
  OldPasscode: string,
  NewPasscode: string,
  ConfirmPasscode: string
): Promise<Result<PasswordChange, GenericErrors>> {
  try {
    const details = await userInfo();
    const { data } = await axios.put('auth/resetpasscode', { OldPasscode, NewPasscode, ConfirmPasscode, details });
    return Ok(guard(object({ data: passwordChangeDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}
// Password Validation expiry

export async function passwordValidityCheck(): Promise<PasswordValidityExpire> {
  const { data } = await axios.get('user/passcodevaliditycheck');
  return guard(object({ data: passwordValidityExpireDecoder }))(data).data;
}

const userInfo = async () => {
  // const response = await axios.get(process.env.REACT_APP_URL_USER_IP_ADDRESS_FINDER_SERVICE as string, { headers: '' });
  {/* TODOS Api call to get ip address currently disabled*/ }

  return {
    browser: navigator.userAgent,
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    ipAddress: "111.92.118.244",
  };
};

export const userLogout=async(): Promise<Result<UserLogout, GenericErrors>>=> {
  try {
    const { data } = await axios.get('auth/logout');
    return Ok(guard(object({ data: userLogoutDecoder }))(data).data);
} catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
}
}