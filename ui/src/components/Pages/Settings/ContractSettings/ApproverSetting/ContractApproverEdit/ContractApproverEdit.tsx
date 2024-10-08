import { useTranslation } from "react-i18next";
import { ContainerPage } from "../../../../../ContainerPage/ContainerPage";
import { ValidationErrorComp } from "../../../../../ValidationErrors/ValidationError";
import { EditApproverState, loadApproverSelectDetails, toggleInformationModalStatus, updateErrors, updateField } from "./ContractApproverEdit.slice";
import { store } from "../../../../../../state/store";
import { startPreloader, stopPreloader } from "../../../../../Preloader/Preloader.slice";
import { useStoreWithInitializer } from '../../../../../../state/storeHooks';
import { useRef } from "react";
import SweetAlert from "react-bootstrap-sweetalert";
import { convertBackEndErrorsToValidationErrors, formatSelectInput } from "../../../../../../helpers/formats";
import * as yup from 'yup';
import { contractApproverEdit, getContractApproverList } from "../../../../../../services/contractApproverSetting";
import { changePage, initializeApproverList, loadApproverDetails } from "../ContractApproverList/ContractApproverList.slice";
import Select from 'react-select';
import { getTenantOfficeName } from "../../../../../../services/tenantOfficeInfo";
import { getSalesContractUsers } from "../../../../../../services/contracts";

