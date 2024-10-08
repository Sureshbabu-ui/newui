import React, { Fragment, useEffect, useState } from 'react';
import { updatePassword } from '../../../services/login';
import { dispatchOnCall, store } from '../../../state/store';
import { useStoreWithInitializer } from '../../../state/storeHooks';
import { ContainerPage } from '../../ContainerPage/ContainerPage';
import {
  ForgotPasswordState,
  formSubmitted,
  initializePasswordChange,
  updateErrors,
  updateField,
} from './ChangePassword.slice';
import { useTranslation } from 'react-i18next';
import { startPreloader, stopPreloader } from '../../Preloader/Preloader.slice';
import * as yup from 'yup';
import { ValidationErrorComp } from '../../ValidationErrors/ValidationError';
import { GuestHeader } from '../../GuestHeader/GuestHeader';
import { convertBackEndErrorsToValidationErrors } from '../../../helpers/formats';

export function PasswordChange() {
  const { t, i18n } = useTranslation();
  const [viewType, setViewType] = useState('password');
  const [confirmPasswordviewType, setConfirmPasswordviewType] = useState('password');

  const { errors, credentials, submitted } = useStoreWithInitializer(({ changePassword }) => changePassword, dispatchOnCall(initializePasswordChange())
  );
  const onUpdateField = (ev: any) => {
    var name = ev.target.name;
    var value = ev.target.value;
    store.dispatch(updateField({ name: name as keyof ForgotPasswordState['credentials'], value }));
  }

  const changePassword = async (ev: React.FormEvent) => {
    ev.preventDefault();
    store.dispatch(updateErrors({}));
    try {
      await validationSchema.validate(store.getState().changePassword.credentials, { abortEarly: false });
    }
    catch (error: any) {
      const errors = error.inner.reduce((allErrors: any, currentError: any) => {
        return { ...allErrors, [currentError.path as string]: currentError.message };
      }, {});
      store.dispatch(updateErrors(errors))
      if (errors)
        return;
    }
    store.dispatch(startPreloader())
    const { PassCode, ConfirmPassword } = store.getState().changePassword.credentials;
    const employeecode = store.getState().forgotPassword.credentials.employeecode;
    const Code = store.getState().codeverification.credentials.Code;
    const result = await updatePassword(PassCode, ConfirmPassword, employeecode, Code);
    result.match({
      ok: () => {
        store.dispatch(formSubmitted());
      },
      err: (e) => {
        const errorMessages = convertBackEndErrorsToValidationErrors(e)
        store.dispatch(updateErrors(errorMessages))
      },
    });
    store.dispatch(stopPreloader())
  }

  const validationSchema = yup.object().shape({
    PassCode: yup.string()
      .required(t('validation_error_change_password_new_password_required') ?? ''),
    ConfirmPassword: yup.string()
      .required(t('validation_error_change_password_confirm_password_required') ?? '')
      .oneOf([yup.ref('PassCode')], t('validation_error_password_reset_confirm_password_mismatch') ?? ''),
  });

  return (
    <div className='auth-page'>
      <GuestHeader />
      <ContainerPage>
        <div className="">
          <div className="m-2 my-0 ">
            <h5 className="app-primary-color">{t('change_password_title_change_password')}</h5>
            <div className="p-0 ">
              {submitted == false ? (
                <>
                  <ValidationErrorComp errors={errors} />
                  <fieldset className="form-group p-0  m-0 p-0">
                    <div className="row">
                      <label className="red-asterisk">{t('change_password_input_label_password')}</label>
                      <div className="input-group mb-1">
                        <input
                          type={viewType}
                          className={`form-control border ${errors["PassCode"] ? "is-invalid border-danger" : ""}`}
                          name="PassCode"
                          onChange={onUpdateField}
                          value={credentials.PassCode}
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
                        <div className="invalid-feedback text-danger">{t(errors['PassCode'])}</div>
                      </div>
                      <div>
                        <label className=""><small>{t('changepassword_checking_rule')}</small></label>
                      </div>
                    </div>
                    <div className="row">
                      <label className="red-asterisk">{t('change_password_input_label_confirm_password')}</label>
                      <div className="input-group mb-1">
                        <input
                          type={confirmPasswordviewType}
                          className={`form-control border ${errors["ConfirmPassword"] ? "is-invalid border-danger" : ""}`}
                          name="ConfirmPassword"
                          onChange={onUpdateField}
                          value={credentials.ConfirmPassword}
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
                      <button className="btn app-primary-bg-color text-white px-6" onClick={changePassword}>{t('change_password_button_submit')}</button>
                    </div>
                  </fieldset>
                </>
              ) : (
                <Fragment>
                  <p>
                    {t('changepassword_success_message1')} <a href='/login'>{t('changepassword_success_message2')}</a>
                    {t('changepassword_success_message3')}
                  </p>
                </Fragment>
              )}
            </div>
          </div>
        </div>
      </ContainerPage>
    </div>
  );

}

