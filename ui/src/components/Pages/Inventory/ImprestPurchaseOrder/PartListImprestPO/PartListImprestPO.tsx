import { useTranslation } from "react-i18next";
import { formatSelectInput } from "../../../../../helpers/formats";
import { useEffect, useState } from "react";
import { CreateImprestPOState, changePage, initializeCreateImprestPurchaseOrder, loadParts, setFilter, setSearch, updateField } from "./PartListImprestPO.slice";
import { useStore, useStoreWithInitializer } from "../../../../../state/storeHooks";
import { store } from "../../../../../state/store";
import { Link } from "react-router-dom";
import { getProductCategoryPartList } from "../../../../../services/part";
import Select from 'react-select';
import { Pagination } from "../../../../Pagination/Pagination";
import { addOrRemoveFromCart, setPartQuantity, setProceed } from "../CreateImprestPurchaseOrder/CreateImprestPurhaseOrder.slice";
import { CreatePurchaseOrderAdvanceFilter } from "./CreatePurchaseOrderAdvanceFilter";
import { startPreloader, stopPreloader } from "../../../../Preloader/Preloader.slice";
import { CreateImprestPurchaseOrder } from "../CreateImprestPurchaseOrder/CreateImprestPurhaseOrder";
import BreadCrumb from "../../../../BreadCrumbs/BreadCrumb";
import { checkForPermission } from "../../../../../helpers/permissions";

