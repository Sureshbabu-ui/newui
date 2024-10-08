import { useTranslation } from "react-i18next";
import { ContainerPage } from "../../../../ContainerPage/ContainerPage";
import { ValidationErrorComp } from "../../../../ValidationErrors/ValidationError";
import { store } from "../../../../../state/store";
import SweetAlert from "react-bootstrap-sweetalert";
import * as yup from 'yup';
import { convertBackEndErrorsToValidationErrors, formatSelectInput } from "../../../../../helpers/formats";
import { useStore, useStoreWithInitializer } from "../../../../../state/storeHooks";
import { startPreloader, stopPreloader } from "../../../../Preloader/Preloader.slice";
import { useEffect, useRef } from "react";
import { UpdateBankGuaranteeState, initializeBankGuaranteeEdit, loadSelectDetails, toggleInformationModalStatus, updateErrors, updateField } from "./BankGuaranteeEdit.slice";
import { editBankGuarantee, getBankGuaranteeList } from "../../../../../services/contractBankGuarantee";
import Select from 'react-select';
import { useParams } from "react-router-dom";
import { getValuesInMasterDataByTable } from "../../../../../services/masterData";
import { getBankBranchNames } from "../../../../../services/bankbranch";
import { loadBankGuarantees } from "../BankGuaranteeList/BankGuaranteeList.slice";

