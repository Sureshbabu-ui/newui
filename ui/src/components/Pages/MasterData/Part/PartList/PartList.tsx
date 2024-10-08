import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useStore } from '../../../../../state/storeHooks';
import { ContainerPage } from "../../../../ContainerPage/ContainerPage";
import { store } from '../../../../../state/store';
import { changePage, initializePartList, loadParts, setFilter, setSearch } from './PartList.slice'
import { Pagination } from "../../../../Pagination/Pagination";
import { startPreloader, stopPreloader } from '../../../../Preloader/Preloader.slice';
import { formatDateTime, formatDocumentName } from "../../../../../helpers/formats";
import { PartCreate } from "../PartCreate/PartCreate";
import { deletePart, downloadPartList, getPartDetailsForEdit, getPartList } from "../../../../../services/part";
import { checkForPermission } from "../../../../../helpers/permissions";
import Select from 'react-select';
import BreadCrumb from "../../../../BreadCrumbs/BreadCrumb";
import FileSaver from "file-saver";
import { loadPartDetails } from "../PartEdit/PartEdit.slice";
import { PartEdit } from "../PartEdit/PartEdit";
import SweetAlert from "react-bootstrap-sweetalert";
import toast, { Toaster } from 'react-hot-toast';

export const PartList = () => {
    const { t, i18n } = useTranslation();
    const {
        partlist: { parts, totalRows, currentPage, perPage, search, searchWith, },
    } = useStore(({ partlist }) => ({ partlist }));

    useEffect(() => {
        if (checkForPermission("PART_VIEW")) {
            onLoad();
        }
    }, []);

    const onLoad = async () => {
        store.dispatch(startPreloader())
        store.dispatch(initializePartList());
        try {
            const result = await getPartList(store.getState().partlist.search, store.getState().partlist.searchWith, currentPage);
            store.dispatch(loadParts(result))
        } catch (error) {
            console.error(error);
        }
        store.dispatch(stopPreloader())
    }

    const [selectedFilter, setSelectedFilter] = useState<any>(null);

    const searchFilter = async (selectedOption: any) => {
        setSelectedFilter(selectedOption);
        store.dispatch(setFilter({ value: selectedOption.value }));
    };

    const onPageChange = async (index: number) => {
        store.dispatch(changePage(index));
        const result = await getPartList(search, searchWith, index);
        store.dispatch(loadParts(result));
    }

    async function filterPartList(e) {
        store.dispatch(changePage(1))
        const result = await getPartList(store.getState().partlist.search, store.getState().partlist.searchWith, 1)
        store.dispatch(loadParts(result));
    }
    const addData = async (event: any) => {
        store.dispatch(setSearch(event.target.value));
        if (event.target.value == "") {
            store.dispatch(changePage(1))
            const result = await getPartList(store.getState().partlist.search, store.getState().partlist.searchWith, store.getState().partlist.currentPage);
            store.dispatch(loadParts(result));
        }
    }
    const filterWith = [
        { value: 'PartCode', label: 'Part Code' },
        { value: 'OemPartNumber', label: 'OEM Part Number' },
        { value: 'Description', label: 'Description' },
        { value: 'MakeName', label: 'Make' },
        { value: 'ProductCategoryName', label: 'Product Category' },
        { value: 'HsnCode', label: 'HSN Code' },
        { value: 'PartName', label: 'Part Name' },
        { value: 'PartCategoryName', label: 'Part Category' },
        { value: 'PartSubCategoryName', label: 'Part Sub Category' }
    ]
    const breadcrumbItems = [
        { Text: 'breadcrumbs_home', Link: '/' },
        { Text: 'breadcrumbs_masters', Link: '/config/masters' },
        { Text: 'breadcrumbs_masters_part' }
    ];

    const onDownloadClick = async (e: any) => {
        const response = await downloadPartList()
        const url = window.URL.createObjectURL(response.data);
        FileSaver.saveAs(url, formatDocumentName())
    }

    async function loadClickedPartDetails(PartId: number) {
        const Part = await getPartDetailsForEdit(PartId);
        store.dispatch(loadPartDetails(Part))
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
                confirmBtnText={t('part_delete_confirm_btn')}
                confirmBtnBsStyle="danger"
                title={t('part_delete_title')}
                onConfirm={() => handleDelete(Id)}
                onCancel={handleCancel}
                focusCancelBtn
            >
                {t('part_delete_question')}
            </SweetAlert>
        );
    }

    async function handleDelete(Id: number) {
        var result = await deletePart(Id);
        result.match({
            ok: () => {
                setId(0);
                toast(i18n.t('part_message_success_delete'), {
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
                {checkForPermission("PART_VIEW") && parts.match({
                    none: () => <>{t('part_list_loading')}</>,
                    some: (part) => <div className="ps-3  ">
                        <div className="row mt-1 mb-3 p-0 ">
                            <div className="col-md-8 app-primary-color ">
                                <h5 className="ms-0 ps-1"> {t('part_list_title')}</h5>
                            </div>
                            <div className="col-md-4">
                                {checkForPermission("PART_MANAGE") &&
                                    <button className="btn float-end  app-primary-bg-color ms-2 mx-0 text-white  " data-bs-toggle='modal' data-bs-target='#CreatePart'>
                                        {t('part_list_button_create')}
                                    </button>
                                }
                                {checkForPermission("PART_VIEW") &&
                                    <button className="btn app-light float-end  app-primary-color fw-bold btn-sm border " onClick={onDownloadClick}>
                                        <span className="material-symbols-outlined align-middle me-1">
                                            download
                                        </span>
                                        {t('part_list_button_download')}
                                    </button>
                                }
                            </div>
                        </div>
                        <div className="row mt-2 pe-0">
                            <label className="">{t('service_request_create_label_filterby')}</label>
                            <div className="input-group me-4">
                                <div className="me-2 fixed-width" >
                                    <Select
                                        options={filterWith}
                                        value={filterWith && filterWith.find(option => option.value == searchWith) || null}
                                        onChange={searchFilter}
                                        isSearchable
                                        classNamePrefix="react-select"
                                    />
                                </div>
                                <input
                                    type='search'
                                    className="form-control custom-input"
                                    value={search}
                                    placeholder={
                                        selectedFilter ? `${t('servicerequest_list_placeholder_searchwith')} ${t(selectedFilter.label)}` : `${t('servicerequest_list_placeholder_search')}`
                                    }
                                    onChange={addData}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            filterPartList(e);
                                        }
                                    }}
                                />
                                <button className="btn app-primary-bg-color text-white float-end px-4" type="button" onClick={filterPartList}>
                                    {t('servicerequest_list_search_button')}
                                </button>
                            </div>
                        </div>
                        <div className="row mt-3 mx-0 p-0">
                            {part.length > 0 ? (
                                <div className="ps-0 pe-0 table-responsive">
                                    <table className="table table-hover table-bordered text-nowrap">
                                        <thead>
                                            <tr>
                                                {checkForPermission("PART_MANAGE") && <th scope="col"></th>}
                                                <th scope="col">{t('part_list_th_sl_no')}</th>
                                                <th scope="col">{t('part_list_th_code')}</th>
                                                <th scope="col">{t('part_list_th_part_name')}</th>
                                                <th scope="col">{t('part_list_th_product_category_name')}</th>
                                                <th scope="col">{t('part_list_th_part_category_name')}</th>
                                                <th scope="col">{t('part_list_th_partsubcategory_name')}</th>
                                                <th scope="col">{t('part_list_th_make_name')}</th>
                                                <th scope="col">{t('part_list_th_hsn_code')}</th>
                                                <th scope="col">{t('part_list_th_oem_part_number')}</th>
                                                <th scope="col">{t('part_list_th_description')}</th>
                                                <th scope="col">{t('part_list_th_createdby')}</th>
                                                <th scope="col">{t('part_list_th_createdon')}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {part.map((field, index) => (
                                                <tr className="mt-2" key={index}>
                                                    {checkForPermission("PART_MANAGE") &&
                                                        <td>
                                                            <a
                                                                className="pseudo-href app-primary-color"
                                                                onClick={() => {
                                                                    loadClickedPartDetails(field.part.Id)
                                                                }}
                                                                data-bs-toggle="modal"
                                                                data-toggle="tooltip" data-placement="left" title={'Edit Part'}
                                                                data-bs-target="#EditPart"
                                                                data-testid={`editproduct${field.part.Id}`}
                                                            >
                                                                <span className="material-symbols-outlined">
                                                                    edit_note
                                                                </span>
                                                            </a>
                                                            <span className="custom-pointer-cursor material-symbols-outlined text-size-20 app-primary-color" onClick={() => handleConfirm(field.part.Id)}>
                                                                Delete
                                                            </span>
                                                        </td>
                                                    }
                                                    <th scope="row">{(currentPage - 1) * 10 + (index + 1)}</th>
                                                    <td>{field.part.PartCode} </td>
                                                    <td>{field.part.PartName} </td>
                                                    <td>{field.part.ProductCategoryName}</td>
                                                    <td>{field.part.PartCategoryName} </td>
                                                    <td>{field.part.PartSubCategoryName}</td>
                                                    <td>{field.part.MakeName} </td>
                                                    <td>{field.part.HsnCode} </td>
                                                    <td>{field.part.OemPartNumber} </td>
                                                    <td>{field.part.Description}</td>
                                                    <td>{field.part.CreatedBy}</td>
                                                    <td>{formatDateTime(field.part.CreatedOn)} </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <div className="row">
                                        <Pagination currentPage={currentPage} count={totalRows} itemsPerPage={perPage} onPageChange={onPageChange} />
                                    </div>
                                </div>
                            ) : (
                                <div className="text-muted ps-3">{t('part_list_no_data')}</div>
                            )}
                        </div>
                        {Id ? <DeleteConfirmationModal /> : ""}
                        <Toaster />
                        <PartCreate />
                        <PartEdit />
                    </div>
                })}
            </>
        </ContainerPage>
    )
}