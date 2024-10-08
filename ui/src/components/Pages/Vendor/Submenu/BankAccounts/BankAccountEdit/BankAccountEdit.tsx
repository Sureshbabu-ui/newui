import { useEffect, useRef } from 'react';
import {
  initializeVendorBankAccountEdit, updateField, updateErrors, toggleInformationModalStatus, EditVendorBankAccountState, loadSelectDetails
} from './BankAccountEdit.slice'
import * as yup from 'yup';
import Select from 'react-select';
import { useTranslation } from 'react-i18next';
import { useStoreWithInitializer } from '../../../../../../state/storeHooks';
import { dispatchOnCall, store } from '../../../../../../state/store';
import { checkForPermission } from '../../../../../../helpers/permissions';
import { convertBackEndErrorsToValidationErrors, formatSelectInput } from '../../../../../../helpers/formats';
import { getValuesInMasterDataByTable } from '../../../../../../services/masterData';
import { startPreloader, stopPreloader } from '../../../../../Preloader/Preloader.slice';
import { editVendorBankAccount, getVendorBankAccountList } from '../../../../../../services/vendorBankAccount';
import SweetAlert from 'react-bootstrap-sweetalert';
import { ContainerPage } from '../../../../../ContainerPage/ContainerPage';
import { ValidationErrorComp } from '../../../../../ValidationErrors/ValidationError';
import { useParams } from 'react-router-dom';
import { loadVendorBankAccounts } from '../BankAccounts.slice';
import { getFilteredBankBranchesByBank } from '../../../../../../services/bankbranch';
import { getApprovedBankNameList } from '../../../../../../services/bank';
import { getVendorBranchNames } from '../../../../../../services/vendorBranch';

