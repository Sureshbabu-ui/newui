import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useStore } from '../../../../../state/storeHooks';
import { ContainerPage } from "../../../../ContainerPage/ContainerPage";
import { store } from '../../../../../state/store';
import { changePage, initializeProductList, loadProducts, setSearch } from './ProductList.slice'
import { Pagination } from "../../../../Pagination/Pagination";
import { startPreloader, stopPreloader } from '../../../../Preloader/Preloader.slice';
import { formatCurrency, formatDateTime, formatDocumentName } from "../../../../../helpers/formats";
import { ProductCreate } from "../ProductCreate/ProductCreate";
import { checkForPermission } from "../../../../../helpers/permissions";
import { downloadProductList, getClickedProductDetails, getProductList, productDelete } from "../../../../../services/product";
import { loadProductDetails } from "../ProductEdit/ProdutEdit.slice";
import { ProductEdit } from "../ProductEdit/ProductEdit";
import SweetAlert from 'react-bootstrap-sweetalert';
import toast, { Toaster } from 'react-hot-toast';
import FeatherIcon from 'feather-icons-react';
import BreadCrumb from "../../../../BreadCrumbs/BreadCrumb";
import FileSaver from "file-saver";


export const ProductList = () => {
    const { t, i18n } = useTranslation();
    const {
        productlist: { products, totalRows, perPage, currentPage, search },
    } = useStore(({ productlist, app }) => ({ productlist, app }));

    useEffect(() => {
        if (checkForPermission("PRODUCTMODEL_VIEW")) {
            onLoad();
        }
    }, []);

    const onLoad = async () => {
        store.dispatch(startPreloader())
        store.dispatch(initializeProductList());
        try {
            const result = await getProductList(search, currentPage);
            store.dispatch(loadProducts(result));
        } catch (error) {
            console.error(error);
        }
        store.dispatch(stopPreloader())
    }

    const onPageChange = async (index: number) => {
        store.dispatch(changePage(index));
        const result = await getProductList(search, index);
        store.dispatch(loadProducts(result));
    }

    async function loadClickedProductDetails(ProductId: string) {
        const Product = await getClickedProductDetails(ProductId);
        store.dispatch(loadProductDetails(Product))
    }
    const [ProductId, setId] = useState(0);

    const handleConfirm = (ProductId: number) => {
        setId(ProductId);
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
                onConfirm={() => deleteProduct(ProductId)}
                onCancel={handleCancel}
                focusCancelBtn
            >
                {t('product_deleted_conformation')}
            </SweetAlert>
        );
    }

    async function deleteProduct(Id: number) {
        var result = await productDelete(Id);
        result.match({
            ok: () => {
                setId(0)
                toast(i18n.t('product_deleted_success_message'),
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

    async function filterProductList(e) {
        store.dispatch(changePage(1))
        const result = await getProductList(store.getState().productlist.search, 1)
        store.dispatch(loadProducts(result));
    }
    const addData = async (event: any) => {
        store.dispatch(setSearch(event.target.value));
        if (event.target.value == "") {
            store.dispatch(changePage(1))
            const result = await getProductList(store.getState().productlist.search, store.getState().productlist.currentPage);
            store.dispatch(loadProducts(result));
        }
    }
    const breadcrumbItems = [
        { Text: 'breadcrumbs_home', Link: '/' },
        { Text: 'breadcrumbs_masters', Link: '/config/masters' },
        { Text: 'breadcrumbs_masters_product' },
    ];
    const onDownloadClick = async (e: any) => {
        const response = await downloadProductList()
        const url = window.URL.createObjectURL(response.data);
        FileSaver.saveAs(url, formatDocumentName())
    }

    return (
        <ContainerPage>
            <>
                <BreadCrumb items={breadcrumbItems} />
                {checkForPermission("PRODUCTMODEL_VIEW") && products.match({
                    none: () => <>{t('product_list_loading')}</>,
                    some: (product) => <div className="ps-3 pe-4 ">
                        <div className="row mt-1 mb-3 p-0 ">
                            <div className="col-md-7 app-primary-color ">
                                <h5 className="ms-0 ps-1"> {t('product_list_title')}</h5>
                            </div>
                            <div className="col-md-5 ">
                                {checkForPermission("PRODUCTMODEL_MANAGE") &&
                                    <button className="btn app-primary-bg-color text-white ms-2 float-end " data-bs-toggle='modal' data-bs-target='#CreateProduct'>
                                        {t('product_list_button_create')}
                                    </button>
                                }
                                <button className="btn app-light float-end  app-primary-color fw-bold btn-sm border " onClick={onDownloadClick}>
                                    <span className="material-symbols-outlined align-middle me-1">
                                        download
                                    </span>
                                    {t('product_list_button_download')}
                                </button>
                            </div>
                        </div>
                        <div className="mb-3 ps-2">
                            <div className="input-group">
                                <input type='search' className="form-control custom-input" value={search} placeholder={t('product_list_placeholder_search') ?? ''}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            filterProductList(e);
                                        }
                                    }} onChange={addData} />
                                <button className="btn app-primary-bg-color text-white float-end " type="button" onClick={filterProductList}>
                                    Search
                                </button>
                            </div>
                        </div>
                        <div className="row mt-3 ps-1">
                            {product.length > 0 ? (
                                <div className=" table-responsive">
                                    <table className="table table-hover  table-bordered ">
                                        <thead>
                                            <tr>
                                                <th scope="col"></th>
                                                <th scope="col">{t('product_list_th_sl_no')}</th>
                                                <th scope="col">{t('product_list_th_code')}</th>
                                                <th scope="col">{t('product_list_th_model_name')}</th>
                                                <th scope="col">{t('product_list_th_description')}</th>
                                                <th scope="col">{t('product_list_th_category')}</th>
                                                <th scope="col">{t('product_list_th_make')}</th>
                                                <th scope="col">{t('product_list_th_manufacturing_year')}</th>
                                                <th scope="col">{t('product_list_th_amc_value')}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {product.map((field, index) => (
                                                <tr className="mt-2">
                                                    <td>
                                                        {checkForPermission("PRODUCTMODEL_MANAGE") &&
                                                            <a
                                                                className="pseudo-href app-primary-color"
                                                                onClick={() => {
                                                                    loadClickedProductDetails(field.product.Id.toString())
                                                                }}
                                                                data-bs-toggle="modal"
                                                                data-toggle="tooltip" data-placement="left" title={'Edit Product'}
                                                                data-bs-target="#EditProduct"
                                                                data-testid={`editproduct${field.product.Id}`}
                                                            >
                                                                <FeatherIcon icon={"edit"} size="16" />
                                                            </a>}
                                                        &nbsp;
                                                        {checkForPermission("PRODUCTMODEL_MANAGE") &&
                                                            <a
                                                                className='pseudo-href app-primary-color'
                                                                data-toggle="tooltip" data-placement="left" title={'Delete Product'}
                                                                onClick={() => handleConfirm(field.product.Id)}
                                                            >
                                                                <FeatherIcon icon={"trash-2"} size="20" />
                                                            </a>
                                                        }
                                                    </td>
                                                    <th className="text-center" scope="row">{(currentPage - 1) * 10 + (index + 1)}</th>
                                                    <td>{field.product.Code} </td>
                                                    <td>{field.product.ModelName} </td>
                                                    <td>{field.product.Description}</td>                                                        <td>{field.product.Category}</td>
                                                    <td>{field.product.Make}</td>
                                                    <td>{field.product.ManufacturingYear}</td>
                                                    <td className="text-end">{formatCurrency(field.product.AmcValue)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <div className="row">
                                        <Pagination currentPage={currentPage} count={totalRows} itemsPerPage={perPage} onPageChange={onPageChange} />
                                    </div>
                                </div>
                            ) : (
                                <div className="text-muted ps-3">{t('product_list_no_data')}</div>
                            )}
                        </div>
                        {ProductId ? <ConfirmationModal /> : ""}
                        {/* toast */}
                        <Toaster />
                        {/* toast ends */}
                        <ProductEdit />
                        <ProductCreate />
                    </div>
                })}
            </>
        </ContainerPage>)
}