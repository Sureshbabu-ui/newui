
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useStore } from '../../../../../state/storeHooks';
import { ContainerPage } from "../../../../ContainerPage/ContainerPage";
import { store } from '../../../../../state/store';
import { changePage, initializeBankBranchList, loadBankBranches, setSearch } from './BankBranchList.slice'
import { Pagination } from "../../../../Pagination/Pagination";
import { startPreloader, stopPreloader } from '../../../../Preloader/Preloader.slice';
import { formatDateTime } from "../../../../../helpers/formats";
import { deleteBankBranch, getBankBranchDetails, getBankBranchList } from "../../../../../services/bankbranch";
import { BankBranchCreate } from "../BankBranchCreate/BankBranchCreate";
import { checkForPermission } from "../../../../../helpers/permissions";
import { loadSelectedBranch } from "../BankBranchView/BankBranchView.slice";
import { BankBranchDetails } from "../BankBranchView/BankBranchView";
import BreadCrumb from "../../../../BreadCrumbs/BreadCrumb";
import { loadBranchDetails } from "../BankBranchEdit/BankBranchEdit.slice";
import { BankBranchEdit } from "../BankBranchEdit/BankBranchEdit";
import SweetAlert from "react-bootstrap-sweetalert";
import toast, { Toaster } from 'react-hot-toast';

