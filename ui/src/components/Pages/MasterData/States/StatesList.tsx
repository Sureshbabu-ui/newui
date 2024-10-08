import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import BreadCrumb from "../../../BreadCrumbs/BreadCrumb";
import { deleteState, getAllStates } from "../../../../services/state";
import { checkForPermission } from "../../../../helpers/permissions";
import { StateCreate } from "./StateCreate/StateCreate";
import { loadStateDetails, updateErrors } from "./StateEdit/StateEdit.slice";
import { store } from "../../../../state/store";
import { StateEdit } from "./StateEdit/StateEdit";
import { useStoreWithInitializer } from "../../../../state/storeHooks";
import { changePage, loadStates, setFilter } from "./StateList.slice";
import { Pagination } from "../../../Pagination/Pagination";
import SweetAlert from "react-bootstrap-sweetalert";
import toast, { Toaster } from 'react-hot-toast';
import { convertBackEndErrorsToValidationErrors } from "../../../../helpers/formats";

export const StateList = () => {
    const { t, i18n } = useTranslation();

    useEffect(() => {
        if (checkForPermission('STATE_VIEW'))
            onLoad();
    }, []);

    const onPageChange = async (index: number) => {
        store.dispatch(changePage(index));
        if (checkForPermission("STATE_VIEW")) {
            const result = await getAllStates(store.getState().statelist.search, store.getState().statelist.currentPage);
            store.dispatch(loadStates(result));
        }
    }

    const filterList = async () => {
        await store.dispatch(changePage(1));
        if (checkForPermission("STATE_VIEW")) {
            const result = await getAllStates(store.getState().statelist.search, store.getState().statelist.currentPage);
            store.dispatch(loadStates(result));
        }
    }

    const onLoad = async () => {
        try {
            const result = await getAllStates(store.getState().statelist.search, store.getState().statelist.currentPage);
            store.dispatch(loadStates(result));
        } catch (error) {
            console.error(error);
        }
    };

    const { statelist: { stateinfo, currentPage, perPage, search, totalRows } } = useStoreWithInitializer(({ statelist, app }) => ({ statelist, app }), onLoad);

    const breadcrumbItems = [
        { Text: 'breadcrumbs_home', Link: '/' },
        { Text: 'breadcrumbs_masters', Link: '/config/masters' },
        { Text: 'breadcrumbs_masters_state' },
    ];

    const addData = async (event: any) => {
        store.dispatch(setFilter(event.target.value));
        if (event.target.value == "") {
            store.dispatch(changePage(1))
            const result = await getAllStates(store.getState().statelist.search, store.getState().statelist.currentPage);
            store.dispatch(loadStates(result));
        }
    }

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
                confirmBtnText={t('state_delete_confirm_btn')}
                confirmBtnBsStyle="danger"
                title={t('state_delete_title')}
                onConfirm={() => handleDelete(Id)}
                onCancel={handleCancel}
                focusCancelBtn
            >
                {t('state_delete_question')}
            </SweetAlert>
        );
    }

    async function handleDelete(Id: number) {
        var result = await deleteState(Id);
        result.match({
            ok: () => {
                setId(0);
                toast(i18n.t('state_message_success_delete'), {
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
                const errorMessages = convertBackEndErrorsToValidationErrors(err)
                store.dispatch(updateErrors(errorMessages));
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
        <div className="row mx-0 mt-4">
            <>
                <BreadCrumb items={breadcrumbItems} />
                <div className="ps-3 pe-4 ">
                    <div className="row mt-1 mb-3 p-0 ">
                        <div className="col-md-9 app-primary-color ">
                            <h5 className="ms-0 ps-1"> {t('state_list_title')}</h5>
                        </div>
                        {checkForPermission("STATE_MANAGE") &&
                            <div className="col-md-3 ">
                                <button className="btn app-primary-bg-color text-white float-end " data-bs-toggle='modal' data-bs-target='#CreateState'>
                                    {t('state_create_title')}
                                </button>
                            </div>
                        }
                    </div>
                    <div className="row mt-1 mb-3 ps-1 ">
                        <div className="input-group">
                            <input type='search' className="form-control custom-input" value={search} placeholder={'Search with Name' ?? ''} onChange={addData}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        filterList();
                                    }
                                }} />
                            <button className="btn app-primary-bg-color text-white float-end " type="button" onClick={filterList}>
                                {t('state_list_button_search')}
                            </button>
                        </div>
                    </div>
                    {checkForPermission("STATE_VIEW") &&
                        stateinfo.match({
                            none: () => <div className="ms-1">{t('state_list_loading')}</div>,
                            some: (states) =>
                                <div className="row mt-1 ps-1">

                                    <div className="table-responsive ">
                                        <table className="table table-hover  table-bordered ">
                                            <thead>
                                                <tr>
                                                    {checkForPermission("STATE_MANAGE") &&
                                                        <th></th>
                                                    }
                                                    <th scope="col">{t("state_list_sl.no")}</th>
                                                    <th scope="col">{t("state_list_code")}</th>
                                                    <th scope="col">{t("state_list_name")}</th>
                                                    <th scope="col">{t("state_list_gststatename")}</th>
                                                    <th scope="col">{t("state_list_gststatecode")}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {states.map((state, index) => (
                                                    <tr key={index} className="mt-2">
                                                        {checkForPermission("STATE_MANAGE") &&
                                                            <td>
                                                                <a
                                                                    className="pseudo-href app-primary-color"
                                                                    onClick={() => store.dispatch(loadStateDetails(state))}
                                                                    data-bs-toggle="modal"
                                                                    data-toggle="tooltip" data-placement="left" title={'Edit'}
                                                                    data-bs-target="#EditState"
                                                                >
                                                                    <span className="material-symbols-outlined ">
                                                                        edit_note
                                                                    </span>
                                                                </a>
                                                                <span className="custom-pointer-cursor material-symbols-outlined text-size-20 app-primary-color" onClick={() => handleConfirm(state.Id)}>
                                                                    Delete
                                                                </span>
                                                            </td>
                                                        }
                                                        <th scope="row">{(currentPage - 1) * 10 + (index + 1)}</th>
                                                        <td>{state.Code}</td>
                                                        <td>{state.Name}</td>
                                                        <td>{state.GstStateName}</td>
                                                        <td>{state.GstStateCode}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        <div className="row m-0 ">
                                            <Pagination currentPage={currentPage} count={totalRows} itemsPerPage={perPage} onPageChange={onPageChange} />
                                        </div>
                                    </div>
                                </div>
                        })}
                    {Id ? <DeleteConfirmationModal /> : ""}
                    <Toaster />
                </div>
            </>
            <StateEdit />
            <StateCreate />
        </div >
    );
};
