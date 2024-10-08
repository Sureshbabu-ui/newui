import { dispatchOnCall, store } from '../../../../state/store';
import { useStoreWithInitializer } from '../../../../state/storeHooks';
import SweetAlert from 'react-bootstrap-sweetalert';
import { ContainerPage } from '../../../ContainerPage/ContainerPage';
import { createBankApprovalRequest, getBankApprovalRequests } from '../../../../services/bank';
import {
  initializeBank,
  startSubmitting,
  stopSubmitting,
  toggleInformationModalStatus,
  updateErrors,
  updateField,
  CreateBankApprovalRequestState,
  BankDetails,
} from './BankApprovalRequestCreate.slice';
import { useTranslation } from 'react-i18next';
import { startPreloader, stopPreloader } from '../../../Preloader/Preloader.slice';
import * as yup from 'yup';
import { ValidationErrorComp } from '../../../ValidationErrors/ValidationError';
import { convertBackEndErrorsToValidationErrors } from '../../../../helpers/formats';
import { loadPendingBanks } from '../BanksPendingList/BanksPendingList.slice';
import { setActiveTab } from '../BankManagement.slice';
import { checkForPermission } from '../../../../helpers/permissions';

export const CreateBankApprovalRequest = () => {
  const { errors, submitting, bank, displayInformationModal } = useStoreWithInitializer(
    ({ bankapprovalrequestcreate }) => bankapprovalrequestcreate,
    dispatchOnCall(initializeBank())
  );

  const { t } = useTranslation();

  const validationSchema = yup.object().shape({
    BankCode: yup.string().required('validation_error_create_bank_code_required'),
    BankName: yup.string().required('validation_error_create_bank_name_required'),
  });

  function onSubmit(bank: BankDetails) {
    return async (ev: React.FormEvent) => {
      ev.preventDefault();
      store.dispatch(updateErrors({}));
      try {
        await validationSchema.validate(store.getState().bankapprovalrequestcreate.bank, { abortEarly: false });
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
      const result = await createBankApprovalRequest(bank);
      store.dispatch(stopSubmitting());
      result.match({
        err: (e) => {
          const errorMessages = convertBackEndErrorsToValidationErrors(e)
          store.dispatch(updateErrors(errorMessages));
        },
        ok: () => {
          store.dispatch(toggleInformationModalStatus());
        },
      });
      store.dispatch(stopPreloader())
    };
  }

  const onUpdateField = (ev: any) => {
    var name = ev.target.name;
    var value = ev.target.value;
    store.dispatch(updateField({ name: name as keyof CreateBankApprovalRequestState['bank'], value }));
  }

  function InformationModal() {
    const { t } = useTranslation();
    return (
      <SweetAlert success title='Success' onConfirm={updatePendingList}>
        {t('create_bank_approval_request_alert_success')}
      </SweetAlert>
    );
  }

  const onModalClose = () => {
    store.dispatch(initializeBank())
  }

  const updatePendingList = async () => {
    try {
      const result = await getBankApprovalRequests(1);
      store.dispatch(loadPendingBanks(result));
      store.dispatch(toggleInformationModalStatus());
      store.dispatch(setActiveTab("nav-pending"))
      document.getElementById('closeCreateBankModal')?.click();
    } catch (error) {
      return;
    }
  }

  return (
    <>
      <div
        className="modal fade"
        id="createNewBank"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title app-primary-color mx-2"> {t('bank_management_label_create_new_bank')}</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                id="closeCreateBankModal"
                aria-label="Close"
                onClick={onModalClose}
              ></button>
            </div>
            {checkForPermission("BANK_MANAGE") &&
              <div className="modal-body">
                <div className='auth-page'>
                  <ContainerPage>
                    <div className=''>
                      {/* create bank approval request form */}
                      <ContainerPage>
                        <ValidationErrorComp errors={errors} />
                        <fieldset className="form-group mb-2">
                          <label className="red-asterisk"> {t('create_bank_approval_request_label_bank_code')}</label>
                          <input
                            name="BankCode"
                            className={`form-control  ${errors["BankCode"] ? "is-invalid" : ""}`}
                            onChange={onUpdateField}
                            value={bank.BankCode}
                            disabled={submitting}
                          />
                          <div className="invalid-feedback"> {t(errors['BankCode'])}</div>
                          <label className='mt-3 red-asterisk'>{t('create_bank_approval_request_label_bank_name')}</label>
                          <input
                            className={`form-control  ${errors["BankName"] ? "is-invalid" : ""}`}
                            name="BankName"
                            onChange={onUpdateField}
                            value={bank.BankName}
                            disabled={submitting}
                          />
                          <div className="invalid-feedback"> {t(errors['BankName'])}</div>
                          <div className="d-flex flex-row mt-3 justify-content-between">
                            <button className="btn text-white app-primary-bg-color px-6" onClick={onSubmit(bank)}>Create Bank</button>
                          </div>
                        </fieldset>
                      </ContainerPage>
                      {/* create bank approval request form ends here */}
                      {displayInformationModal ? <InformationModal /> : ''}
                    </div>
                  </ContainerPage>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </>
  );
}