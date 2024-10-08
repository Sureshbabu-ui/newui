import { useEffect } from 'react';
import { store } from '../../../../state/store';
import { useStoreWithInitializer } from '../../../../state/storeHooks';
import { useTranslation } from 'react-i18next';
import { BankCollectionCancelClaimState, initializeBankCollectionClaimCancel, loadClaimCancelCollectionDetail, toggleInformationModalStatus, updateCollectionCalimCancelDetailField, updateErrors } from './BankCollectionCancelClaim.slice';
import { cancelCollectionClaim, getBankCollectionDetail } from '../../../../services/bankCollection';
import { checkForPermission } from '../../../../helpers/permissions';
import { convertBackEndErrorsToValidationErrors, formatCurrency, formatDate } from '../../../../helpers/formats';
import { startPreloader, stopPreloader } from '../../../Preloader/Preloader.slice';
import { useHistory } from 'react-router-dom';
import SweetAlert from 'react-bootstrap-sweetalert';
import { useRef } from 'react'
import { ValidationErrorComp } from '../../../ValidationErrors/ValidationError';
import { setBankCollectionSelectedStatus } from '../BankCollectionList/BankCollectionList.slice';
import * as yup from 'yup';

export const BankCollectionCancelClaim = () => {
    const { t } = useTranslation();

    const modalRef = useRef<HTMLButtonElement>(null);

    const onLoad =() =>{
      store.dispatch(initializeBankCollectionClaimCancel())
    }

    const { BankCollectionDetail, CollectionReceiptList, displayInformationModal, errors, CollectionCancelDetail } 
    = useStoreWithInitializer(({ bankcollectioncancelclaim }) => bankcollectioncancelclaim,onLoad);

    const history = useHistory();

    useEffect(() => {
        if (CollectionCancelDetail?.Id != null)
            setCollectionDetail()
    }, [CollectionCancelDetail?.Id])

   const setCollectionDetail = async () => {
        store.dispatch(startPreloader())
        try {
            const result = await getBankCollectionDetail(CollectionCancelDetail.Id);
            store.dispatch(loadClaimCancelCollectionDetail(result));
        } catch (error) {
            console.error(error);
        }
        store.dispatch(stopPreloader())
    }

    const validationSchema = yup.object().shape({
        CancelReason: yup.string().required('bankcollectioncancelclaim_validation_error_cancelreason_required')
    });

    const onSubmit = async () => {
        store.dispatch(updateErrors({}));
        try {
            await validationSchema.validate(CollectionCancelDetail, { abortEarly: false });
        } catch (error: any) {
            const errors = error.inner.reduce((allErrors: any, currentError: any) => {
                return { ...allErrors, [currentError.path as string]: currentError.message };
            }, {});
            store.dispatch(updateErrors(errors))
            if (errors)
                return;
        }
        store.dispatch(startPreloader());
        
        const result = await cancelCollectionClaim(CollectionCancelDetail)
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
                {t('bankcollectioncancelclaim_success_message')}
            </SweetAlert>
        );
    }

    const redirectToReceipt = async () => {
        store.dispatch(toggleInformationModalStatus());
        modalRef.current?.click();
        store.dispatch(setBankCollectionSelectedStatus('BCS_PNDG'));
        history.push("/finance/collections/Pending")
    }

    const onModalClose = () => {
        store.dispatch(initializeBankCollectionClaimCancel());
    }

    const onUpdateField = (ev: any) => {
        var name = ev.target.name;
        var value = ev.target.value;
        store.dispatch(updateCollectionCalimCancelDetailField({ name: name as keyof BankCollectionCancelClaimState['CollectionCancelDetail'], value }));
    }

    return (
        <>
            <div
                className="modal fade modal-lg"
                id='CancelBankCollectionClaim'
                data-bs-backdrop='static'
                data-bs-keyboard='false'
                aria-hidden='true'
            >
                <div className="modal-dialog ">
                    <div className="modal-content">
                        <div className="modal-header mx-2">
                            <h5 className="modal-title">{t('bankcollectioncancelclaim_title')}</h5>
                            <button
                                type='button'
                                className="btn-close"
                                data-bs-dismiss='modal'
                                id='closeCancelBankCollectionClaimModal'
                                aria-label='Close'
                                onClick={onModalClose}
                                ref={modalRef}
                            ></button>
                        </div>
                        {checkForPermission("BANKCOLLECTION_UPLOAD") &&
                            <>
                                <div className="modal-body">
                                    <ValidationErrorComp errors={errors} />
                                    <>
                                        <div>
                                            {CollectionCancelDetail?.Id && <>
                                                <div>
                                                    <label >{t('bankcollectioncancelclaim_trf')}</label>
                                                    <p>{BankCollectionDetail.TransactionReferenceNumber}</p>
                                                </div>
                                                <div>
                                                    <p className="mb-0"> {t('bankcollectioncancelclaim_transactiondate')}</p>
                                                    <p>{formatDate(BankCollectionDetail.TransactionDate)}</p>
                                                </div>
                                                <div>
                                                    <label className="">{t('bankcollectioncancelclaim_transactionamount')}</label>
                                                    <p>{formatCurrency(BankCollectionDetail.TransactionAmount)}</p>
                                                </div>
                                                <label className="">{t('bankcollectioncancelclaim_claimed')}</label>
                                                <p>{formatCurrency(BankCollectionDetail.TotalReceiptAmount ?? 0)}</p>

                                                <div className="mb-2">
                                                    <label className="">{t('bankcollectioncancelclaim_paymentmethod')}</label>
                                                    <p>{BankCollectionDetail.PaymentMethodName}</p>
                                                </div>

                                                <div className="mb-2">
                                                    <label>{t('bankcollectioncancelclaim_customer')}</label>
                                                    <p>{BankCollectionDetail.CustomerName}</p>
                                                </div>
                                                <div className="row">
                                                    {CollectionReceiptList.length > 0 ? (
                                                        <div className="table-responsive">
                                                            <table className="table table-hover table-bordered ms-0">
                                                                <thead>
                                                                    <tr>
                                                                        <td>{t('bankcollectioncancelclaim_th_sl_no')}</td>
                                                                        <td>{t('bankcollectioncancelclaim_th_receiptnumber')}</td>
                                                                        <td>{t('bankcollectioncancelclaim_th_receiptamount')}</td>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>

                                                                    {CollectionReceiptList.map((Item, Index) => {
                                                                        return <tr key={Index} className="">
                                                                            <td>{Index + 1}</td>
                                                                            <td className="px-2"><a className="pseudo-href app-primary-color" href={`/finance/receipts/${Item.Id}`}>
                                                                                {Item.ReceiptNumber}
                                                                            </a></td>
                                                                            <td className="px-2">{formatCurrency(Item.ReceiptAmount.toFixed(2))}</td>
                                                                        </tr>
                                                                    })}
                                                                </tbody>
                                                            </table>
                                                        </div>) : (<> </>)}
                                                </div>

                                                <div className="row ps-0">
                                                    <div className="col-md-12">
                                                        <div className="invalid-feedback"> {t(errors['BankCode'])}</div>
                                                        <label className='mt-3 red-asterisk'>{t('bankcollectioncancelclaim_cancelreason')}</label>
                                                        <input
                                                            className={`form-control  ${errors["CancelReason"] ? "is-invalid" : ""}`}
                                                            name="CancelReason"
                                                            onChange={onUpdateField}
                                                            value={CollectionCancelDetail.CancelReason ?? ''}
                                                        />
                                                        <div className="invalid-feedback"> {t(errors['CancelReason'])}</div>
                                                        <button type='button' className="btn  app-primary-bg-color text-white mt-2"
                                                            onClick={onSubmit}
                                                        >
                                                            {t('bankcollectioncancelclaim_submit_button')}
                                                        </button>
                                                    </div>
                                                </div>
                                            </>
                                            }
                                            {displayInformationModal ? <InformationModal /> : ""}
                                        </div>
                                    </>
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