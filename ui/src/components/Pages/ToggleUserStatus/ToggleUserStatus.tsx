import { dispatchOnCall, store } from '../../../state/store';
import { useStoreWithInitializer } from '../../../state/storeHooks';
import { initializeToggleUserStatus, startSubmitting, stopSubmitting } from './ToggleUserStatus.slice';
import { toggleUserStatus } from '../../../services/users';
import SweetAlert from 'react-bootstrap-sweetalert';
import { ContainerPage } from '../../ContainerPage/ContainerPage';
import { setConfirmString, toggleInformationModalStatus } from '../ToggleUserStatus/ToggleUserStatus.slice';
import { useTranslation } from 'react-i18next';
import { checkForPermission } from '../../../helpers/permissions';
import { useRef } from 'react';
import { initializeProfile, loadUserProfile } from '../UserProfile/ProfileInfo.slice';
import { getClickedProfileDetails, getClickedUserStatus } from '../../../services/userprofiles';
import { setUserStatus } from '../UserProfile/UpdateUserPassword.slice';
import { setUserProfileStatus } from '../UserProfile/UserProfile.slice';

export function UserStatus() {
  const { t, i18n } = useTranslation();
  const { displayInformationModal, user, confirmString } = useStoreWithInitializer(
    ({ userStatus }) => userStatus,
    dispatchOnCall(initializeToggleUserStatus())
  );
  const modalRef = useRef<HTMLButtonElement>(null);

  const onModalClose = () => {
    store.dispatch(setConfirmString(""))
  }

  async function reDirectRoute() {
    store.dispatch(toggleInformationModalStatus());
    store.dispatch(initializeToggleUserStatus())
    modalRef.current?.click()
    store.dispatch(initializeProfile())
    const result = await getClickedProfileDetails(String(user.Id));
    store.dispatch(loadUserProfile(result.UserDetails[0]));
    const result1 = await getClickedUserStatus(String(user.Id));
    store.dispatch(setUserStatus(result1.UserStatus[0].IsActive));
    store.dispatch(setUserProfileStatus(result1.UserStatus[0].IsActive));
  }

  function confirmStringUpdated(event: any) {
    store.dispatch(setConfirmString(event.target.value));
  }

  function updateUserStatus() {
    store.dispatch(startSubmitting());
    const result = toggleUserStatus(store.getState().userStatus.user);
    store.dispatch(stopSubmitting());
    store.dispatch(toggleInformationModalStatus());
  }

  function InformationModal() {
    const { t, i18n } = useTranslation();
    return (
      <SweetAlert success title='Success' onConfirm={reDirectRoute}>
        {t('toggle_user_status_title_success')}
      </SweetAlert>
    );
  }

  return (
    <div
      className='modal fade'
      id='updatUserStatus'
      data-bs-backdrop='static'
      data-bs-keyboard='false'
      aria-hidden='true'
      onClick={onModalClose}
    >
      <div className='modal-dialog'>
        <div className='modal-content'>
          <div className='modal-header'>
            <h5 className='modal-title'>{t('usermanagement_title_update_user_status')}</h5>
            <button
              type='button'
              className='btn-close'
              data-bs-dismiss='modal'
              id='closeToggleUserStatusModal'
              aria-label='Close'
              ref={modalRef}
            ></button>
          </div>
          <div className='modal-body'>
            <div className='auth-page'>
              {checkForPermission("USER_MANAGE") && <>
                <ContainerPage>
                  <div className='p-0 pt-0'>
                    {t('user_status_help_text_1')}{store.getState().userStatus.user.UserInfoStatus == false ? 'enable' : 'disable'} {t('user_status_help_text_2')}
                    <p className='mt-2'>
                      <input type='text' className='form-control' value={confirmString ?? ""}
                        onPaste={(e) => {
                          e.preventDefault(); // Prevent paste event
                        }}
                        onCopy={(e) => {
                          e.preventDefault(); // Prevent copy event
                        }}
                        autoComplete="off" placeholder='CONFIRM' onChange={confirmStringUpdated} />
                    </p>
                    <div className=''>
                      <button
                        type='button'
                        className={store.getState().userStatus.user.UserInfoStatus == false ? 'btn btn-success' : 'btn btn-danger'}
                        disabled={store.getState().userStatus.confirmString != 'CONFIRM' ? true : false}
                        onClick={updateUserStatus}
                        data-testid="toggle_user_status_button_confirm"
                      >
                        {store.getState().userStatus.user.UserInfoStatus == false ? `${t('user_status_enable_button')}` : `${t('user_status_disable_button')}`}
                      </button>
                      &nbsp;
                      <button type='button' className='btn btn-secondary' data-bs-dismiss='modal'>
                        {t('toggle_user_status_button_close')}
                      </button>
                    </div>
                    {displayInformationModal ? <InformationModal /> : ''}
                  </div>
                </ContainerPage>
              </>
              }
            </div>
          </div>
        </div>
      </div>
    </div>

  );
}