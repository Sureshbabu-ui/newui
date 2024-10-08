import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useStore } from '../../../../../state/storeHooks';
import { ContainerPage } from "../../../../ContainerPage/ContainerPage";
import { store } from '../../../../../state/store';
import { changePage, updateField, loadInvoicePrerequisites, setSearch, startSubmitting, stopSubmitting } from './InvoicePrerequisiteList.slice';
import { Pagination } from "../../../../Pagination/Pagination";
import { startPreloader, stopPreloader } from '../../../../Preloader/Preloader.slice';
import { deleteInvoicePrerequisite, getInvoicePrerequisiteList, updateInvoicePrerequisite } from "../../../../../services/invoicePrerequisite";
import { InvoicePrerequisiteCreate } from "../InvoicePrerequisiteCreate/InvoicePrerequisiteCreate";
import { InvoicePrerequisiteUpdate } from "../../../../../types/invoicePrerequisite";
import SweetAlert from "react-bootstrap-sweetalert";
import i18n from "../../../../../i18n";
import toast, { Toaster } from "react-hot-toast";
import FeatherIcon from 'feather-icons-react';
import { checkForPermission } from "../../../../../helpers/permissions";
import BreadCrumb from "../../../../BreadCrumbs/BreadCrumb";

export const InvoicePrerequisiteList = () => {
    const { t } = useTranslation();
    const {
        invoiceprerequisitelist: { invoiceprerequisites, totalRows, perPage, currentPage, search, invoiceprerequisite },
    } = useStore(({ invoiceprerequisitelist, app }) => ({ invoiceprerequisitelist, app }));

    useEffect(() => {
        onLoad();
    }, []);


    const [Id, setId] = useState(0);

    const handleConfirmDelete = (Id: number) => {
        setId(Id);
    };

    const handleCancelDelete = () => {
        setId(0);
    };

    function DeleteConfirmationModal() {
        return (
            <SweetAlert
                danger
                showCancel
                confirmBtnText={t('invoiceprerequisite_delete_confirm_btn')}
                confirmBtnBsStyle="danger"
                title={t('invoiceprerequisite_delete_title')}
                onConfirm={() => handleDelete(Id)}
                onCancel={handleCancelDelete}
                focusCancelBtn
            >
                {t('invoiceprerequisite_delete_question')}
            </SweetAlert>
        );
    }

    async function handleDelete(Id: number) {
        var result = await deleteInvoicePrerequisite(Id);
        result.match({
            ok: () => {
                setId(0);
                toast(i18n.t('invoiceprerequisite_message_success_delete'), {
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

    const [searchvalue, setSearchValue] = useState(false)

    async function InvoicePrerequisiteUpdate(invoiceprerequisite: InvoicePrerequisiteUpdate) {
        const result = await updateInvoicePrerequisite(invoiceprerequisite)
        store.dispatch(startPreloader());
        store.dispatch(startSubmitting());
        store.dispatch(stopSubmitting())
        result.match({
            ok: () => {
                setInvoicePrerequisiteId(0)
                toast(i18n.t('invoiceprerequisitelist_toast_success'),
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
            err: (e) => {
                toast(i18n.t('invoiceprerequisitelist_toast_fail'),
                    {
                        duration: 2500,
                        style: {
                            borderRadius: '0',
                            background: '#F92F60',
                            color: '#fff'
                        }
                    });
                onLoad()
                console.log("Error")
            },
        });
        store.dispatch(stopPreloader());
    }
    const [InvoicePrerequisite, setInvoicePrerequisiteId] = useState(0);

    const handleConfirm = (id: any) => {
        if (checkForPermission("INVOICEPREREQUISITE_MANAGE")) {
            setInvoicePrerequisiteId(1);
        }
    }

    async function handleCancel() {
        setInvoicePrerequisiteId(0);
        if (checkForPermission('INVOICEPREREQUISITE_VIEW'))
            onLoad()
    }
    
    function InformationModal() {
        const { t, i18n } = useTranslation();
        return (
            <SweetAlert warning
                showCancel
                confirmBtnCssClass="me-0"
                confirmBtnText='Yes'
                cancelBtnText='Cancel'
                cancelBtnBsStyle='light'
                confirmBtnBsStyle='warning'
                title='Are you sure?'
                onConfirm={() => InvoicePrerequisiteUpdate(store.getState().invoiceprerequisitelist.invoiceprerequisite)}
                onCancel={handleCancel}
                focusCancelBtn>
                {t('invoiceprerequisitelist_conformation_text')}
            </SweetAlert>
        );
    }

    const onLoad = async () => {
        store.dispatch(startPreloader())
        store.dispatch(setSearch(search))
        try {
            if (searchvalue == true && search !== null) {
                const InvoicePrerequisite = await getInvoicePrerequisiteList(search, currentPage);
                store.dispatch(loadInvoicePrerequisites(InvoicePrerequisite));
            } else {
                const InvoicePrerequisite = await getInvoicePrerequisiteList("", currentPage);
                store.dispatch(loadInvoicePrerequisites(InvoicePrerequisite));
            }
        } catch (error) {
            console.error(error);
        }
        store.dispatch(stopPreloader())
    }

    const onPageChange = async (index: number) => {
        store.dispatch(changePage(index));
        const result = await getInvoicePrerequisiteList(search, index);
        store.dispatch(loadInvoicePrerequisites(result));
    }

    async function filterInvoicePrerequisiteList(e) {
        store.dispatch(setSearch(search))
        const result = await getInvoicePrerequisiteList(store.getState().invoiceprerequisitelist.search, store.getState().invoiceprerequisitelist.currentPage)
        store.dispatch(loadInvoicePrerequisites(result));
    }

    const addData = async (event: any) => {
        store.dispatch(setSearch(event.target.value));
        if (event.target.value == "") {
            setSearchValue(false)
            const result = await getInvoicePrerequisiteList(store.getState().invoiceprerequisitelist.search, store.getState().invoiceprerequisitelist.currentPage);
            store.dispatch(loadInvoicePrerequisites(result));
        }
    }
    function onUpdateField(event: any, Id: number, index: number) {
        if (checkForPermission("INVOICEPREREQUISITE_MANAGE")) {
            var value = event.target.value;
            var checked = event.target.checked;
            value = checked ? true : false;
            store.dispatch(updateField({ Id: Id, IsActive: value, Index: index }));
        }
    }
    const breadcrumbItems = [
        { Text: 'breadcrumbs_home', Link: '/' },
        { Text: 'breadcrumbs_masters', Link: '/config/masters' },
        { Text: 'breadcrumbs_masters_invoice_prerequisites' }
    ];

    return (
        <ContainerPage>
            <BreadCrumb items={breadcrumbItems} />
            <div>
                {checkForPermission('INVOICEPREREQUISITE_VIEW') && <>
                    <div className="ps-3 pe-4">
                        <div className="row mt-1 mb-3 p-0 ">
                            <div className="col-md-9 app-primary-color ">
                                <h5 className="ms-0 ps-1"> {t('invoiceprerequisitelist_title')}</h5>
                            </div>
                            <div className="col-md-3 ">
                                {checkForPermission('INVOICEPREREQUISITE_MANAGE') && <button className="btn app-primary-bg-color text-white float-end " data-bs-toggle='modal' data-bs-target='#CreateInvoicePrerequisite'>
                                    {t('invoiceprerequisitelist_button_create')}
                                </button>}
                            </div>
                        </div>
                        <div className="mb-3 ps-1">
                            <div className="input-group">
                                <input type='search' className="form-control custom-input" value={search} placeholder={t('invoiceprerequisitelist_placeholder_search') ?? ''}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            setSearchValue(true)
                                            filterInvoicePrerequisiteList(e);
                                        }
                                    }}
                                    onChange={addData}
                                />
                                <button className="btn app-primary-bg-color text-white float-end " type="button" onClick={(e) => { filterInvoicePrerequisiteList(e), setSearchValue(true) }}>
                                    Search
                                </button>
                            </div>
                        </div>
                    </div>
                    {invoiceprerequisites.length > 0 ? (
                        <>
                            <div className="pe-3">
                                <div className="row mt-2">
                                    <>
                                        <div className="">
                                            {invoiceprerequisites.map((field, index) => (
                                                <div key={index}>
                                                    <div className="row my-3 ps-2">
                                                        <div className="col">
                                                            <div>
                                                                <span className="fs-6">
                                                                    {field.IsActive == false ?
                                                                        <span data-toggle="tooltip" data-placement="left" title={'In Active'}> <FeatherIcon className="text-secondary" stroke-width="3" icon={"x-circle"} size="19" /></span>
                                                                        : <span data-toggle="tooltip" data-placement="left" title={'Active'}><FeatherIcon className="text-success" icon={"check-circle"} stroke-width="3" size="18" /></span>} &nbsp;{field.DocumentName} &nbsp; <span className="text-muted small ">({field.DocumentCode})</span>
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="col d-flex justify-content-end me-1">
                                                            <div className="form-check form-switch">
                                                                {checkForPermission("INVOICEPREREQUISITE_MANAGE") && (
                                                                    <>
                                                                        <input
                                                                            className="form-check-input switch-input-lg"
                                                                            type="checkbox"
                                                                            name="IsActive"
                                                                            id="flexSwitchCheckDefault"
                                                                            checked={field.IsActive}
                                                                            value={invoiceprerequisite.IsActive.toLocaleString()}
                                                                            onClick={() => handleConfirm(1)}
                                                                            onChange={(ev) => onUpdateField(ev, field.Id, index)}
                                                                        ></input>
                                                                        <span className="custom-pointer-cursor material-symbols-outlined app-primary-color" onClick={() => handleConfirmDelete(field.Id)}>
                                                                            Delete
                                                                        </span>
                                                                    </>

                                                                )}
                                                            </div>
                                                        </div>
                                                        <small className="col-12 text-muted ms-4">{field.Description}</small>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className=" m-0">
                                            <Pagination currentPage={currentPage} count={totalRows} itemsPerPage={perPage} onPageChange={onPageChange} />
                                        </div>
                                    </>
                                </div>
                                {Id ? <DeleteConfirmationModal /> : ""}
                                <Toaster />
                                {InvoicePrerequisite ? <InformationModal /> : ''}
                                <InvoicePrerequisiteCreate />
                            </div></>
                    ) : (
                        <div className="ps-3 pe-4 mt-3">
                            {t('invoiceprerequisitelist_no_data')}
                        </div>)}
                </>}
            </div>
        </ContainerPage>)
}