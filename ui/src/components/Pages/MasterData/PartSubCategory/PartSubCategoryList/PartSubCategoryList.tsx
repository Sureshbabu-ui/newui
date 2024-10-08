import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useStore } from '../../../../../state/storeHooks';
import { ContainerPage } from "../../../../ContainerPage/ContainerPage";
import { store } from '../../../../../state/store';
import { changePage, initializePartSubCategoryList, loadPartSubCategories, setSearch, setSearchSubmit } from './PartSubCategoryList.slice'
import { Pagination } from "../../../../Pagination/Pagination";
import { startPreloader, stopPreloader } from '../../../../Preloader/Preloader.slice';
import { deletePartSubCategory, getPartSubCategoryList } from "../../../../../services/partSubCategory";
import { PartSubCategoryEdit } from "../PartSubCategoryEdit/PartSubCategoryEdit";
import { checkForPermission } from "../../../../../helpers/permissions";
import FeatherIcon from 'feather-icons-react';
import BreadCrumb from "../../../../BreadCrumbs/BreadCrumb";
import { PartSubCategoryEditDetails } from "../../../../../types/partSubCategory";
import { loadPartSubCategoryEditDetails } from "../PartSubCategoryEdit/PartSubCategoryEdit.slice";
import { PartSubCategoryCreate } from "../PartSubCategoryCreate/PartSubCategoryCreate";
import SweetAlert from "react-bootstrap-sweetalert";
import toast, { Toaster } from 'react-hot-toast';

