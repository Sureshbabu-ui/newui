import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useStore, useStoreWithInitializer } from '../../../../../state/storeHooks';
import { dispatchOnCall, store } from '../../../../../state/store';
import {
    initializeContractClose,
    toggleInformationModalStatus,
    toggleCloseModal,
    updateErrors,
    loadContractCloseDetail,
    setSafeToClose,
} from './ContractClose.slice';
import { useEffect } from 'react';
import { startPreloader, stopPreloader } from '../../../../Preloader/Preloader.slice';
import { closeContract, getCloseContractDetail } from '../../../../../services/contractSetting';
import { convertBackEndErrorsToValidationErrors, formatCurrency } from '../../../../../helpers/formats';
import SweetAlert from 'react-bootstrap-sweetalert';
import { checkForPermission } from '../../../../../helpers/permissions';
import toast, { Toaster } from 'react-hot-toast';
import { setContractStatus } from '../../../ContractView/ContractView.slice';

export const ContractClose = () => {
    const { t, i18n } = useTranslation();
    const { ContractId } = useParams<{ ContractId: string }>();
    const { isCloseModalEnabled, displayInformationModal, errors, contractCloseDetail, isSafeToClose } =
        useStoreWithInitializer(
            ({ contractclose }) => contractclose,
            dispatchOnCall(initializeContractClose())
        );

    const { contractStatus } = useStore(
        ({ contractview }) => contractview);

    const handleCloseContract = async () => {
        store.dispatch(updateErrors({}));
        store.dispatch(startPreloader());
        const result = await closeContract(ContractId);
        result.match({
            ok: () => {
                store.dispatch(toggleCloseModal());
                toast(i18n.t('contractclose_success_message'),
                    {
                        duration: 2100,
                        style: {
                            borderRadius: '0',
                            background: '#00D26A',
                            color: '#fff',
                        }
                    });
                store.dispatch(setContractStatus('CTS_CLSD'))
            },
            err: (e) => {
                const errorMessages = convertBackEndErrorsToValidationErrors(e);
                store.dispatch(updateErrors(errorMessages));
            },
        });
        store.dispatch(stopPreloader());
    };

    const InformationModal = () => {
        const { t } = useTranslation();
        return (
            <SweetAlert success title='Success' onConfirm={updateSetting}>
                {t('contraclose_success_message')}
            </SweetAlert>
        );
    };
    const updateSetting = async () => {
        store.dispatch(toggleInformationModalStatus());
        store.dispatch(toggleCloseModal());
    };

    function ConfirmationModal() {
        return (
            <SweetAlert
                warning
                showCancel
                confirmBtnText={`${isSafeToClose ? t('contractclose_btn_safetoclose') : t('contractclose_btn_notsafetoclose')}`}
                cancelBtnText='Cancel'
                cancelBtnBsStyle='light'
                confirmBtnBsStyle={`${isSafeToClose ? "success" : "danger"}`}
                title='Are you sure?'
                onConfirm={handleCloseContract}
                onCancel={handleCancel}
                focusCancelBtn
            >
                <div className='ps-2 mt-2'>
                    <p className='fw-bold mt-1'>{t('contractclose_close_confirmation_title')}</p>
                    <div className="text-start ps-4">
                        <div className={`"fw-bold " ${Number(contractCloseDetail.TotalInvoiceAmount) - Number(contractCloseDetail.TotalCollection) > 0 ? "text-danger" : "text-success"}`}>{t('contractclose_modal_pendingcollection') }<span > {formatCurrency(Number(contractCloseDetail.TotalInvoiceAmount) - Number(contractCloseDetail.TotalCollection))}</span></div>
                        <div className={`"fw-bold " ${Number(contractCloseDetail.TotalOpenServiceRequest) > 0 ? "text-danger" : "text-success"}`}>{t('contractclose_modal_openservicerequest')} <span >{contractCloseDetail.TotalOpenServiceRequest}</span></div>
                    </div>
                </div>
            </SweetAlert >
        );
    }

    const openCloseModal = async () => {
        await loadCloseDetail()
        store.dispatch(toggleCloseModal());
    };

    const handleCancel = () => {
        store.dispatch(toggleCloseModal());
    };

    const loadCloseDetail = async () => {
        try {
            const result = await getCloseContractDetail(ContractId)
            store.dispatch(loadContractCloseDetail(result))

        } catch (ex) {
            console.log("Failed to load", ex)
        }
    }

    useEffect(() => {
        const safeFlag = ((Number(contractCloseDetail.TotalInvoiceAmount) - Number(contractCloseDetail.TotalCollection) <= 0) || Number(contractCloseDetail.PendingBankGuarantee) > 0)
        store.dispatch(setSafeToClose(safeFlag))
    }, [contractCloseDetail])

    return (
        <>
            {checkForPermission('CONTRACT_CREATE') && contractStatus != 'CTS_CLSD' && (
                <>
                    <div className='row mt-2'>
                        <div className="app-primary-color fw-bold mb-2"><small>{t('contractclose_title_close_contract')}</small></div>
                        <div><small>{t('contractclose_title_description')}</small></div>
                        <div className='col col-sm-12 pt-3 '>
                            <span className="btn app-primary-bg-color text-white btn-sm" onClick={openCloseModal}>
                                {t('contractclose_button_close')}
                            </span>
                        </div>
                    </div>
                    {displayInformationModal ? <InformationModal /> : ''}
                    {isCloseModalEnabled ? <ConfirmationModal /> : <></>}
                </>
            )}
            <Toaster />
        </>
    );
};
