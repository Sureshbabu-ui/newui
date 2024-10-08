import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useStore } from '../../../../../state/storeHooks';
import { ContainerPage } from "../../../../ContainerPage/ContainerPage";
import { store } from '../../../../../state/store';
import { changePage, initializeProductCategoryList, loadProductCategories, setSearch } from './PartProductCategoryList.slice'
import { Pagination } from "../../../../Pagination/Pagination";
import { startPreloader, stopPreloader } from '../../../../Preloader/Preloader.slice';
import { formatDateTime, formatDocumentName } from "../../../../../helpers/formats";
import { PartProductCategoryCreate } from "../PartProductCategoryCreate/PartProductCategoryCreate";
import { downloadProductCategoryList, getPartProductCategoryList, productCategoryDelete } from "../../../../../services/partProductCategory";
import SweetAlert from "react-bootstrap-sweetalert";
import toast, { Toaster } from "react-hot-toast";
import i18n from "../../../../../i18n";
import { checkForPermission } from "../../../../../helpers/permissions";
import FeatherIcon from 'feather-icons-react';
import BreadCrumb from "../../../../BreadCrumbs/BreadCrumb";
import FileSaver from "file-saver";
import { Link } from "react-router-dom";
import { loadPartProductCategoryDetails } from "../PartProductCategoryEdit/PartProductCategoryEdit.slice";
import { PartProductCategoryEdit } from "../PartProductCategoryEdit/PartProductCategoryEdit";


