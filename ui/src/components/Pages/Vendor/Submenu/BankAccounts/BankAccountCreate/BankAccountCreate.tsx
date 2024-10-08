import SweetAlert from 'react-bootstrap-sweetalert';
import { useTranslation } from 'react-i18next';
import { useEffect, useRef } from 'react';
import { initializeVendorBankAccountCreate, updateField, updateErrors, toggleInformationModalStatus, CreateVendorBankAccountState, loadSelectDetails } from './BankAccountCreate.slice'
import Select from 'react-select';
import { useStoreWithInitializer } from '../../../../../../state/storeHooks';
import { dispatchOnCall, store } from '../../../../../../state/store';
import { checkForPermission } from '../../../../../../helpers/permissions';
import { convertBackEndErrorsToValidationErrors, formatSelectInput } from '../../../../../../helpers/formats';
import { startPreloader, stopPreloader } from '../../../../../Preloader/Preloader.slice';
import { createVendorBankAccount, getVendorBankAccountList } from '../../../../../../services/vendorBankAccount';
import { ContainerPage } from '../../../../../ContainerPage/ContainerPage';
import { ValidationErrorComp } from '../../../../../ValidationErrors/ValidationError';
import { getValuesInMasterDataByTable } from '../../../../../../services/masterData';
import * as yup from 'yup';
import { useParams } from 'react-router-dom';
import { loadVendorBankAccounts } from '../BankAccounts.slice';
import { getApprovedBankNameList } from '../../../../../../services/bank';
import { getFilteredBankBranchesByBank } from '../../../../../../services/bankbranch';
import { getVendorBranchNames } from '../../../../../../services/vendorBranch';

