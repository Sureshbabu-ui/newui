import { useTranslation } from 'react-i18next';
import { dispatchOnCall, store } from '../../../state/store';
import { ContainerPage } from '../../ContainerPage/ContainerPage';
import { ValidationErrorComp } from '../../ValidationErrors/ValidationError';
import { useStoreWithInitializer } from '../../../state/storeHooks';
import { UserPasswordState, initializeUserPasswordUpdate, updateErrors, updateField, setUserStatus } from './UpdateUserPassword.slice';
import { updateValidationErrors } from '../../App/App.slice';
import { startPreloader, stopPreloader } from '../../Preloader/Preloader.slice';
import * as yup from 'yup';
import { UserpasswordUpdate } from '../../../services/users';
import SweetAlert from 'react-bootstrap-sweetalert';
import { toggleInformationModalStatus } from './UpdateUserPassword.slice';
import { convertBackEndErrorsToValidationErrors } from '../../../helpers/formats';
import { getClickedUserStatus } from '../../../services/userprofiles';
import { useState } from 'react';

export function UpdateUserPassword() {
  const { t, i18n } = useTranslation();
  const [viewType, setViewType] = useState('password');
  const [confirmPasswordviewType, setConfirmPasswordviewType] = useState('password');
  const { errors, credentials, displayInformationModal, IsActive } = useStoreWithInitializer(({ changeuserPassword }) => changeuserPassword, dispatchOnCall(initializeUserPasswordUpdate()));

  const validationSchema = yup.object().shape({
    NewPasscode: yup.string().required(t('validation_error_password_reset_new_password_required') ?? ''),
    ConfirmPasscode: yup.string().required('validation_error_password_reset_confirm_password_required').test('passwords-match', ((t('validation_error_password_reset_confirm_password_mismatch') ?? '')), function (value) {
      const { NewPasscode } = this.parent;
      return value === NewPasscode;
    }),
  });

  const onUpdateField = (ev: any) => {
    var name = ev.target.name;
    var value = ev.target.value;
    var checked = ev.target.checked;
    if (name === 'IsActive') {
      value = checked ? true : false;
    }
    store.dispatch(updateField({ name: name as keyof UserPasswordState['credentials'], value }));
  }

  return (
    <ContainerPage>
      <div className="col-md-12">
        <div className="row">
          <div className="header">
            <h5 className="ms-2">{t('update_user_password_main_heading')}</h5>
          </div>
          <div className="body">
            {/* Change Password form */}
            <ContainerPage>
              <ValidationErrorComp errors={errors} />
              <fieldset className="form-group mb-2">
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="IsActive"
                    id="flexSwitchCheckDefault"
                    checked={credentials.IsActive.valueOf()}
                    value={credentials.IsActive.toString()}
                    onChange={onUpdateField}
                  ></input>
                  <label className="form-check-label red-asterisk" htmlFor="flexSwitchCheckDefault">{t('update_user_password_switck_checkbox_status')}</label>
                  <div id="emailHelp" className="form-text">{t('update_user_password_help_text')}</div>
                </div>
                <div className='row'>
                  <label className="red-asterisk">{t('change_password_input_label_password')}</label>
                  <div className="input-group mb-1">
                    <input
                      type={viewType}
                      className={`form-control border ${errors["NewPasscode"] ? "is-invalid border-danger" : ""}`}
                      name="NewPasscode"
                      autoComplete="new-password" // Prevents autofill
                      value={credentials.NewPasscode}
                      onChange={onUpdateField}
                      data-testid="change_password_input_passcode"
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
                  </div>
                  {errors['NewPasscode'] ? (
                    <div className="small text-danger"> {t(errors['NewPasscode'])}</div>
                  ) : (
                    <label className=""><small>{t('changepassword_checking_rule')}</small></label>
                  )}
                </div>

                <div className="row">
                  <label className="red-asterisk">{t('change_password_input_label_confirm_password')}</label>
                  <div className="input-group mb-1">
                    <input
                      type={confirmPasswordviewType}
                      className={`form-control border ${errors["ConfirmPasscode"] ? "is-invalid border-danger" : ""}`}
                      name="ConfirmPasscode"
                      onChange={onUpdateField}
                      value={credentials.ConfirmPasscode}
                      data-testid="change_password_input_passcode"
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
                    <div className="invalid-feedback text-danger">{t(errors['ConfirmPasscode'])}</div>
                  </div>
                </div>
                <div className="d-flex flex-row mt-3 justify-content-between">
                  <button className="btn app-primary-bg-color text-white  px-6"
                    onClick={passwordchange}
                  >{t('change_password_button_submit')}</button>
                </div>
              </fieldset>
            </ContainerPage>
            {/* Change Password form ends here */}
          </div>
        </div>
        {displayInformationModal ? <InformationModal /> : ''}
      </div>
    </ContainerPage>
  );

  async function passwordchange(ev: React.FormEvent) {
    ev.preventDefault();
    store.dispatch(updateErrors({}));
    store.dispatch(updateValidationErrors({}))
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

    const { NewPasscode, ConfirmPasscode, IsActive } = store.getState().changeuserPassword.credentials;
    const result = await UserpasswordUpdate(NewPasscode, ConfirmPasscode, IsActive, store.getState().profile.singleprofile.Id.toString());
    result.match({
      ok: () => {
        store.dispatch(toggleInformationModalStatus());
      },
      err: (e) => {
        const errorMessages = convertBackEndErrorsToValidationErrors(e)
        store.dispatch(updateErrors(errorMessages));
      },
    });
    store.dispatch(stopPreloader())
  }

  function InformationModal() {
    const { t, i18n } = useTranslation();
    return (
      <SweetAlert success title='Success' onConfirm={reDirectRoute}>
        {t('update_user_password_success_message')}<br></br>
        <small>{t('update_user_password_small_success_message')}</small>
      </SweetAlert>
    );
  }

  async function reDirectRoute() {
    store.dispatch(toggleInformationModalStatus());
    const result1 = await getClickedUserStatus(store.getState().profile.singleprofile.Id.toString());
    store.dispatch(setUserStatus(result1.UserStatus[0].IsActive));
    store.dispatch(updateField({ name: 'ConfirmPasscode', value: '' }))
    store.dispatch(updateField({ name: 'NewPasscode', value: '' }))

  }
}