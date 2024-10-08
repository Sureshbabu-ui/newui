import { useTranslation } from "react-i18next";
import { ContainerPage } from "../../../../ContainerPage/ContainerPage";
import { ValidationErrorComp } from "../../../../ValidationErrors/ValidationError";
import { store } from "../../../../../state/store";
import { startPreloader, stopPreloader } from "../../../../Preloader/Preloader.slice";
import { useStoreWithInitializer } from '../../../../../state/storeHooks';
import { useRef, useState, useEffect } from "react";
import SweetAlert from "react-bootstrap-sweetalert";
import { convertBackEndErrorsToValidationErrors, formatSelectInput } from "../../../../../helpers/formats";
import * as yup from 'yup';
import Select from 'react-select';
import { checkForPermission } from "../../../../../helpers/permissions";
import { getProductCategory } from "../../../../../services/product";
import { getProductPartsCategory } from "../../../../../services/partCategory";
import {  getPartSubCategoryList, partSubCategoryCreate } from "../../../../../services/partSubCategory";
import { PartSubCateogyCreateState, initializePartSubCategoryCreate, toggleInformationModalStatus, updateErrors, updateField } from "./PartSubCategoryCreate.slice";
import { loadPartSubCategories } from "../PartSubCategoryList/PartSubCategoryList.slice";

