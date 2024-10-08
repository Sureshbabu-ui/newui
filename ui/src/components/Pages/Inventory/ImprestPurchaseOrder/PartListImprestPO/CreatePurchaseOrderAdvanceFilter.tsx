import { formatPartCategorySelectInput, formatSelectInput } from "../../../../../helpers/formats";
import { useEffect, useState } from "react";
import { CreateImprestPOState, loadPartProductCategoryNames, loadParts, updateField } from "./PartListImprestPO.slice";
import { useStore } from "../../../../../state/storeHooks";
import { store } from "../../../../../state/store";
import { getPartMake, getProductCategoryPartList } from "../../../../../services/part";
import Select from 'react-select';
import { getProductCategory } from "../../../../../services/product";
import { useTranslation } from "react-i18next";
import { getPartSubCategoryNames } from "../../../../../services/partSubCategory";
import { getProductPartsCategory } from "../../../../../services/partCategory";

export const CreatePurchaseOrderAdvanceFilter = () => {
    const { t } = useTranslation();
    const [partCategoryList, setPartCategoryList] = useState<any>(null)
    const [partMakeList, setPartMakeList] = useState<any>([]);
    const [productCategoryList, setProductCategoryList] = useState<any>([]);
    const [PartSubCategoryList, setPartSubCategoryList] = useState<any>([]);

    const { currentPage, searchWith, search, totalRows, filter } = useStore(
        ({ imprestpurchaseorderparts, }) => imprestpurchaseorderparts);

    useEffect(() => {
        onLoad();
    }, []);

    const onLoad = async () => {
        const { MakeNames } = await getPartMake()
        setPartMakeList(formatSelectInput(MakeNames, "Name", "Id"))

        const { ProductCategoryNames } = await getProductCategory()
        setProductCategoryList(formatSelectInput(ProductCategoryNames, "CategoryName", "Id"))
    }

    useEffect(() => {
        if (filter.ProductCategoryId != 0) {
            getFilteredPartCategory()
        }
    }, [filter.ProductCategoryId])

    const getFilteredPartCategory = async () => {
        const { PartProductCategoryDetails } = await getProductPartsCategory(filter.ProductCategoryId)
        setPartCategoryList(formatPartCategorySelectInput(PartProductCategoryDetails))
    }

    const getFilteredPartSubCategory = async () => {
        const { PartSubCategoryDetails } = await getPartSubCategoryNames(partCategoryList?.find(item => item.value == filter.PartCategoryId).PartProductCategoryToPartCategoryMappingId)
        setPartSubCategoryList(formatSelectInput(PartSubCategoryDetails, "Name", "Id"))
    }

    useEffect(() => {
        if (filter.PartCategoryId)
            getFilteredPartSubCategory()
    }, [filter.PartCategoryId])

    async function onSelectChange(selectedOption: any, Name: any) {
        var value = selectedOption.value
        var name = Name
        store.dispatch(updateField({ name: name as keyof CreateImprestPOState['filter'], value }));
    }

    async function onFilter() {
        document.getElementById("closeCreatePOFilter")?.click();
        const result = await getProductCategoryPartList(filter.ProductCategoryId, filter.PartCategoryId, filter.PartSubCategoryId, filter.MakeId, search, searchWith, currentPage);
        store.dispatch(loadParts(result))
    }

    const onModalClose = async () => {
        const { ProductCategoryNames } = await getProductCategory()
        const formatedProductCategory = formatSelectInput(ProductCategoryNames, "CategoryName", "Id")
        store.dispatch(loadPartProductCategoryNames({ Select: formatedProductCategory }))
    }

    return (
        <div
            className="modal fade"
            id='CreatePOFilter'
            data-bs-backdrop='static'
            data-bs-keyboard='false'
            aria-hidden='true'
        >
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header mx-3">
                        <h5 className="modal-title app-primary-color">Advanced Filter</h5>
                        <button
                            type='button'
                            className="btn-close me-2"
                            data-bs-dismiss='modal'
                            id='closeCreatePOFilter'
                            onClick={onModalClose}
                            aria-label='Close'
                        ></button>
                    </div>
                    <div className="modal-body">
                        <div className="row">
                            <div className='mb-2'>
                                <label className="mt-2 red-asterisk">Make</label>
                                <Select
                                    value={partMakeList && partMakeList.find(option => option.value == filter.MakeId) || null}
                                    options={partMakeList}
                                    onChange={(selectedOption) => onSelectChange(selectedOption, "MakeId")}
                                    isSearchable
                                    name="MakeId"
                                    placeholder="Select option"
                                />
                            </div>
                            <div className='mb-2'>
                                <label className="mt-2 red-asterisk">Part Product Category</label>
                                <Select
                                    value={productCategoryList && productCategoryList.find(option => option.value == filter.ProductCategoryId) || null}
                                    options={productCategoryList}
                                    onChange={(selectedOption) => onSelectChange(selectedOption, "ProductCategoryId")}
                                    isSearchable
                                    name="ProductCategoryId"
                                    placeholder="Select option"
                                />
                            </div>
                            <div className='mb-2'>
                                <label className="mt-2 red-asterisk">Part Category</label>
                                <Select
                                    value={partCategoryList && partCategoryList.find(option => option.value == filter.PartCategoryId) || null}
                                    options={partCategoryList}
                                    onChange={(selectedOption) => onSelectChange(selectedOption, "PartCategoryId")}
                                    isSearchable
                                    name="PartCategoryId"
                                    placeholder="Select option"
                                />
                            </div>
                            <div className='col-md-12'>
                                <label className="mt-2">{t('part_create_input_partsubcategory')}</label>
                                <Select
                                    options={PartSubCategoryList}
                                    value={PartSubCategoryList && PartSubCategoryList.find(option => option.value == filter.PartSubCategoryId) || null}
                                    onChange={(selectedOption) => onSelectChange(selectedOption, "PartSubCategoryId")}
                                    isSearchable
                                    name="PartSubCategoryId"
                                    placeholder={t('partcreate_subcategory_select')}
                                />
                            </div>
                            <div className="mb-2 mt-3">
                                <button className="btn app-primary-bg-color text-white float-end" aria-label='Close'
                                    type="button" onClick={() => { onFilter() }}>
                                    {t('create_purchaseorder_proceed_button')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
} 