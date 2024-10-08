import React, { Fragment, useEffect } from 'react';
import { PasswordReset } from '../../../services/login';
import { dispatchOnCall, store } from '../../../state/store';
import { useStoreWithInitializer } from '../../../state/storeHooks';
import { ContainerPage } from '../../ContainerPage/ContainerPage';
import {
  ForgotPasswordState,
  formSubmitted,
  initializeForgot,
  updateCode,
  updateErrors,
  updateField,
} from './ForgotPassword.slice';
import { useTranslation } from 'react-i18next';
import { startPreloader, stopPreloader } from '../../Preloader/Preloader.slice';
import * as yup from 'yup';
import { ValidationErrorComp } from '../../ValidationErrors/ValidationError';
import { GuestHeader } from '../../GuestHeader/GuestHeader';
import { useHistory } from 'react-router-dom';
import { convertBackEndErrorsToValidationErrors } from '../../../helpers/formats';

export const ForgotPassword = () => {
  const { t, i18n } = useTranslation();
  const history = useHistory()
  const { errors, credentials, submitted, response } = useStoreWithInitializer(
    ({ forgotPassword }) => forgotPassword,
    dispatchOnCall(initializeForgot())
  );

  const validationSchema = yup.object().shape({
    employeecode: yup.string().required(t('validation_error_forgot_password_userid_required') ?? ''),
  });

  const onsubmit = () => {
    history.replace("verify-reset-password-code")
  }
  return (
    <div>
      <GuestHeader />
      <ContainerPage>
        <div>
          <div className='mx-2 py-0 my-0'>
            <div className=''>
              <h5>{t('forgotpassword_title_forgotpassword')} </h5>
            </div>
            <div className='p-0'>
              {response.IsCodeGenerated == false ? (
                <>
                  <p>
                    <small>{t('forgotpassword_message_empcode')}</small>
                  </p>
                  <ValidationErrorComp errors={errors} />
                  <fieldset className='form-group p-0'>
                    <label>{t('forgotpassword_input_label_userid')}</label>
                    <input
                      className={`form-control  ${errors['employeecode'] ? 'is-invalid' : ''}`}
                      name='employeecode'
                      onChange={onUpdateField}
                      value={credentials.employeecode}
                      data-testid='forgot_password_input_email'
                      disabled={submitted}
                    />
                    <div className='invalid-feedback'> {errors['employeecode']}</div>
                    <div className='d-flex flex-row mt-3 justify-content-between'>
                      <button className='btn  app-primary-bg-color text-white px-6' onClick={forgotPassword}>
                        {t('password_reset_submit_button')}
                      </button>
                    </div>
                  </fieldset>
                </>
              ) : (
                <Fragment>
                  <p>{t('forgotpassword_title_message')}</p>
                  {/* <a href="/verify-reset-password-code"> */}
                  <button className='btn  app-primary-bg-color text-white px-6' onClick={onsubmit}>
                    {t('forgotpassword_button_proceed')}
                  </button>
                  {/* </a> */}
                </Fragment>
              )}
            </div>
          </div>
        </div>
      </ContainerPage>
    </div>
  );

  async function forgotPassword(ev: React.FormEvent) {
    ev.preventDefault();
    if (store.getState().forgotPassword.submitted) return;
    store.dispatch(updateErrors({}));
    try {
      await validationSchema.validate(store.getState().forgotPassword.credentials, { abortEarly: false });
    } catch (error: any) {
      const errors = error.inner.reduce((allErrors: any, currentError: any) => {
        return { ...allErrors, [currentError.path as string]: currentError.message };
      }, {});
      store.dispatch(updateErrors(errors))
      if (errors)
        return;
    }
    store.dispatch(formSubmitted());
    store.dispatch(startPreloader())
    const { employeecode } = store.getState().forgotPassword.credentials;
    const result = await PasswordReset(employeecode);
    result.match({
      ok: (data) => {
        store.dispatch(updateCode(data));
      },
      err: (e) => {
        const errorMessages = convertBackEndErrorsToValidationErrors(e)
        store.dispatch(updateErrors(errorMessages));
      },
    });
    store.dispatch(stopPreloader())
  }
}

const onUpdateField = (ev: any) => {
  var name = ev.target.name;
  var value = ev.target.value;
  store.dispatch(updateField({ name: name as keyof ForgotPasswordState['credentials'], value }));
}