export const VendorBankAccountEdit = () => {
  const modalRef = useRef<HTMLButtonElement>(null);
  const { t } = useTranslation();
  const { VendorId } = useParams<{ VendorId: string }>();

  const { vendorBankAccount, displayInformationModal, errors, selectDetails } = useStoreWithInitializer(({ vendorbankaccountedit }) => vendorbankaccountedit,
    dispatchOnCall(initializeVendorBankAccountEdit()))

  useEffect(() => {
    if (checkForPermission("VENDORBANKACCOUNT_CREATE")) {
      onLoad();
    }
  }, []);

  const onLoad = async () => {
    try {
      const { MasterData } = await getValuesInMasterDataByTable("BankAccountType");
      const FilteredBankTypes = await formatSelectInput(MasterData, "Name", "Id")
      store.dispatch(loadSelectDetails({ name: 'BankAccountTypes', value: { Select: FilteredBankTypes } }));

      const { ApprovedList } = await getApprovedBankNameList();
      const FilteredBanks = await formatSelectInput(ApprovedList, "BankName", "Id")
      store.dispatch(loadSelectDetails({ name: 'Banks', value: { Select: FilteredBanks } }));

      const { VendorBranches } = await getVendorBranchNames(VendorId);
      const FilteredVendors = await formatSelectInput(VendorBranches, "BranchName", "Id")
      store.dispatch(loadSelectDetails({ name: 'VendorBranches', value: { Select: [{ label: "Head Office", value: null }, ...FilteredVendors] } }));
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getBankBranchList()
  }, [vendorBankAccount.BankId])

  const getBankBranchList = async () => {
    const BankBranches = await getFilteredBankBranchesByBank(vendorBankAccount.BankId);
    const FilteredBankBranches = formatSelectInput(BankBranches.BankBranches, "BranchName", "BranchId")
    store.dispatch(loadSelectDetails({ name: 'BankBranches', value: { Select: FilteredBankBranches } }));
  }


  const validationSchema = yup.object().shape({
    AccountNumber: yup.string().required('validation_error_vendorbankaccouunt_edit_accnumber_required'),
    BankAccountTypeId: yup.number().positive('validation_error_vendorbankaccount_edit_acctype_required'),
    BankBranchId: yup.number().positive('validation_error_vendorbankaccount_edit_bankbranch_required'),
    VendorBankAccountId: yup.number().positive('validation_error_vendorbankaccount_edit_vendorbankaccount_required'),
    BankId: yup.number().positive('validation_error_vendorbankaccount_edit_bank_required'),
  });

  const onModalClose = () => {
    store.dispatch(initializeVendorBankAccountEdit())
    onLoad()
  }

  const onSubmit = async () => {
    store.dispatch(updateErrors({}));
    try {
      await validationSchema.validate(vendorBankAccount, { abortEarly: false });
    } catch (error: any) {
      const errors = error.inner.reduce((allErrors: any, currentError: any) => {
        return { ...allErrors, [currentError.path as string]: currentError.message };
      }, {});
      store.dispatch(updateErrors(errors))
      if (errors)
        return;
    }
    store.dispatch(startPreloader());
    const result = await editVendorBankAccount(store.getState().vendorbankaccountedit.vendorBankAccount);
    result.match({
      ok: () => {
        store.dispatch(toggleInformationModalStatus());
      },
      err: async (e) => {
        const formattedErrors = convertBackEndErrorsToValidationErrors(e)
        store.dispatch(updateErrors(formattedErrors))
      },
    });
    store.dispatch(stopPreloader())
  }

  const onUpdateField = (ev: any) => {
    var name = ev.target.name;
    var value = ev.target.value;
    var checked = ev.target.checked
    if (name == "IsActive") {
      value = checked ? true : false;
    } store.dispatch(updateField({ name: name as keyof EditVendorBankAccountState['vendorBankAccount'], value }));
  }
  const onSelectChange = (selectedOption: any, actionMeta: any) => {
    var value = selectedOption.value
    var name = actionMeta.name
    store.dispatch(updateField({ name: name as keyof EditVendorBankAccountState['vendorBankAccount'], value }));
  }

  const InformationModal = () => {
    const { t, i18n } = useTranslation();
    return (
      <SweetAlert success title='Success' onConfirm={reDirectRoute}>
        {t('vendorbankaccount_edit_success')}
      </SweetAlert>
    );
  }

  const reDirectRoute = async () => {
    store.dispatch(initializeVendorBankAccountEdit())
    document.getElementById('closeEditVendorBankAccountModal')?.click();
    const result = await getVendorBankAccountList(store.getState().vendorbankaccountlist.currentPage, VendorId);
    store.dispatch(loadVendorBankAccounts(result));
    onLoad()
  }

  return (
    <>
      {
        checkForPermission("VENDORBANKACCOUNT_CREATE")
        &&
        <div
          className="modal fade"
          id='EditVendorBankAccount'
          data-bs-backdrop='static'
          data-bs-keyboard='false'
          aria-hidden='true'
        >
          <div className="modal-dialog modal-md">
            <div className="modal-content">
              <div className="modal-header mx-2">
                <h5 className="modal-title">{t('vendorbankaccount_edit_modal')}</h5>
                <button
                  type='button'
                  className="btn-close"
                  data-bs-dismiss='modal'
                  id='closeEditVendorBankAccountModal'
                  aria-label='Close'
                  onClick={onModalClose}
                  ref={modalRef}
                ></button>
              </div>
              <div className="modal-body">
                <ContainerPage>
                  <ValidationErrorComp errors={errors} />
                  <div className="col-md-12" >
                    <div className="mb-2 mt-1">
                      <div className="form-check form-switch ps-4 ms-3">
                        <input
                          className="form-check-input switch-input-lg ps-1"
                          type="checkbox"
                          name="IsActive"
                          id="ActiveSwitch"
                          checked={vendorBankAccount.IsActive}
                          value={vendorBankAccount.IsActive.toString()}
                          onChange={onUpdateField}
                        ></input>
                        <span className=''>{t('vendorbankaccount_edit_isactive')}</span>
                      </div>
                    </div>
                    <div className="mb-1">
                      <label className="red-asterisk">{t('vendorbankaccount_edit_banks')}</label>
                      <Select
                        options={selectDetails.Banks}
                        value={selectDetails.Banks && selectDetails.Banks.find(option => option.value == vendorBankAccount.BankId) || null}
                        onChange={onSelectChange}
                        isSearchable
                        name="BankId"
                        placeholder="Select Bank"
                      />
                      <div className="small text-danger"> {t(errors['BankId'])}</div>
                    </div>
                    <div className="mb-1">
                      <label className="red-asterisk">{t('vendorbankaccount_edit_bankbranch')}</label>
                      <Select
                        options={selectDetails.BankBranches}
                        value={selectDetails.BankBranches && selectDetails.BankBranches.find(option => option.value == vendorBankAccount.BankBranchId) || null}
                        onChange={onSelectChange}
                        isSearchable
                        name="BankBranchId"
                        placeholder="Select Bank Branch"
                      />
                      <div className="small text-danger"> {t(errors['BankBranchId'])}</div>
                    </div>
                    <div className="mb-1">
                      <label className="red-asterisk">{t('vendorbankaccount_edit_vendorbranches')}</label>
                      <Select
                        options={selectDetails.VendorBranches}
                        value={selectDetails.VendorBranches && selectDetails.VendorBranches.find(option => option.value == vendorBankAccount.VendorBranchId) || null}
                        onChange={onSelectChange}
                        isSearchable
                        name="VendorBranchId"
                        placeholder="Select Vendor Branch"
                      />
                      <div className="small text-danger"> {t(errors['VendorBranchId'])}</div>
                    </div>
                    <div className="mb-1">
                      <label className="red-asterisk">{t('vendorbankaccount_edit_acctype')}</label>
                      <Select
                        options={selectDetails.BankAccountTypes}
                        value={selectDetails.BankAccountTypes && selectDetails.BankAccountTypes.find(option => option.value == vendorBankAccount.BankAccountTypeId) || null}
                        onChange={onSelectChange}
                        isSearchable
                        name="BankAccountTypeId"
                        placeholder="Select Bank Account Type"
                      />
                      <div className="small text-danger"> {t(errors['BankAccountTypeId'])}</div>
                    </div>
                    <div className="mb-1">
                      <label className="red-asterisk">{t('vendorbankaccount_edit_accnumber')}</label>
                      <input onChange={onUpdateField} name="AccountNumber" value={vendorBankAccount.AccountNumber} type="text" className={`form-control  ${errors["AccountNumber"] ? "is-invalid" : ""}`} />
                      <div className="invalid-feedback"> {t(errors['AccountNumber'])}</div>
                    </div>
                    <button type="button" onClick={onSubmit} className="btn  app-primary-bg-color text-white mt-2 float-end">{t('vendorbankaccount_edit_button')}</button>
                    {displayInformationModal ? <InformationModal /> : ''}
                  </div>
                </ContainerPage>
              </div>
            </div>
          </div >
        </div >
      }
    </>
  );
}