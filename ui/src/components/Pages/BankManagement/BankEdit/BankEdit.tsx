import { dispatchOnCall, store } from '../../../../state/store';
import { useStoreWithInitializer } from '../../../../state/storeHooks';
import SweetAlert from 'react-bootstrap-sweetalert';
import { editBank, getApprovedBankList, getBankApprovalRequests } from '../../../../services/bank';
import { initializeBank, toggleInformationModalStatus, updateErrors, updateField, BankEditState } from './BankEdit.slice';
import { useTranslation } from 'react-i18next';
import { startPreloader, stopPreloader } from '../../../Preloader/Preloader.slice';
import * as yup from 'yup';
import { ValidationErrorComp } from '../../../ValidationErrors/ValidationError';
import { convertBackEndErrorsToValidationErrors } from '../../../../helpers/formats';
import { setActiveTab } from '../BankManagement.slice';
import { checkForPermission } from '../../../../helpers/permissions';
import { loadApprovedBanks } from '../BanksApprovedList/BanksApprovedList.slice';

export const BankEdit = () => {
  const { errors, submitting, bank, displayInformationModal } = useStoreWithInitializer(({ bankedit }) => bankedit, dispatchOnCall(initializeBank()));

  const { t } = useTranslation();

  const validationSchema = yup.object().shape({
    BankName: yup.string().required('validation_error_edit_bank_name_required'),
  });

  const onSubmit = async () => {
    store.dispatch(updateErrors({}))
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
    const result = await editBank(bank);
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
  }

  const onUpdateField = (ev: any) => {
    var name = ev.target.name;
    var value = ev.target.value;    
    store.dispatch(updateField({ name: name as keyof BankEditState['bank'], value }));
  }

  function InformationModal() {
    const { t } = useTranslation();
    return (
      <SweetAlert success title='Success' onConfirm={redirectToBankApprovedList}>
        {t('edit_bank_alert_success')}
      </SweetAlert>
    );
  }

  const onModalClose = () => {
    store.dispatch(initializeBank())
  }

  const redirectToBankApprovedList = async () => {
    try {
      const currentPage = store.getState().banksapproved.currentPage;
      const searchKey = store.getState().banksapproved.search;
      const result = await getApprovedBankList(currentPage, searchKey);
      store.dispatch(loadApprovedBanks(result));
      store.dispatch(toggleInformationModalStatus());
      store.dispatch(setActiveTab("nav-home"))
      document.getElementById('closeEditBank')?.click();
    } catch (error) {
      return error;
    }
  }

  return (
    <>
      <div
        className="modal fade"
        id="EditBank"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title app-primary-color mx-2"> {t('bank_management_label_edit_bank')}</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                id="closeEditBank"
                aria-label="Close"
                onClick={onModalClose}
              ></button>
            </div>
            {checkForPermission("BANK_MANAGE") &&
              <div className="modal-body">
                <div className='row'>
                  {/* update bank approval request form */}
                  <ValidationErrorComp errors={errors} />
                  <div>
                    <label className='mt-3 red-asterisk'>{t('update_bank_label_bank_name')}</label>
                    <input
                      className={`form-control  ${errors["BankName"] ? "is-invalid" : ""}`}
                      name="BankName"
                      onChange={onUpdateField}
                      value={bank.BankName}
                    />
                    <div className="invalid-feedback"> {t(errors['BankName'])}</div>
                  </div>
                  <div className="d-flex flex-row mt-3 justify-content-between">
                    <button className="btn text-white app-primary-bg-color px-6" onClick={onSubmit}>{t('update_bank_submit_button')}</button>
                  </div>
                  {/* update bank approval request form ends here */}
                  {displayInformationModal ? <InformationModal /> : ''}
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </>
  );
}