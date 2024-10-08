import { useEffect } from 'react';
import { store } from '../../../../state/store';
import { useStore } from '../../../../state/storeHooks';
import { ContainerPage } from '../../../ContainerPage/ContainerPage';
import { useTranslation } from 'react-i18next';
import { BankCollectionProcessState, calculateInvoiceReceipts, initializeBankCollectionsList, loadCustomers, loadFormattedInvoices, loadPaymentMethods, loadPendingInvoiceDetails, toggleInformationModalStatus, updateDetailField, updateErrors, updateMultiSelectedItems, updateReceiptDetailField } from './BankCollectionProcess.slice';
import { processCollection } from '../../../../services/bankCollection';
import { checkForPermission } from '../../../../helpers/permissions';
import { convertBackEndErrorsToValidationErrors, formatCurrency, formatDate, formatSelectInput } from '../../../../helpers/formats';
import { getValuesInMasterDataByTable } from '../../../../services/masterData';
import Select from 'react-select';
import { getCustomersList } from '../../../../services/customer';
import { getFilteredInvoicesByCustomer } from '../../../../services/contractInvoice';
import * as yup from 'yup';
import { startPreloader, stopPreloader } from '../../../Preloader/Preloader.slice';
import { useHistory } from 'react-router-dom';
import SweetAlert from 'react-bootstrap-sweetalert';
import { useRef, useState } from 'react'
import { ValidationErrorComp } from '../../../ValidationErrors/ValidationError';
export const BankCollectionProcess = () => {
    const { t } = useTranslation();

    const modalRef = useRef<HTMLButtonElement>(null);
    const [receiptAmount, setReceiptAmount] = useState(0)
    const {
        bankcollectionprocess: { selectedBankCollection, displayInformationModal, errors, invoicereceipts, Customers, PaymentMethods, InvoiceIds, collectionApproveDetail, FilteredCustomerInvoices },
    } = useStore(({ bankcollectionprocess, app }) => ({ bankcollectionprocess, app }));

    useEffect(() => {
        if (checkForPermission("BANKCOLLECTION_PROCESS")) {
            onLoad();
        }
    }, [null]);

    const history = useHistory();

    const paymentConfiguration = {
        "CASH": {
            CustomerName: 1,
            TRF: -1
        },
        "CLG": {
            CustomerName: 1,
            TRF: 2
        },
        "FT IMPS": {
            CustomerName: 1,
            TRF: 2
        },
        "NFT": {
            CustomerName: 1,
            TRF: 2
        },
        "RTG": {
            CustomerName: 1,
            TRF: 2
        },
        "TFR": {
            CustomerName: 1,
            TRF: -1
        },
        "UPI IN": {
            CustomerName: 2,
            TRF: 1
        },
        "CHEQUE": {
            CustomerName: -1,
            TRF: 1
        }
    }

    useEffect(() => {
        if (selectedBankCollection?.Id != null)
            setCollectionDetail()
    }, [selectedBankCollection?.Id])

    const onLoad = async () => {
        store.dispatch(initializeBankCollectionsList());
        try {
            var { MasterData } = await getValuesInMasterDataByTable("PaymentMethod")
            const paymentMethods = await formatSelectInput(MasterData, "Name", "Id")
            store.dispatch(loadPaymentMethods({ MasterData: paymentMethods }));
            const Customers = await getCustomersList();
            const customers = await formatSelectInput(Customers.CustomersList, "Name", "Id")
            store.dispatch(loadCustomers(customers));

        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        const amount = invoicereceipts.reduce((total, item) => {
            return Number(total) + Number(item.Amount)
        }, 0)
        setReceiptAmount(amount)
    }, [invoicereceipts])

    const setCollectionDetail = async () => {
        try {
            const Particulars = selectedBankCollection?.Particulars ?? ''
            store.dispatch(updateDetailField({ name: "Particulars", value: Particulars }));
            store.dispatch(updateDetailField({ name: "TransactionAmount", value: selectedBankCollection?.TransactionAmount ?? 0 }))
            store.dispatch(updateDetailField({ name: "TransactionDate", value: selectedBankCollection?.TransactionDate ?? null }))
            store.dispatch(updateDetailField({ name: "TenantBankAccountId", value: selectedBankCollection?.TenantBankAccountId ?? null }))
            store.dispatch(updateDetailField({ name: "CustomerInfoId", value: selectedBankCollection?.CustomerInfoId ?? null }))

            const ParticularsSplitted = Particulars.split('/').length > 1 ? Particulars.split('/') : Particulars.split(':')
            if (ParticularsSplitted.length > 1) {
                const PaymentMethodId = PaymentMethods.find(option => option.label == ParticularsSplitted[0])?.value
                store.dispatch(updateDetailField({ name: "PaymentMethodId", value: PaymentMethodId }));
                const configurationDetail = paymentConfiguration[PaymentMethods.find(option => option.value == PaymentMethodId)?.label ?? ""]
                const TRFIndex = configurationDetail["TRF"] ?? 0
                store.dispatch(updateDetailField({ name: "TransactionReferenceNumber", value: ParticularsSplitted[TRFIndex] }));
                const customers = Customers.slice().sort(sortByLabelMatch(ParticularsSplitted[configurationDetail["CustomerName"]]))
                store.dispatch(loadCustomers(customers));
            }
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        getFilteredInvoices()
    }, [collectionApproveDetail.CustomerInfoId])

    const sortByLabelMatch = (searchTerm: string) => (a: any, b: any) => {
        const aLabelLower = a.label.toLowerCase();
        const bLabelLower = b.label.toLowerCase();
        const searchTermLower = searchTerm.toLowerCase();
        const aMatch = searchTermLower.includes(aLabelLower) || aLabelLower.includes(searchTermLower);
        const bMatch = searchTermLower.includes(bLabelLower) || bLabelLower.includes(searchTermLower);

        if (aMatch && !bMatch) return -1;
        if (!aMatch && bMatch) return 1;
        if (aMatch && bMatch) {
            return a.label.localeCompare(b.label);
        }
        return 0;
    }

    const onFieldChangeSelect = (selectedOption: any, actionMeta: any) => {
        const name = actionMeta.name;
        const value = selectedOption.value;
        store.dispatch(updateDetailField({ name: name as keyof BankCollectionProcessState['collectionApproveDetail'], value }));
    }

    const getFilteredInvoices = async () => {
        const Invoices = await getFilteredInvoicesByCustomer(collectionApproveDetail.CustomerInfoId ?? 0);
        store.dispatch(loadPendingInvoiceDetails({ value: Invoices }))
        const FormatedInvoices = await formatSelectInput(Invoices.ContractInvoices, "InvoiceNumber", "Id")
        store.dispatch(loadFormattedInvoices({ MasterData: FormatedInvoices }));
    }

    useEffect(() => {
        store.dispatch(calculateInvoiceReceipts())
    }, [InvoiceIds])

    const onUpdateMultiSelectedItems = (selectedOption: any, actionMeta: any) => {
        const name = actionMeta.name
        const value = selectedOption
        store.dispatch(updateMultiSelectedItems({ name: name, value: { MasterData: value } }));
    }

    const onSubmit = async () => {
        store.dispatch(startPreloader());
        const result = await processCollection(collectionApproveDetail, invoicereceipts.filter(item => item.Amount > 0))
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
            <SweetAlert success title="Success" onConfirm={redirectToReceipt}>
                {t('bankcollectionprocess_success_message')}
            </SweetAlert>
        );
    }

    const redirectToReceipt = async () => {
        store.dispatch(toggleInformationModalStatus());
        modalRef.current?.click();
        history.push("/finance/receipts")
    }

    const onModalClose = () => {
        store.dispatch(updateMultiSelectedItems({ name: "InvoiceIds", value: { MasterData: [] } }));
        store.dispatch(updateDetailField({ name: "CustomerInfoId", value: null }));
    }

    const onUpdateReceiptDetailField = (ev: any) => {
        const index = Number(ev.target.name);
        if (!isNaN(ev.target.value)) {
            const value = ev.target.value;
            store.dispatch(updateReceiptDetailField({ index, value }));
        }
    }

    return (
        <>
            <div
                className="modal fade modal-lg"
                id='ProcessBankCollection'
                data-bs-backdrop='static'
                data-bs-keyboard='false'
                aria-hidden='true'
            >
                <div className="modal-dialog ">
                    <div className="modal-content">
                        <div className="modal-header mx-2">
                            <h5 className="modal-title">{t('bankcollectionprocess_title')}</h5>
                            <button
                                type='button'
                                className="btn-close"
                                data-bs-dismiss='modal'
                                id='closeProcessBankCollectionModal'
                                aria-label='Close'
                                onClick={onModalClose}
                                ref={modalRef}
                            ></button>
                        </div>
                        {checkForPermission("BANKCOLLECTION_PROCESS") &&
                            <>
                                <div className="modal-body">
                                    <ValidationErrorComp errors={errors} />
                                    <ContainerPage>
                                        <>
                                            <div>
                                                {collectionApproveDetail.Id && <>
                                                    <div>
                                                        <label >{t('bankcollectionprocess_particulars')}</label>
                                                        <p>{collectionApproveDetail.Particulars}</p>
                                                    </div>
                                                    <div>
                                                        <label className="">{t('bankcollectionprocess_transactionamount')}</label>
                                                        <p>{formatCurrency(collectionApproveDetail.TransactionAmount)}</p>
                                                    </div>
                                                    {selectedBankCollection?.TotalReceiptAmount ? <div>
                                                        <label className="">{t('bankcollectionprocess_claimedbefore')}</label>
                                                        <p>{formatCurrency(selectedBankCollection?.TotalReceiptAmount ?? 0)}</p>
                                                    </div>:<></>
                                                    }
                                                    <div className="mb-2">
                                                        <label className="">{t('bankcollectionprocess_paymentmethod')}</label>
                                                        <p>{PaymentMethods?.find(option => option.value == collectionApproveDetail.PaymentMethodId)?.label} </p>
                                                    </div>
                                                    <div>
                                                        <p className="mb-0"> {t('bankcollectionprocess_trf')}</p>
                                                        <p>{collectionApproveDetail.TransactionReferenceNumber ?? '-------'}</p>
                                                    </div>
                                                    <div className="mb-2">
                                                        <label className='red-asterisk'>{t('bankcollectionprocess_customer')}</label>
                                                        {selectedBankCollection?.CustomerInfoId ?
                                                            <div>{Customers && Customers.find(option => option.value == collectionApproveDetail.CustomerInfoId)?.label}</div>
                                                            : <Select
                                                                options={Customers}
                                                                value={Customers && Customers.find(option => option.value == collectionApproveDetail.CustomerInfoId) || null}
                                                                onChange={onFieldChangeSelect}
                                                                isSearchable
                                                                name="CustomerInfoId"
                                                                placeholder={t('bankcollection_select_customer')}
                                                            />
                                                        }
                                                    </div>

                                                    {collectionApproveDetail.CustomerInfoId &&
                                                        <div className="col-md-12">
                                                            <label className="mt-2 red-asterisk">{t('bankcollectionprocess_select_invoice')}</label>
                                                            <Select
                                                                value={FilteredCustomerInvoices && FilteredCustomerInvoices.filter(option => InvoiceIds.includes(option.value)) || null}
                                                                options={FilteredCustomerInvoices}
                                                                onChange={(ev, selectedOption) => onUpdateMultiSelectedItems(ev, selectedOption)}
                                                                isSearchable
                                                                name="InvoiceIds"
                                                                isMulti={true}
                                                                placeholder={t('bankcollectionprocess_select_invoice_placeholder')}
                                                            />
                                                        </div>
                                                    }
                                                    <div className="row px-2">
                                                        {InvoiceIds.length > 0 &&
                                                            <table className="table mt-3 table-bordered">
                                                                <thead>
                                                                    <tr>
                                                                        <th> {t('bankcollectionprocess_th_invoicenum')} </th>
                                                                        <th> {t('bankcollectionprocess_th_invoiceamount')} </th>
                                                                        <th> {t('bankcollectionprocess_th_collectiondate')}</th>
                                                                        <th>{t('bankcollectionprocess_th_paidamount')}</th>
                                                                        <th>{t('bankcollectionprocess_th_pendingamount')}</th>
                                                                        <th>{t('bankcollectionprocess_th_amount')}</th>
                                                                        <th>{t('bankcollectionprocess_th_balance')}</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {
                                                                        invoicereceipts.map((item, index) => {
                                                                            return <tr key={item.InvoiceId}>
                                                                                <td>{item.InvoiceNumber} </td>
                                                                                <td>{(Number(item.PaidAmount) + Number(item.PendingAmount)).toFixed(2)}</td>
                                                                                <td>{formatDate(item.CollectionDueDate)}</td>
                                                                                <td>{item.PaidAmount}</td>
                                                                                <td>{item.PendingAmount}</td>
                                                                                <td className="cw-200">
                                                                                    <input name={`${index}`}
                                                                                        value={item.Amount}
                                                                                        className="form-control"
                                                                                        onChange={onUpdateReceiptDetailField}
                                                                                        type='text' >
                                                                                    </input>
                                                                                </td>
                                                                                <td className="">{(item.PendingAmount - item.Amount).toFixed(2)}</td>
                                                                            </tr>
                                                                        })
                                                                    }
                                                                </tbody>
                                                            </table>
                                                        }
                                                    </div>
                                                    <div className="row ps-0">
                                                        <div className="col-md-12 my-3">
                                                            <button type='button' className={`btn  app-primary-bg-color text-white mt-2  
                                                                ${(receiptAmount <= (Number(selectedBankCollection?.TransactionAmount) - Number(selectedBankCollection?.TotalReceiptAmount)) && receiptAmount > 0) ? "" : "disabled"}`}
                                                                onClick={onSubmit}
                                                            >
                                                                {t('bankcollectionmanagement_receipt_create_button')}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </>
                                                }
                                                {displayInformationModal ? <InformationModal /> : ""}
                                            </div>
                                        </>
                                    </ContainerPage>
                                    {displayInformationModal ? <InformationModal /> : ""}
                                </div>
                            </>
                        }
                    </div>
                </div>
            </div >
        </>
    )
}