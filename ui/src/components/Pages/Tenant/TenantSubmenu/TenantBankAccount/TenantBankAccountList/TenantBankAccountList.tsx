import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useStore } from '../../../../../../state/storeHooks';
import toast, { Toaster } from 'react-hot-toast';
import { store } from '../../../../../../state/store';
import { changePage, initializeTenantBankAccountList, loadTenantBankAccounts, setSearch, setVisibleModal } from './TenantBankAccountList.slice'
import { deleteTenantBankAccount, getTenantBankAccountDetails, getTenantBankAccountList } from "../../../../../../services/tenantBankAccount";
import { Pagination } from "../../../../../Pagination/Pagination";
import { startPreloader, stopPreloader } from '../../../../../Preloader/Preloader.slice';
import { TenantBankAccountCreate } from "../TenantBankAccountCreate/TenantBankAccountCreate";
import { useParams } from "react-router-dom";
import { TenantBankAccountView } from "../TenantBankAccountView/TenantBankAccountView";
import { loadTenantBankAccountDetails } from "../TenantBankAccountView/TenantBankAccountView.slice";
import { checkForPermission } from "../../../../../../helpers/permissions";
import FeatherIcon from 'feather-icons-react';
import SweetAlert from "react-bootstrap-sweetalert";


const TenantBankAccountList = () => {
    const { t, i18n } = useTranslation();
    const { TenantId } = useParams<{ TenantId: string }>();

    const {
        tenantbankaccountlist: { TenantBankAccounts, totalRows, perPage, currentPage, search },
    } = useStore(({ tenantbankaccountlist, app }) => ({ tenantbankaccountlist, app }));

    useEffect(() => {
        if (checkForPermission("ACCEL_MANAGE_BANK")) {
            onLoad();
        }
    }, []);

    const onLoad = async () => {
        store.dispatch(startPreloader())
        store.dispatch(initializeTenantBankAccountList());
        try {
            const CurrentPage = store.getState().tenantbankaccountlist.currentPage;
            const SearchKey = store.getState().tenantbankaccountlist.search;
            const TenantBankAccounts = await getTenantBankAccountList(TenantId, SearchKey, CurrentPage);
            store.dispatch(loadTenantBankAccounts(TenantBankAccounts));
        } catch (error) {
            console.error(error);
        }
        store.dispatch(stopPreloader())
    }

    const onPageChange = async (index: number) => {
        store.dispatch(changePage(index));
        const searchKey = store.getState().tenantbankaccountlist.search;
        const result = await getTenantBankAccountList(TenantId, searchKey, index);
        store.dispatch(loadTenantBankAccounts(result));
    }

    const filterBankAccountList = async (event: any) => {
        store.dispatch(changePage(1))
        const result = await getTenantBankAccountList(TenantId, store.getState().tenantbankaccountlist.search, 1);
        store.dispatch(loadTenantBankAccounts(result));
    }
    const addData = async (event: any) => {
        store.dispatch(setSearch(event.target.value));
        if (event.target.value == "") {
            store.dispatch(changePage(1))
            const result = await getTenantBankAccountList(TenantId, store.getState().tenantbankaccountlist.search, store.getState().tenantbankaccountlist.currentPage);
            store.dispatch(loadTenantBankAccounts(result));
        }
    }

    const onTenantBankViewLoad = async (TenantBankAccountId: number) => {
        try {
            const result = await getTenantBankAccountDetails(TenantBankAccountId);
            store.dispatch(loadTenantBankAccountDetails(result));
        } catch (error) {
            console.error(error);
        }
    }
    const [tenantBankAccountId, setTenantBankAccountId] = useState(0);

    const handleConfirm = (tenantBankAccountId: number) => {
        setTenantBankAccountId(tenantBankAccountId);
    };

    async function handleCancel() {
        setTenantBankAccountId(0);
    }

    function ConfirmationModal() {
        return (
            <SweetAlert
                warning
                showCancel
                confirmBtnText='Yes, Delete!'
                cancelBtnText='Cancel'
                cancelBtnBsStyle='light'
                confirmBtnBsStyle='danger'
                title={t('tenantbankaccount_deleted_confirmation_message')}
                onConfirm={() => deleteTenantAccount(tenantBankAccountId)}
                onCancel={handleCancel}
                focusCancelBtn
            >
                {t('tenantbankaccount_deleted_conformation')}
            </SweetAlert>
        );
    }

    async function deleteTenantAccount(Id: number) {
        var result = await deleteTenantBankAccount(Id);
        result.match({
            ok: () => {
                setTenantBankAccountId(0)
                toast(i18n.t('tenantbankaccount_deleted_success_message'),
                    {
                        duration: 2500,
                        style: {
                            borderRadius: '0',
                            background: '#00D26A',
                            color: '#fff',
                        }
                    });
                onLoad()
            },
            err: (err) => {
                toast(i18n.t('tenantbankaccount_deleted_failure_message'),
                    {
                        duration: 2500,
                        style: {
                            borderRadius: '0',
                            background: '#F92F60',
                            color: '#fff'
                        }
                    });
                console.log(err);
            },
        });
    }

    return (<div>
        <>
            {checkForPermission("ACCEL_MANAGE_BANK") && TenantBankAccounts.match({

                none: () => <>{t('tenantbankaccount_list_loading')}</>,
                some: (TenantBankAccounts) => <div className="ps-3 pe-2 mt-2">
                    {checkForPermission("ACCEL_MANAGE_BANK") && <>
                        <div className="row mt-0  mx-0  ps-0 ">
                            <div className="col-md-8 app-primary-color  ps-0">
                                <h5> {t('tenantbankaccount_list_title')}</h5>
                            </div>
                            {checkForPermission("ACCEL_MANAGE_BANK") &&
                                <div className="col-md-4 pe-0 mt-1">
                                    <button onClick={() => store.dispatch(setVisibleModal("CreateTenantBankAccount"))} className="btn app-primary-bg-color text-white float-end " data-bs-toggle='modal' data-bs-target='#CreateTenantBankAccount'>
                                        {t('tenantbankaccount_list_button_create')}
                                    </button>
                                </div>
                            }
                        </div>
                        <br />
                        <div className="mb-1 ">
                            <div className="input-group">
                                <input type='search' className="form-control custom-input" value={search} placeholder={t('tenantbankaccount_list_placeholder_search') ?? ''} onChange={addData}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            filterBankAccountList(e);
                                        }
                                    }} />
                                <button className="btn app-primary-bg-color text-white float-end " type="button" onClick={filterBankAccountList}>
                                    Search
                                </button>
                            </div>
                        </div>
                        <div className="row mt-3 ">
                            {TenantBankAccounts.length > 0 ? (
                                <div className=" table-responsive pl-3 ">
                                    <table className="table table-hover  table-bordered">
                                        <thead>
                                            <tr>
                                                <th scope='col'>{t('tenantbankaccount_list_th_action')}</th>
                                                <th scope="col">{t('tenantbankaccount_list_th_sl_no')}</th>
                                                <th scope="col">{t('tenantbankaccount_list_th_branchname')}</th>
                                                <th scope="col">{t('tenantbankaccount_list_th_accountnumber')}</th>
                                                <th scope="col">{t('tenantbankaccount_list_th_relationshipmanager')}</th>
                                                <th scope="col">{t('tenantbankaccount_list_th_contactnumber')}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {TenantBankAccounts.map((field, index) => (
                                                <tr className="mt-2" key={index}>
                                                    <td>
                                                        <a
                                                            className="pseudo-href app-primary-color ms-3"
                                                            onClick={() => onTenantBankViewLoad(field.TenantBankAccount.Id)}
                                                            data-bs-toggle="modal"

                                                            data-bs-target="#tenantBankAccountView"
                                                        >
                                                            <span className="material-symbols-outlined">
                                                                visibility
                                                            </span>
                                                        </a>
                                                        <a
                                                            className='pseudo-href app-primary-color ps-2'
                                                            role="button"
                                                            data-toggle="tooltip" data-placement="left" title={'Delete Company Bank Account'}
                                                            onClick={() => handleConfirm(field.TenantBankAccount.Id)}
                                                        >
                                                            <span className="material-symbols-outlined">
                                                                delete
                                                            </span>
                                                        </a>
                                                    </td>
                                                    <th scope="row">{(currentPage - 1) * 10 + (index + 1)}</th>
                                                    <td>{field.TenantBankAccount.BranchName} </td>
                                                    <td>  {field.TenantBankAccount.AccountNumber} </td>
                                                    <td >   {field.TenantBankAccount.RelationshipManager}</td>
                                                    <td>{field.TenantBankAccount.ContactNumber}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <div className="row m-0">
                                        <Pagination currentPage={currentPage} count={totalRows} itemsPerPage={perPage} onPageChange={onPageChange} />
                                    </div>
                                </div>
                            ) : (
                                <div className="text-muted ps-3">{t('tenantbankaccountview_no_data')}</div>
                            )}
                        </div>
                    </>}
                    {tenantBankAccountId ? <ConfirmationModal /> : ""}
                    <TenantBankAccountCreate />
                    <TenantBankAccountView />
                    <Toaster />
                </div>
            })}
        </>
    </div>)
}
export default TenantBankAccountList