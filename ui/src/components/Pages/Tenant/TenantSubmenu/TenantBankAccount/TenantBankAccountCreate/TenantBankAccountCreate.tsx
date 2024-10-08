import { useTranslation } from "react-i18next";
import { ContainerPage } from "../../../../../ContainerPage/ContainerPage";
import { ValidationErrorComp } from "../../../../../ValidationErrors/ValidationError";
import { loadBanks, loadBankBranches, toggleInformationModalStatus, updateErrors, updateField, loadBankAccountTypes, initializeBankAccountCreate } from "./TenantBankAccountCreate.slice";
import { store } from "../../../../../../state/store";
import { startPreloader, stopPreloader } from "../../../../../Preloader/Preloader.slice";
import { getTenantBankAccountList, tenantBankAccountCreate } from "../../../../../../services/tenantBankAccount";
import { useStore } from '../../../../../../state/storeHooks';
import { useEffect, useRef } from "react";
import SweetAlert from "react-bootstrap-sweetalert";
import { loadTenantBankAccounts } from "../TenantBankAccountList/TenantBankAccountList.slice";
import * as yup from 'yup';
import { convertBackEndErrorsToValidationErrors, formatSelectInput } from "../../../../../../helpers/formats";
import { useParams } from "react-router-dom";
import { getApprovedBankNameList } from "../../../../../../services/bank";
import Select from 'react-select';
import { getFilteredBankBranchesByBank } from "../../../../../../services/bankbranch";
import { getValuesInMasterDataByTable } from "../../../../../../services/masterData";