export const BankGuaranteeEdit = () => {
    const { t } = useTranslation();
    const modalRef = useRef<HTMLButtonElement>(null);
    const { ContractId } = useParams<{ ContractId: string }>();
    const MODAL_NAME = "BankGuaranteeEdit"
    const { bankguaranteeedit: { displayInformationModal, errors, bankGuarantee, selectDetails }, bankguaranteelist: { visibleModal } } = useStore(({ bankguaranteeedit, bankguaranteelist }) => ({ bankguaranteeedit, bankguaranteelist }));

    const onUpdateField = (ev: any) => {
        var { name, value } = ev.target
        store.dispatch(updateField({ name: name as keyof UpdateBankGuaranteeState['bankGuarantee'], value }));
    }

    useEffect(() => {
        onLoad()
    }, [visibleModal == MODAL_NAME])

    const onLoad = async () => {
        store.dispatch(initializeBankGuaranteeEdit());
        if (visibleModal == MODAL_NAME) {
            try {
                store.dispatch(startPreloader())
                var { MasterData } = await getValuesInMasterDataByTable("GuaranteeType")
                const guaranteeType = await formatSelectInput(MasterData, "Name", "Id")
                store.dispatch(loadSelectDetails({ name: "GuaranteeType", value: { Select: guaranteeType } }));

                var { BankBranches } = await getBankBranchNames()
                const bankBraches = await formatSelectInput(BankBranches, "BranchName", "Id")
                store.dispatch(loadSelectDetails({ name: "BankBranchNames", value: { Select: bankBraches } }));
                store.dispatch(stopPreloader())
            } catch (error) {
                console.error(error);
            }
        }
    }

    function onSelectChange(selectedOption: any, actionMeta: any) {
        const name = actionMeta.name;
        const value = selectedOption.value;
        store.dispatch(updateField({ name: name as keyof UpdateBankGuaranteeState['bankGuarantee'], value }));
    }

    const validationSchema = yup.object().shape({
        BankBranchInfoId: yup.number().typeError('validation_error_bankguarantee_bank_branch_required').required('validation_error_bankguarantee_bank_branch_required').moreThan(0, ('validation_error_bankguarantee_bank_branch_required')),
        GuaranteeAmount: yup.number().typeError('validation_error_bankguarantee_amount_required').required('validation_error_bankguarantee_amount_required').moreThan(0, ('validation_error_bankguarantee_amount_required')),
        GuaranteeClaimPeriodInDays: yup.number().typeError('validation_error_bankguarantee_claim_period_required').required('validation_error_bankguarantee_claim_period_required').moreThan(0, ('validation_error_bankguarantee_claim_period_required')),
        GuaranteeEndDate: yup.string().required('validation_error_bankguarantee_enddate_required'),
        GuaranteeNumber: yup.string().required('validation_error_bankguarantee_guarantee_number_required'),
        GuaranteeStartDate: yup.string().required('validation_error_bankguarantee_startdate_required'),
        GuaranteeType: yup.number().typeError('validation_error_bankguarantee_type_required').required('validation_error_bankguarantee_type_required').moreThan(0, ('validation_error_bankguarantee_type_required')),
        Remarks: yup.string().required('validation_error_bankguarantee_remarks_required'),
    });

    const onSubmit = async () => {
        store.dispatch(updateErrors({}))
        try {
            await validationSchema.validate(bankGuarantee, { abortEarly: false });
        } catch (error: any) {
            const errors = error.inner.reduce((allErrors: any, currentError: any) => {
                return { ...allErrors, [currentError.path as string]: currentError.message };
            }, {});
            store.dispatch(updateErrors(errors))
            if (errors)
                return;
        }
        store.dispatch(startPreloader());
        const result = await editBankGuarantee(bankGuarantee)
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
            <SweetAlert success title="Success" onConfirm={updateBankGuaranteeList}>
                {t('bankguarantee_update_success_message')}
            </SweetAlert>
        );
    }

    const updateBankGuaranteeList = async () => {
        store.dispatch(initializeBankGuaranteeEdit());
        store.dispatch(toggleInformationModalStatus());
        const result = await getBankGuaranteeList(ContractId);
        store.dispatch(loadBankGuarantees(result));
        modalRef.current?.click()
    }

    const onModalClose = () => {
        store.dispatch(initializeBankGuaranteeEdit());
        store.dispatch(updateErrors({}))
    }

    return (
        <>
            <div
                className="modal fade"
                id='BankGuaranteeEdit'
                data-bs-backdrop='static'
                data-bs-keyboard='false'
                aria-hidden='true'
            >
                <div className="modal-dialog ">
                    <div className="modal-content">
                        <div className="modal-header mx-3">
                            <h5 className="modal-title app-primary-color">{t('bankguarantee_update_title')}</h5>
                            <button
                                type='button'
                                className="btn-close"
                                data-bs-dismiss='modal'
                                id='closeBankGuaranteeEdit'
                                onClick={onModalClose}
                                aria-label='Close'
                                ref={modalRef}
                            ></button>
                        </div>
                        <div className="modal-body">
                            <ContainerPage>
                                <ValidationErrorComp errors={errors} />
                                <div className=''>
                                    <div className='row mb-1'>
                                        <div className='col-md-12'>
                                            <label className="mt-2 red-asterisk">{t('bankguarantee_update_input_branch_name')}</label>
                                            <Select
                                                options={selectDetails.BankBranchNames}
                                                value={selectDetails.BankBranchNames && selectDetails.BankBranchNames.find(option => option.value == bankGuarantee.BankBranchInfoId) || null}
                                                onChange={onSelectChange}
                                                isSearchable
                                                name="BankBranchInfoId"
                                                placeholder="Select option"
                                            />
                                            <div className="small text-danger"> {t(errors['BankBranchInfoId'])}</div>
                                        </div>
                                        <div className='col-md-12'>
                                            <label className="mt-2 red-asterisk">{t('bankguarantee_update_input_guarantee_type')}</label>
                                            <Select
                                                options={selectDetails.GuaranteeType}
                                                value={selectDetails.GuaranteeType && selectDetails.GuaranteeType.find(option => option.value == bankGuarantee.GuaranteeType) || null}
                                                onChange={onSelectChange}
                                                isSearchable
                                                name="GuaranteeType"
                                                placeholder="Select option"
                                            />
                                            <div className="small text-danger"> {t(errors['GuaranteeType'])}</div>
                                        </div>
                                        <div className='col-md-12'>
                                            <label className="mt-2 red-asterisk">{t('bankguarantee_update_input_guarantee_number')}</label>
                                            <input name='GuaranteeNumber'
                                                value={bankGuarantee.GuaranteeNumber}
                                                className={`form-control  ${errors["GuaranteeNumber"] ? "is-invalid" : ""}`}
                                                onChange={onUpdateField} type='text' ></input>
                                            <div className="invalid-feedback"> {t(errors['GuaranteeNumber'])}</div>
                                        </div>
                                        <div className='col-md-12'>
                                            <label className="mt-2 red-asterisk">{t('bankguarantee_update_input_guarantee_amount')}</label>
                                            <input name='GuaranteeAmount' onChange={onUpdateField} type='text'
                                                value={bankGuarantee.GuaranteeAmount}
                                                className={`form-control  ${errors["GuaranteeAmount"] ? "is-invalid" : ""}`}
                                            ></input>
                                            <div className="invalid-feedback"> {t(errors['GuaranteeAmount'])}</div>
                                        </div>
                                        <div className='col-md-12'>
                                            <label className="mt-2 red-asterisk">{t('bankguarantee_update_input_start_date')}</label>
                                            <input name='GuaranteeStartDate'
                                                value={bankGuarantee.GuaranteeStartDate.split('T')[0]}
                                                className={`form-control  ${errors["GuaranteeStartDate"] ? "is-invalid" : ""}`}
                                                onChange={onUpdateField} type='date' ></input>
                                            <div className="invalid-feedback"> {t(errors['GuaranteeStartDate'])}</div>
                                        </div>
                                        <div className='col-md-12'>
                                            <label className="mt-2 red-asterisk">{t('bankguarantee_update_input_end_date')}</label>
                                            <input name='GuaranteeEndDate' onChange={onUpdateField} type='date'
                                                value={bankGuarantee.GuaranteeEndDate.split('T')[0]}
                                                className={`form-control  ${errors["GuaranteeEndDate"] ? "is-invalid" : ""}`}
                                            ></input>
                                            <div className="invalid-feedback"> {t(errors['GuaranteeEndDate'])}</div>
                                        </div>
                                        <div className='col-md-12'>
                                            <label className="mt-2 red-asterisk">{t('bankguarantee_update_input_claim_period')}{t('bankguarantee_edit_input_claim_period_days')}</label>
                                            <input name='GuaranteeClaimPeriodInDays'
                                                value={bankGuarantee.GuaranteeClaimPeriodInDays}
                                                className={`form-control  ${errors["GuaranteeClaimPeriodInDays"] ? "is-invalid" : ""}`}
                                                onChange={onUpdateField} type='text' ></input>
                                            <div className="invalid-feedback"> {t(errors['GuaranteeClaimPeriodInDays'])}</div>
                                        </div>
                                        <div className='col-md-12'>
                                            <label className="mt-2 red-asterisk">{t('bankguarantee_update_input_remarks')}</label>
                                            <textarea
                                                value={bankGuarantee.Remarks}
                                                className={`form-control  ${errors["Remarks"] ? "is-invalid" : ""}`}
                                                rows={3}
                                                name="Remarks"
                                                maxLength={128}
                                                onChange={onUpdateField}
                                            ></textarea>
                                            <div className="invalid-feedback"> {t(errors['Remarks'])}</div>
                                        </div>
                                        <div className="col-md-12 mt-2">
                                            <button type='button' className='btn float-end app-primary-bg-color text-white mt-2' onClick={onSubmit}>
                                                {t('bankguarantee_update_button')}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </ContainerPage>
                            {displayInformationModal ? <InformationModal /> : ""}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
} 