export const ContractApproverEdit = () => {
    const { t } = useTranslation();
    const modalRef = useRef<HTMLButtonElement>(null);
    const onLoad = async () => {
        try {
            const { TenantOfficeName } = await getTenantOfficeName();
            const TenantLocation = await formatSelectInput(TenantOfficeName, "OfficeName", "Id")
            store.dispatch(loadApproverSelectDetails({ name: "TenantOffice", value: { Select: TenantLocation } }));

            const { Salesusers } = await getSalesContractUsers();
            const SalesUsers = await formatSelectInput(Salesusers, "FullName", "Id")
            store.dispatch(loadApproverSelectDetails({ name: "Approvers", value: { Select: SalesUsers } }));
        } catch (error) {
            console.log(error);
        }
    }
    const { approverDetails, displayInformationModal, errors, approverSelectDetails } = useStoreWithInitializer(({ contractapproveredit }) => (contractapproveredit), onLoad);

    const onSubmit = async () => {
        store.dispatch(updateErrors({}))
        try {
            await validationSchema.validate(store.getState().contractapproveredit.approverDetails, { abortEarly: false });
        } catch (error: any) {
            const errors = error.inner.reduce((allErrors: any, currentError: any) => {
                return { ...allErrors, [currentError.path as string]: currentError.message };
            }, {});
            store.dispatch(updateErrors(errors))
            if (errors)
                return;
        }
        store.dispatch(startPreloader());
        const result = await contractApproverEdit(approverDetails)
        result.match({
            ok: () => {
                store.dispatch(toggleInformationModalStatus())
            },
            err: (e) => {
                const errorMessages = convertBackEndErrorsToValidationErrors(e)
                store.dispatch(updateErrors(errorMessages));
            },
        });
        store.dispatch(stopPreloader());
    }

    const InformationModal = () => {
        const { t } = useTranslation();
        return (
            <SweetAlert success title="Success" onConfirm={updateApproverlist}>
                {t('contract_approver_edit_success_message')}
            </SweetAlert>
        );
    }

    function onFieldChangeSelect(selectedOption: any, actionMeta: any) {
        const name = actionMeta.name;
        const value = selectedOption.value;
        store.dispatch(updateField({ name: name as keyof EditApproverState['approverDetails'], value }));
    }

    const updateApproverlist = async () => {
        store.dispatch(toggleInformationModalStatus());
        modalRef.current?.click()
        store.dispatch(initializeApproverList())
        try {
            const approverList = await getContractApproverList(store.getState().contractapproverlist.search, 1)
            store.dispatch(loadApproverDetails(approverList));
        } catch (error) {
            console.log(error);
        }
        store.dispatch(updateErrors({}))
    }

    const validationSchema = yup.object().shape({
        TenantOfficeId: yup.number().moreThan(0, ('validation_error_contract_approver_management_accellocation_required')),
        FirstApproverId: yup.number().moreThan(0, ('validation_error_contract_approver_management_firstapprover_required')),
        SecondApproverId: yup.number().moreThan(0, ('validation_error_contract_approver_management_secondapprover_required')),
        RenewalFirstApproverId: yup.number().moreThan(0, ('validation_error_contract_approver_management_firstapprover_required')),
        RenewalSecondApproverId: yup.number().moreThan(0, ('validation_error_contract_approver_management_secondapprover_required')),
    });

    const onModalClose = () => {
        store.dispatch(updateErrors({}))
    }

    return (
        <>
            <div
                className="modal fade"
                id='EditApprover'
                data-bs-backdrop='static'
                data-bs-keyboard='false'
                aria-hidden='true'
            >
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header mx-2">
                            <h5 className="modal-title">{t('contract_approver_edit_title')}</h5>
                            <button
                                type='button'
                                className="btn-close"
                                data-bs-dismiss='modal'
                                id='closeEditApproverModal'
                                aria-label='Close'
                                onClick={onModalClose}
                                ref={modalRef}
                            ></button>
                        </div>
                        <div className="modal-body">
                            <ContainerPage>
                                <ValidationErrorComp errors={errors} />
                                <div className='row mb-1'>
                                    <div className='col-md-12'>
                                        <label className='red-asterisk'>{t('contract_approver_management_label_accel_location')}</label>
                                        <Select
                                            options={approverSelectDetails.TenantOffice}
                                            value={approverSelectDetails.TenantOffice && approverSelectDetails.TenantOffice.find(option => option.value == approverDetails.TenantOfficeId) || null}
                                            onChange={onFieldChangeSelect}
                                            isSearchable
                                            isDisabled={true}
                                            name="TenantOfficeId"
                                            placeholder="Select option"
                                        />
                                        <div className="small text-danger"> {t(errors["TenantOfficeId"])}</div>
                                    </div>
                                    <div className="col-md-12">
                                        <label className='red-asterisk'>{t('contract_approver_management_label_firstapprover')}</label>
                                        <Select
                                            options={approverSelectDetails.Approvers.filter((approver) => (approver.value !== approverDetails.SecondApproverId))}
                                            value={approverSelectDetails.Approvers && approverSelectDetails.Approvers.find(option => option.value == approverDetails.FirstApproverId) || null}
                                            onChange={onFieldChangeSelect}
                                            isSearchable
                                            name="FirstApproverId"
                                            placeholder="Select option"
                                        />
                                        <div className="small text-danger"> {t(errors["FirstApproverId"])}</div>
                                    </div>
                                    <div className="col-md-12">
                                        <label className='red-asterisk'>{t('contract_approver_management_label_secondapprover')}</label>
                                        <Select
                                            options={approverSelectDetails.Approvers.filter((approver) => (approver.value !== approverDetails.FirstApproverId))}
                                            value={approverSelectDetails.Approvers && approverSelectDetails.Approvers.find(option => option.value == approverDetails.SecondApproverId) || null}
                                            onChange={onFieldChangeSelect}
                                            isSearchable
                                            name="SecondApproverId"
                                            placeholder="Select option"
                                        />
                                        <div className="small text-danger"> {t(errors["SecondApproverId"])}</div>
                                    </div>
                                    <div className="col-md-12">
                                        <label className='red-asterisk'>{t('contract_approver_management_label_renewal_firstapprover')}</label>
                                        <Select
                                            options={approverSelectDetails.Approvers.filter((approver) => (approver.value !== approverDetails.RenewalSecondApproverId))}
                                            value={approverSelectDetails.Approvers && approverSelectDetails.Approvers.find(option => option.value == approverDetails.RenewalFirstApproverId) || null}
                                            onChange={onFieldChangeSelect}
                                            isSearchable
                                            name="RenewalFirstApproverId"
                                            placeholder="Select option"
                                        />
                                        <div className="small text-danger"> {t(errors["RenewalFirstApproverId"])}</div>
                                    </div>
                                    <div className="col-md-12">
                                        <label className='red-asterisk'>{t('contract_approver_management_label_renewal_secondapprover')}</label>
                                        <Select
                                            options={approverSelectDetails.Approvers.filter((approver) => (approver.value !== approverDetails.RenewalFirstApproverId))}
                                            value={approverSelectDetails.Approvers && approverSelectDetails.Approvers.find(option => option.value == approverDetails.RenewalSecondApproverId) || null}
                                            onChange={onFieldChangeSelect}
                                            isSearchable
                                            name="RenewalSecondApproverId"
                                            placeholder="Select option"
                                        />
                                        <div className="small text-danger"> {t(errors["RenewalSecondApproverId"])}</div>
                                    </div>
                                    <div className="col-md-12 mt-4 ">
                                        <button type='button' className='btn  app-primary-bg-color text-white mt-2 float-end' onClick={onSubmit}>
                                            {t('approver_edit_button')}
                                        </button>
                                    </div>
                                </div>
                            </ContainerPage>
                            {displayInformationModal ? <InformationModal /> : ""}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}