export const TenantBankAccountCreate = () => {
    const { t } = useTranslation();
    const { TenantId } = useParams<{ TenantId: string }>();
    const modalRef = useRef<HTMLButtonElement>(null);
    const MODAL_NAME = "CreateTenantBankAccount"
    const {
        tenantbankaccountcreate: { tenantBankAccount, displayInformationModal, errors, banks, bankBranches, bankAccountTypes }, tenantbankaccountlist: { visibleModal }
    } = useStore(({ tenantbankaccountcreate, tenantbankaccountlist }) => ({ tenantbankaccountcreate, tenantbankaccountlist }));

    useEffect(() => {
        onLoad()
    }, [TenantId && visibleModal == MODAL_NAME])

    const onLoad = async () => {
        store.dispatch(initializeBankAccountCreate())
        store.dispatch(updateField({ name: "TenantId", value: TenantId }));
        if (visibleModal == MODAL_NAME) {
            try {
                const BankAccountTypeList = await getValuesInMasterDataByTable("BankAccountType");
                const FilteredBankTypes = await formatSelectInput(BankAccountTypeList.MasterData, "Name", "Id")
                store.dispatch(loadBankAccountTypes({ MasterData: FilteredBankTypes }))

                const Banks = await getApprovedBankNameList();
                const FilteredBanks = await formatSelectInput(Banks.ApprovedList, "BankName", "Id")
                store.dispatch(loadBanks({ Banks: FilteredBanks }))
            } catch (error) {
                return error
            }
        }
    }

    useEffect(() => {
        visibleModal == MODAL_NAME && getBankBranchList()
    }, [tenantBankAccount.BankId])

    const getBankBranchList = async () => {
        const BankBranches = await getFilteredBankBranchesByBank(tenantBankAccount.BankId);
        const FilteredBankBranches = formatSelectInput(BankBranches.BankBranches, "BranchName", "Id")
        store.dispatch(loadBankBranches({ BankBranches: FilteredBankBranches }))
    }

    const onUpdateField = (ev: any) => {
        var name = ev.target.name;
        var value = ev.target.value;
        store.dispatch(updateField({ name, value }));
    }

    const onTenantBankAccountSubmit = async () => {
        store.dispatch(updateErrors({}))
        try {
            await validationTenantBankAccountSchema.validate(tenantBankAccount, { abortEarly: false });
        } catch (error: any) {
            const errors = error.inner.reduce((allErrors: any, currentError: any) => {
                return { ...allErrors, [currentError.path as string]: currentError.message };
            }, {});
            store.dispatch(updateErrors(errors))
            if (errors)
                return;
        }
        store.dispatch(startPreloader());
        const result = await tenantBankAccountCreate(tenantBankAccount)
        result.match({
            ok: () => {
                store.dispatch(toggleInformationModalStatus());
            },
            err: (e) => {
                const formattedErrors = convertBackEndErrorsToValidationErrors(e)
                store.dispatch(updateErrors(formattedErrors))
            },
        });
        store.dispatch(stopPreloader());
    }

    const InformationModal = () => {
        const { t } = useTranslation();
        return (
            <SweetAlert success title="Success" onConfirm={updateTenantBankAccount}>
                {t('tenantbankaccountcreate_success_message')}
            </SweetAlert>
        );
    }

    const updateTenantBankAccount = async () => {
        store.dispatch(toggleInformationModalStatus());
        const TenantBankAccounts = await getTenantBankAccountList(TenantId, "", 1);
        store.dispatch(loadTenantBankAccounts(TenantBankAccounts));
        modalRef.current?.click()
    }

    const onModalClose = () => {
        store.dispatch(initializeBankAccountCreate())
        getBankBranchList()
    }

    const validationTenantBankAccountSchema = yup.object().shape({
        BankId: yup.number().min(1, ('validation_error_tenantbankaccountcreate_bankid_required')),
        BankBranchInfoId: yup.number().min(1, ('validation_error_tenantbankaccountcreate_bankbranchinfoid_required')),
        RelationshipManager: yup.string().required('validation_error_tenantbankaccountcreate_relationshipmanager_required'),
        BankAccountTypeId: yup.number().positive('validation_error_tenantbankaccountcreate_bankaccounttypeid_required'),
        Email: yup.string().required('validation_error_tenantbankaccountcreate_email_required'),
        ContactNumber: yup.string().required('validation_error_tenantbankaccountcreate_contactnumber_required'),
        AccountNumber: yup.string().required('validation_error_tenantbankaccountcreate_accountnumber_required').max(32, 'validation_error_tenantbankaccountcreate_accountnumber_maxvalue'),
    });

    const onSelectChange = (selectedOption: any, Name: any) => {
        var value = selectedOption.value
        var name = Name
        store.dispatch(updateField({ name, value }));
    }

    return (
        <>
            <div
                className="modal fade"
                id='CreateTenantBankAccount'
                data-bs-backdrop='static'
                data-bs-keyboard='false'
                aria-hidden='true'
            >
                <div className="modal-dialog ">
                    <div className="modal-content">
                        <div className="modal-header mx-3">
                            <h5 className="modal-title app-primary-color">{t('tenantbankaccountcreate_new_tenantbankaccountcreate')}</h5>
                            <button
                                type='button'
                                className="btn-close"
                                data-bs-dismiss='modal'
                                id='closeCreateTenantBankAccountModal'
                                onClick={onModalClose}
                                aria-label='Close'
                                ref={modalRef}
                            ></button>
                        </div>
                        <div className="modal-body">
                            <ContainerPage>
                                <ValidationErrorComp errors={errors} />
                                <div>
                                    <div className='mb-3 px-0 py-0'>
                                        <div className="row">
                                            <div className="col-md-12">
                                                <label className="mt-2 red-asterisk">{t('tenantbankaccountcreate_input_bankid')}</label>
                                                <Select
                                                    value={banks && banks.find(option => option.value == tenantBankAccount.BankId) || null}
                                                    options={banks}
                                                    onChange={(selectedOption) => onSelectChange(selectedOption, "BankId")}
                                                    isSearchable
                                                    name="BankId"
                                                    placeholder={t('teantbankacountcreate_select_bankid_placeholder')}
                                                />
                                                <div className="text-danger">{t(errors['BankId'])}</div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-12">
                                                <label className="mt-2 red-asterisk">{t('tenantbankaccountcreate_input_bankbranchinfoid')}</label>
                                                <Select
                                                    value={bankBranches && bankBranches.find(option => option.value == tenantBankAccount.BankBranchInfoId) || null}
                                                    options={bankBranches}
                                                    onChange={(selectedOption) => onSelectChange(selectedOption, "BankBranchInfoId")}
                                                    isSearchable
                                                    name="BankBranchInfoId"
                                                    placeholder={t('teantbankacountcreate_select_bankbranchinfoid_placeholder')}
                                                />
                                                <div className="text-danger">{t(errors['BankBranchInfoId'])}</div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-12">
                                                <label className='mt-2 red-asterisk'>{t('tenantbankaccountcreate_label_bankaccountyypeid')}</label>
                                                <Select
                                                    value={bankAccountTypes && bankAccountTypes.find(option => option.value == tenantBankAccount.BankAccountTypeId) || null}
                                                    options={bankAccountTypes}
                                                    onChange={(selectedOption) => onSelectChange(selectedOption, "BankAccountTypeId")}
                                                    isSearchable
                                                    name="BankAccountTypeId"
                                                    placeholder={t('teantbankacountcreate_select_bankaccounttypeid_placeholder')}
                                                />
                                                <div className="text-danger">{t(errors['BankAccountTypeId'])}</div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-12">
                                                <label className='mt-2 red-asterisk'>{t('tenantbankaccountcreate_label_relationshipmanager')}</label>
                                                <input
                                                    value={tenantBankAccount.RelationshipManager ?? ""}
                                                    className={`form-control  ${errors["RelationshipManager"] ? "is-invalid" : ""}`}
                                                    name="RelationshipManager"
                                                    onChange={onUpdateField}
                                                ></input>
                                                <div className="invalid-feedback">{t(errors['RelationshipManager'])}</div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-12">
                                                <label className='mt-2 red-asterisk'>{t('tenantbankaccountcreate_label_contactnumber')}</label>
                                                <input
                                                    value={tenantBankAccount.ContactNumber ?? ""}
                                                    className={`form-control  ${errors["ContactNumber"] ? "is-invalid" : ""}`}
                                                    name="ContactNumber"
                                                    onChange={onUpdateField}
                                                ></input>
                                                <div className="invalid-feedback">{t(errors['ContactNumber'])}</div>
                                            </div>
                                        </div>   <div className="row">
                                            <div className="col-md-12">
                                                <label className='mt-2 red-asterisk'>{t('tenantbankaccountcreate_label_email')}</label>
                                                <input
                                                    value={tenantBankAccount.Email ?? ""}
                                                    className={`form-control  ${errors["Email"] ? "is-invalid" : ""}`}
                                                    name="Email"
                                                    onChange={onUpdateField}
                                                ></input>
                                                <div className="invalid-feedback">{t(errors['Email'])}</div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-12">
                                                <label className='mt-2 red-asterisk'>{t('tenantbankaccountcreate_label_accountnumber')}</label>
                                                <input
                                                    value={tenantBankAccount.AccountNumber ?? ""}
                                                    maxLength={32}
                                                    className={`form-control  ${errors["AccountNumber"] ? "is-invalid" : ""}`}
                                                    name="AccountNumber"
                                                    onChange={onUpdateField}
                                                ></input>
                                                <div className="invalid-feedback">{t(errors['AccountNumber'])}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col col-md-12 mt-4">
                                            <button type='button' className='btn  app-primary-bg-color text-white mt-2 w-100' onClick={onTenantBankAccountSubmit}>
                                                {t('tenantbankaccountcreate_button_submit')}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </ContainerPage>
                            {displayInformationModal ? <InformationModal /> : ""}
                        </div>
                    </div>
                </div >
            </div >
        </>
    );
}