import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useStore } from '../../../../../state/storeHooks';
import { ContainerPage } from "../../../../ContainerPage/ContainerPage";
import { store } from '../../../../../state/store';
import { changePage, initializePartCategoryList, loadPartCategories, setFilter, setSearch } from './PartCategoryList.slice'
import { Pagination } from "../../../../Pagination/Pagination";
import { startPreloader, stopPreloader } from '../../../../Preloader/Preloader.slice';
import { formatDateTime, formatDocumentName, formatSelectInput } from "../../../../../helpers/formats";
import { PartCategoryCreate } from "../PartCategoryCreate/PartCategoryCreate";
import { deletePartCategory, downloadPartCategoryList, getPartCategoryList } from "../../../../../services/partCategory";
import Select from 'react-select';
import { getProductCategory } from "../../../../../services/product";
import { checkForPermission } from "../../../../../helpers/permissions";
import BreadCrumb from "../../../../BreadCrumbs/BreadCrumb";
import FileSaver from "file-saver";
import { PartCategoryEdit } from "../PartCategoryEdit/PartCategoryEdit";
import { loadPartCategoryDetails } from "../PartCategoryEdit/PartCategoryEdit.slice";
import SweetAlert from "react-bootstrap-sweetalert";
import toast, { Toaster } from 'react-hot-toast';

