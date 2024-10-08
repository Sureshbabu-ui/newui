import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { store } from '../../../../../../../../state/store';
import { changePage, initializePartList, loadParts, setFilter, setPartCategories, setPartSubCategories, setSearch } from './AvailablePartList.slice'
import Select from 'react-select';
import { useStore } from "../../../../../../../../state/storeHooks";
import { checkForPermission } from "../../../../../../../../helpers/permissions";
import { Pagination } from "../../../../../../../Pagination/Pagination";
import { addOrRemoveFromCart } from "../PartIndentCart/PartIndentCart.slice";
import { getServiceRequestPartCategory, getServiceRequestPartList, getServiceRequestPartSubCategory } from "../../../../../../../../services/partIndent";
import { ContainerPage } from "../../../../../../../ContainerPage/ContainerPage";
import { setTabStatus } from "../PartIndentManagement/PartIndentManagement.slice";
import { formatSelectInput } from "../../../../../../../../helpers/formats";

export const AvailablePartList = () => {
    const { t } = useTranslation();
    const ServiceRequestId = store.getState().callcordinatormanagement.serviceRequestId
    const AssetProductCategoryId = store.getState().assetdetailsforcallcordinator.assetDetails.ProductCategoryId
    const ContractId = store.getState().assetdetailsforcallcordinator.assetDetails.ContractId
    const {
        availablepartlist: { parts, totalRows, perPage, currentPage, search, partCategoryId, partSubCategoryId, searchWith },
    } = useStore(({ availablepartlist }) => ({ availablepartlist }));

    const {
        partindentcart: { requestPart },
    } = useStore(({ partindentcart }) => ({ partindentcart }));

    useEffect(() => {
        if (checkForPermission("PARTINDENT_CREATE")) {
            onLoad();
        }
    }, []);

    const onLoad = async () => {
        store.dispatch(initializePartList());
        if (ServiceRequestId) {
            try {
                const partCategories = await getServiceRequestPartCategory(ServiceRequestId);
                if (partCategories.PartCategories && partCategories.PartCategories.length > 0) {
                    partCategories.PartCategories.unshift({ Name: "All", Id: 0 });
                }

                setPartCategory(formatSelectInput(partCategories.PartCategories, "Name", "Id"))
            } catch (error) {
                return
            }
        }
    }

    const [selectedFilter, setSelectedFilter] = useState<any>(null);
    const [partCategory, setPartCategory] = useState<any>([])
    const [partSubCategory, setSubPartCategory] = useState<any>([])

    useEffect(() => {
        const fetchSubCategories = async () => {
            try {
                const partSubCategories = await getServiceRequestPartSubCategory(AssetProductCategoryId, partCategoryId);
                if (partSubCategories.PartSubCategories && partSubCategories.PartSubCategories.length > 0) {
                    partSubCategories.PartSubCategories.unshift({ Name: "All", Id: -1 });
                }
                setSubPartCategory(formatSelectInput(partSubCategories.PartSubCategories, "Name", "Id"));
                store.dispatch(setPartSubCategories(0));
            } catch (error) {
                return
            }
        };

        fetchSubCategories();
    }, [partCategoryId]);

    const searchFilter = async (selectedOption: any) => {
        setSelectedFilter(selectedOption);
        store.dispatch(setFilter({ value: selectedOption.value }));
    };

    const selectPartCategory = async (selectedOption: any) => {
        store.dispatch(setPartCategories(selectedOption.value));
    };

    const selectPartSubCategory = async (selectedOption: any) => {
        store.dispatch(setPartSubCategories(selectedOption.value));
    };

    const onPageChange = async (index: number) => {
        store.dispatch(changePage(index));
        if (ServiceRequestId && AssetProductCategoryId) {
            const selectedPartSubCategoryId = partSubCategoryId === -1 ? 0 : partSubCategoryId;
            const result = await getServiceRequestPartList(ContractId, AssetProductCategoryId, search, searchWith, index, partCategoryId, selectedPartSubCategoryId);
            store.dispatch(loadParts(result));
        }
    }

    async function filterPartList(e) {
        store.dispatch(changePage(1));
        if (ServiceRequestId && AssetProductCategoryId) {
            // Check if partSubCategoryId is -1, and set it to null if true
            const selectedPartSubCategoryId = partSubCategoryId === -1 ? 0 : partSubCategoryId;
            const result = await getServiceRequestPartList(
                ContractId,
                AssetProductCategoryId,
                search,
                searchWith,
                1,
                partCategoryId,
                selectedPartSubCategoryId
            );
            store.dispatch(loadParts(result));
        }
    }

    const addData = async (event: any) => {
        store.dispatch(setSearch(event.target.value));
        let currentpage = currentPage;
        if (event.target.value == "") {
            {
                currentpage = 1;
            }
            if (ServiceRequestId && AssetProductCategoryId) {
                const selectedPartSubCategoryId = partSubCategoryId === -1 ? 0 : partSubCategoryId;
                const result = await getServiceRequestPartList(ContractId, AssetProductCategoryId, event.target.value, searchWith, currentpage, partCategoryId, selectedPartSubCategoryId);
                store.dispatch(loadParts(result));
            }
        }
    }

    const searchTypes = [
        { value: 'PartCode', label: 'Part Code' },
        { value: 'OemPartNumber', label: 'OEM Part Number' },
        { value: 'MakeName', label: 'Make' },
        { value: 'HsnCode', label: 'HSN Code' },
        { value: 'PartName', label: 'Part Name' }
    ]
    const partSubCategoryIsNull = [
        { value: 'All', label: 'All' }
    ]

    const moveToCart = (Id: number | string, Action: string) => {
        return () => {
            const part = parts.unwrap().find(part => part.part.Id == Id)
            if (part)
                store.dispatch(addOrRemoveFromCart({ Part: part.part, Action: Action }))
        }
    }

    const getPartCount = (partId) => {
        return requestPart.partInfoList.find((item) => item.Id === partId) ? true : false;
    };

    const handleStatusChange = (statusId) => {
        store.dispatch(setTabStatus(statusId))
    };

    return (
        <>
            <div className="row input-group"><div className="">
                <label className="mt-2">{t('availablepartlist_label_filterby')}</label>
                <div className=" mt-2  row">
                    <div className="col-md-6 ">
                        <div className=" p-0 m-0">
                            <div className="" >
                                <Select
                                    options={partCategory}
                                    onChange={selectPartCategory}
                                    value={partCategory && partCategory.find(option => option.value == partCategoryId) || partCategory[0]}
                                    isSearchable
                                    classNamePrefix="react-select"
                                    placeholder="Select PartCategory..."
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="" >
                            <Select
                                options={partSubCategory}
                                onChange={selectPartSubCategory}
                                value={partSubCategory && partSubCategory.find(option => option.value == partSubCategoryId) || partSubCategoryIsNull[0]}
                                isSearchable
                                classNamePrefix="react-select"
                                placeholder="Select Part SubCategory..."
                            />
                        </div>
                    </div>
                </div>
                <div className="input-group mt-2">
                    <div className="pe-2 me-3 col-md-6" >
                        <Select
                            options={searchTypes}
                            onChange={searchFilter}
                            value={searchTypes && searchTypes.find(option => option.value == searchWith)}
                            isSearchable
                            classNamePrefix="react-select"
                            placeholder="Advanced Filter"
                        />
                    </div>
                    <input
                        type='search'
                        className="form-control  custom-input"
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
                </div>
            </div>
                <div className="row ps-3 mt-2 col-md-12">
                    <button className=" py-2 app-primary-bg-color border text-white" type="button" onClick={filterPartList}>
                        {t('availablepartlist_btn_search')}
                    </button>
                </div></div>
            <ContainerPage>
                <div className="row m-0 p-0">{parts.match({
                    none: () => <div className="mb-3 text-muted pt-0 ">{t('availablepartlist_loading')}</div>,
                    some: (part) =>
                        <div className="m-0 p-0">
                            {checkForPermission("PARTINDENT_CREATE") && <>
                                <div className="mt-2">
                                    {totalRows > 0 ?
                                        <div className=" table-responsive overflow-hidden">
                                            <table className="table table-hover m-0 p-0 table-bordered ">
                                                <thead>
                                                    <tr>
                                                        <th scope="col">{t('part_list_th_sl_no')}</th>
                                                        <th className="col-md-2 " scope="col">{t('availablepartlist_header_hsncode')}</th>
                                                        <th className="col-md-2 " scope="col">{t('availablepartlist_header_partcode')}</th>
                                                        <th className="col-md-2  " scope="col">{t('availablepartlist_header_oempartnumber')}</th>
                                                        <th scope="col">{t('availablepartlist_header_partname')}</th>
                                                        <th scope="col"></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {part.map((field, index) => (
                                                        <tr className="mt-2" key={index}>
                                                            <th scope="row">{(currentPage - 1) * 10 + (index + 1)}</th>
                                                            <td >{field.part.HsnCode}</td>
                                                            <td >{field.part.PartCode}</td>
                                                            <td >{field.part.OemPartNumber}</td>
                                                            <td >
                                                                <div className="part-info">
                                                                    {field.part.Description}<br />
                                                                    {field.part.PartName}
                                                                </div>
                                                            </td>
                                                            <td className="col-md-2">
                                                                <div className=" mt-2 text-center">
                                                                    {getPartCount(field.part.Id) == true ?
                                                                        <>
                                                                            <div onClick={moveToCart(field.part.Id, "remove")} className="btn small btn-danger"  >
                                                                                <div className="text-size-11"
                                                                                    data-toggle="tooltip" data-placement="left" title={`${t('availablepartlist_btn_remove_tooltip')}`} >
                                                                                    <span className="material-symbols-outlined fs-4 align-middle pe-1"> delete</span>
                                                                                </div>
                                                                            </div>

                                                                        </>

                                                                        :
                                                                        <div onClick={moveToCart(field.part.Id, "add")} className="btn small btn-success"  >
                                                                            <div className=""
                                                                                data-toggle="tooltip" data-placement="left" title={`${t('availablepartlist_btn_add_tooltip')}`} >
                                                                                <span className="material-symbols-outlined fs-4 align-middle pe-1"> shopping_cart</span>
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
                                            {requestPart.partInfoList.length > 0 &&
                                                <button type='button' onClick={() => handleStatusChange("2")} className="sticky-bottom btn app-primary-bg-color text-white mt-3 mb-1 w-100" >Proceed to Cart</button>
                                            }
                                        </div>
                                        : <div className="text-muted ps-0 mt-1">{t('availablepartlist_nodata')} </div>
                                    }
                                </div>
                            </>
                            }
                        </div>
                })}
                </div>
            </ContainerPage >
        </>
    )
}