export const PartProductCategoryList = () => {
    const { t } = useTranslation();
    const {
        partproductcategorylist: { productCategories, totalRows, perPage, currentPage, search },
    } = useStore(({ partproductcategorylist }) => ({ partproductcategorylist }));

    useEffect(() => {
        if (checkForPermission("PARTPRODUCTCATEGORY_VIEW")) {
            onLoad();
        }
    }, []);

    const onLoad = async () => {
        store.dispatch(startPreloader())
        store.dispatch(initializeProductCategoryList());
        try {
            const result = await getPartProductCategoryList(search, currentPage);
            store.dispatch(loadProductCategories(result));
        } catch (error) {
            console.error(error);
        }
        store.dispatch(stopPreloader())
    }

    const onPageChange = async (index: number) => {
        store.dispatch(changePage(index));
        const result = await getPartProductCategoryList(search, index);
        store.dispatch(loadProductCategories(result));
    }

    async function filterProductCategoryList(e) {
        store.dispatch(changePage(1))
        const result = await getPartProductCategoryList(store.getState().partproductcategorylist.search, 1)
        store.dispatch(loadProductCategories(result));
    }
    const addData = async (event: any) => {
        store.dispatch(setSearch(event.target.value));
        if (event.target.value == "") {
            store.dispatch(changePage(1))
            const result = await getPartProductCategoryList(store.getState().partproductcategorylist.search, store.getState().partproductcategorylist.currentPage);
            store.dispatch(loadProductCategories(result));
        }
    }

    const [ProductCategoryId, setId] = useState(0);

    const handleConfirm = (ProductCategoryId: number) => {
        setId(ProductCategoryId);
    };

    async function handleCancel() {
        setId(0);
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
                onConfirm={() => deleteProductCategory(ProductCategoryId)}
                onCancel={handleCancel}
                focusCancelBtn
            >
                {t('partproduct_category_deleted_conformation')}
            </SweetAlert>
        );
    }

    async function deleteProductCategory(Id: number) {
        setId(0)
        var result = await productCategoryDelete(Id);
        result.match({
            ok: () => {
                toast(i18n.t('partproduct_category_deleted_success_message'),
                    {
                        duration: 2000,
                        style: {
                            borderRadius: '0',
                            background: '#00D26A',
                            color: '#fff',
                        }
                    });
                onLoad()
            },
            err: (err) => {
                console.log(err.Message,"jhkjhk")
                toast(i18n.t(err.Message),
                    {
                        duration: 2100,
                        style: {
                            borderRadius: '0',
                            background: '#F92F60',
                            color: '#fff'
                        }
                    });
           },
        });
    }
    const breadcrumbItems = [
        { Text: 'breadcrumbs_home', Link: '/' },
        { Text: 'breadcrumbs_masters', Link: '/config/masters' },
        { Text: 'breadcrumbs_masters_partproduct_category' },
    ];
    const onDownloadClick = async (e: any) => {
        const response = await downloadProductCategoryList()
        const url = window.URL.createObjectURL(response.data);
        FileSaver.saveAs(url, formatDocumentName())
    }
    return (
        <ContainerPage>
            <>
                <BreadCrumb items={breadcrumbItems} />
                {checkForPermission("PARTPRODUCTCATEGORY_VIEW") && productCategories.match({
                    none: () => <>{t('partproduct_category_list_loading')}</>,
                    some: (productCategory) => <div className="ps-3 pe-4">
                        <div className="row mt-1 mb-3 p-0 ">
                            <div className="col-md-8 app-primary-color ">
                                <h5 className="ms-0 ps-1"> {t('partproduct_category_list_title')}</h5>
                            </div>
                            <div className="col-md-4 ">
                                {checkForPermission("PARTPRODUCTCATEGORY_MANAGE") &&
                                    <button className="btn app-primary-bg-color text-white ms-2 float-end " data-bs-toggle='modal' data-bs-target='#CreatePartProductCategory'>
                                        {t('partproduct_category_list_button_create')}
                                    </button>
                                }
                                <button className="btn app-light float-end  app-primary-color fw-bold btn-sm border " onClick={onDownloadClick}>
                                    <span className="material-symbols-outlined align-middle me-1">
                                        download
                                    </span>
                                    {t('partproduct_category_list_button_download')}
                                </button>
                            </div>
                        </div>
                        <div className="mb-3  ps-2">
                            <div className="input-group">
                                <input type='search' className="form-control custom-input" value={search} placeholder={t('productcategory_list_placeholder_search') ?? ''}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            filterProductCategoryList(e);
                                        }
                                    }} onChange={addData} />
                                <button className="btn app-primary-bg-color text-white float-end " type="button" onClick={filterProductCategoryList}>
                                    Search
                                </button>
                            </div>
                        </div>
                        <div className="row mt-3 ps-1">
                            {productCategory.length > 0 ? (
                                <div className=" table-responsive ">
                                    <table className="table table-hover  table-bordered ">
                                        <thead>
                                            <tr>
                                                {checkForPermission("PARTPRODUCTCATEGORY_MANAGE") && <th className="col-auto"></th>}
                                                <th scope="col">{t('partproduct_category_list_th_sl_no')}</th>
                                                <th scope="col">{t('partproduct_category_list_th_code')}</th>
                                                <th scope="col">{t('partproduct_category_list_th_category_name')}</th>
                                                <th scope="col">{t('partproduct_category_list_th_createdby')}</th>
                                                <th scope="col">{t('partproduct_category_list_th_createdon')}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {productCategory.map((field, index) => (
                                                <tr key={field.productCategory.Id} className="mt-2">
                                                    {checkForPermission("PARTPRODUCTCATEGORY_MANAGE") &&
                                                        <td className="col-auto">
                                                            <a
                                                                className="pseudo-href app-primary-color me-2"
                                                                onClick={() => {
                                                                    store.dispatch(loadPartProductCategoryDetails(
                                                                        {
                                                                            Id: field.productCategory.Id, CategoryName: field.productCategory.CategoryName
                                                                        }))
                                                                }}
                                                                data-bs-toggle="modal"
                                                                data-toggle="tooltip" data-placement="left" title={'Edit'}
                                                                data-bs-target="#EditPartProductCategory"
                                                            >
                                                                <span className="material-symbols-outlined ">
                                                                    edit_note
                                                                </span>
                                                            </a>
                                                                       <a
                                                                className='pseudo-href app-primary-color'
                                                                data-toggle="tooltip" data-placement="left" title={'Delete Product Category'}
                                                                onClick={() => handleConfirm(field.productCategory.Id)}
                                                            >
                                                                <span className="material-symbols-outlined"> delete</span>
                                                            </a>
                                                        </td>
                                                    }
                                                    <th scope="row">{(currentPage - 1) * 10 + (index + 1)}</th>
                                                    <td>{field.productCategory.Code} </td>
                                                    <td>{field.productCategory.CategoryName} </td>
                                                    <td>{field.productCategory.CreatedBy}</td>
                                                    <td>{formatDateTime(field.productCategory.CreatedOn)} </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <div className="row">
                                        <Pagination currentPage={currentPage} count={totalRows} itemsPerPage={perPage} onPageChange={onPageChange} />
                                    </div>
                                </div>
                            ) : (
                                <div className="text-muted ps-3">{t('partproduct_category_list_no_data')}</div>
                            )}
                        </div>
                        {ProductCategoryId ? <ConfirmationModal /> : ""}
                        {/* toast */}
                        <Toaster />
                        {/* toast ends */}
                        <PartProductCategoryEdit/>
                        <PartProductCategoryCreate />
                    </div>
                })}
            </>
        </ContainerPage>)
}