export const VendorBankAccountCreate = () => {
  const modalRef = useRef<HTMLButtonElement>(null);
  const { t } = useTranslation();
  const { VendorId } = useParams<{ VendorId: string }>();

  const { vendorBankAccount, displayInformationModal, errors, selectDetails } = useStoreWithInitializer(({ vendorbankaccountcreate }) => vendorbankaccountcreate,
    dispatchOnCall(initializeVendorBankAccountCreate()))

  useEffect(() => {
    if (checkForPermission("VENDORBANKACCOUNT_CREATE")) {
      onLoad();
    }
  }, []);

  const onLoad = async () => {
    try {
      store.dispatch(updateField({ name: "VendorId", value: VendorId }));

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

  const onModalClose = () => {
    store.dispatch(initializeVendorBankAccountCreate())
    onLoad()
  }

  const validationSchema = yup.object().shape({
    AccountNumber: yup.string().required('validation_error_vendorbankaccouunt_create_accnumber_required'),
    BankAccountTypeId: yup.number().positive('validation_error_vendorbankaccouunt_create_acctype_required'),
    BankBranchId: yup.number().positive('validation_error_vendorbankaccount_create_bankbranch_required'),
    VendorBankAccountId: yup.number().positive('validation_error_vendorbankaccount_create_vendorbankAccount_required'),
    BankId: yup.number().positive('validation_error_vendorbankaccount_edit_bank_required'),
  });

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
    const result = await createVendorBankAccount(store.getState().vendorbankaccountcreate.vendorBankAccount);
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
    store.dispatch(updateField({ name: name as keyof CreateVendorBankAccountState['vendorBankAccount'], value }));
  }

  const onSelectChange = (selectedOption: any, actionMeta: any) => {
    var value = selectedOption.value
    var name = actionMeta.name
    store.dispatch(updateField({ name: name as keyof CreateVendorBankAccountState['vendorBankAccount'], value }));
  }

  const InformationModal = () => {
    const { t } = useTranslation();
    return (
      <SweetAlert success title='Success' onConfirm={reDirectRoute}>
        {t('vendorbankaccount_create_success')}
      </SweetAlert>
    );
  }
  const reDirectRoute = async () => {
    store.dispatch(initializeVendorBankAccountCreate())
    document.getElementById('closeCreateVendorBankAccountModal')?.click();
    const result = await getVendorBankAccountList(store.getState().vendorbankaccountlist.currentPage, VendorId);
    store.dispatch(loadVendorBankAccounts(result));
    onLoad()
  }

  return (
    <>
      {checkForPermission("VENDORBANKACCOUNT_CREATE") &&
        <div
          className="modal fade"
          id='CreateVendorBankAccount'
          data-bs-backdrop='static'
          data-bs-keyboard='false'
          aria-hidden='true'
        >
          <div className="modal-dialog modal-md">
            <div className="modal-content">
              <div className="modal-header mx-2">
                <h5 className="modal-title">{t('vendorbankaccount_create_modal')}</h5>
                <button
                  type='button'
                  className="btn-close"
                  data-bs-dismiss='modal'
                  id='closeCreateVendorBankAccountModal'
                  aria-label='Close'
                  onClick={onModalClose}
                  ref={modalRef}
                ></button>
              </div>
              <div className="modal-body">
                <ContainerPage>
                  <ValidationErrorComp errors={errors} />
                  <div className="col-md-12" >
                    <div className="mb-1">
                      <label className="red-asterisk">{t('vendorbankaccount_create_banks')}</label>
                      <Select
                        options={selectDetails.Banks}
                        value={selectDetails.Banks && selectDetails.Banks.find(option => option.value == vendorBankAccount.BankId) || null}
                        onChange={onSelectChange}
                        isSearchable
                        name="BankId"
                        placeholder={t('vendorbankaccount_create_placeholder_banks')}
                      />
                      <div className="small text-danger"> {t(errors['BankId'])}</div>
                    </div>
                    <div className="mb-1">
                      <label className="red-asterisk">{t('vendorbankaccount_create_bankbranch')}</label>
                      <Select
                        options={selectDetails.BankBranches}
                        value={selectDetails.BankBranches && selectDetails.BankBranches.find(option => option.value == vendorBankAccount.BankBranchId) || null}
                        onChange={onSelectChange}
                        isSearchable
                        name="BankBranchId"
                        placeholder={t('vendorbankaccount_create_placeholder_bankbranch')}
                      />
                      <div className="small text-danger"> {t(errors['BankBranchId'])}</div>
                    </div>
                    <div className="mb-1">
                      <label className="red-asterisk">{t('vendorbankaccount_create_vendorbranches')}</label>
                      <Select
                        options={selectDetails.VendorBranches}
                        value={selectDetails.VendorBranches && selectDetails.VendorBranches.find(option => option.value == vendorBankAccount.VendorBranchId) || null}
                        onChange={onSelectChange}
                        isSearchable
                        name="VendorBranchId"
                        placeholder={t('vendorbankaccount_create_placeholder_vendorbranches')}
                      />
                      <div className="small text-danger"> {t(errors['VendorBranchId'])}</div>
                    </div>
                    <div className="mb-1">
                      <label className="red-asterisk">{t('vendorbankaccount_create_acctype')}</label>
                      <Select
                        options={selectDetails.BankAccountTypes}
                        value={selectDetails.BankAccountTypes && selectDetails.BankAccountTypes.find(option => option.value == vendorBankAccount.BankAccountTypeId) || null}
                        onChange={onSelectChange}
                        isSearchable
                        name="BankAccountTypeId"
                        placeholder={t('vendorbankaccount_create_placeholder_acctype')}
                      />
                      <div className="small text-danger"> {t(errors['BankAccountTypeId'])}</div>
                    </div>
                    <div className="mb-1">
                      <label className="red-asterisk">{t('vendorbankaccount_create_accnumber')}</label>
                      <input onChange={onUpdateField} name="AccountNumber" value={vendorBankAccount.AccountNumber} type="text" className={`form-control  ${errors["AccountNumber"] ? "is-invalid" : ""}`} />
                      <div className="invalid-feedback"> {t(errors['AccountNumber'])}</div>
                    </div>
                    <button type="button" onClick={onSubmit} className="btn  app-primary-bg-color text-white mt-2 float-end">{t('vendorbankaccount_create_create_button')}</button>
                    {displayInformationModal ? <InformationModal /> : ''}
                  </div>
                </ContainerPage>
              </div>
            </div>
          </div>
        </div>
      }
    </>
  );
}