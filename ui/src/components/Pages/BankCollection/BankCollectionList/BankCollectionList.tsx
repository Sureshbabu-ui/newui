import { useEffect, useState } from 'react';
import { store } from '../../../../state/store';
import { useStore } from '../../../../state/storeHooks';
import { ContainerPage } from '../../../ContainerPage/ContainerPage';
import { Pagination } from '../../../Pagination/Pagination';
import { useTranslation } from 'react-i18next';
import BreadCrumb from '../../../BreadCrumbs/BreadCrumb';
import { changePage, initializeBankCollectionsList, loadBankCollections, loadMasterData, setBankCollectionSelectedStatus, setSearch } from './BankCollectionList.slice';
import { getBankCollectionList, ignoreBankCollection } from '../../../../services/bankCollection';
import { checkForMenuPermission, checkForPermission } from '../../../../helpers/permissions';
import { formatCurrency, formatDate, formatDateTime, formatSelectInput, formatSelectInputWithCode, subtractUtcDateFromCurrent } from '../../../../helpers/formats';
import { loadSelectedBankCollection, updateDetailField } from '../BankCollectionProcess/BankCollectionProcess.slice';
import { BankCollectionProcess } from '../BankCollectionProcess/BankCollectionProcess';
import { getValuesInMasterDataByTable } from '../../../../services/masterData';
import { useHistory, useParams } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import SweetAlert from 'react-bootstrap-sweetalert';
import { BankCollectionCancelClaim } from '../BankCollectionCancelClaim/BankCollectionCancelClaim';
import { updateCollectionCalimCancelDetailField } from '../BankCollectionCancelClaim/BankCollectionCancelClaim.slice';

