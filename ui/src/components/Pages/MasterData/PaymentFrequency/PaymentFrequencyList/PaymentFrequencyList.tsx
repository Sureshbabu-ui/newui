import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useStore } from '../../../../../state/storeHooks';
import { ContainerPage } from "../../../../ContainerPage/ContainerPage";
import { store } from '../../../../../state/store';
import { changePage, initializePaymentFrequencyList, loadPaymentFrequencies, setSearch } from './PaymentFrequencyList.slice'
import { deletePaymentFrequency, getPaymentFrequencyList } from "../../../../../services/paymentFrequency";
import { Pagination } from "../../../../Pagination/Pagination";
import { startPreloader, stopPreloader } from '../../../../Preloader/Preloader.slice';
import { formatDateTime } from "../../../../../helpers/formats";
import { PaymentFrequencyCreate } from "../PaymentFrequencyCreate/PaymentFrequencyCreate";
import { checkForPermission } from "../../../../../helpers/permissions";
import BreadCrumb from "../../../../BreadCrumbs/BreadCrumb";
import { loadPaymentFrequencyDetails } from "../PaymentFrequencyEdit/PaymentFrequencyEdit.slice";
import { PaymentFrequencyEdit } from "../PaymentFrequencyEdit/PaymentFrequencyEdit";
import SweetAlert from "react-bootstrap-sweetalert";
import toast, { Toaster } from 'react-hot-toast';

