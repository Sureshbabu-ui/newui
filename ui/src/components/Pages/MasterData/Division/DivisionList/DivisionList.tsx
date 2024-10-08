import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useStore } from '../../../../../state/storeHooks';
import { ContainerPage } from "../../../../ContainerPage/ContainerPage";
import { store } from '../../../../../state/store';
import { changePage, initializeDivisionList, loadDivisions, setSearch } from './DivisionList.slice'
import { deleteDivision, getDivisionList } from "../../../../../services/division";
import { Pagination } from "../../../../Pagination/Pagination";
import { startPreloader, stopPreloader } from '../../../../Preloader/Preloader.slice';
import { formatDateTime } from "../../../../../helpers/formats";
import { DivisionCreate } from "../DivisionCreate/DivisionCreate";
import { checkForPermission } from "../../../../../helpers/permissions";
import BreadCrumb from "../../../../BreadCrumbs/BreadCrumb";
import { loadDivisionDetails } from "../DivisionEdit/DivisionEdit.slice";
import { DivisionEdit } from "../DivisionEdit/DivisionEdit";
import SweetAlert from "react-bootstrap-sweetalert";
import toast, { Toaster } from 'react-hot-toast';

export const DivisionList = () => {
    const { t, i18n } = useTranslation();
    const {
        divisionlist: { divisions, totalRows, perPage, currentPage, search },
    } = useStore(({ divisionlist, app }) => ({ divisionlist, app }));

    useEffect(() => {
        if (checkForPermission("BUSINESSDIVISION_VIEW")) {
            onLoad();
        }
    }, []);
    const onLoad = async () => {
        store.dispatch(startPreloader())
        store.dispatch(initializeDivisionList());
        try {
            const Divisions = await getDivisionList(search, currentPage);
            store.dispatch(loadDivisions(Divisions));
        } catch (error) {
            console.error(error);
        }
        store.dispatch(stopPreloader())
    }
    const onPageChange = async (index: number) => {
        store.dispatch(changePage(index));
        const result = await getDivisionList(search, index);
        store.dispatch(loadDivisions(result));
    }
    const filterDivisionList = async () => {
        store.dispatch(changePage(1))
        const result = await getDivisionList(store.getState().divisionlist.search, 1);
        store.dispatch(loadDivisions(result));
    }
    const addData = async (event: any) => {
        store.dispatch(setSearch(event.target.value));
        if (event.target.value == "") {
            store.dispatch(changePage(1))
            const result = await getDivisionList(store.getState().divisionlist.search, store.getState().divisionlist.currentPage);
            store.dispatch(loadDivisions(result));
        }
    }
    const breadcrumbItems = [
        { Text: 'breadcrumbs_home', Link: '/' },
        { Text: 'breadcrumbs_masters', Link: '/config/masters' },
        { Text: 'breadcrumbs_masters_business_division' }
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
                confirmBtnText={t('division_delete_confirm_btn')}
                confirmBtnBsStyle="danger"
                title={t('division_delete_title')}
                onConfirm={() => handleDelete(Id)}
                onCancel={handleCancel}
                focusCancelBtn
            >
                {t('division_delete_question')}
            </SweetAlert>
        );
    }

    async function handleDelete(Id: number) {
        var result = await deleteDivision(Id);
        result.match({
            ok: () => {
                setId(0);
                toast(i18n.t('division_message_success_delete'), {
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
            {checkForPermission("BUSINESSDIVISION_VIEW") && divisions.match({
                none: () => <>{t('division_list_loading')}</>,
                some: (Divisions) => <div className="ps-3 pe-4   ">
                    <div className="row mt-1 mb-3 p-0 ">
                        <div className="col-md-9 app-primary-color ">
                            <h5 className="ms-0 ps-1"> {t('division_list_title')}</h5>
                        </div>
                        {checkForPermission("BUSINESSDIVISION_MANAGE") &&
                            <div className="col-md-3 ">
                                <button className="btn app-primary-bg-color text-white float-end " data-bs-toggle='modal' data-bs-target='#CreateDivision'>
                                    {t('division_list_button_create')}
                                </button>
                            </div>
                        }
                    </div>
                    {checkForPermission("BUSINESSDIVISION_VIEW") && <>
                        <div className="mb-3 ps-1">
                            <div className="input-group">
                                <input type='search' className="form-control custom-input " value={search} placeholder={t('businessdivision_list_placeholder_search') ?? ''} onChange={addData}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            filterDivisionList();
                                        }
                                    }} />
                                <button className="btn app-primary-bg-color text-white float-end" type="button" onClick={filterDivisionList}>
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
                                                <th scope="col">{t('division_list_th_sl_no')}</th>
                                                <th scope="col">{t('division_list_th_code')}</th>
                                                <th scope="col">{t('division_list_th_name')}</th>
                                                <th scope="col">{t('division_list_th_createdon')}</th>
                                                <th scope="col">{t('division_list_th_createdby')}</th>
                                                <th scope="col">{t('division_list_th_updatedon')}</th>
                                                <th scope='col'>{t('division_list_th_updatedby')}</th>
                                                <th scope='col'>{t('division_list_th_status')}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Divisions.map((field, index) => (
                                                <tr className="mt-2">
                                                    <td className="">
                                                        {checkForPermission("BUSINESSDIVISION_MANAGE") &&
                                                            <>
                                                                <a
                                                                    className="pseudo-href app-primary-color"
                                                                    onClick={() => {
                                                                        store.dispatch(loadDivisionDetails({ Id: field.division.Id, Name: field.division.Name, IsActive: (field.division.IsActive == true ? "1" : "0") }))
                                                                    }}
                                                                    data-bs-toggle="modal"
                                                                    data-toggle="tooltip" data-placement="left" title={'Edit'}
                                                                    data-bs-target="#EditDivision"
                                                                >
                                                                    <span className="material-symbols-outlined me-2">
                                                                        edit_note
                                                                    </span>
                                                                </a>
                                                                <span className="custom-pointer-cursor material-symbols-outlined text-size-20 app-primary-color" onClick={() => handleConfirm(field.division.Id)}>
                                                                    Delete
                                                                </span>
                                                            </>
                                                        }
                                                    </td>
                                                    <th scope='row'>{(currentPage - 1) * 10 + (index + 1)}</th>
                                                    <td>{field.division.Code} </td>
                                                    <td>  {field.division.Name} </td>
                                                    <td>  {formatDateTime(field.division.CreatedOn)} </td>
                                                    <td>{field.division.CreatedByFullName}</td>
                                                    <td>{field.division.UpdatedOn ? formatDateTime(field.division.UpdatedOn) : ""} </td>
                                                    <td>{field.division.UpdatedByFullName ?? ""}</td>
                                                    <td >{field.division.IsActive == true ? "ACTIVE" : "INACTIVE"}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <div className="row m-0">
                                        <Pagination currentPage={currentPage} count={totalRows} itemsPerPage={perPage} onPageChange={onPageChange} />
                                    </div>
                                </div>
                            ) : (
                                <div className="text-muted ps-3">{t('divisionlist_no_data')}</div>
                            )}
                        </div>
                    </>}
                    <DivisionEdit />
                    <DivisionCreate />
                    {Id ? <DeleteConfirmationModal /> : ""}
                    <Toaster />
                </div>
            })}
        </>
    </ContainerPage>)
}