export const PartListImprestPurchaseOrder = () => {
    const { t } = useTranslation();

    const { currentPage, parts, perPage, searchWith, search, totalRows, filter } = useStoreWithInitializer(
        ({ imprestpurchaseorderparts, }) => imprestpurchaseorderparts,
        initializeCreateImprestPurchaseOrder
    );

    const { createimprestpo: { createforpurchaseorder, proceed }, } = useStore(({ createimprestpo }) => ({ createimprestpo }));

    useEffect(() => {
        if (checkForPermission("IMPRESTPURCHASEORDER_MANAGE")) {
            onLoad();
        }
    }, []);

    const getPartCount = (partId) => {
        return createforpurchaseorder.PartList.find((item) => item.Id === partId) ? true : false;
    };

    const moveToCart = (Id: number | string, Action: string) => {
        return () => {
            const part = parts.unwrap().find(part => part.part.Id == Id)
            if (part)
                store.dispatch(addOrRemoveFromCart({ Part: part.part, Action: Action }))
        }
    }

    const onLoad = async () => {
        store.dispatch(startPreloader());
        try {
            const result = await getProductCategoryPartList(filter.ProductCategoryId, filter.PartCategoryId, filter.PartSubCategoryId, filter.PartCategoryId, search, searchWith, currentPage);
            store.dispatch(loadParts(result))
        } catch (error) {
            return;
        }
        store.dispatch(stopPreloader());
    }

    const searchTypes = [
        { value: 'PartCode', label: 'Part Code' },
        { value: 'OemPartNumber', label: 'OEM Part Number' },
        { value: 'Description', label: 'Description' },
        { value: 'MakeName', label: 'Make' },
        { value: 'PartCategoryName', label: 'Part Category' },
        { value: 'HsnCode', label: 'HSN Code' },
        { value: 'PartName', label: 'Part Name' }
    ]

    const [selectedFilter, setSelectedFilter] = useState<any>(null);

    const searchFilter = async (selectedOption: any) => {
        setSelectedFilter(selectedOption);
        store.dispatch(setFilter({ value: selectedOption.value }));
    };

    const onPageChange = async (index: number) => {
        store.dispatch(changePage(index));
        const result = await getProductCategoryPartList(filter.ProductCategoryId, filter.PartCategoryId, filter.PartSubCategoryId, filter.PartCategoryId, search, searchWith, currentPage);
        store.dispatch(loadParts(result));
    }

    async function filterPartList(e) {
        store.dispatch(changePage(1))
        const result = await getProductCategoryPartList(filter.ProductCategoryId, filter.PartCategoryId, filter.PartSubCategoryId, filter.PartCategoryId, search, searchWith, currentPage);
        store.dispatch(loadParts(result));
    }

    const addData = async (event: any) => {
        store.dispatch(setSearch(event.target.value));
        let currentpage = currentPage;
        if (event.target.value == "") {
            {
                currentpage = 1;
            }
            const result = await getProductCategoryPartList(filter.ProductCategoryId, filter.PartCategoryId, filter.PartSubCategoryId, filter.PartCategoryId, search, searchWith, currentPage);
            store.dispatch(loadParts(result));
        }
    }

    const ProceedToPO = async () => {
        store.dispatch(setProceed(true))
    }

    const breadcrumbItems = [
        { Text: 'breadcrumbs_home', Link: '/' },
        { Text: 'breadcrumbs_purchase_orders', Link: '/logistics/purchaseorders' },
        { Text: 'breadcrumbs_imprest_purchase_orders' }
    ];

    return (
        <div className="row mx-2">
            {checkForPermission('IMPRESTPURCHASEORDER_MANAGE') &&
                <>
                    <BreadCrumb items={breadcrumbItems} />
                    <div className="row mt-4 ">
                        <div className={`${proceed == true ? 'col-md-6' : 'col-md-12 mx-2 p-0 ps-1'}`}>
                            <div className="row mx-0">
                                {parts.match({
                                    none: () => <>{t('availablepartlist_loading')}</>,
                                    some: (part) =>
                                        <div className="m-0 p-0">
                                            {/* Proceed Button */}
                                            {(proceed == false || createforpurchaseorder.PartList.length == 0) &&
                                                <div className="mb-3">
                                                    <button className="btn app-primary-bg-color text-white float-end" disabled={createforpurchaseorder.PartList.length == 0} type="button" onClick={() => ProceedToPO()}>
                                                        <span className="material-symbols-outlined fs-4 align-middle pe-1"> shopping_cart</span>
                                                        <span className="small "> {t('availablepartlist_cart')}</span>
                                                    </button>
                                                </div>
                                            }
                                            {/* Proceed Button ends */}
                                            <div className="">
                                                <label className="form-text">{t('availablepartlist_label_filterby')}</label>
                                                <div className="input-group">
                                                    <div className="me-2 fixed-width" >
                                                        <Select
                                                            options={searchTypes}
                                                            onChange={searchFilter}
                                                            value={searchTypes && searchTypes.find(option => option.value == searchWith) || null}
                                                            isSearchable
                                                            classNamePrefix="react-select"
                                                        />
                                                    </div>
                                                    <input
                                                        type='search'
                                                        className="form-control custom-input"
                                                        value={search}
                                                        placeholder={
                                                            selectedFilter ? `${t('availablepartlist_placeholder_searchwith')} ${t(selectedFilter.label)}` : `${t('availablepartlist_placeholder_search')}`
                                                        }
                                                        onChange={addData}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') {
                                                                filterPartList(e);
                                                            }
                                                        }}
                                                    />
                                                    <button className="btn app-primary-bg-color border text-white float-end" type="button" onClick={filterPartList}>
                                                        {t('availablepartlist_btn_search')}
                                                    </button>
                                                </div>
                                                {/* advanced search */}
                                                <div className="text-primary text-end my-2"><small role="button" data-bs-toggle='modal'
                                                    data-bs-target='#CreatePOFilter'>{t('availablepartlist_cart_advanced')}</small></div>
                                                <CreatePurchaseOrderAdvanceFilter />
                                                {/* advanced search */}
                                            </div>
                                            <div className="mt-2">
                                                {totalRows > 0 ?
                                                    <div className={`${proceed == true ? 'imprest_overflow overflow-y-scroll' : ''}table-responsive `}>
                                                        <table className="table table-hover m-0 p-0 table-bordered ">
                                                            <thead>
                                                                <tr>
                                                                    <th scope="col-auto">{t('part_list_th_sl_no')}</th>
                                                                    <th className="col-md-2 " scope="col">{t('availablepartlist_header_hsncode')}</th>
                                                                    <th className="col-md-2 " scope="col">{t('availablepartlist_header_partcode')}</th>
                                                                    <th className="col-md-2  " scope="col">{t('availablepartlist_header_oempartnumber')}</th>
                                                                    <th scope="col-auto">{t('availablepartlist_header_partname')}</th>
                                                                    <th scope="col-md-1"></th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {part.map((field, index) => (
                                                                    <tr className="mt-2" key={index}>
                                                                        <th scope="row">{(currentPage - 1) * 10 + (index + 1)}</th>
                                                                        <td >{field.part.HsnCode}</td>
                                                                        <td >{field.part.PartCode}</td>
                                                                        <td >{field.part.OemPartNumber}</td>
                                                                        <td >{field.part.Description} </td>
                                                                        <td className="col-md-2">
                                                                            <div className=" mt-2 text-center">
                                                                                {getPartCount(field.part.Id) == true ?
                                                                                    <>
                                                                                        {proceed == false ?
                                                                                            <div onClick={moveToCart(field.part.Id, "remove")} className="btn small btn-danger"  >
                                                                                                <div className=""
                                                                                                    data-toggle="tooltip" data-placement="left" title={`${t('availablepartlist_btn_remove_tooltip')}`} >
                                                                                                    <span className="material-symbols-outlined fs-4 align-middle pe-1"> shopping_cart</span>
                                                                                                    <span>{t('availablepartlist_cart_remove')}</span>
                                                                                                </div>
                                                                                            </div>
                                                                                            :
                                                                                            <div className="text-muted"> {t('availablepartlist_added_to_cart')} </div>
                                                                                        }
                                                                                    </>

                                                                                    :
                                                                                    <div onClick={moveToCart(field.part.Id, "add")} className="btn small btn-success"  >
                                                                                        <div className=""
                                                                                            data-toggle="tooltip" data-placement="left" title={`${t('availablepartlist_btn_add_tooltip')}`} >
                                                                                            <span className="material-symbols-outlined fs-4 align-middle pe-1"> shopping_cart</span>
                                                                                            {proceed === false &&
                                                                                                <span className="small ">{t('availablepartlist_btn_add')}</span>
                                                                                            }
                                                                                        </div>
                                                                                    </div>
                                                                                }
                                                                            </div>
                                                                        </td>
                                                                    </tr>

                                                                ))}
                                                            </tbody>
                                                        </table>
                                                        <div className="row mt-2">
                                                            <Pagination currentPage={currentPage} count={totalRows} itemsPerPage={perPage} onPageChange={onPageChange} />
                                                        </div>
                                                    </div>
                                                    : <div className="text-muted ps-0 mt-1">{t('availablepartlist_nodata')} </div>
                                                }
                                            </div>
                                        </div>
                                })}
                            </div>
                        </div>
                        {proceed == true &&
                            <div className="col-md-6 mx-0 p-0 m-0"><CreateImprestPurchaseOrder /></div>
                        }
                    </div>
                </>
            }
        </div>
    )
} 