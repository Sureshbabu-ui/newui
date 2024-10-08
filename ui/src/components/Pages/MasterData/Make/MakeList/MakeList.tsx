import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useStore } from '../../../../../state/storeHooks';
import { ContainerPage } from "../../../../ContainerPage/ContainerPage";
import { store } from '../../../../../state/store';
import { changePage, initializeMakeList, loadMakes, setSearch } from './MakeList.slice'
import { Pagination } from "../../../../Pagination/Pagination";
import { startPreloader, stopPreloader } from '../../../../Preloader/Preloader.slice';
import { formatDateTime, formatDocumentName } from "../../../../../helpers/formats";
import { MakeCreate } from "../MakeCreate/MakeCreate";
import { downloadMakeList, getMakeList, makeDelete } from "../../../../../services/make";
import FeatherIcon from 'feather-icons-react';
import toast, { Toaster } from 'react-hot-toast';
import SweetAlert from 'react-bootstrap-sweetalert';
import { loadMakeDetails } from "../MakeEdit/MakeEdit.slice";
import { MakeEdit } from "../MakeEdit/MakeEdit";
import { checkForPermission } from "../../../../../helpers/permissions";
import BreadCrumb from "../../../../BreadCrumbs/BreadCrumb";
import FileSaver from "file-saver";

