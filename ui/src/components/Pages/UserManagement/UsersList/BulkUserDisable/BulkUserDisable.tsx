import { store } from '../../../../../state/store';
import { useStore } from '../../../../../state/storeHooks';
import { initializeToggleUserStatus, setConfirmString, toggleInformationModalStatus } from './BulkUserDisable.slice';
import { DisableUsers, getUsersList, toggleUserStatus } from '../../../../../services/users';
import SweetAlert from 'react-bootstrap-sweetalert';
import { ContainerPage } from '../../../../ContainerPage/ContainerPage';
import { useTranslation } from 'react-i18next';
import { checkForPermission } from '../../../../../helpers/permissions';
import { useRef } from 'react';
import { initializeUsersList, loadUsers } from '../UserManagement.slice';

export function BulkDisableUser() {
  const { t, i18n } = useTranslation();
  const { displayInformationModal, confirmString, disableUsers, userIdList } = useStore(({ disableusers }) => disableusers);
  const modalRef = useRef<HTMLButtonElement>(null);

  const onModalClose = () => {
    store.dispatch(setConfirmString(""))
  }

  function confirmStringUpdated(event: any) {
    store.dispatch(setConfirmString(event.target.value));
  }

  async function updateUserStatus() {
    const result = await DisableUsers(disableUsers);
    result.match({
      ok: () => {
        store.dispatch(toggleInformationModalStatus());
      },
      err: async (error) => {
        return error;
      }
    });
  }

  function InformationModal() {
    const { t, i18n } = useTranslation();
    return (
      <SweetAlert success title='Success' onConfirm={reDirectRoute}>
        {t('disable_users_message_success_delete')}
      </SweetAlert>
    );
  }

 async function reDirectRoute() {
    store.dispatch(toggleInformationModalStatus());
    store.dispatch(initializeToggleUserStatus())
    store.dispatch(initializeUsersList())
    modalRef.current?.click()
    const result = await getUsersList(store.getState().usermanagement.currentPage, store.getState().usermanagement.SearchText, store.getState().usermanagement.SearchWith)
    store.dispatch(loadUsers(result));
  }

  return (
    <div
      className='modal fade'
      id='DisableUsers'
      data-bs-backdrop='static'
      data-bs-keyboard='false'
      aria-hidden='true'
      onClick={onModalClose}
    >
      <div className='modal-dialog'>
        <div className='modal-content'>
          <div className='modal-header'>
            <h5 className='modal-title'>{t('disable_user_modal_label')}{userIdList.length > 1 && 's'}</h5>
            <button
              type='button'
              className='btn-close'
              data-bs-dismiss='modal'
              id='closeDisableUsers'
              aria-label='Close'
              ref={modalRef}
            ></button>
          </div>
          <div className='modal-body'>
            <div className='auth-page'>
              {checkForPermission("USER_MANAGE") && <>
                <ContainerPage>
                  <div className='p-0 pt-0'>
                    <span>{t(`disable_users_delete_question`)}{userIdList.length > 1 && 's'} ? </span>
                    {t('disable_users_confirmation_text')}
                    <p className='mt-2'>
                      <input type='text'
                        onPaste={(e) => {
                          e.preventDefault(); // Prevent paste event
                        }}
                        onCopy={(e) => {
                          e.preventDefault(); // Prevent copy event
                        }}
                        autoComplete="off" className='form-control' placeholder='CONFIRM' onChange={confirmStringUpdated} />
                    </p>
                    <div className=''>
                      <button
                        type='button'
                        className="btn btn-danger"
                        disabled={confirmString == 'CONFIRM' ? false : true}
                        onClick={updateUserStatus}
                        data-testid="toggle_user_status_button_confirm"
                      >
                        {t('disable_users_button')}
                      </button>
                      &nbsp;
                      <button type='button' className='btn btn-secondary' data-bs-dismiss='modal'>
                        {t('disable_user_button_close')}
                      </button>
                    </div>
                    {displayInformationModal ? <InformationModal /> : ''}
                  </div>
                </ContainerPage>
              </>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}