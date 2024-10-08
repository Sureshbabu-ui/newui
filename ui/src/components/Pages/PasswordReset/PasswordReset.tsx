import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { logout } from '../../App/App.slice';
import { passwordUpdate } from '../../../services/login';
import { dispatchOnCall, store } from '../../../state/store';
import { useStoreWithInitializer } from '../../../state/storeHooks';
import {
  PasswordChangeState,
  formSubmitted,
  initializePasswordReset,
  updateErrors,
  updateField,
} from './PasswordReset.slice';
import { ContainerPage } from '../../ContainerPage/ContainerPage';
import toast, { Toaster } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { startPreloader, stopPreloader } from '../../Preloader/Preloader.slice';
import * as yup from 'yup';
import { ValidationErrorComp } from '../../ValidationErrors/ValidationError';
import { convertBackEndErrorsToValidationErrors } from '../../../helpers/formats';
import { useHistory } from 'react-router-dom';
import BreadCrumb from '../../BreadCrumbs/BreadCrumb';

export function PasswordReset() {
  const { t, i18n } = useTranslation();
  const [viewType, setViewType] = useState('password');
  const [newPasswordviewType, setNewPasswordViewType] = useState('password');
  const [confirmPasswordviewType, setConfirmPasswordviewType] = useState('password');
  const { errors, credential, submitted } = useStoreWithInitializer(
    ({ passwordReset }) => passwordReset,
    dispatchOnCall(initializePasswordReset())
  );

  const history = useHistory()

  const validationSchema = yup.object().shape({
    OldPassword: yup.string().required(t('validation_error_password_reset_old_password_required') ?? ''),
    NewPassword: yup
    .string()
    .required(t('validation_error_password_reset_new_password_required') ?? '')
    .test(
      'password-validation',
      t('validation_error_changepassword_checking_rule') ?? '',
      function (value) {
        if (!value) return true;
        const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[a-zA-Z0-9]).{8,16}$/;
        return regex.test(value);
      }
    ),
    ConfirmPassword: yup
      .string()
      .required(t('validation_error_password_reset_confirm_password_required') ?? '')
      .test('passwords-match', ((t('validation_error_password_reset_confirm_password_mismatch') ?? '')), function (value) {
        const { NewPassword } = this.parent;
        return value === NewPassword;
      }),
  });
  const breadcrumbItems = [
    { Text: 'breadcrumbs_home', Link: '/' },
    { Text: 'breadcrumbs_change_password' }
  ];

  return (
    <div className="auth-page">
      <ContainerPage>
        <BreadCrumb items={breadcrumbItems} />
        <div className="ms-2">
          <div>
            <p className="mt-2 row m-0">
              <div className="col-md-4 alert alert-warning rounded-0 py-1 px-2 text-size-11 text-black" role="alert">
                <div className="d-flex">
                  <span className="material-symbols-outlined fs-5 me-1 flex-start">info</span>
                  <span className="">{t('changepassword_message')}</span>
                </div>
              </div>
            </p>
          </div>
          <div className="p-0 row m-0">
            {/* Change Password form */}
            <ValidationErrorComp errors={errors} />
            <fieldset className="form-group p-0 col-md-4">
              <div className="row">
                <label className="red-asterisk">{t('changepassword_label_oldpassword')}</label>
                <div className="input-group mb-1">
                  <input
                    type={viewType}
                    className={`form-control border ${errors["OldPassword"] ? "is-invalid border-danger" : ""}`}
                    name="OldPassword"
                    onChange={onUpdateField}
                    value={credential.OldPassword}
                    data-testid="change_password_input_passcode"
                    disabled={submitted}
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
                  <div className="invalid-feedback text-danger">{t(errors['OldPassword'])}</div>
                </div>
              </div>
              <div className="row">
                <label className="red-asterisk">{t('changepassword_label_newpassword')}</label>
                <div className="input-group mb-1">
                  <input
                    type={newPasswordviewType}
                    className={`form-control border ${errors["NewPassword"] ? "is-invalid border-danger" : ""}`}
                    name="NewPassword"
                    onChange={onUpdateField}
                    value={credential.NewPassword}
                    data-testid="change_password_input_passcode"
                    disabled={submitted}
                  />
                  {newPasswordviewType == "password" ?
                    (

                      <div className="ps-2 pt-2 input-group-text" role='button' onClick={() => setNewPasswordViewType('text')}>
                        <span className="material-symbols-outlined app-primary-color  cursor-pointer ">
                          visibility
                        </span>
                      </div>
                    ) : (
                      <div className="ps-2 pt-2 input-group-text" role='button' onClick={() => setNewPasswordViewType('password')}>
                        <span className="material-symbols-outlined app-primary-color  cursor-pointer ">
                          visibility_off
                        </span>
                      </div>
                    )
                  }
                  <div className="invalid-feedback text-danger">{t(errors['NewPassword'])}</div>
                </div>
              </div>
              <div className="row">
                <label className="red-asterisk">{t('changepassword_confirmpassword')}</label>
                <div className="input-group mb-1">
                  <input
                    type={confirmPasswordviewType}
                    className={`form-control border ${errors["ConfirmPassword"] ? "is-invalid border-danger" : ""}`}
                    name="ConfirmPassword"
                    onChange={onUpdateField}
                    value={credential.ConfirmPassword}
                    data-testid="change_password_input_passcode"
                    disabled={submitted}
                  />
                  {confirmPasswordviewType == "password" ?
                    (

                      <div className="ps-2 pt-2 input-group-text" role='button' onClick={() => setConfirmPasswordviewType('text')}>
                        <span className="material-symbols-outlined app-primary-color  cursor-pointer ">
                          visibility
                        </span>
                      </div>
                    ) : (
                      <div className="ps-2 pt-2 input-group-text" role='button' onClick={() => setConfirmPasswordviewType('password')}>
                        <span className="material-symbols-outlined app-primary-color  cursor-pointer ">
                          visibility_off
                        </span>
                      </div>
                    )
                  }
                  <div className="invalid-feedback text-danger">{t(errors['ConfirmPassword'])}</div>
                </div>
              </div>
              <div className="d-flex flex-row mt-3 justify-content-between">
                <button className="btn  app-primary-bg-color text-white px-6" onClick={passwordReset}>{t('password_reset_submit_button')}</button>
              </div>
            </fieldset>
            {/* Change Password form ends here */}
          </div>
        </div>
        {/* toast */}
        <Toaster />
        {/* toast ends */}
      </ContainerPage>

    </div>
  );

  async function passwordReset(ev: React.FormEvent) {
    ev.preventDefault();
    if (store.getState().passwordReset.submitted) return;
    store.dispatch(updateErrors({}));
    try {
      await validationSchema.validate(credential, { abortEarly: false });
    } catch (error: any) {
      const errors = error.inner.reduce((allErrors: any, currentError: any) => {
        return { ...allErrors, [currentError.path as string]: currentError.message };
      }, {});
      store.dispatch(updateErrors(errors))
      if (errors)
        return;
    }
    store.dispatch(startPreloader())
    store.dispatch(formSubmitted());
    const { OldPassword, NewPassword, ConfirmPassword } = store.getState().passwordReset.credential;
    const result = await passwordUpdate(OldPassword, NewPassword, ConfirmPassword);
    result.match({
      ok: () => {
        // in case if the user refresh the page before redirection
        // do not remove this
        delete axios.defaults.headers.Authorization;
        localStorage.removeItem('token');

        toast(i18n.t('password_reset_message_success'),
          {
            duration: 3000,
            style: {
              borderRadius: '0',
              background: '#00D26A',
              color: '#fff',
            }
          });

        setTimeout(() => {
          history.push('/login')
          store.dispatch(logout());
        }, 3500);
      },
      err: (e) => {
        toast(i18n.t('password_reset_message_failed'),
          {
            duration: 6000,
            style: {
              borderRadius: '0',
              background: '#F92F60',
              color: '#fff',
            }
          })
        {
          const errorMessages = convertBackEndErrorsToValidationErrors(e)
          store.dispatch(updateErrors(errorMessages))
        }
      },
    })
    store.dispatch(stopPreloader())
  }
}
const onUpdateField = (ev: any) => {
  var name = ev.target.name;
  var value = ev.target.value;
  store.dispatch(updateField({ name: name as keyof PasswordChangeState['credential'], value }));
}

