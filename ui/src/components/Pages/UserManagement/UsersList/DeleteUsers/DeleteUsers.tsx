import { store } from '../../../../../state/store';
import { useStore } from '../../../../../state/storeHooks';
import { DeleteSelectedUsers, getUsersList } from '../../../../../services/users';
import SweetAlert from 'react-bootstrap-sweetalert';
import { ContainerPage } from '../../../../ContainerPage/ContainerPage';
import { setConfirmString, toggleInformationModalStatus, initializeToggleUserStatus, startSubmitting, stopSubmitting } from './DeleteUsers.slice';
import { useTranslation } from 'react-i18next';
import { checkForPermission } from '../../../../../helpers/permissions';
import { useRef } from 'react';
import { initializeUsersList, loadUsers } from '../UserManagement.slice';

export function DeleteUsers() {
  const { t, i18n } = useTranslation();
  const { displayInformationModal, confirmString, deleteUsers, userIdList, } = useStore(({ deleteusers }) => deleteusers);
  const modalRef = useRef<HTMLButtonElement>(null);

  const onModalClose = () => {
    store.dispatch(setConfirmString(""))
  }

  function confirmStringUpdated(event: any) {
    store.dispatch(setConfirmString(event.target.value));
  }

  async function updateUserStatus() {
    store.dispatch(startSubmitting());
    const result = DeleteSelectedUsers(deleteUsers);
    store.dispatch(stopSubmitting());
    store.dispatch(toggleInformationModalStatus());
  }

  function InformationModal() {
    const { t, i18n } = useTranslation();
    return (
      <SweetAlert success title='Success' onConfirm={reDirectRoute}>
        {t('delete_users_message_success_delete')}
      </SweetAlert>
    );
  }

async  function reDirectRoute() {
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
      id='DeleteUsers'
      data-bs-backdrop='static'
      data-bs-keyboard='false'
      aria-hidden='true'
      onClick={onModalClose}
    >
      <div className='modal-dialog'>
        <div className='modal-content'>
          <div className='modal-header'>
            <h5 className='modal-title'>{t('delete_user_modal_label')}{userIdList.length > 1 && 's'}</h5>
            <button
              type='button'
              className='btn-close'
              data-bs-dismiss='modal'
              id='closeDeleteUsers'
              aria-label='Close'
              ref={modalRef}
            ></button>
          </div>
          <div className='modal-body'>
            <div className='auth-page'>
              {checkForPermission("USER_MANAGE") && <>
                <ContainerPage>
                  <div className='p-0 pt-0'>
                    <span>{t(`delete_users_delete_question`)}{userIdList.length > 1 && 's'} ?</span>
                    {t('delete_users_confirmation_text')}
                    <p className='mt-2'>
                      <input type='text' className='form-control' onPaste={(e) => {
                        e.preventDefault(); // Prevent paste event
                      }}
                        onCopy={(e) => {
                          e.preventDefault(); // Prevent copy event
                        }}
                        autoComplete="off" value={confirmString ?? ""} placeholder='CONFIRM' onChange={confirmStringUpdated} />
                    </p>
                    <div className=''>
                      <button
                        type='button'
                        className="btn btn-danger"
                        disabled={confirmString == 'CONFIRM' ? false : true}
                        onClick={updateUserStatus}
                        data-testid="toggle_user_status_button_confirm"
                      >
                        {t('delete_user_button')}
                      </button>
                      &nbsp;
                      <button type='button' className='btn btn-secondary' data-bs-dismiss='modal'>
                        {t('delete_user_button_close')}
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
