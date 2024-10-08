import { dispatchOnCall, store } from '../../../../state/store';
import { useStoreWithInitializer } from '../../../../state/storeHooks';
import SweetAlert from 'react-bootstrap-sweetalert';
import { SelectedPendingApprovalDetail } from '../../../../types/pendingApproval';
import { useEffect } from 'react';
import {
  initializeEditPendingBank,
  startSubmitting,
  stopSubmitting,
  toggleInformationModalStatus,
  updateErrors,
  updateField,
  EditBankPendingRequestState,
  setContentForEdit,
  loadSelectedPendingBankDetail,
} from './BankApprovalRequestEdit.slice';
import { useTranslation } from 'react-i18next';
import { startPreloader, stopPreloader } from '../../../Preloader/Preloader.slice';
import * as yup from 'yup';
import { ValidationErrorComp } from '../../../ValidationErrors/ValidationError';
import { editPendingBankApproval, getApprovedBankList, getBankApprovalRequests, getBankPendingViewDetail } from '../../../../services/bank';
import { loadPendingBanks } from '../BanksPendingList/BanksPendingList.slice';
import { loadApprovedBanks } from '../BanksApprovedList/BanksApprovedList.slice';
import { convertBackEndErrorsToValidationErrors } from '../../../../helpers/formats';
import { checkForPermission } from '../../../../helpers/permissions';

export const EditBankRequestDetails = () => {
  const { t } = useTranslation();
  const { bank, displayInformationModal,errors,ApprovalRequestId } = useStoreWithInitializer(
    ({ bankapprovalrequestedit }) => bankapprovalrequestedit,
    dispatchOnCall(initializeEditPendingBank())
  );

  const onLoad = async () => {
    if (Number(ApprovalRequestId) > 0) {
      try {
        const result = await getBankPendingViewDetail(ApprovalRequestId)
       store.dispatch(loadSelectedPendingBankDetail({"BankCode":result.BankPendingDetail.BankCode,"BankName":result.BankPendingDetail.BankName}));
      } catch (error) {
        console.log(error);
      }
    }
  }

  const validationSchema = yup.object().shape({
    BankCode: yup.string().required('validation_error_edit_bank_code_required'),
    BankName: yup.string().required('validation_error_edit_bank_name_required'),
  });

    useEffect(() => {
    onLoad()
  }, [ApprovalRequestId])

  const onSubmit=async()=> {     
    //const Id=store.getState().approvarequestdetails.selectedApprovals.ApprovalRequestDetailId
      store.dispatch(updateErrors({}));
      try {
        await validationSchema.validate(bank, { abortEarly: false });
      } catch (error: any) {
        const errors = error.inner.reduce((allErrors: any, currentError: any) => {
          return { ...allErrors, [currentError.path as string]: currentError.message };
        }, {});
        store.dispatch(updateErrors(errors))
        if (errors)
          return;
      } 
      store.dispatch(startPreloader())
      store.dispatch(startSubmitting());
      const result = await editPendingBankApproval(bank, ApprovalRequestId);
      store.dispatch(stopSubmitting());
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

  function onUpdateField(ev: any) {
    var name = ev.target.name;
    var value = ev.target.value;
    store.dispatch(updateField({ name: name as keyof EditBankPendingRequestState['bank'], value }));
  }

  function setEditApprovalRequestItem(editItem: SelectedPendingApprovalDetail): any {
    if (editItem.Content) {
      var contents = {
        BankCode: JSON.parse(editItem.Content).BankCode,
        BankName: JSON.parse(editItem.Content).BankName,
      };
      store.dispatch(setContentForEdit(contents));
    }
  }

  const InformationModal=() =>{
    const { t } = useTranslation();
    return (
      <SweetAlert success title='Success' onConfirm={reDirectRoute}>
        {t('edit_bank_request_details_message_success')}
      </SweetAlert>
    );
  }

  const reDirectRoute = async () => {
    store.dispatch(toggleInformationModalStatus());
    const bankspendingCurrentPage = store.getState().bankspending.currentPage;
    const pendingBanks = await getBankApprovalRequests(bankspendingCurrentPage);
    store.dispatch(loadPendingBanks(pendingBanks));
    const banksapprovedCurrentpage = store.getState().banksapproved.currentPage;
    const banksapprovedSearchKey = store.getState().banksapproved.search;
    const approvedBanks = await getApprovedBankList(banksapprovedCurrentpage, banksapprovedSearchKey);
    store.dispatch(loadApprovedBanks(approvedBanks));
    document.getElementById('closeEditBankRequestModal')?.click();
  }

  return (
    <>
      <div
        className="modal fade"
        id='EditBankRequest'
        data-bs-backdrop='static'
        data-bs-keyboard='false'
        aria-hidden='true'
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title app-primary-color mx-2">{t('edit_bank_request_details_modal_title')}</h5>
              <button
                type='button'
                className="btn-close"
                data-bs-dismiss='modal'
                id='closeEditBankRequestModal'
                aria-label='Close'
              ></button>
            </div>
            {checkForPermission("BANK_MANAGE") &&
            <div className="modal-body">
              <>
                <ValidationErrorComp errors={errors}/>
                {/* edit bank approval request form */}
                <fieldset className='form-group mb-2'>
                  <label className='red-asterisk'>{t('edit_bank_request_details_label_bank_code')}</label>
                  <input
                    className={`form-control ${errors["BankCode"] ? "is-invalid" : ""}`}
                    name='BankCode'
                    onChange={onUpdateField}
                    value={bank.BankCode??''}
                  />
                  <div className="invalid-feedback"> {t(errors['BankCode'])}</div>
                  <label className='mt-3 red-asterisk'>{t('edit_bank_request_details_label_bank_name')}</label>
                  <input
                    className={`form-control ${errors["BankName"] ? "is-invalid" : ""}`}
                    name='BankName'
                    onChange={onUpdateField}
                    value={bank.BankName??''}
                  />
                  <div className="invalid-feedback"> {t(errors['BankName'])}</div>
                  <div className="d-flex flex-row mt-3 justify-content-between">
                    <button onClick={onSubmit} className='btn text-white app-primary-bg-color px-6'>{t('edit_bank_request_details_button_submit')}</button>
                  </div> 
                </fieldset>
                {/* edit bank approval request form ends here */}
                {displayInformationModal ? <InformationModal /> : ''}
              </>
            </div>
            }
          </div>
        </div>
      </div>
    </>
  );
}
