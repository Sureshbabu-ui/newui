import { useEffect, useRef, useState } from 'react';
import { store } from '../../../../../../state/store';
import { useStoreWithInitializer } from '../../../../../../state/storeHooks';
import { ContainerPage } from '../../../../../ContainerPage/ContainerPage';
import { Pagination } from '../../../../../Pagination/Pagination';
import { useTranslation } from 'react-i18next';
import BreadCrumb from '../../../../../BreadCrumbs/BreadCrumb';
import { PartStocksListState, changePage, initializePartStocksList, loadAreaOffices, loadMake, loadPartCategories, loadPartStock, loadPartStocks, loadProductCategories, loadStockRooms, loadTenantRegions, setSearch, setStockRoom, updateField } from './PartStockList.slice';
import { getPartStockList } from '../../../../../../services/partStock';
import { checkForPermission } from '../../../../../../helpers/permissions';
import { formatDateTime, formatPartCategorySelectInput, formatSelectInput } from '../../../../../../helpers/formats';
import { Link } from 'react-router-dom';
import PartStockDetailList from '../../PartStockDetail/PartStockDetailList/PartStockDetailList';
import { setPart, setPartStocks } from '../PartStockBasket/PartStockBasket.slice';
import { PartStockBasketList } from '../PartStockBasket/PartStockBasket';
import { initializePartStockDetailsList, setStockDetailSearch } from '../../PartStockDetail/PartStockDetailList/PartStockDetailList.slice';
import Select from 'react-select';
import { getTenantRegionNames } from '../../../../../../services/tenantRegion';
import { getRegionWiseTenantOfficeList } from '../../../../../../services/tenantOfficeInfo';
import { getValuesInMasterDataByTable } from '../../../../../../services/masterData';
import { getPartMake } from '../../../../../../services/part';
import { getProductCategory } from '../../../../../../services/product';
import { getPartCategoryList, getProductPartsCategory } from '../../../../../../services/partCategory';
import { getStockRoomNames } from '../../../../../../services/stockroom';
import { getPartSubCategoryNames } from '../../../../../../services/partSubCategory';
export const PartStockList = () => {

    const { t } = useTranslation();
    const onLoad = async () => {
        store.dispatch(initializePartStocksList());
    }
    const [partCategoryList, setPartCategoryList] = useState<any>(null)
    const [PartSubCategoryList, setPartSubCategoryList] = useState<any>([]);
    const { partstocklist: { partStocks, StockRoom, StockType, ProductCategory, StockRoomName, totalRows, perPage, Make, currentPage, search, TenantRegion, partStockFilter, AreaOfficeInfo },
    } = useStoreWithInitializer(({ partstocklist, app }) => ({ partstocklist, app }), onLoad);

    const breadcrumbItems = () => {
        return [
            { Text: 'breadcrumbs_home', Link: '/' },
            { Text: 'breadcrumbs_manage_partstocklist' }
        ];
    }
    useEffect(() => {
        if (Number(partStockFilter.PartCategory) > 0) {
            getFilteredPartSubCategory()
        }
    }, [partStockFilter.PartCategory])

    const getFilteredPartSubCategory = async () => {
        const { PartSubCategoryDetails } = await getPartSubCategoryNames(partCategoryList.find(item => item.value == partStockFilter.PartCategory).PartProductCategoryToPartCategoryMappingId)
        setPartSubCategoryList(formatSelectInput(PartSubCategoryDetails, "Name", "Id"))
    }

    useEffect(() => {
        fetchCollectionList()
    }, [currentPage])

    const fetchCollectionList = async () => {
        try {
            if (checkForPermission("PARTSTOCK_LIST")) {
                store.dispatch(initializePartStocksList());
                const collections = await getPartStockList("", "", currentPage);
                store.dispatch(loadPartStocks(collections));
            }
        }
        catch (error) {
            console.error(error);
        }
    }

    const onPageChange = async (index: number) => {
        store.dispatch(changePage(index));
    }

    const filterPartStockList = async () => {
        await store.dispatch(changePage(1));
        fetchCollectionList()
    }

    const addData = async (event: any) => {
        store.dispatch(setSearch(event.target.value));
    }

    useEffect(() => {
        if (search == "") {
            fetchCollectionList()
        }
    }, [search])

    const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);
    const [selectedPartId, setSelectedPartId] = useState<null | string>(null);

    // Handler for offcanvas link click
    const handleOffcanvasClick = (event) => {
        store.dispatch(initializePartStockDetailsList())
        setIsOffcanvasOpen(true);
        setSelectedPartId(event.target.value)
        store.dispatch(setPart(event.target.value))
    };

    const handleOffcanvasClose = () => {
        store.dispatch(setStockDetailSearch(StockRoomName))
        setIsOffcanvasOpen(false);
        setSelectedPartId(null);
        return true;
    };

    const [isFilterDivOpen, setFilterDivOpen] = useState(false);

    const onFilterClick = () => {
        if (!isFilterDivOpen) {
            setFilterDivOpen(true);
        } else {
            setFilterDivOpen(false);
        }
    }

    useEffect(() => {
        GetPartStockFilterData();
    }, []);

    async function GetPartStockFilterData() {
        store.dispatch(initializePartStocksList());
        try {
            const TenantRegion = await getTenantRegionNames();
            const regions = await formatSelectInput(TenantRegion.RegionNames, "RegionName", "Id")
            store.dispatch(loadTenantRegions({ Select: regions }));

            var { MasterData } = await getValuesInMasterDataByTable("StockType")
            const stocktype = await formatSelectInput(MasterData, "Name", "Id")
            store.dispatch(loadPartStock({ Select: stocktype }));

            var Make = await getPartMake()
            const make = await formatSelectInput(Make.MakeNames, "Name", "Id")
            store.dispatch(loadMake({ Select: make }));

            const { ProductCategoryNames } = await getProductCategory()
            const productCategory = await formatSelectInput(ProductCategoryNames, "CategoryName", "Id")
            store.dispatch(loadProductCategories({ Select: productCategory }));

            const StockRoom = await getStockRoomNames();
            const stockRoom = await formatSelectInput(StockRoom.StockRooms, "RoomName", "Id")
            store.dispatch(loadStockRooms({ Select: stockRoom }));
        } catch (error) {
            return
        }
    }

    useEffect(() => {
        if (partStockFilter.ProductCategory != 0) {
            getFilteredPartCategory()
        }
    }, [partStockFilter.ProductCategory])

    const getFilteredPartCategory = async () => {
        const { PartProductCategoryDetails } = await getProductPartsCategory(partStockFilter.ProductCategory)
        setPartCategoryList(formatPartCategorySelectInput(PartProductCategoryDetails))
    }

    useEffect(() => {
        const fetchData = async () => {
            const TenantLocations = await getRegionWiseTenantOfficeList(partStockFilter.TenantRegionId.toString());
            const TenantLocation = await formatSelectInput(TenantLocations.TenantOfficeName, 'OfficeName', 'Id');
            store.dispatch(loadAreaOffices({ Select: TenantLocation }));

            const PartCategory = await getPartCategoryList(partStockFilter.ProductCategory.toString(), "", store.getState().partcategorylist.currentPage);
            const partCategory = await formatSelectInput(PartCategory.PartCategories, "Name", "Id")
            store.dispatch(loadPartCategories({ Select: partCategory }));
        };

        fetchData();
    }, [partStockFilter.TenantRegionId, partStockFilter.ProductCategory]);

    const handleBasketItemsModal = async (event: any) => {
        setIsOffcanvasOpen(false);
        store.dispatch(setPartStocks(true));
        if (store.getState().partstockbasket.BasketItem == true) {
            document.getElementById('closeOffcanvasPartStocks')?.click();
        }
    };

    const onSelectChange = async (selectedOption: any, name: string) => {
        var value = selectedOption.value
        if (name == "StockRoom"){
            store.dispatch(setStockRoom(selectedOption.label));
        }
        store.dispatch(updateField({ name: name as keyof PartStocksListState['partStockFilter'], value }));
    }

    const onSubmit = async () => {
        const collections = await getPartStockList(search, partStockFilter, currentPage);
        store.dispatch(loadPartStocks(collections));
    }

    const offcanvasRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (offcanvasRef.current && !offcanvasRef.current.contains(event.target)) {
                handleOffcanvasClose();
            }
        };

        if (isOffcanvasOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOffcanvasOpen, handleOffcanvasClose]);

    return (
        <ContainerPage>
            <BreadCrumb items={breadcrumbItems()} />
            <div>
                {checkForPermission("PARTSTOCK_LIST") &&
                    <div>
                        {partStocks.match({
                            none: () => <div className='mx-2 pt-2'>{t('partstocklist_loading_message')}</div>,
                            some: (collection) =>
                                <div className=" pe-2 mt-2 mx-0 ps-2">
                                    {/* search */}
                                    <div className="">
                                        <div className="input-group">
                                            <input type='search' className="form-control custom-input" value={search ?? ''} placeholder={t('partstocklist_placeholder_search') ?? ''} onChange={addData}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        filterPartStockList();
                                                    }
                                                }} />
                                            <button className="btn app-primary-bg-color text-white float-end " type="button" onClick={filterPartStockList}>
                                                {t('partstocklist_button_search')}
                                            </button>

                                            <div className="col-md-12">
                                                <div className="float-end pt-1 pb-1">
                                                    <div className="app-primary-color href-underline-none" onClick={onFilterClick}>
                                                        <small>{t('partstocklist_advanced_search')}</small>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* search ends */}
                                    {/* Filter Begin */}
                                    {isFilterDivOpen &&
                                        <div className='row mx-0 p-0'>
                                            <div className="mb-2 app-primary-color ps-0">
                                                {t('partstocklist_filter_by')}
                                            </div>
                                            <div className="mt-2 p-0">
                                                <div className="row display-flex">
                                                    <div className='col-md-3'>
                                                        <label className=''>{t('partstocklist_filter_region')}</label>
                                                        <Select
                                                            options={TenantRegion}
                                                            value={TenantRegion && TenantRegion.find(option => option.value == partStockFilter.TenantRegionId) || null}
                                                            onChange={(selectedOption) => onSelectChange(selectedOption, "TenantRegionId")}
                                                            isSearchable
                                                            placeholder={t('tenant_officeinfo_list_placeholder_search_select_filter')}
                                                            classNamePrefix="react-select"
                                                            name="TenantRegionId"
                                                        />
                                                    </div>
                                                    <div className='col'>
                                                        <label className=''>{t('partstocklist_filter_area_office')}</label>
                                                        <Select
                                                            options={AreaOfficeInfo}
                                                            value={AreaOfficeInfo && AreaOfficeInfo.find(option => option.value == partStockFilter.TenantOfficeId) || null}
                                                            onChange={(selectedOption) => onSelectChange(selectedOption, "TenantOfficeId")}
                                                            isSearchable
                                                            name='TenantOfficeId'
                                                            placeholder='Select option'
                                                            isDisabled={!partStockFilter.TenantRegionId}
                                                        />
                                                    </div>
                                                    <div className='col'>
                                                        <label className=''>{t('partstocklist_filter_part_type')}</label>
                                                        <Select
                                                            options={StockType}
                                                            value={StockType && StockType.find(option => option.value == partStockFilter.PartType) || null}
                                                            onChange={(selectedOption) => onSelectChange(selectedOption, "PartType")}
                                                            isSearchable
                                                            name='PartType'
                                                            placeholder='Select option'
                                                        />
                                                    </div>
                                                    <div className='col'>
                                                        <label className=''>{t('partstocklist_filter_make')}</label>
                                                        <Select
                                                            options={Make}
                                                            value={Make && Make.find(option => option.value == partStockFilter.Make) || null}
                                                            onChange={(selectedOption) => onSelectChange(selectedOption, "Make")}
                                                            isSearchable
                                                            name='Make'
                                                            placeholder='Select option'
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mt-2 p-0">
                                                <div className="row display-flex">
                                                    <div className='col-md-3'>
                                                        <label className=''>{t('partstocklist_filter_product_category')}</label>
                                                        <Select
                                                            options={ProductCategory}
                                                            value={ProductCategory && ProductCategory.find(option => option.value == partStockFilter.ProductCategory) || null}
                                                            onChange={(selectedOption) => onSelectChange(selectedOption, "ProductCategory")}
                                                            isSearchable
                                                            name='ProductCategory'
                                                            placeholder='Select option'
                                                        />
                                                    </div>
                                                    <div className='col-md-3'>
                                                        <label className=''>{t('partstocklist_filter_part_category')}</label>
                                                        <Select
                                                            options={partCategoryList}
                                                            value={partCategoryList && partCategoryList.find(option => option.value == partStockFilter.PartCategory) || null}
                                                            onChange={(selectedOption) => onSelectChange(selectedOption, "PartCategory")}
                                                            isSearchable
                                                            placeholder='Select option'
                                                            classNamePrefix="react-select"
                                                            name="PartCategory"
                                                        />
                                                    </div>
                                                    <div className='col-md-3'>
                                                        <label className=''>{t('partstocklist_filter_part_sub_category')}</label>
                                                        <Select
                                                            options={PartSubCategoryList}
                                                            value={PartSubCategoryList && PartSubCategoryList.find(option => option.value == partStockFilter.SubCategory) || null}
                                                            onChange={(selectedOption) => onSelectChange(selectedOption, "SubCategory")}
                                                            isSearchable
                                                            name='SubCategory'
                                                            placeholder='Select option'
                                                        />
                                                    </div>
                                                    <div className='col-md-3'>
                                                        <label className=''>{t('partstocklist_filter_stock_room')}</label>
                                                        <Select
                                                            options={StockRoom}
                                                            onChange={(selectedOption) => onSelectChange(selectedOption, "StockRoom")}
                                                            isSearchable
                                                            name='StockRoom'
                                                            placeholder='Select option'
                                                        />
                                                    </div>

                                                </div>
                                                <button type='button' className='btn float-end app-primary-bg-color text-white mt-2' onClick={onSubmit}>
                                                    {t('partstocklist_filter_button')}
                                                </button>
                                            </div>
                                        </div>
                                    }
                                    {/* Filter End */}
                                    {collection.length > 0 ? (
                                        <div className="row mt-2">
                                            <div>
                                                {collection.map((field, index) => (
                                                    <div key={index}>
                                                        <div className="row m-0 py-2 border-bottom">
                                                            {/* part details */}
                                                            <div className="col-md-10 px-0">
                                                                <div className="row m-0">
                                                                    <div className="col-1 ps-0 small">{field.partStock.PartCode}</div>
                                                                    <div className="col-9 small fw-bold">{field.partStock.PartName}</div>
                                                                    <div className="col-2 text-size-11 text-muted">{`${field.partStock.UpdatedOn ? 'Last updated ' + formatDateTime(field.partStock.UpdatedOn) : ''}`}  </div>
                                                                </div>
                                                            </div>
                                                            {/* part details ends */}

                                                            <div className="col-md-2 d-flex flex-row-reverse px-0">
                                                                <button className="btn btn-light text-decoration-none app-primary-color"
                                                                    value={field.partStock.Id ?? 0}
                                                                    onClick={handleOffcanvasClick}
                                                                    type="button" data-bs-toggle="offcanvas"
                                                                    data-bs-target="#offcanvasPartStocks"
                                                                    aria-controls="offcanvasPartStocks"
                                                                >
                                                                    {field.partStock.Quantity}
                                                                </button>
                                                            </div>
                                                        </div>
                                                        {/* iteration ends here */}
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="offcanvas offcanvas-start p-0" tabIndex={-1} id="offcanvasPartStocks" aria-labelledby="offcanvasPartStocksLabel" ref={offcanvasRef}>
                                                <div className="offcanvas-header">
                                                    <h5 className="offcanvas-title" id="offcanvasPartStocksLabel">{t('partstocklist_offcanvas_title')}</h5>
                                                    <button type="button" className="btn-close text-reset" id='closeOffcanvasPartStocks' data-bs-dismiss="offcanvas" onClick={handleOffcanvasClose} aria-label="Close"></button>
                                                </div>
                                                <div className="offcanvas-body m-0 p-0">
                                                    {
                                                        isOffcanvasOpen && Number(selectedPartId) >= 1 &&
                                                        <PartStockDetailList PartId={selectedPartId} RenderType="compact" search={StockRoomName} />
                                                    }
                                                </div>
                                                <div className="offcanvas-footer shadow-sm m-0 p-1 text-center fw-bold">
                                                    <Link to={`/inventory/partstockdetail?partid=${selectedPartId}`} onClick={handleOffcanvasClose} className="text-decoration-none app-primary-color">
                                                        {t('partstocklist_offcanvas_btn_expand')}
                                                        <span className="material-symbols-outlined align-middle ps-2"> open_in_new</span>
                                                    </Link>
                                                </div>
                                            </div>
                                            <div className="m-0">
                                                <Pagination currentPage={currentPage} count={totalRows} itemsPerPage={perPage} onPageChange={onPageChange} />
                                            </div>
                                            {store.getState().partstockbasket.BasketList.length > 0 &&
                                                <button
                                                    type='button'
                                                    onClick={handleBasketItemsModal} data-bs-toggle="modal" data-bs-target="#StockTransfer"
                                                    className='sticky-bottom btn app-primary-bg-color text-white mt-3 mb-1 w-100'
                                                >
                                                    {t('partstocklist_go_to_cart')}
                                                </button>
                                            }
                                        </div>
                                    ) : (
                                        <div className="text-muted ps-3">{t('partstocklist_nodata')}</div>
                                    )}
                                </div>
                        })}
                    </div>
                }
            </div>
            <PartStockBasketList />
        </ContainerPage>
    )
}
