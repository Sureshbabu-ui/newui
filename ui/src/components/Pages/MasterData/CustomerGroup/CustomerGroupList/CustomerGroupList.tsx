import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useStore } from '../../../../../state/storeHooks';
import { ContainerPage } from "../../../../ContainerPage/ContainerPage";
import { store } from '../../../../../state/store';
import { Pagination } from "../../../../Pagination/Pagination";
import { startPreloader, stopPreloader } from '../../../../Preloader/Preloader.slice';
import { formatDateTime } from "../../../../../helpers/formats";
import { changePage, initializeCustomerGroupList, loadCustomerGroups, setSearch } from "./CustomerGroupList.slice";
import { deleteCustomerGroup, getCustomerGroupList } from "../../../../../services/customerGroup";
import { CustomerGroupCreate } from "../CustomerGroupCreate/CustomerGroupCreate";
import { checkForPermission } from "../../../../../helpers/permissions";
import BreadCrumb from "../../../../BreadCrumbs/BreadCrumb";
import { loadDetails } from "../CustomerGroupEdit/CustomerGroupEdit.slice";
import { CustomerGroupEdit } from "../CustomerGroupEdit/CustomerGroupEdit";
import SweetAlert from "react-bootstrap-sweetalert";
import toast, { Toaster } from 'react-hot-toast';

export const CustomerGroupList = () => {
    const { t, i18n } = useTranslation();
    const {
        customergrouplist: { customergroups, totalRows, perPage, currentPage, search },
    } = useStore(({ customergrouplist, app }) => ({ customergrouplist, app }));

    useEffect(() => {
        onLoad();
    }, []);

    const onLoad = async () => {
        store.dispatch(startPreloader())
        store.dispatch(initializeCustomerGroupList());
        try {
            const result = await getCustomerGroupList(currentPage, search);
            store.dispatch(loadCustomerGroups(result));
        } catch (error) {
            console.error(error);
        }
        store.dispatch(stopPreloader())
    }

    const onPageChange = async (index: number) => {
        store.dispatch(changePage(index));
        const result = await getCustomerGroupList(index, search);
        store.dispatch(loadCustomerGroups(result));
    }
    const breadcrumbItems = [
        { Text: 'breadcrumbs_home', Link: '/' },
        { Text: 'breadcrumbs_masters', Link: '/config/masters' },
        { Text: 'breadcrumbs_masters_customer_group' }
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
                confirmBtnText={t('customergroup_delete_confirm_btn')}
                confirmBtnBsStyle="danger"
                title={t('customergroup_delete_title')}
                onConfirm={() => handleDelete(Id)}
                onCancel={handleCancel}
                focusCancelBtn
            >
                {t('customergroup_delete_question')}
            </SweetAlert>
        );
    }

    async function handleDelete(Id: number) {
        var result = await deleteCustomerGroup(Id);
        result.match({
            ok: () => {
                setId(0);
                toast(i18n.t('customergroup_message_success_delete'), {
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

    return (
        <ContainerPage>
            <>
                <BreadCrumb items={breadcrumbItems} />
                {checkForPermission("CUSTOMERGROUP_VIEW") && customergroups.match({
                    none: () => <>{t('customer_group_list_loading')}</>,
                    some: (CustomerGroups) => <div className="ps-3 pe-4   ">
                        <div className="row mt-1 mb-3 p-0 ">
                            <div className="col-md-9 app-primary-color ">
                                <h5 className="ms-0 ps-1"> {t('customer_group_list_title')}</h5>
                            </div>
                            {checkForPermission("CUSTOMERGROUP_MANAGE") &&
                                <div className="col-md-3 ">
                                    <button className="btn app-primary-bg-color text-white float-end " data-bs-toggle='modal' data-bs-target='#CreateCustomerGroup'>
                                        {t('customer_group_list_button_create')}
                                    </button>
                                </div>
                            }
                        </div>
                        <div className="mb-3 ps-2">
                            <div className="input-group">
                                <input type='search' className="form-control custom-input" value={search} placeholder={t('customergroup_list_placeholder_search') ?? ''}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            filterCustomerGroupList(e);
                                        }
                                    }} onChange={addData} />
                                <button className="btn app-primary-bg-color text-white float-end " type="button" onClick={filterCustomerGroupList}>
                                    Search
                                </button>
                            </div>
                        </div>
                        <div className="row mt-3 ps-1">
                            {CustomerGroups.length > 0 ? (
                                <div className=" table-responsive ">
                                    <table className="table table-hover  table-bordered ">
                                        <thead>
                                            <tr>
                                                {checkForPermission("CUSTOMERGROUP_MANAGE") && <th></th>}
                                                <th scope="col">{t('customer_group_list_th_sl_no')}</th>
                                                <th scope="col">{t('customer_group_list_th_code')}</th>
                                                <th scope="col">{t('customer_group_list_th_name')}</th>
                                                <th scope="col">{t('customer_group_list_th_createdby')}</th>
                                                <th scope="col">{t('customer_group_list_th_createdon')}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {CustomerGroups.map((field, index) => (
                                                <tr className="mt-2">
                                                    {checkForPermission("CUSTOMERGROUP_MANAGE") &&
                                                        <td className="">
                                                            <a
                                                                className="pseudo-href app-primary-color"
                                                                onClick={() => {
                                                                    store.dispatch(loadDetails({ Id: field.customergroups.Id, GroupName: field.customergroups.GroupName }))
                                                                }}
                                                                data-bs-toggle="modal"
                                                                data-toggle="tooltip" data-placement="left" title={'Edit'}
                                                                data-bs-target="#EditCustomerGroup"
                                                            >
                                                                <span className="material-symbols-outlined ">
                                                                    edit_note
                                                                </span>
                                                             
                                                            </a>
                                                            <span className="custom-pointer-cursor material-symbols-outlined text-size-20 app-primary-color" onClick={() => handleConfirm(field.customergroups.Id)}>
                                                                    Delete
                                                                </span>
                                                        </td>
                                                    }
                                                    <th scope="row">{(currentPage - 1) * 10 + (index + 1)}</th>
                                                    <td>{field.customergroups.GroupCode} </td>
                                                    <td>{field.customergroups.GroupName} </td>
                                                    <td>{field.customergroups.CreatedBy}</td>
                                                    <td>{formatDateTime(field.customergroups.CreatedOn)} </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <div className="row">
                                        <Pagination currentPage={currentPage} count={totalRows} itemsPerPage={perPage} onPageChange={onPageChange} />
                                    </div>
                                </div>
                            ) : (
                                <div className="text-muted ps-3">{t('customer_group_list_no_data')}</div>
                            )}
                        </div>
                        {Id ? <DeleteConfirmationModal /> : ""}
                        <Toaster />
                        <CustomerGroupEdit />
                        <CustomerGroupCreate />
                    </div>
                })}
            </>
        </ContainerPage>)
}

async function filterCustomerGroupList(e) {
    store.dispatch(changePage(1))
    const result = await getCustomerGroupList(1, store.getState().customergrouplist.search)
    store.dispatch(loadCustomerGroups(result));
}
const addData = async (event: any) => {
    store.dispatch(setSearch(event.target.value));
    if (event.target.value == "") {
        const result = await getCustomerGroupList(store.getState().customergrouplist.currentPage, store.getState().customergrouplist.search);
        store.dispatch(loadCustomerGroups(result));
    }
}