import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useStore } from '../../../../../state/storeHooks';
import { ContainerPage } from "../../../../ContainerPage/ContainerPage";
import { store } from '../../../../../state/store';
import { changePage, initializeDesignationList, loadDesignations, setSearch } from './DesignationList.slice'
import { deleteDesignation, getDesignationList } from "../../../../../services/designation";
import { Pagination } from "../../../../Pagination/Pagination";
import { startPreloader, stopPreloader } from '../../../../Preloader/Preloader.slice';
import { formatDateTime } from "../../../../../helpers/formats";
import { DesignationCreate } from "../DesignationCreate/DesignationCreate";
import { checkForPermission } from "../../../../../helpers/permissions";
import BreadCrumb from "../../../../BreadCrumbs/BreadCrumb";
import { loadDesignationDetails } from "../DesignationUpdate/DesignationUpdate.slice";
import { DesignationUpdate } from "../DesignationUpdate/DesignationUpdate";
import SweetAlert from "react-bootstrap-sweetalert";
import toast, { Toaster } from 'react-hot-toast';

export const DesignationList = () => {
    const { t, i18n } = useTranslation();
    const {
        designationlist: { designations, totalRows, perPage, currentPage, search },
    } = useStore(({ designationlist, app }) => ({ designationlist, app }));

    useEffect(() => {
        if (checkForPermission("DESIGNATION_VIEW")) {
            onLoad();
        }
    }, []);

    const onLoad = async () => {
        store.dispatch(startPreloader())
        store.dispatch(initializeDesignationList());
        try {
            const Designations = await getDesignationList(search, currentPage);
            store.dispatch(loadDesignations(Designations));
        } catch (error) {
            console.error(error);
        }
        store.dispatch(stopPreloader())
    }

    const onPageChange = async (index: number) => {
        store.dispatch(changePage(index));
        const result = await getDesignationList(search, index);
        store.dispatch(loadDesignations(result));
    }

    async function filterDesignationList(e) {
        store.dispatch(changePage(1))
        const result = await getDesignationList(store.getState().designationlist.search, 1)
        store.dispatch(loadDesignations(result));
    }
    const addData = async (event: any) => {
        store.dispatch(setSearch(event.target.value));
        if (event.target.value == "") {
            store.dispatch(changePage(1))
            const result = await getDesignationList(store.getState().designationlist.search, store.getState().designationlist.currentPage);
            store.dispatch(loadDesignations(result));
        }
    }
    const breadcrumbItems = [
        { Text: 'breadcrumbs_home', Link: '/' },
        { Text: 'breadcrumbs_masters', Link: '/config/masters' },
        { Text: 'breadcrumbs_masters_designation' }
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
                confirmBtnText={t('designation_delete_confirm_btn')}
                confirmBtnBsStyle="danger"
                title={t('designation_delete_title')}
                onConfirm={() => handleDelete(Id)}
                onCancel={handleCancel}
                focusCancelBtn
            >
                {t('designation_delete_question')}
            </SweetAlert>
        );
    }

    async function handleDelete(Id: number) {
        var result = await deleteDesignation(Id);
        result.match({
            ok: () => {
                setId(0);
                toast(i18n.t('designation_message_success_delete'), {
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
            {checkForPermission("DESIGNATION_VIEW") && designations.match({
                none: () => <>{t('designation_list_loading')}</>,
                some: (Designations) => <div className="ps-3 pe-4">
                    <div className="row mt-1 mb-3 p-0 ">
                        <div className="col-md-9 app-primary-color ">
                            <h5 className="ms-0 ps-1"> {t('designation_list_title')}</h5>
                        </div>
                        {checkForPermission("DESIGNATION_MANAGE") &&
                            <div className="col-md-3 ">
                                <button className="btn app-primary-bg-color text-white float-end " data-bs-toggle='modal' data-bs-target='#CreateDesignation'>
                                    {t('designation_list_button_create')}
                                </button>
                            </div>
                        }
                    </div>
                    <div className="mb-3 ps-2">
                        <div className="input-group">
                            <input type='search' className="form-control custom-input" value={search} placeholder={t('businessevent_list_placeholder_search') ?? ''}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        filterDesignationList(e);
                                    }
                                }} onChange={addData} />
                            <button className="btn app-primary-bg-color text-white float-end " type="button" onClick={filterDesignationList}>
                                Search
                            </button>
                        </div>
                    </div>
                    <div className="row mt-3 ps-1">
                        {Designations.length > 0 ? (
                            <div className=" table-responsive ">
                                <table className="table table-hover  table-bordered ">
                                    <thead>
                                        <tr>
                                            {checkForPermission("DESIGNATION_MANAGE") &&
                                                <th></th>
                                            }
                                            <th scope="col">{t('designation_list_th_sl_no')}</th>
                                            <th scope="col">{t('designation_list_th_code')}</th>
                                            <th scope="col">{t('designation_list_th_name')}</th>
                                            <th scope="col">{t('designation_list_th_createdon')}</th>
                                            <th scope="col">{t('designation_list_th_createdby')}</th>
                                            <th scope="col">{t('designation_list_th_updatedon')}</th>
                                            <th scope='col'>{t('designation_list_th_updatedby')}</th>
                                            <th scope='col'>{t('designation_list_th_status')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Designations.map((field, index) => (
                                            <tr className="mt-2">
                                                {checkForPermission("DESIGNATION_MANAGE") &&
                                                    <td className="">
                                                        <a
                                                            className="pseudo-href app-primary-color"
                                                            onClick={() => {
                                                                store.dispatch(loadDesignationDetails({ Id: field.designation.Id, Name: field.designation.Name, IsActive: field.designation.IsActive == true ? "1" : "0" }))
                                                            }}
                                                            data-bs-toggle="modal"
                                                            data-toggle="tooltip" data-placement="left" title={'Edit'}
                                                            data-bs-target="#UpdateDesignation"
                                                        >
                                                            <span className="material-symbols-outlined ">
                                                                edit_note
                                                            </span>
                                                        </a>
                                                        <span className="custom-pointer-cursor material-symbols-outlined text-size-20 app-primary-color" onClick={() => handleConfirm(field.designation.Id)}>
                                                            Delete
                                                        </span>
                                                    </td>
                                                }
                                                <th scope="row">{(currentPage - 1) * 10 + (index + 1)}</th>
                                                <td>{field.designation.Code} </td>
                                                <td>  {field.designation.Name} </td>
                                                <td>  {formatDateTime(field.designation.CreatedOn)} </td>
                                                <td>{field.designation.CreatedByFullName}</td>
                                                <td>  {field.designation.UpdatedOn ? formatDateTime(field.designation.UpdatedOn) : ""} </td>
                                                <td>{field.designation.UpdatedByFullName ?? ""}</td>
                                                <td >   {field.designation.IsActive == true ? "ACTIVE" : "INACTIVE"}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div className="row m-0">
                                    <Pagination currentPage={currentPage} count={totalRows} itemsPerPage={perPage} onPageChange={onPageChange} />
                                </div>
                            </div>
                        ) : (
                            <div className="text-muted ps-3">{t('designationlist_no_data')}</div>
                        )}
                    </div>
                    {Id ? <DeleteConfirmationModal /> : ""}
                    <Toaster />
                    <DesignationUpdate />
                    <DesignationCreate />
                </div>
            })}
        </>
    </ContainerPage>)
}