export const PartCategoryList = () => {
    const { t, i18n } = useTranslation();
    const {
        partcategorylist: { partCategories, totalRows, perPage, currentPage, search, searchWith },
    } = useStore(({ partcategorylist }) => ({ partcategorylist }));

    useEffect(() => {
        if (checkForPermission("PARTCATEGORY_VIEW")) {
            onLoad();
        }
    }, []);

    const [categoryList, setCategoryList] = useState<any>(null)

    const onLoad = async () => {
        store.dispatch(startPreloader())
        store.dispatch(initializePartCategoryList());
        try {
            const { ProductCategoryNames } = await getProductCategory()
            setCategoryList(formatSelectInput(ProductCategoryNames, "CategoryName", "Id"))

            const result = await getPartCategoryList(search, searchWith, currentPage);
            store.dispatch(loadPartCategories(result))
        } catch (error) {
            console.error(error);
        }
        store.dispatch(stopPreloader())
    }

    const onPageChange = async (index: number) => {
        store.dispatch(changePage(index));
        const result = await getPartCategoryList(store.getState().partcategorylist.search, store.getState().partcategorylist.searchWith, index);
        store.dispatch(loadPartCategories(result));
    }

    const searchFilter = async (selectedOption: any) => {
        if (selectedOption && selectedOption.value !== null && selectedOption.value !== undefined) {
            store.dispatch(setFilter({ value: selectedOption.value }));
        } else {
            store.dispatch(setFilter({ value: "" }));// Handle the case when the dropdown search is cleared
        }
        const result = await getPartCategoryList(store.getState().partcategorylist.search, store.getState().partcategorylist.searchWith, store.getState().partcategorylist.currentPage);
        store.dispatch(loadPartCategories(result));
    };

    async function filterPartCategoryList(e) {
        store.dispatch(changePage(1))
        const result = await getPartCategoryList(store.getState().partcategorylist.search, store.getState().partcategorylist.searchWith, 1)
        store.dispatch(loadPartCategories(result));
    }
    const addData = async (event: any) => {
        store.dispatch(setSearch(event.target.value));
        if (event.target.value == "") {
            store.dispatch(changePage(1))
            const result = await getPartCategoryList(store.getState().partcategorylist.search, store.getState().partcategorylist.searchWith, store.getState().partcategorylist.currentPage);
            store.dispatch(loadPartCategories(result));
        }
    }
    const breadcrumbItems = [
        { Text: 'breadcrumbs_home', Link: '/' },
        { Text: 'breadcrumbs_masters', Link: '/config/masters' },
        { Text: 'breadcrumbs_masters_part_category' },
    ];
    const onDownloadClick = async (e: any) => {
        const response = await downloadPartCategoryList()
        const url = window.URL.createObjectURL(response.data);
        FileSaver.saveAs(url, formatDocumentName())
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
                confirmBtnText={t('partcategory_delete_confirm_btn')}
                confirmBtnBsStyle="danger"
                title={t('partcategory_delete_title')}
                onConfirm={() => handleDelete(Id)}
                onCancel={handleCancel}
                focusCancelBtn
            >
                {t('partcategory_delete_question')}
            </SweetAlert>
        );
    }

    async function handleDelete(Id: number) {
        var result = await deletePartCategory(Id);
        setId(0);
        result.match({
            ok: () => {
                toast(i18n.t('partcategory_message_success_delete'), {
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

    return (
        <ContainerPage>
            <>
                <BreadCrumb items={breadcrumbItems} />
                {checkForPermission("PARTCATEGORY_VIEW") && partCategories.match({
                    none: () => <>{t('part_category_list_loading')}</>,
                    some: (partCategory) => <div className="ps-3 pe-4  ">
                        <div className="row mt-1 mb-3 p-0 ">
                            <div className="col-md-8 app-primary-color ">
                                <h5 className="ms-0 ps-1"> {t('part_category_list_title')}</h5>
                            </div>
                            <div className="col-md-4 ">
                                {checkForPermission("PARTCATEGORY_MANAGE") &&

                                    <button className="btn app-primary-bg-color text-white ms-2 float-end " data-bs-toggle='modal' data-bs-target='#CreatePartCategory'>
                                        {t('part_category_list_button_create')}
                                    </button>
                                }
                                <button className="btn app-light float-end  app-primary-color fw-bold btn-sm border" onClick={onDownloadClick} >
                                    <span className="material-symbols-outlined align-middle me-1">
                                        download
                                    </span>
                                    {t('part_category_list_button_download')}
                                </button>
                            </div>

                        </div>
                        <div className="row mt-2 ps-1 pe-0">
                            <label className="">{t('part_category_list_helptext_filterby')}</label>
                            <div className="input-group">
                                <div className="me-2 fixed-width" >
                                    <Select
                                        options={categoryList}
                                        value={categoryList && categoryList.find(option => option.value == searchWith) || null}
                                        onChange={searchFilter}
                                        isSearchable
                                        isClearable={true} // Set this to enable clearing
                                        placeholder={t('part_category_list_placeholder_search_select_filter')}
                                        classNamePrefix="react-select"
                                        name="searchWith"
                                    />
                                </div>
                                <input type='search' className="form-control custom-input" value={search} placeholder={t('partcategory_list_placeholder_search') ?? ''}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            filterPartCategoryList(e);
                                        }
                                    }} onChange={addData} />
                                <button className="btn app-primary-bg-color text-white float-end " type="button" onClick={filterPartCategoryList}>
                                    Search
                                </button>
                            </div>
                        </div>
                        <div className="row mt-3 ps-1">
                            {partCategory.length > 0 ? (
                                <div className=" table-responsive ">
                                    <table className="table table-hover  table-bordered ">
                                        <thead>
                                            <tr>
                                                {checkForPermission("PARTCATEGORY_MANAGE") && <th></th>}
                                                <th scope="col">{t('part_category_list_th_sl_no')}</th>
                                                <th scope="col">{t('part_category_list_th_code')}</th>
                                                <th scope="col">{t('part_category_list_th_category_name')}</th>
                                                <th scope="col">{t('part_category_list_th_productcategory')}</th>
                                                <th scope="col">{t('part_category_list_th_createdby')}</th>
                                                <th scope="col">{t('part_category_list_th_createdon')}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {partCategory.map((field, index) => (
                                                <tr className="mt-2" key={index}>
                                                    {checkForPermission("PARTCATEGORY_MANAGE") &&
                                                        <td className="">
                                                            <a
                                                                className="pseudo-href app-primary-color"
                                                                onClick={() => {
                                                                    store.dispatch(loadPartCategoryDetails(
                                                                        {
                                                                            Id: field.partCategory.Id, Name: field.partCategory.Name,
                                                                            PartProductCategoryId: field.partCategory.PartProductCategoryId,
                                                                            MappingId: field.partCategory.MappingId
                                                                        }))
                                                                }}
                                                                data-bs-toggle="modal"
                                                                data-toggle="tooltip" data-placement="left" title={'Edit'}
                                                                data-bs-target="#EditPartCategory"
                                                            >
                                                                <span className="material-symbols-outlined ">
                                                                    edit_note
                                                                </span>
                                                            </a>
                                                            <span className="custom-pointer-cursor material-symbols-outlined text-size-20 app-primary-color" onClick={() => handleConfirm(field.partCategory.Id)}>
                                                                Delete
                                                            </span>
                                                        </td>
                                                    }
                                                    <th scope="row">{(currentPage - 1) * 10 + (index + 1)}</th>
                                                    <td>{field.partCategory.Code} </td>
                                                    <td>{field.partCategory.Name} </td>
                                                    <td>{field.partCategory.ProductCategory}</td>
                                                    <td>{field.partCategory.CreatedBy}</td>
                                                    <td>{formatDateTime(field.partCategory.CreatedOn)} </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <div className="row">
                                        <Pagination currentPage={currentPage} count={totalRows} itemsPerPage={perPage} onPageChange={onPageChange} />
                                    </div>
                                </div>
                            ) : (
                                <div className="text-muted ps-3">{t('part_category_list_no_data')}</div>
                            )}
                        </div>
                        {Id ? <DeleteConfirmationModal /> : ""}
                        <Toaster />
                        <PartCategoryEdit />
                        <PartCategoryCreate />
                    </div>
                })}
            </>
        </ContainerPage>)
}