export const BankCollectionList = () => {
    const { t, i18n } = useTranslation();
    const { status } = useParams<{ status: string }>();
    const history = useHistory();
    const [collectionId, setCollectionId] = useState<number>(0);
    const {
        bankcollectionlist: { bankCollections, masterDataList, selectedStatus, totalRows, perPage, currentPage, search },
    } = useStore(({ bankcollectionlist, app }) => ({ bankcollectionlist, app }));

    useEffect(() => {
        if (checkForPermission("BANKCOLLECTION_LIST")) {
            onLoad();
        }
    }, [null]);

    const breadcrumbItems = () => {
        if (checkForPermission("BANKCOLLECTION_UPLOAD")) {
            return [
                { Text: 'breadcrumbs_home', Link: '/' },
                { Text: 'breadcrumbs_manage_bankcollection', Link: '/finance/collections' },
                { Text: 'breadcrumbs_manage_bankcollectionlist' }
            ];
        }
        return [
            { Text: 'breadcrumbs_home', Link: '/' },
            { Text: 'breadcrumbs_manage_bankcollectionlist' }
        ];
    }

    const onLoad = async () => {
        store.dispatch(initializeBankCollectionsList());
        try {
            const statusList = await getValuesInMasterDataByTable("BankCollectionStatus");
            const FilteredStatuses = await formatSelectInputWithCode(statusList.MasterData, "Name", "Id", "Code")
            store.dispatch(loadMasterData({ name: "BankCollectionStatus", value: { Select: FilteredStatuses } }));
        }
        catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        const tab = masterDataList.BankCollectionStatus.find(item => item.label == status)?.code
        store.dispatch(setBankCollectionSelectedStatus(tab))
    }, [masterDataList.BankCollectionStatus])

    useEffect(() => {
        fetchCollectionList()
    }, [selectedStatus, currentPage])

    const fetchCollectionList = async () => {
        if (selectedStatus != "") {
            const collections = await getBankCollectionList(selectedStatus, search, currentPage);
            store.dispatch(loadBankCollections(collections));
        }
    }

    const onPageChange = async (index: number) => {
        store.dispatch(changePage(index));
    }

    const filterBankCollectionList = async () => {
        await store.dispatch(changePage(1));
        if (checkForPermission("BANKCOLLECTION_LIST"))
            fetchCollectionList()
    }

    const addData = async (event: any) => {
        store.dispatch(setSearch(event.target.value));
    }

    useEffect(() => {
        if (search == "") {
            fetchCollectionList()
        }
    }, [search])

    const selectCollectionDetail = async (CollectionId: number | string | null) => {
        store.dispatch(updateDetailField({ name: "Id", value: CollectionId }));
        const selectedItem = bankCollections.unwrap()?.find(item => item.bankCollection.Id == CollectionId)?.bankCollection
        store.dispatch(loadSelectedBankCollection(selectedItem ?? null))
    }
    const setClaimCancelDetail = async (CollectionId: number | string | null) => {
        store.dispatch(updateCollectionCalimCancelDetailField({ name : "Id", value:CollectionId }));
    }

    const handleStatusChange = (status: string) => {
        store.dispatch(setBankCollectionSelectedStatus(status));
        history.replace(masterDataList.BankCollectionStatus.find(item => item.code == status)?.label);
    };

    const handleIgnoreConfirm = (bankCollectionId: number | null) => {
        setCollectionId(bankCollectionId ?? 0)
    }

    const handleIgnoreCancel = () => {
        setCollectionId(0)
    }

    function IgnoreConfirmationModal() {
        return (
            <SweetAlert
                warning
                showCancel
                confirmBtnText={t('bankcollectionlist_ignore_confirmtext')}
                cancelBtnText={t('bankcollectionlist_ignore_canceltext')}
                cancelBtnBsStyle='light'
                confirmBtnBsStyle='danger'
                title={t('bankcollectionlist_ignore_confirm_title')}
                onConfirm={() => ignoreCollection(collectionId)}
                onCancel={handleIgnoreCancel}
                focusCancelBtn
            >
                {t('bankcollectionlist_ignore_conformation')}
            </SweetAlert>
        );
    }

    const ignoreCollection = async (Id: number) => {
        var result = await ignoreBankCollection(Id);
        result.match({
            ok: () => {
                toast(i18n.t('bankcollectionlist_ignored_success_message'),
                    {
                        duration: 2100,
                        style: {
                            borderRadius: '0',
                            background: '#00D26A',
                            color: '#fff',
                        }
                    });
                onLoad()
            },
            err: (err) => {
                toast(i18n.t('bankcollectionlist_ignored_failure_message'),
                    {
                        duration: 2100,
                        style: {
                            borderRadius: '0',
                            background: '#F92F60',
                            color: '#fff'
                        }
                    });
                console.log(err);
            },
        });
        setCollectionId(0)
    }

    useEffect(() => {
    }, [selectedStatus])

    const canClaim = (CollectionId: number | null) => {
        const selectedItem = bankCollections.unwrap()?.find(item => item.bankCollection.Id == CollectionId)?.bankCollection
        if (selectedItem?.ChequeRealizedOn || selectedItem?.PaymentMethodCode != 'PYM_CHEQ')
            return true;
        return false;
    }

    return (<ContainerPage >
        <BreadCrumb items={breadcrumbItems()} />

        <div>
            {checkForPermission("BANKCOLLECTION_LIST") &&
                <div>
                    {bankCollections.match({
                        none: () => <div >{t('bankcollectionlist_loading_message')}</div>,
                        some: (collection) =>
                            <div className=" pe-2 mt-2  mx-0 ps-2">
                                <div className="nav nav-tabs " id="nav-tab" role="tablist">
                                    {masterDataList.BankCollectionStatus.map((option) => (
                                        <button
                                            key={option.value}
                                            className={`nav-link ${selectedStatus === option.code ? "active" : ''} `}
                                            onClick={() => handleStatusChange(option.code)}
                                            role="tab"
                                            aria-controls={`status-tab-${option.value}`}
                                            id={`nav-${option.label}-tab`}
                                            data-bs-toggle="tab"
                                            data-bs-target={`#${option.label}`}
                                            type="button"
                                            aria-selected="true"
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                                <div className="mb-3">
                                    <div className="input-group">
                                        <input type='search' className="form-control custom-input" value={search ?? ''} placeholder={'Search' ?? ''} onChange={addData}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    filterBankCollectionList();
                                                }
                                            }} />
                                        <button className="btn app-primary-bg-color text-white float-end " type="button" onClick={filterBankCollectionList}>
                                            {t('bankcollectionlist_button_search')}
                                        </button>
                                    </div>
                                </div>
                                {collection.length > 0 ? (
                                    <div className="row mt-3">
                                        <div className=" table-responsive ">
                                            <table className="table table-hover text-nowrap table-bordered ">
                                                <thead>
                                                    <tr>
                                                        <th scope="col">{t('bankcollectionlist_th_sl_no')}</th>
                                                        <th scope="col">{t('bankcollectionlist_th_ageing')}</th>
                                                        <th scope="col">{t('bankcollectionlist_th_transactiondate')}</th>
                                                        <th scope="col">{t('bankcollectionlist_th_particulars')}</th>
                                                        <th scope="col" className="text-end">{t('bankcollectionlist_th_transactionamount')}</th>
                                                        {['BCS_PRNG', 'BCS_CPLT'].includes(selectedStatus) && <th scope="col" className="text-end">{t('bankcollectionlist_th_receiptamount')}</th>}
                                                        {['BCS_PRNG'].includes(selectedStatus) && <th scope="col" className="text-end">{t('bankcollectionlist_th_pending')}</th>}
                                                        {['BCS_PRNG', 'BCS_CPLT'].includes(selectedStatus) && <th scope="col">{t('bankcollectionlist_th_claimedby')}</th>}
                                                        {checkForMenuPermission('BANKCOLLECTION_UPLOAD', 'BANKCOLLECTION_PROCESS') && ['BCS_PNDG', 'BCS_PRNG'].includes(selectedStatus) && <th scope="col">{t('bankcollectionlist_th_actions')}</th>}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {collection.map((field, index) => (
                                                        <tr className="" key={index}>
                                                            <td>{(currentPage - 1) * 10 + index + 1}</td>
                                                            <td>{subtractUtcDateFromCurrent(field.bankCollection.TransactionDate ?? "")} Days </td>
                                                            <td className="">{formatDate(field.bankCollection.TransactionDate)}                                                          </td>

                                                            <td key={field.bankCollection.Id} >
                                                                {field.bankCollection.Particulars}
                                                            </td>
                                                            <td className=" text-end ">{formatCurrency(field.bankCollection.TransactionAmount)}</td>
                                                            {['BCS_PRNG', 'BCS_CPLT'].includes(selectedStatus) && <td className=" text-end">{formatCurrency(field.bankCollection.TotalReceiptAmount)}</td>}
                                                            {['BCS_PRNG'].includes(selectedStatus) && <td className=" text-end">{formatCurrency(Number(field.bankCollection.TransactionAmount) - Number(field.bankCollection.TotalReceiptAmount))}</td>}
                                                            {['BCS_PRNG', 'BCS_CPLT'].includes(selectedStatus) && <td className="">{field.bankCollection.ClaimedBy}</td>}

                                                            {checkForMenuPermission('BANKCOLLECTION_UPLOAD', 'BANKCOLLECTION_PROCESS') && ['BCS_PNDG', 'BCS_PRNG'].includes(selectedStatus)
                                                                && <td className="">
                                                                    {checkForPermission("BANKCOLLECTION_PROCESS") && canClaim(field.bankCollection.Id) ?
                                                                        <button className="btn app-primary-bg-color text-white mx-2" onClick={() => selectCollectionDetail(field.bankCollection.Id)}
                                                                            data-bs-toggle="modal"
                                                                            data-bs-target='#ProcessBankCollection'> {t('bankcollectonlist_button_claim')}</button>
                                                                        : <span></span>
                                                                    }
                                                                    {selectedStatus == 'BCS_PNDG' && checkForPermission("BANKCOLLECTION_UPLOAD") &&
                                                                        <button type="button" className="btn  btn-danger mx-2 "
                                                                            onClick={() => handleIgnoreConfirm(field.bankCollection.Id)}
                                                                        >{t('bankcollectonlist_button_ignore')}</button>
                                                                    }
                                                                    {['BCS_PRNG', 'BCS_CPLT'].includes(selectedStatus) && checkForPermission("BANKCOLLECTION_UPLOAD") &&
                                                                        <button className="btn app-primary-bg-color text-white mx-2" onClick={() => setClaimCancelDetail(field.bankCollection.Id)}
                                                                            data-bs-toggle="modal"
                                                                            data-bs-target='#CancelBankCollectionClaim'> {t('bankcollectonlist_button_cancelclaim')}</button>
                                                                    }
                                                                </td>}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>

                                            <div className="m-0">
                                                <Pagination currentPage={currentPage} count={totalRows} itemsPerPage={perPage} onPageChange={onPageChange} />
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-muted ps-3">{t('bankcollectionlist_nodata')}</div>
                                )}
                                {collectionId ? <IgnoreConfirmationModal /> : <></>}
                            </div>
                    }
                    )}
                    <Toaster />
                    <BankCollectionProcess />
                    <BankCollectionCancelClaim />
                </div>
            }
        </div>
    </ContainerPage>
    )
}