export const PaymentFrequencyList = () => {
    const { t, i18n } = useTranslation();
    const {
        paymentfrequencylist: { paymentFrequencies, totalRows, perPage, currentPage, search },
    } = useStore(({ paymentfrequencylist, app }) => ({ paymentfrequencylist, app }));

    useEffect(() => {
        if (checkForPermission("PAYMENTFREQUENCY_VIEW")) {
            onLoad();
        }
    }, []);
    const onLoad = async () => {
        store.dispatch(startPreloader())
        store.dispatch(initializePaymentFrequencyList());
        try {
            const PaymentFrequencys = await getPaymentFrequencyList(search, currentPage);
            store.dispatch(loadPaymentFrequencies(PaymentFrequencys));
        } catch (error) {
            console.error(error);
        }
        store.dispatch(stopPreloader())
    }
    const onPageChange = async (index: number) => {
        store.dispatch(changePage(index));
        const result = await getPaymentFrequencyList(search, index);
        store.dispatch(loadPaymentFrequencies(result));
    }
    const filterPaymentFrequencyList = async () => {
        store.dispatch(changePage(1))
        const result = await getPaymentFrequencyList(store.getState().paymentfrequencylist.search, 1);
        store.dispatch(loadPaymentFrequencies(result));
    }
    const addData = async (event: any) => {
        store.dispatch(setSearch(event.target.value));
        if (event.target.value == "") {
            store.dispatch(changePage(1))
            const result = await getPaymentFrequencyList(store.getState().paymentfrequencylist.search, store.getState().paymentfrequencylist.currentPage);
            store.dispatch(loadPaymentFrequencies(result));
        }
    }
    const breadcrumbItems = [
        { Text: 'breadcrumbs_home', Link: '/' },
        { Text: 'breadcrumbs_masters', Link: '/config/masters' },
        { Text: 'breadcrumbs_masters_payment_frequency' },
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
                confirmBtnText={t('paymentfrequency_delete_confirm_btn')}
                confirmBtnBsStyle="danger"
                title={t('paymentfrequency_delete_title')}
                onConfirm={() => handleDelete(Id)}
                onCancel={handleCancel}
                focusCancelBtn
            >
                {t('paymentfrequency_delete_question')}
            </SweetAlert>
        );
    }

    async function handleDelete(Id: number) {
        var result = await deletePaymentFrequency(Id);
        setId(0);
        result.match({
            ok: () => {
                toast(i18n.t('paymentfrequency_message_success_delete'), {
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
            },
        });
    }

    return (<ContainerPage>
        <>
            <BreadCrumb items={breadcrumbItems} />
            {checkForPermission("PAYMENTFREQUENCY_VIEW") && paymentFrequencies.match({
                none: () => <>{t('paymentfrequency_list_loading')}</>,
                some: (PaymentFrequencies) => <div className="ps-3 pe-4">
                    <div className="row mt-1 mb-3 p-0 ">
                        <div className="col-md-9 app-primary-color ">
                            <h5 className="ms-0 ps-1"> {t('paymentfrequency_list_title')}</h5>
                        </div>
                        {checkForPermission("PAYMENTFREQUENCY_MANAGE") &&
                            <div className="col-md-3 ">
                                <button className="btn app-primary-bg-color text-white float-end " data-bs-toggle='modal' data-bs-target='#CreatePaymentFrequency'>
                                    {t('paymentfrequency_list_button_create')}
                                </button>
                            </div>
                        }
                    </div>
                    <div className="mb-3 ps-1">
                        <div className="input-group">
                            <input type='search' className="form-control custom-input " value={search} placeholder={t('paymentfrequency_list_placeholder_search') ?? ''} onChange={addData}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        filterPaymentFrequencyList();
                                    }
                                }} />
                            <button className="btn app-primary-bg-color text-white float-end" type="button" onClick={filterPaymentFrequencyList}>
                                Search
                            </button>
                        </div>
                    </div>
                    <div className="row mt-3 ps-1">
                        {PaymentFrequencies.length > 0 ? (
                            <div className=" table-responsive ">
                                <table className="table table-hover  table-bordered ">
                                    <thead>
                                        <tr>
                                            {checkForPermission("PAYMENTFREQUENCY_MANAGE") && <th></th>}
                                            <th scope="col">{t('paymentfrequency_list_th_sl_no')}</th>
                                            <th scope="col">{t('paymentfrequency_list_th_code')}</th>
                                            <th scope="col">{t('paymentfrequency_list_th_name')}</th>
                                            <th scope="col">{t('paymentfrequency_list_th_calendarmonths')}</th>
                                            <th scope="col">{t('paymentfrequency_list_th_createdon')}</th>
                                            <th scope="col">{t('paymentfrequency_list_th_createdby')}</th>
                                            <th scope="col">{t('paymentfrequency_list_th_updatedon')}</th>
                                            <th scope='col'>{t('paymentfrequency_list_th_updatedby')}</th>
                                            <th scope='col'>{t('paymentfrequency_list_th_status')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {PaymentFrequencies.map((field, index) => (
                                            <tr className="mt-2" key={index}>
                                                {checkForPermission("PAYMENTFREQUENCY_MANAGE") &&
                                                    <td className="">
                                                        <a
                                                            className="pseudo-href app-primary-color"
                                                            onClick={() => {
                                                                store.dispatch(loadPaymentFrequencyDetails({
                                                                    Id: field.paymentFrequency.Id, Name: field.paymentFrequency.Name,
                                                                    IsActive: (field.paymentFrequency.IsActive == true ? "1" : "0"),
                                                                    CalendarMonths: field.paymentFrequency.CalendarMonths
                                                                }))
                                                            }}
                                                            data-bs-toggle="modal"
                                                            data-toggle="tooltip" data-placement="left" title={'Edit'}
                                                            data-bs-target="#EditPaymentFrequency"
                                                        >
                                                            <span className="material-symbols-outlined ">
                                                                edit_note
                                                            </span>
                                                        </a>
                                                        <span className="custom-pointer-cursor material-symbols-outlined text-size-20 app-primary-color" onClick={() => handleConfirm(field.paymentFrequency.Id)}>
                                                            Delete
                                                        </span>
                                                    </td>
                                                }
                                                <th scope='row'>{(currentPage - 1) * 10 + (index + 1)}</th>
                                                <td>{field.paymentFrequency.Code} </td>
                                                <td>{field.paymentFrequency.Name} </td>
                                                <td>{field.paymentFrequency.CalendarMonths} </td>
                                                <td>{formatDateTime(field.paymentFrequency.CreatedOn)} </td>
                                                <td>{field.paymentFrequency.CreatedByFullName}</td>
                                                <td>{field.paymentFrequency.UpdatedOn ? formatDateTime(field.paymentFrequency.UpdatedOn) : ""} </td>
                                                <td>{field.paymentFrequency.UpdatedByFullName ?? ""}</td>
                                                <td >{field.paymentFrequency.IsActive == true ? "ACTIVE" : "INACTIVE"}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div className="row m-0">
                                    <Pagination currentPage={currentPage} count={totalRows} itemsPerPage={perPage} onPageChange={onPageChange} />
                                </div>
                            </div>
                        ) : (
                            <div className="text-muted ps-3">{t('paymentfrequencylist_no_data')}</div>
                        )}
                    </div>
                    {Id ? <DeleteConfirmationModal /> : ""}
                    <Toaster />
                    <PaymentFrequencyEdit />
                    <PaymentFrequencyCreate />
                </div>
            })}
        </>
    </ContainerPage>)
}