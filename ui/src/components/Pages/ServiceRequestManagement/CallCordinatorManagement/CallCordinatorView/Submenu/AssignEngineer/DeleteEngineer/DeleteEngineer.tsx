import { dispatchOnCall, store } from '../../../../../../../../state/store';
import { useStoreWithInitializer } from '../../../../../../../../state/storeHooks';
import { ServiceRequestAssigneeDeleteState, initializeDeleteEngineer, setConfirmString, startSubmitting, stopSubmitting, updateErrors, updateField } from './DeleteEngineer.slice';
import { useRef } from "react";
import SweetAlert from 'react-bootstrap-sweetalert';
import { ContainerPage } from '../../../../../../../ContainerPage/ContainerPage';
import { toggleInformationModalStatus } from './DeleteEngineer.slice';
import { useTranslation } from 'react-i18next';
import { assigneesList, deleteAssignee } from '../../../../../../../../services/assignEngineer';
import { loadAssignees } from '../AssignEngineer.slice';

export function DeleteEngineer() {
  const { t, i18n } = useTranslation();
  const modalRef = useRef<HTMLButtonElement>(null);
  const { displayInformationModal, engineerdelete, confirmString } = useStoreWithInitializer(
    ({ deleteengineer }) => deleteengineer,
    dispatchOnCall(initializeDeleteEngineer())
  );
  const ServiceRequestId = store.getState().callcordinatormanagement.serviceRequestId
  const InformationModal = () => {
    const { t } = useTranslation();
    return (
      <SweetAlert success title="Success" onConfirm={updateAssignEngineer}>
        {t('assign_engineer_deleted_success_message')}
      </SweetAlert>
    );
  }

  const updateAssignEngineer = async () => {
    store.dispatch(toggleInformationModalStatus());
    const result = await assigneesList(ServiceRequestId ?? 0);
    store.dispatch(loadAssignees(result));
    modalRef.current?.click()
  }

  const onUpdateRemarksField = (ev: any) => {
    const { name, value } = ev.target;
    store.dispatch(updateField({ name: name as keyof ServiceRequestAssigneeDeleteState['engineerdelete'], value }));
  };

  const onModalClose = async () => {
    store.dispatch(initializeDeleteEngineer())
    const result = await assigneesList(ServiceRequestId ?? 0);
    store.dispatch(loadAssignees(result));
  }

  function confirmStringUpdated(event: any) {
    store.dispatch(setConfirmString(event.target.value));
  }

  return (
    <>
      <div
        className="modal fade"
        id='DeleteEngineer'
        data-bs-backdrop='static'
        data-bs-keyboard='false'
        aria-hidden='true'
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header mx-0">
              <h5 className="modal-title app-primary-color">{t('assign_engineer_delete_main_heading')}</h5>
              <button
                type='button'
                className="btn-close"
                data-bs-dismiss='modal'
                id='closeDeleteEngineerModal'
                onClick={onModalClose}
                aria-label='Close'
                ref={modalRef}
              ></button>
            </div>
            <div className="modal-body">
              <ContainerPage>
                <div className='p-0 pt-0'>
                  <div className="row m-0">
                    <label className='p-0'>{t('assign_engineer_delete_remarks')}</label>
                    <textarea onChange={onUpdateRemarksField} name="DeletedReason" value={engineerdelete.DeletedReason} />
                  </div>
                  <p className='mt-2'>
                    <label>{t('assign_engineer_delete_label')}</label>
                    <input
                      type='text'
                      className='form-control'
                      placeholder='REVOKE ASSIGNMENT'
                      onChange={confirmStringUpdated}
                      value={confirmString}
                    />
                  </p>
                  <div className='d-flex float-end'>
                    <button
                      type='button'
                      className={store.getState().deleteengineer.engineerdelete.IsDeleted ? 'btn btn-success' : 'btn btn-danger'}
                      disabled={store.getState().deleteengineer.confirmString != 'REVOKE ASSIGNMENT' ? true : false}
                      onClick={onAssignEngineerSubmit}
                      data-testid="toggle_user_status_button_confirm"
                    >
                      {t('assign_engineer_delete_button')}
                    </button>
                  </div>
                </div>
              </ContainerPage>
              {displayInformationModal ? <InformationModal /> : ''}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const onAssignEngineerSubmit = async () => {
  store.dispatch(startSubmitting());
  const result = deleteAssignee(store.getState().deleteengineer.engineerdelete);
  store.dispatch(stopSubmitting());
  store.dispatch(toggleInformationModalStatus());
  console.log(result, 'Engineer Deleted Successfully');

}