export const MakeList = () => {
    const { t, i18n } = useTranslation();
    const {
        makelist: { makes, totalRows, perPage, currentPage, search },
    } = useStore(({ makelist, app }) => ({ makelist, app }));

    useEffect(() => {
        if (checkForPermission("MAKE_VIEW")) {
            onLoad();
        }
    }, []);
    const [makeId, setMakeId] = useState(0);

    const onLoad = async () => {
        store.dispatch(startPreloader())
        store.dispatch(initializeMakeList());
        try {
            const result = await getMakeList(search, currentPage);
            store.dispatch(loadMakes(result));
        } catch (error) {
            console.error(error);
        }
        store.dispatch(stopPreloader())
    }

    const onPageChange = async (index: number) => {
        store.dispatch(changePage(index));
        const result = await getMakeList(search, index);
        store.dispatch(loadMakes(result));
    }

    async function filterMakeList(e) {
        store.dispatch(changePage(1))
        const result = await getMakeList(store.getState().makelist.search, 1)
        store.dispatch(loadMakes(result));
    }
    const addData = async (event: any) => {
        store.dispatch(setSearch(event.target.value));
        if (event.target.value == "") {
            store.dispatch(changePage(1))
            const result = await getMakeList(store.getState().makelist.search, store.getState().makelist.currentPage);
            store.dispatch(loadMakes(result));
        }
    }

    async function loadClickedMakeDetails(MakeId: number, Code: string, Name: string) {
        store.dispatch(loadMakeDetails({ Id: MakeId, Code: Code, Name: Name }))
    }

    const handleConfirm = (MakeId: number) => {
        setMakeId(MakeId);
    };

    async function handleCancel() {
        setMakeId(0);
    }

    function ConfirmationModal() {
        return (
            <SweetAlert
                warning
                showCancel
                confirmBtnText='Yes, Delete!'
                cancelBtnText='Cancel'
                cancelBtnBsStyle='light'
                confirmBtnBsStyle='warning'
                title='Are you sure?'
                onConfirm={() => deleteMake(makeId)}
                onCancel={handleCancel}
                focusCancelBtn
            >
                {t('make_deleted_conformation')}
            </SweetAlert>
        );
    }

    const deleteMake = async (Id: number) => {
        setMakeId(0)
        var result = await makeDelete(Id);
        result.match({
            ok: () => {
                toast(i18n.t('make_deleted_success_message'),
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
                toast(i18n.t(err.Message),
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
    }
    const breadcrumbItems = [
        { Text: 'breadcrumbs_home', Link: '/' },
        { Text: 'breadcrumbs_masters', Link: '/config/masters' },
        { Text: 'breadcrumbs_masters_make' }
    ];
    const onDownloadClick = async (e: any) => {
        const response = await downloadMakeList()
        const url = window.URL.createObjectURL(response.data);
        FileSaver.saveAs(url, formatDocumentName())
    }

    return (
        <ContainerPage>
            <>
                <BreadCrumb items={breadcrumbItems} />
                {checkForPermission("MAKE_VIEW") && makes.match({
                    none: () => <>{t('make_list_loading')}</>,
                    some: (Make) => <div className="ps-3 pe-4 ">
                        <div className="row mt-1 mb-3 p-0 ">
                            <div className="col-md-8 app-primary-color ">
                                <h5 className="ms-0 ps-1"> {t('make_list_title')}</h5>
                            </div>
                            <div className="col-md-4 ">
                                {checkForPermission("MAKE_MANAGE") &&

                                    <button className="btn app-primary-bg-color text-white float-end ms-2 " data-bs-toggle='modal' data-bs-target='#CreateMake'>
                                        {t('make_list_button_create')}
                                    </button>
                                }
                                {checkForPermission("MAKE_VIEW") &&
                                    <button className="btn app-light float-end  app-primary-color fw-bold btn-sm border " onClick={onDownloadClick}>
                                        <span className="material-symbols-outlined align-middle me-1">
                                            download
                                        </span>
                                        {t('make_list_button_download')}
                                    </button>
                                }
                            </div>
                        </div>
                        <div className="mb-3  ps-1">
                                <div className="mb-3  ps-2">
                                    <div className="input-group">
                                        <input type='search' className="form-control custom-input" value={search} placeholder={t('make_list_placeholder_search') ?? ''}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    filterMakeList(e);
                                                }
                                            }} onChange={addData} />
                                        <button className="btn app-primary-bg-color text-white float-end " type="button" onClick={filterMakeList}>
                                            Search
                                        </button>
                                    </div>
                                </div>
                                <div className="row mt-3 ps-1">
                                    {Make.length > 0 ? (
                                        <div className=" table-responsive ">
                                            <table className="table table-hover  table-bordered ">
                                                <thead>
                                                    <tr>
                                                        <th></th>
                                                        <th scope="col">{t('make_list_th_sl_no')}</th>
                                                        <th scope="col">{t('make_list_th_code')}</th>
                                                        <th scope="col">{t('make_list_th_name')}</th>
                                                        <th scope="col">{t('make_list_th_createdby')}</th>
                                                        <th scope="col">{t('make_list_th_createdon')}</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {Make.map((field, index) => (
                                                        <tr className="mt-2">
                                                            <td className="custom-table-col-width">
                                                            {checkForPermission("MAKE_MANAGE") && <a
                                                                    className="pseudo-href app-primary-color ms-2"
                                                                    onClick={() => {
                                                                        loadClickedMakeDetails(field.make.Id, field.make.Code, field.make.Name)
                                                                    }}
                                                                    data-bs-toggle="modal"
                                                                    data-toggle="tooltip" data-placement="left" title={'Edit Make'}
                                                                    data-bs-target="#EditMake"
                                                                >
                                                                    <FeatherIcon icon={"edit"} size="16" />
                                                                </a>}

                                                                {checkForPermission("MAKE_MANAGE") && <a
                                                                    className='pseudo-href app-primary-color ms-2'
                                                                    data-toggle="tooltip" data-placement="left" title={'Delete Make'}
                                                                    onClick={() => handleConfirm(field.make.Id)}
                                                                >
                                                                    <FeatherIcon icon={"trash-2"} size="20" />
                                                                </a>}
                                                            </td>
                                                            <th scope="row">{(currentPage - 1) * 10 + (index + 1)}</th>
                                                            <td>{field.make.Code} </td>
                                                            <td>{field.make.Name} </td>
                                                            <td>{field.make.CreatedBy}</td>
                                                            <td>{formatDateTime(field.make.CreatedOn)} </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                            <div className="row">
                                                <Pagination currentPage={currentPage} count={totalRows} itemsPerPage={perPage} onPageChange={onPageChange} />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-muted ps-3">{t('make_list_no_data')}</div>
                                    )}
                                </div>
                                {makeId ? <ConfirmationModal /> : ""}
                                {/* toast */}
                                <Toaster />
                                {/* toast ends */}
                                <MakeEdit />
                            <MakeCreate />
                        </div>
                    </div>
                })}
            </>
        </ContainerPage>
    )
}