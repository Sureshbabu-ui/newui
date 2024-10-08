import React, { useEffect } from 'react';
import { ConfirmCode } from '../../../services/login';
import { dispatchOnCall, store } from '../../../state/store';
import { useStoreWithInitializer } from '../../../state/storeHooks';
import { initializeVerify, updateErrors, updateField, VerifyCodeState } from './CodeVerification.slice';
import { ContainerPage } from '../../ContainerPage/ContainerPage';
import { useTranslation } from 'react-i18next';
import { startPreloader, stopPreloader } from '../../Preloader/Preloader.slice';
import * as yup from 'yup';
import { ValidationErrorComp } from '../../ValidationErrors/ValidationError';
import { GuestHeader } from '../../GuestHeader/GuestHeader';
import { useHistory } from 'react-router-dom';
import { convertBackEndErrorsToValidationErrors } from '../../../helpers/formats';

export function CodeVerification() {
  const { t, i18n } = useTranslation();
  const history=useHistory();
  const { errors, credentials, submitted } = useStoreWithInitializer(
    ({ codeverification }) => codeverification,
    dispatchOnCall(initializeVerify())
  );

  const validationSchema = yup.object().shape({
    Code: yup.string().required(t('validation_error_forgot_password_code_required') ?? ''),
  });

  return (
    <div className="auth-page">
      <GuestHeader />
      <ContainerPage>
        <div className="">
          <div className="mx-2 py-0 my-0">
            <div>
              <h5 className='app-primary-color'> {t('forgotpassword_title_verifycode')} </h5>
            </div>
            <div className="p-0">
              <ValidationErrorComp errors={errors}/>
              <fieldset className="form-group p-0">
                <label>{t('forgotpassword_label_secret_code')}</label>
                <input
                  className={`form-control ${errors["Code"] ? "is-invalid" : ""}`}
                  name="Code"
                  onChange={onUpdateField}
                  value={credentials.Code}
                  data-testid="code_verification_input_code"
                  disabled={submitted}
                />
                <div className="invalid-feedback"> {errors['Code']}</div>
                <div className="d-flex flex-row mt-3 justify-content-between">
                  <button className="btn  app-primary-bg-color text-white px-6" onClick={codeVerify}>{t('password_reset_submit_button')}</button>
                </div>
              </fieldset>
            </div>
          </div>
        </div>
      </ContainerPage>
    </div>
  );

  async function codeVerify(ev: React.FormEvent) {
    ev.preventDefault();
    if (store.getState().codeverification.submitted) return;
    store.dispatch(updateErrors({}));
    try {
      await validationSchema.validate(store.getState().codeverification.credentials, { abortEarly: false });
    } catch (error: any) {
      const errors = error.inner.reduce((allErrors: any, currentError: any) => {
        return { ...allErrors, [currentError.path as string]: currentError.message };
      }, {});
      store.dispatch(updateErrors(errors))
      if (errors)
        return;
    }
    store.dispatch(startPreloader())
    const { Code } = store.getState().codeverification.credentials;
    const { employeecode } = store.getState().forgotPassword.credentials;
    const result = await ConfirmCode(employeecode, Code);
    result.match({
      ok: () => {
        history.push('resetpassword')
      },
      err: (e) => {
        const errorMessages = convertBackEndErrorsToValidationErrors(e)
        store.dispatch(updateErrors(errorMessages));      },
    });
    store.dispatch(stopPreloader())
  }
}

const onUpdateField = (ev: any) => {
  var name = ev.target.name;
  var value = ev.target.value;
  store.dispatch(updateField({ name: name as keyof VerifyCodeState['credentials'], value }));
}