export const PartSubCategoryList = () => {
    const { t, i18n } = useTranslation();
    const {
        partsubcategorylist: { partSubCategorys, totalRows, perPage, currentPage, search },
    } = useStore(({ partsubcategorylist }) => ({ partsubcategorylist }));

    useEffect(() => {
        if (checkForPermission("PARTSUBCATEGORY_VIEW")) {
            onLoad();
        }
    }, []);

    const onLoad = async () => {
        store.dispatch(startPreloader())
        store.dispatch(initializePartSubCategoryList());
        try {
            const partSubCategory = await getPartSubCategoryList(search, currentPage);
            store.dispatch(loadPartSubCategories(partSubCategory));
        } catch (error) {
            console.error(error);
        }
        store.dispatch(stopPreloader())
    }

    const onPageChange = async (index: number) => {
        store.dispatch(changePage(index));
        const result = await getPartSubCategoryList(search, index);
        store.dispatch(loadPartSubCategories(result));
    }

    async function filterPartSubCategoryList(e) {
        store.dispatch(changePage(1))
        const result = await getPartSubCategoryList(store.getState().partsubcategorylist.search, 1)
        store.dispatch(loadPartSubCategories(result));
    }

    const addData = async (event: any) => {
        store.dispatch(setSearch(event.target.value));
        if (event.target.value == "") {
            store.dispatch(changePage(1))
            const result = await getPartSubCategoryList(store.getState().partsubcategorylist.search, store.getState().partsubcategorylist.currentPage);
            store.dispatch(loadPartSubCategories(result));
        }
    }

    const loadClickedPartSubCategoryDetails = (partSubCategoryDetails: PartSubCategoryEditDetails) => {
        store.dispatch(loadPartSubCategoryEditDetails(partSubCategoryDetails))
    }

    const breadcrumbItems = [
        { Text: 'breadcrumbs_home', Link: '/' },
        { Text: 'breadcrumbs_masters', Link: '/config/masters' },
        { Text: 'breadcrumbs_masters_partsubcategory' },
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
                confirmBtnText={t('partsubcategory_delete_confirm_btn')}
                confirmBtnBsStyle="danger"
                title={t('partsubcategory_delete_title')}
                onConfirm={() => handleDelete(Id)}
                onCancel={handleCancel}
                focusCancelBtn
            >
                {t('partsubcategory_delete_question')}
            </SweetAlert>
        );
    }

    async function handleDelete(Id: number) {
        var result = await deletePartSubCategory(Id);
        result.match({
            ok: () => {
                setId(0);
                toast(i18n.t('partsubcategory_message_success_delete'), {
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
                {checkForPermission("PARTSUBCATEGORY_VIEW") && partSubCategorys.match({
                    none: () => <>{t('partsubcategory_list_loading')}</>,
                    some: (subCategory) => <div className="ps-3 pe-4 ">
                        <div className="row mt-1 mb-3 p-0 ">
                            <div className="col-md-7 app-primary-color ">
                                <h5 className="ms-0 ps-1"> {t('partsubcategory_list_title')}</h5>
                            </div>
                            <div className="col-md-5">
                                {checkForPermission("PARTSUBCATEGORY_MANAGE") &&
                                    <button className="btn float-end  app-primary-bg-color ms-2 mx-0 text-white  " data-bs-toggle='modal' data-bs-target='#CreatePartSubCategory'>
                                        {t('partsubcategory_list_button_create')}
                                    </button>
                                }
                            </div>
                        </div>
                        <div className="mb-3 ps-1">
                            <div className="input-group">
                                <input type='search' className="form-control custom-input" value={search} placeholder={t('partsubcategory_list_placeholder_search') ?? ''}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            filterPartSubCategoryList(e);
                                            store.dispatch(setSearchSubmit(true))
                                        }
                                    }} onChange={addData} />
                                <button className="btn app-primary-bg-color text-white float-end " type="button" onClick={(e) => { filterPartSubCategoryList(e), store.dispatch(setSearchSubmit(true)) }}>
                                    {t('partsubcategory_list_button_search')}
                                </button>
                            </div>
                        </div>
                        <div className="row mt-3 ps-1">
                            {subCategory.length > 0 ? (
                                <div className=" table-responsive ">
                                    <table className="table table-hover table-bordered ">
                                        <thead>
                                            <tr>
                                                {checkForPermission("PARTSUBCATEGORY_MANAGE") &&
                                                    <th ></th>}
                                                <th scope="col">{t('partsubcategory_list_th_sl_no')}</th>
                                                <th scope="col">{t('partsubcategory_list_th_code')}</th>
                                                <th scope="col">{t('partsubcategory_list_th_name')}</th>
                                                <th scope="col">{t('partsubcategory_list_th_partcategoey')}</th>
                                                <th scope="col">{t('partsubcategory_list_th_productcategory')}</th>
                                                <th scope='col'>{t('partsubcategory_list_th_status')}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {subCategory.map(({ partSubCategory }, index) => (
                                                <tr className="mt-2" key={index}>
                                                         {checkForPermission("PARTSUBCATEGORY_MANAGE") &&
                                                        <td >
                                                            <a
                                                                className="pseudo-href app-primary-color ms-3"
                                                                onClick={() => loadClickedPartSubCategoryDetails({ Id: partSubCategory.Id, Name: partSubCategory.Name, IsActive: partSubCategory.IsActive })}
                                                                data-bs-toggle="modal"
                                                                data-bs-target='#EditPartSubCategory'
                                                            >
                                                                <FeatherIcon icon={"edit"} size="16" />
                                                            </a>
                                                            <span className="custom-pointer-cursor material-symbols-outlined text-size-20 app-primary-color" onClick={() => handleConfirm(partSubCategory.Id)}>
                                                                Delete
                                                            </span>
                                                        </td>
                                                    }
                                                    <th scope="row">{(currentPage - 1) * 10 + (index + 1)}</th>
                                                    <td> {partSubCategory.Code} </td>
                                                    <td> {partSubCategory.Name} </td>
                                                    <td> {partSubCategory.PartCategory} </td>
                                                    <td> {partSubCategory.ProductCategory} </td>
                                                    <td >{partSubCategory.IsActive ? "ACTIVE" : "INACTIVE"}</td>                                               
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <div className="row">
                                        <Pagination currentPage={currentPage} count={totalRows} itemsPerPage={perPage} onPageChange={onPageChange} />
                                    </div>
                                </div>
                            ) : (
                                <div className="text-muted ps-3">{t('partsubcategory_no_data')}</div>
                            )}
                        </div>
                        {Id ? <DeleteConfirmationModal /> : ""}
                        <Toaster />
                        <PartSubCategoryEdit />
                        <PartSubCategoryCreate />
                    </div>
                })}
            </>
        </ContainerPage>)
}