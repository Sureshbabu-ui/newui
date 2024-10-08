import React, { useEffect, useState } from 'react';
import { ConfirmCode, login, passwordValidityCheck } from '../../../services/login';
import { dispatchOnCall, store } from '../../../state/store';
import { useStoreWithInitializer } from '../../../state/storeHooks';
import { loadUserIntoApp } from '../../../types/user';
import { initializeLogin, LoginState, setPasswordExpiry, startLoginIn, updateErrors, updateField } from './Login.slice';
import { ContainerPage } from '../../ContainerPage/ContainerPage';
import { useTranslation } from 'react-i18next';
import { startPreloader, stopPreloader } from '../../Preloader/Preloader.slice';
import * as yup from 'yup';
import { ValidationErrorComp } from '../../ValidationErrors/ValidationError';
import { convertBackEndErrorsToValidationErrors } from '../../../helpers/formats';
import axios from 'axios';
import { updateCodeForPswdReset } from '../CodeVerification/CodeVerification.slice';
import { setEmployeeCode, updateCode } from '../ForgotPassword/ForgotPassword.slice';
import { useHistory } from 'react-router-dom';

const appLanguages: { [key: string]: any } = {
  en: { nativeName: 'English' },
  ta: { nativeName: 'தமிழ்' },
};
export const Login = () => {
  const { t, i18n } = useTranslation();
  const { errors, loginIn, passwordExpired, credentials } = useStoreWithInitializer(({ login }) => login, dispatchOnCall(initializeLogin()));
  const history = useHistory()

  const validationSchema = yup.object().shape({
    EmployeeCode: yup.string().required('validation_error_login_userid_required'),
    Passcode: yup.string().required('validation_error_login_password_required'),
  });

  const [version, setVersion] = useState('');
  const [viewType, setViewType] = useState('password');

  useEffect(() => {
    fetchVersion();
  }, []);

  const fetchVersion = async () => {
    try {
      const response = await axios.get('version/get');
      const data = response.data;
      const versionString = data.toString();
      setVersion(versionString);
    } catch (error) { return }
  };
  const signIn = async (ev: React.FormEvent) => {
    store.dispatch(updateErrors({}))
    store.dispatch(setPasswordExpiry(false))
    try {
      await validationSchema.validate(credentials, { abortEarly: false });
    } catch (error: any) {
      const errors = error.inner.reduce((allErrors: any, currentError: any) => {
        return { ...allErrors, [currentError.path as string]: currentError.message };
      }, {});
      store.dispatch(updateErrors(errors))
      if (errors)
        return;
    }
    store.dispatch(startPreloader())
    if (store.getState().login.loginIn) return;
    store.dispatch(startLoginIn());
    const { EmployeeCode, Passcode } = store.getState().login.credentials;
    const result = await login(EmployeeCode, Passcode);
    result.match({
      ok: async (loginResponse) => {
        loadUserIntoApp(loginResponse);
        const expire = await passwordValidityCheck();
        expire.isExpired ? store.dispatch(setPasswordExpiry(expire.isExpired)) : (location.pathname = '/home');
      },
      err: async (e) => {
        const formattedErrors = convertBackEndErrorsToValidationErrors(e)
        store.dispatch(updateErrors(formattedErrors))
        if (store.getState().login.passwordExpired == true) {
          const [resetCode, employeeCode] = formattedErrors.Message.split('//');
          store.dispatch(updateCodeForPswdReset(resetCode))
          store.dispatch(updateCode({ IsCodeGenerated: true }))
          store.dispatch(setEmployeeCode(employeeCode))
          const result = await ConfirmCode(employeeCode, resetCode);
          result.match({
            ok: () => {
              history.push('resetpassword')
            },
            err: (e) => {
              return
            },
          });
        }
      },
    });
    store.dispatch(stopPreloader())
  }

  return (
    <div className="auth-page px-5 mx-2">
      <ContainerPage>
        {/* wrapper */}
        <> {store.getState().app.apiErrorCode == "500" && <div className="alert alert-danger" role="alert" style={{ zIndex: 1000001 }}>
          {t('api_statuscode_500') ?? ''}
        </div>}</>
        <div className="row m-0 login-wrapper">
          {/* slider section */}
          <div className="col-md-6 py-2 px-5">
            {/* home page besure logo */}
            <div className="mt-5">
              <img className="besure-logo-homepage pt-0" src="/images/logo.1.0.png" />
            </div>
            {/* home page besure logo ends */}
            {/* slider */}
            <div className="row m-0 mt-2 p-0 text-muted">
              <div className="col-auto p-0">
                Start managing your business in a
              </div>
              <div className="col-auto p-0 px-2">
                <div className="carousel slide carousel-fade" data-bs-ride="carousel">
                  <div className="carousel-inner">
                    <div className="carousel-item active app-primary-color fw-bold" data-bs-interval="10000">
                      faster
                    </div>
                    <div className="carousel-item app-primary-color fw-bold" data-bs-interval="2000">
                      smarter
                    </div>
                    <div className="carousel-item app-primary-color fw-bold">
                      greater
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-auto px-0">
                way
              </div>
            </div>
            {/* slider ends */}
            {/* illustration */}
            <div className="mt-5">
              <img className="besure-login-ilustration pt-0" src="/images/secure-login.png" />
            </div>
            {/* illustration ends */}
          </div>
          {/* slider section ends */}
          {/* login */}
          <div className="col-md-6 py-2 px-5">
            <div className="fs-3 mt-5">
              <strong>Welcome back</strong>
            </div>
            <div className="text-muted">
              <small>Sign in to access your personalized experience</small>
            </div>
            {/* login form */}
            <div className="mt-2 me-5">
              <fieldset className="form-group mb-2 ">
                <label>{t('login_input_label_userid')}</label>
                <div className="col-8">
                  <input
                    className={`form-control  ${errors["EmployeeCode"] ? "is-invalid" : ""}`}
                    name="EmployeeCode"
                    onChange={onUpdateField}
                    value={credentials.EmployeeCode}
                    data-testid="login_input_email "
                    disabled={loginIn}
                    aria-describedby="emailFeedback"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        signIn(e);
                      }
                    }}
                  />
                  <div className="invalid-feedback">{t(errors['EmployeeCode'])}</div>
                </div>
                <div className="col-8">
                  <label className="mt-3">{t('login_input_label_password')}</label>
                  <div className="input-group mb-1">
                    <input
                      type={viewType}
                      className={`form-control border ${errors["Passcode"] ? "is-invalid border-danger" : ""}`}
                      name="Passcode"
                      value={credentials.Passcode}
                      onChange={onUpdateField}
                      disabled={loginIn}
                      data-testid="login_input_password"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          signIn(e);
                        }
                      }}
                    />
                    {viewType == "password" ?
                      (

                        <div className="ps-2 pt-2 input-group-text" role='button' onClick={() => setViewType('text')}>
                          <span className="material-symbols-outlined app-primary-color  cursor-pointer ">
                            visibility
                          </span>
                        </div>
                      ) : (
                        <div className="ps-2 pt-2 input-group-text" role='button' onClick={() => setViewType('password')}>
                          <span className="material-symbols-outlined app-primary-color  cursor-pointer ">
                            visibility_off
                          </span>
                        </div>
                      )
                    }
                    <div className="invalid-feedback">{t(errors['Passcode'])}</div>
                  </div>
                </div>
                <div className="d-flex flex-row mt-3 justify-content-between">
                  <button className="btn text-white app-primary-bg-color px-6"
                    autoFocus
                    onClick={signIn}>{t('login_button_text_login')}</button>
                </div>
                {/* validation errors */}
                <div className="mt-2">
                  {store.getState().login.passwordExpired == true ?
                    <></> :
                    <ValidationErrorComp errors={errors} />
                  }
                </div>
                {/* validation errors ends */}
              </fieldset>
            </div>
            {/* login form ends */}
            {/* forgot password */}
            <div className="mt-3">
              <div>
                <small>
                  <a href="/forgotpassword" className="pseudo-href">{t('loginpage_forgot_password')}</a>
                </small>
              </div>
            </div>
            {/* forgot password ends */}

            {/* language switcher */}
            {/* TODO:  */}
            {/* <div className="mt-5">
              <small>
                {t('login_button_choose_locale')} &nbsp;
                {Object.keys(appLanguages).map((key) => (
                  <a
                    key={key}
                    className="pseudo-href me-1"
                    style={{ fontWeight: i18n.resolvedLanguage === key ? 'bold' : 'normal' }}
                    onClick={() => i18n.changeLanguage(key)}
                  >
                    {appLanguages[key].nativeName}
                  </a>
                ))}
              </small>
            </div> */}
            {/* language switcher ends */}
          </div>
          {/* login ends */}
        </div>
        {/* 
          footer 
          TODO: version should be read from the settings table
        */}
        <div className="footer">
          {/* <span className="mx-5 px-4 text-muted">&#169; {(new Date().getFullYear())} Accel IT Services, Version {version}</span> */}
        </div>
        {/* footer */}
      </ContainerPage>
    </div>
  );

  function onUpdateField(ev: any) {
    var name = ev.target.name;
    var value = ev.target.value;
    store.dispatch(updateField({ name: name as keyof LoginState['credentials'], value }));
  }
}