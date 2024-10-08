import { useTranslation } from "react-i18next";
import { useStore } from "../../../../../state/storeHooks";
import { useEffect, useRef, useState } from 'react';
import * as yup from 'yup';
import { initializeContractInvoice, toggleInformationModalStatus, updateErrors, updateInvoiceMailCc, updateInvoiceMailTo } from "./ContractInvoiceShare.slice";
import { store } from "../../../../../state/store";
import { startPreloader, stopPreloader } from "../../../../Preloader/Preloader.slice";
import { convertBackEndErrorsToValidationErrors } from "../../../../../helpers/formats";
import { ShareInvoiceDetails } from "../../../../../services/contractInvoice";
import SweetAlert from "react-bootstrap-sweetalert";
import { ContainerPage } from "../../../../ContainerPage/ContainerPage";
import { useParams } from "react-router-dom";
import { ValidationErrorComp } from "../../../../ValidationErrors/ValidationError";

export const ContractInvoiceShare = () => {
    const modalRef = useRef<HTMLButtonElement>(null);

    const { t } = useTranslation();
    const {
        contractinvoiceshare: { contractInvoice, displayInformationModal, invoiceshareinfo, errors },
    } = useStore(({ contractinvoiceshare, app }) => ({ contractinvoiceshare, app }));

    const [emailInput, setEmailInput] = useState('');

    const handleInputChange = (ev: any) => {
        setEmailInput(ev.target.value);
    };

    async function handleInputKeyDown(ev: any) {
        if (ev.key === 'Enter') {
            ev.preventDefault();
            addEmail();
        }
    }

    const onUpdateField = (ev: any) => {
        ev.target.value
        store.dispatch(updateInvoiceMailTo({ name: "To", value: ev.target.value }));
    };

    const emailSchema = yup.string().email('Invalid email address').required('Email is required');

    async function addEmail() {
        try {
            await emailSchema.validate(emailInput);
            if (emailInput && !contractInvoice.Cc.includes(emailInput)) {
                store.dispatch(updateInvoiceMailCc({ name: "Cc", value: [...contractInvoice.Cc, emailInput] }));
                setEmailInput('');
                store.dispatch(updateErrors({}))
            }
        } catch (error: any) {
            store.dispatch(updateErrors({ emailInput: error['message'] }))
        }
    }

    const removeEmail = (index: number) => {
        const newEmails = [...contractInvoice.Cc];
        newEmails.splice(index, 1);
        store.dispatch(updateInvoiceMailCc({ name: "Cc", value: newEmails }));
    }

    const onSubmit = async () => {
            store.dispatch(updateErrors({}))
            store.dispatch(startPreloader());
            const result = await ShareInvoiceDetails(contractInvoice)
            result.match({
                ok: () => {
                    store.dispatch(toggleInformationModalStatus());
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
            <SweetAlert success title="Success" onConfirm={updateContractInvoiceDetail}>
                {t('contracthshareinvoice_success_message')}
            </SweetAlert>
        );
    }

    const updateContractInvoiceDetail = async () => {
        store.dispatch(toggleInformationModalStatus());
        modalRef.current?.click()
    }

    const onModalClose = () => {
        store.dispatch(initializeContractInvoice())
        store.dispatch(updateErrors({}))
        setEmailInput('');
    }

    return (
        <ContainerPage>
            <div className="modal fade" id='InvoiceShare' data-bs-backdrop='static' data-bs-keyboard='false' aria-hidden='true'>
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header mx-2">
                            <h5 className="modal-title app-primary-color ms-1 text-bold">{t('contracthshareinvoice_main_heading')}</h5>
                            <button type='button'
                                className="btn-close"
                                data-bs-dismiss='modal'
                                id='closeInvoiceShare'
                                aria-label='Close'
                                onClick={onModalClose}
                                ref={modalRef}
                            >
                            </button>
                        </div>
                        <div className="modal-body pt-2">
                            <ValidationErrorComp errors={errors} />
                            <div className="row mt-1 m-1 mb-2  mt-2">
                                <div className="d-flex flex-row">
                                    <div className="pt-3">{t('contracthshareinvoice_recipient_email_to')}</div>
                                    <div className="p-2 col-md-7">
                                        <input type="email" className="form-control rounded-pill" onChange={onUpdateField} value={contractInvoice.To} />
                                    </div>
                                </div>
                                <div className="input-group mb-3 ps-2">
                                    <div className="form-label mt-2">{t('contracthshareinvoice_recipient_email_cc')} &nbsp;</div>
                                    {contractInvoice.Cc.map((email, index) => (
                                        <div key={index} className="rounded-pill border p-1 m-1 me-1 align-item-center">
                                            <span>{email}</span>
                                            <a
                                                className='pseudo-href'
                                                data-toggle="tooltip" data-placement="left" title={'Remove'}
                                                onClick={() => removeEmail(index)}
                                            >
                                                <span className="material-symbols-outlined small fw-bold mt-1 text-dark ms-2" >close</span>
                                            </a>
                                        </div>
                                    ))}
                                </div>
                                <div className="form-group">
                                    <div id="emailHelp" className="">{t('contracthshareinvoice_press_enter_to_add')}</div>
                                    <div className="d-flex flex-row">
                                        <label className="pt-2 pe-2">{t('contracthshareinvoice_recipient_email_cc_for_update')}</label>
                                    <input
                                        type="email"
                                        style={{ outline: 'none', backgroundColor: 'none' }}
                                        className={`form-control ${errors["emailInput"] ? "is-invalid" : ""}`}
                                        value={emailInput ?? ""}
                                        onChange={handleInputChange}
                                        onKeyDown={handleInputKeyDown}
                                        placeholder={`${t('contracthshareinvoice_enter_email_address')}`}
                                    />
                                    <div className="invalid-feedback">{t(errors["emailInput"])}</div>
                                    </div>
                                </div>
                                <div>
                                    <button onClick={onSubmit} className="btn app-primary-bg-color text-white float-end mt-2">
                                        {t('contracthshareinvoice_send_mail_button')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <>
                {displayInformationModal ? <InformationModal /> : ""}
            </>
        </ContainerPage>
    )
}
