import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useStore } from '../../../../../state/storeHooks';
import { ContainerPage } from "../../../../ContainerPage/ContainerPage";
import { store } from '../../../../../state/store';
import { changePage, initializeAssetProductCategoryList, loadAssetProductCategories, setSearch } from './AssetProductCategoryList.slice'
import { Pagination } from "../../../../Pagination/Pagination";
import { startPreloader, stopPreloader } from '../../../../Preloader/Preloader.slice';
import { AssetProductCategoryCreate } from "../AssetProductCategoryCreate/AssetProductCategoryCreate";
import { deleteAssetProductCategory, getAssetProductCategoryList, getProductCategoryDetails } from "../../../../../services/assetProductCategory";
import { checkForPermission } from "../../../../../helpers/permissions";
import BreadCrumb from "../../../../BreadCrumbs/BreadCrumb";
import { Link } from "react-router-dom";
import { loadProductCategoryDetails } from "../AssetProductCategoryEdit/AssetProductCategoryEdit.slice";
import { AssetProductCategoryEdit } from "../AssetProductCategoryEdit/AssetProductCategoryEdit";
import SweetAlert from "react-bootstrap-sweetalert";
import toast, { Toaster } from 'react-hot-toast';

export const AssetProductCategoryList = () => {
    const { t, i18n } = useTranslation();
    const {
        assetproductcategorylist: { productCategories, totalRows, perPage, currentPage, search },
    } = useStore(({ assetproductcategorylist }) => ({ assetproductcategorylist }));

    useEffect(() => {
        if (checkForPermission("ASSETPRODUCTCATEGORY_VIEW")) {
            onLoad();
        }
    }, []);

    const onLoad = async () => {
        store.dispatch(startPreloader())
        store.dispatch(initializeAssetProductCategoryList());
        try {
            const result = await getAssetProductCategoryList(search, currentPage);
            store.dispatch(loadAssetProductCategories(result));
        } catch (error) {
            console.error(error);
        }
        store.dispatch(stopPreloader())
    }

    const onPageChange = async (index: number) => {
        store.dispatch(changePage(index));
        const result = await getAssetProductCategoryList(search, index);
        store.dispatch(loadAssetProductCategories(result));
    }

    async function filterProductCategoryList(e) {
        store.dispatch(changePage(1))
        const result = await getAssetProductCategoryList(store.getState().assetproductcategorylist.search, 1)
        store.dispatch(loadAssetProductCategories(result));
    }

    const addData = async (event: any) => {
        store.dispatch(setSearch(event.target.value));
        if (event.target.value == "") {
            store.dispatch(changePage(1))
            const result = await getAssetProductCategoryList(store.getState().assetproductcategorylist.search, store.getState().assetproductcategorylist.currentPage);
            store.dispatch(loadAssetProductCategories(result));
        }
    }

    const breadcrumbItems = [
        { Text: 'breadcrumbs_home', Link: '/' },
        { Text: 'breadcrumbs_masters', Link: '/config/masters' },
        { Text: 'breadcrumbs_masters_assetproduct_category' },
    ];

    async function loadClickedProductCategoryDetails(ProductCategoryId: number) {
        const result = await getProductCategoryDetails(String(ProductCategoryId));
        store.dispatch(loadProductCategoryDetails(result.ProductCategoryDetails));
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
                confirmBtnText={t('asset_product_category_delete_confirm_btn')}
                confirmBtnBsStyle="danger"
                title={t('asset_product_category_delete_title')}
                onConfirm={() => handleDeleteRole(Id)}
                onCancel={handleCancel}
                focusCancelBtn
            >
                {t('asset_product_category_delete_question')}
            </SweetAlert>
        );
    }

    async function handleDeleteRole(Id: number) {
        var result = await deleteAssetProductCategory(Id);
        result.match({
            ok: () => {
                setId(0);
                toast(i18n.t('asset_product_category_message_success_delete'), {
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
                {checkForPermission("ASSETPRODUCTCATEGORY_VIEW") && productCategories.match({
                    none: () => <>{t('asset_product_category_list_loading')}</>,
                    some: (productCategory) => <div className="ps-3 pe-4">
                        <div className="row mt-1 mb-3 p-0 ">
                            <div className="col-md-8 app-primary-color ">
                                <h5 className="ms-0 ps-1"> {t('asset_product_category_list_title')}</h5>
                            </div>
                            <div className="col-md-4 ">
                                {checkForPermission("ASSETPRODUCTCATEGORY_MANAGE") &&
                                    <button className="btn app-primary-bg-color text-white ms-2 float-end " data-bs-toggle='modal' data-bs-target='#CreateAssetProductCategory'>
                                        {t('asset_product_category_list_button_create')}
                                    </button>
                                }
                                {/* {checkForPermission("PART_LIST") &&
                                    <button className="btn app-light float-end  app-primary-color fw-bold btn-sm border">
                                        <span className="material-symbols-outlined align-middle me-1">
                                            download
                                        </span>
                                        {t('asset_product_category_list_button_download')}
                                    </button>
                                } */}
                            </div>
                        </div>
                        {checkForPermission("ASSETPRODUCTCATEGORY_VIEW") && <>
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
                            <div className="row mt-3 mx-0 p-2">
                                {productCategory.length > 0 ? (
                                    <div className="ps-0 pe-0 table-responsive">
                                        <table className="table table-hover table-bordered text-nowrap">
                                            <thead>
                                                <tr>
                                                    <th scope="col"></th>
                                                    <th scope="col">{t('asset_product_category_list_th_sl_no')}</th>
                                                    <th scope="col">{t('asset_product_category_list_th_code')}</th>
                                                    <th scope="col">{t('asset_product_category_list_th_category_name')}</th>
                                                    <th scope="col">{t('asset_product_category_list_th_partproductcategory')}</th>
                                                    <th scope="col">{t('asset_product_category_list_th_generalnotcovered')}</th>
                                                    <th scope="col">{t('asset_product_category_list_th_softwarenotcovered')}</th>
                                                    <th scope="col">{t('asset_product_category_list_th_hardwarenotcovered')}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {productCategory.map((field, index) => (
                                                    <tr key={field.productCategory.Id} className="mt-2">
                                                        <td className="align-items-center">
                                                            <Link
                                                                className='pseudo-href app-primary-color me-2 '
                                                                to={`/config/masters/assetproductcategory/${field.productCategory.Id}`}
                                                            >
                                                                <span className="material-symbols-outlined text-size-20">visibility</span>
                                                            </Link>
                                                            {checkForPermission("ASSETPRODUCTCATEGORY_MANAGE") &&
                                                                <>
                                                                    <a
                                                                        className="pseudo-href app-primary-color me-2 pt-2"
                                                                        onClick={() => {
                                                                            loadClickedProductCategoryDetails(field.productCategory.Id)
                                                                        }}
                                                                        data-bs-toggle="modal"
                                                                        data-toggle="tooltip" data-placement="left" title={'Edit'}
                                                                        data-bs-target="#EditAssetProductCategory"
                                                                    >
                                                                        <span className="material-symbols-outlined">
                                                                            edit_note
                                                                        </span>
                                                                    </a>
                                                                    <span
                                                                        className="custom-pointer-cursor material-symbols-outlined text-size-20 app-primary-color"
                                                                        onClick={() => handleConfirm(field.productCategory.Id)}
                                                                    >Delete</span>
                                                                </>
                                                            }
                                                        </td>
                                                        <th scope="row">{(currentPage - 1) * 10 + (index + 1)}</th>
                                                        <td>{field.productCategory.Code} </td>
                                                        <td>{field.productCategory.CategoryName} </td>
                                                        <td>{field.productCategory.PartProductCategory}</td>
                                                        <td >{field.productCategory.GeneralNotCovered}</td>
                                                        <td>{field.productCategory.SoftwareNotCovered} </td>
                                                        <td>{field.productCategory.HardwareNotCovered}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>

                                    </div>
                                ) : (
                                    <div className="text-muted ps-3">{t('asset_product_category_list_no_data')}</div>
                                )}
                                <div className="row mt-2">
                                    <Pagination currentPage={currentPage} count={totalRows} itemsPerPage={perPage} onPageChange={onPageChange} />
                                </div>
                            </div>
                        </>}
                        {Id ? <DeleteConfirmationModal /> : ""}
                        <AssetProductCategoryCreate />
                        <AssetProductCategoryEdit />
                        <Toaster />
                    </div>
                })}
            </>
        </ContainerPage>)
}