export const PartSubCategoryCreate = () => {
    const { t } = useTranslation();
    const modalRef = useRef<HTMLButtonElement>(null);
    const [partCategoryList, setPartCategoryList] = useState<any>(null)
    const [productCategoryList, setProductCategoryList] = useState<any>([]);

    const getSelectListData = async () => {
        store.dispatch(initializePartSubCategoryCreate())

        const { ProductCategoryNames } = await getProductCategory()
        setProductCategoryList(formatSelectInput(ProductCategoryNames, "CategoryName", "Id"))
    }

    const {
        partSubCategory, displayInformationModal, errors
    } = useStoreWithInitializer(({ partsubcategorycreate }) => partsubcategorycreate, getSelectListData);

    useEffect(() => {
        if (partSubCategory.ProductCategoryId != 0) {
            getFilteredPartCategory()
        }
    }, [partSubCategory.ProductCategoryId])

    const getFilteredPartCategory = async () => {
        const { PartProductCategoryDetails } = await getProductPartsCategory(partSubCategory.ProductCategoryId)
        setPartCategoryList(formatSelectInput(PartProductCategoryDetails, "Name", "PartProductCategoryToPartCategoryMappingId"))
    } 

    const onSelectChange = async (selectedOption: any, name: string) => {
        var value = selectedOption.value
        store.dispatch(updateField({ name: name as keyof PartSubCateogyCreateState['partSubCategory'], value }));
    }

    const onUpdateField = (ev: any) => {
        var { name, value } = ev.target
        store.dispatch(updateField({ name: name as keyof PartSubCateogyCreateState['partSubCategory'], value }));
    }

    const onSubmit = async () => {
        store.dispatch(updateErrors({}))
        try {
            await validationSchema.validate(partSubCategory, { abortEarly: false });
        } catch (error: any) {
            const errors = error.inner.reduce((allErrors: any, currentError: any) => {
                return { ...allErrors, [currentError.path as string]: currentError.message };
            }, {});
            store.dispatch(updateErrors(errors))
            if (errors) {
                console.log(errors)
                return;
            }
        }
        store.dispatch(startPreloader());
        const result = await partSubCategoryCreate(partSubCategory)
        result.match({
            ok: () => {
                store.dispatch(toggleInformationModalStatus());
            },
            err: (e) => {
                const errorMessages = convertBackEndErrorsToValidationErrors(e)
                store.dispatch(updateErrors(errorMessages));
            },
        });
        store.dispatch(stopPreloader());
    }

    const InformationModal = () => {
        const { t } = useTranslation();
        return (
            <SweetAlert success title="Success" onConfirm={updatePartList}>
                {t('partsubcategorycreate_success_message')}
            </SweetAlert>
        );
    }

    const updatePartList = async () => {
        store.dispatch(toggleInformationModalStatus());
        modalRef.current?.click()
       const result = await getPartSubCategoryList(store.getState().partsubcategorylist.search, 1);
       store.dispatch(loadPartSubCategories(result));
    }

    const onModalClose = () => {
        store.dispatch(initializePartSubCategoryCreate())
    }

    const validationSchema = yup.object().shape({
        ProductCategoryId: yup.number().positive('validation_error_partsubcategorycreate_product_category_required'),
        PartSubCategoryName: yup.string().required('validation_error_partsubcategorycreate_name_required').max(64, ('validation_error_part_create_Name_max')),
        PartProductCategoryToPartCategoryMappingId: yup.number().positive('validation_error_partsubcategorycreate_part_category_required'),
    });
    
    return (
        <>
            <div
                className="modal fade"
                id='CreatePartSubCategory'
                data-bs-backdrop='static'
                data-bs-keyboard='false'
                aria-hidden='true'
            >
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header mx-2">
                            <h5 className="modal-title">{t('partsubcategory_create_title')}</h5>
                            <button
                                type='button'
                                className="btn-close"
                                data-bs-dismiss='modal'
                                id='closeCreatePartSubCategoryModal'
                                aria-label='Close'
                                onClick={onModalClose}
                                ref={modalRef}
                            ></button>
                        </div>
                        {checkForPermission("PARTSUBCATEGORY_MANAGE") && <>
                            <div className="modal-body">
                                <ContainerPage>
                                    <ValidationErrorComp errors={errors} />
                                    <div className=''>
                                        <div className='row mb-1'>
                                            <div className='col-md-12'>
                                                <label className="mt-2 red-asterisk">{t('partsubcategorycreate_input_product_category')}</label>
                                                <Select
                                                    options={productCategoryList}
                                                    value={productCategoryList && productCategoryList.find(option => option.value == partSubCategory.ProductCategoryId) || null}
                                                    onChange={(selectedOption) => onSelectChange(selectedOption, "ProductCategoryId")}
                                                    isSearchable
                                                    name="ProductCategoryId"
                                                    placeholder="Select option"
                                                />
                                                <div className="small text-danger"> {t(errors['ProductCategoryId'])}</div>
                                            </div>
                                            <div className='col-md-12'>
                                                <label className="mt-2 red-asterisk">{t('partsubcategorycreate_input_part_category')}</label>
                                                <Select
                                                    options={partCategoryList}
                                                    value={partCategoryList && partCategoryList.find(option => option.value == partSubCategory.PartProductCategoryToPartCategoryMappingId) || null}
                                                    onChange={(selectedOption) => onSelectChange(selectedOption, "PartProductCategoryToPartCategoryMappingId")}
                                                    isSearchable
                                                    name="PartProductCategoryToPartCategoryMappingId"
                                                    placeholder="Select option"
                                                />
                                                <div className="small text-danger"> {t(errors['PartProductCategoryToPartCategoryMappingId'])}</div>
                                            </div>
                                      
                                            <div className='col-md-12'>
                                                <label className="mt-2 red-asterisk">{t('partsubcategorycreate_input_partsubcategoryname')}</label>
                                                <input name='PartSubCategoryName' onChange={onUpdateField} type='text'
                                                    value={partSubCategory.PartSubCategoryName}
                                                    className={`form-control  ${errors["PartSubCategoryName"] ? "is-invalid" : ""}`}
                                                ></input>
                                                <div className="invalid-feedback"> {t(errors['PartSubCategoryName'])}</div>
                                            </div>
                                               
                                            <div className="col-md-12 mt-2">
                                                <button type='button' className='btn float-end app-primary-bg-color text-white mt-2' onClick={onSubmit}>
                                                    {t('partsubcategory_create_button')}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </ContainerPage>
                                {displayInformationModal ? <InformationModal /> : ""}
                            </div>
                        </>}
                    </div>
                </div>
            </div>
        </>
    );
}