export const BankBranchList = () => {
    const { t, i18n } = useTranslation();
    const {
        bankbranchlist: { bankBranches, totalRows, perPage, currentPage, search },
    } = useStore(({ bankbranchlist, app }) => ({ bankbranchlist, app }));

    useEffect(() => {
        if (checkForPermission("BANKBRANCH_VIEW")) {
            onLoad();
        }
    }, []);

    const onLoad = async () => {
        store.dispatch(startPreloader())
        store.dispatch(initializeBankBranchList());
        try {
            const BankBranches = await getBankBranchList(search, currentPage);
            store.dispatch(loadBankBranches(BankBranches));
        } catch (error) {
            console.error(error);
        }
        store.dispatch(stopPreloader())
    }

    const onPageChange = async (index: number) => {
        store.dispatch(changePage(index));
        const result = await getBankBranchList(search, index);
        store.dispatch(loadBankBranches(result));
    }

    const filterBankBranchList = async (event: any) => {
        store.dispatch(changePage(1))
        const result = await getBankBranchList(store.getState().bankbranchlist.search, 1);
        store.dispatch(loadBankBranches(result));
    }
    const addData = async (event: any) => {
        store.dispatch(setSearch(event.target.value));
        if (event.target.value == "") {
            store.dispatch(changePage(1))
            const result = await getBankBranchList(store.getState().bankbranchlist.search, store.getState().bankbranchlist.currentPage);
            store.dispatch(loadBankBranches(result));
        }
    }

    const redirectToViewDetails = async (Id: number) => {
        try {
            const result = await getBankBranchDetails(Id.toString());
            store.dispatch(loadSelectedBranch(result));
            store.dispatch(loadBranchDetails(result));
        } catch (error) {
            console.error(error);
        }
    }
    const breadcrumbItems = [
        { Text: 'breadcrumbs_home', Link: '/' },
        { Text: 'breadcrumbs_masters', Link: '/config/masters' },
        { Text: 'breadcrumbs_masters_bankbranch_list' }
    ];

    const [Id, setId] = useState(0);

    const handleConfirm = (Id: number) => {
        setId(Id);
    };

    const handleCancel = () => {
        setId(0);
    };

    function DeleteConfirmationModal() {
        return (
            <SweetAlert
                danger
                showCancel
                confirmBtnText={t('bankbranch_delete_confirm_btn')}
                confirmBtnBsStyle="danger"
                title={t('bankbranch_delete_title')}
                onConfirm={() => handleDelete(Id)}
                onCancel={handleCancel}
                focusCancelBtn
            >
                {t('bankbranch_delete_question')}
            </SweetAlert>
        );
    }

    async function handleDelete(Id: number) {
        var result = await deleteBankBranch(Id);
        result.match({
            ok: () => {
                setId(0);
                toast(i18n.t('bankbranch_message_success_delete'), {
                    duration: 3000,
                    style: {
                        borderRadius: '0',
                        background: '#00D26A',
                        color: '#fff',
                    },
                });
                onLoad();
            },
            err: (err) => {
                toast(i18n.t(err.Message), {
                    duration: 3600,
                    style: {
                        borderRadius: '0',
                        background: '#F92F60',
                        color: '#fff',
                    },
                });
                setId(0);
            },
        });
    }

    return (<ContainerPage>
        <>
            <BreadCrumb items={breadcrumbItems} />
            {checkForPermission("BANKBRANCH_VIEW") && bankBranches.match({
                none: () => <div className="row mt-4 ps-5">{t('bankbranch_list_loading')}</div>,
                some: (Divisions) => <div className="ps-3 pe-4    mt-3">
                    <div className="row mt-1 mb-3 p-0 ">
                        <div className="col-md-9 app-primary-color ">
                            <h5 className="ms-0 ps-1"> {t('bankbranch_list_title')}</h5>
                        </div>
                        {checkForPermission("BANKBRANCH_MANAGE") &&
                            <div className="col-md-3 ">
                                <button className="btn app-primary-bg-color text-white float-end " data-bs-toggle='modal' data-bs-target='#CreateBankBranch'>
                                    {t('bankbranch_list_button_create')}
                                </button>
                            </div>
                        }
                    </div>
                    {checkForPermission("BANKBRANCH_VIEW") && <>
                        <div className="mb-3 ps-1">
                            <div className="input-group ">
                                <input type='search' className="form-control custom-input" value={search} placeholder={t('bankbranch_list_placeholder_search') ?? ''} onChange={addData}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            filterBankBranchList(e);
                                        }
                                    }} />
                                <button className="btn app-primary-bg-color text-white float-end " type="button" onClick={filterBankBranchList}>
                                    Search
                                </button>
                            </div>
                        </div>
                        <div className="row mt-3 ps-1">
                            {Divisions.length > 0 ? (
                                <div className=" table-responsive ">
                                    <table className="table table-hover  table-bordered ">
                                        <thead>
                                            <tr>
                                                <th></th>
                                                <th scope="col">{t('bankbranch_list_th_sl_no')}</th>
                                                <th scope="col">{t('bankbranch_list_th_branchname')}</th>
                                                <th scope="col">{t('bankbranch_list_th_bankname')}</th>
                                                <th scope="col">{t('bankbranch_list_th_cityname')}</th>
                                                <th scope="col">{t('bankbranch_list_th_statename')}</th>
                                                <th scope="col">{t('bankbranch_list_th_ifsc')}</th>
                                                <th scope="col">{t('bankbranch_list_th_createdon')}</th>
                                                <th scope="col">{t('bankbranch_list_th_createdby')}</th>

                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Divisions.map((field, index) => (
                                                <tr className="mt-2" key={index}>
                                                    <td className="">
                                                        <a className="pseudo-href app-primary-color me-2" onClick={() => redirectToViewDetails(field.bankBranch.Id)}
                                                            data-bs-toggle='modal' data-bs-target='#BranchDetails'>
                                                            <span className="material-symbols-outlined">visibility</span>
                                                        </a>
                                                        {checkForPermission("BANKBRANCH_MANAGE") &&
                                                            <>
                                                                <a
                                                                    className="pseudo-href app-primary-color"
                                                                    onClick={() => redirectToViewDetails(field.bankBranch.Id)}
                                                                    data-bs-toggle="modal"
                                                                    data-toggle="tooltip" data-placement="left" title={'Edit'}
                                                                    data-bs-target="#EditBankBranch"
                                                                >
                                                                    <span className="material-symbols-outlined me-2">
                                                                        edit_note
                                                                    </span>
                                                                </a>
                                                                <span className="custom-pointer-cursor material-symbols-outlined text-size-20 app-primary-color" onClick={() => handleConfirm(field.bankBranch.Id)}>
                                                                    Delete
                                                                </span>
                                                            </>
                                                        }
                                                    </td>
                                                    <th scope="row">{(currentPage - 1) * 10 + (index + 1)}</th>
                                                    <td>  {field.bankBranch.BranchName} </td>
                                                    <td>  {field.bankBranch.BankName} </td>
                                                    <td>  {field.bankBranch.CityName} </td>
                                                    <td>  {field.bankBranch.StateName} </td>
                                                    <td>  {field.bankBranch.Ifsc} </td>
                                                    <td>  {formatDateTime(field.bankBranch.CreatedOn)} </td>
                                                    <td>{field.bankBranch.CreatedByFullName}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <div className="row m-0">
                                        <Pagination currentPage={currentPage} count={totalRows} itemsPerPage={perPage} onPageChange={onPageChange} />
                                    </div>
                                </div>
                            ) : (
                                <div className="text-muted row ps-3">{t('divisionlist_no_data')}</div>
                            )}
                        </div>
                    </>}
                    <BankBranchEdit />
                    <BankBranchDetails />
                    <BankBranchCreate />
                    {Id ? <DeleteConfirmationModal /> : ""}
                    <Toaster />
                </div>
            })}
        </>
    </ContainerPage>)
}
