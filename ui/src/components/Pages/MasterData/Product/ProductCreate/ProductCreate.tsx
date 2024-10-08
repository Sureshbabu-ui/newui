import { useTranslation } from "react-i18next";
import { ContainerPage } from "../../../../ContainerPage/ContainerPage";
import { ValidationErrorComp } from "../../../../ValidationErrors/ValidationError";
import { CreateProductState, initializeProductCreate, toggleInformationModalStatus, updateErrors, updateField } from "./ProductCreate.slice";
import { store } from "../../../../../state/store";
import { startPreloader, stopPreloader } from "../../../../Preloader/Preloader.slice";
import { useStoreWithInitializer } from '../../../../../state/storeHooks';
import { useRef, useState } from "react";
import SweetAlert from "react-bootstrap-sweetalert";
import { loadProducts } from "../ProductList/ProductList.slice";
import { convertBackEndErrorsToValidationErrors, formatSelectInput } from "../../../../../helpers/formats";
import * as yup from 'yup';
import { getProductCategory, getProductList, getProductMake, productCreate } from "../../../../../services/product";
import Select from 'react-select';
import { checkForPermission } from "../../../../../helpers/permissions";
import { getAssetProductCategoryNames } from "../../../../../services/assetProductCategory";

export const ProductCreate = () => {
    const { t } = useTranslation();
    const modalRef = useRef<HTMLButtonElement>(null);
    const [makeList, setMakeList] = useState<any>(null)
    const [categoryList, setCategoryList] = useState<any>(null)

    const getSelectListData = async () => {
        store.dispatch(initializeProductCreate())
        const { MakeNames } = await getProductMake()
        setMakeList(formatSelectInput(MakeNames, "Name", "Id"))
        const { AssetProductCategoryNames } = await getAssetProductCategoryNames()
        setCategoryList(formatSelectInput(AssetProductCategoryNames, "CategoryName", "Id"))
    }
   
    const {
        product, displayInformationModal, errors
    } = useStoreWithInitializer(({ productcreate }) => productcreate, getSelectListData);

    const onSelectChange = (selectedOption: any, name: string) => {
        var value = selectedOption.value
        store.dispatch(updateField({ name: name as keyof CreateProductState['product'], value }));
    }

    const onUpdateField = (ev: any) => {
        var { name, value } = ev.target;
        store.dispatch(updateField({ name: name as keyof CreateProductState['product'], value }));
    }

    const onSubmit = async () => {
        store.dispatch(updateErrors({}))
        try {
            await validationSchema.validate(product, { abortEarly: false });
        } catch (error: any) {
            const errors = error.inner.reduce((allErrors: any, currentError: any) => {
                return { ...allErrors, [currentError.path as string]: currentError.message };
            }, {});
            store.dispatch(updateErrors(errors))
            if (errors)
                return;
        }
        store.dispatch(startPreloader());
        const result = await productCreate(product)
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
            <SweetAlert success title="Success" onConfirm={updateProductList}>
                {t('product_create_success_message')}
            </SweetAlert>
        );
    }

    const updateProductList = async () => {
        store.dispatch(toggleInformationModalStatus());
        const relult = await getProductList(store.getState().productlist.search, 1);
        store.dispatch(loadProducts(relult));
        modalRef.current?.click()
    }

    const onModalClose = () => {
        store.dispatch(initializeProductCreate())
    }
    const validationSchema = yup.object().shape({
        ModelName: yup.string().required('validation_error_product_create_model_name_required').max(64, ('validation_error_product_create_model_name_max')),
        CategoryId: yup.number().required('validation_error_product_create_category_required').min(1, ('validation_error_product_create_category_required')),
        MakeId: yup.number().required('validation_error_product_create_make_required').min(1, ('validation_error_product_create_make_required')),
        ManufacturingYear: yup.number().nullable().max(9999, 'validation_error_product_create_manufacturing_year_max').min(1000, 'validation_error_product_create_manufacturing_year_min')
    });
    return (
        <>
            <div
                className="modal fade"
                id='CreateProduct'
                data-bs-backdrop='static'
                data-bs-keyboard='false'
                aria-hidden='true'
            >
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header mx-2">
                            <h5 className="modal-title">{t('product_create_title')}</h5>
                            <button
                                type='button'
                                className="btn-close"
                                data-bs-dismiss='modal'
                                id='closeCreateProductModal'
                                aria-label='Close'
                                onClick={onModalClose}
                                ref={modalRef}
                            ></button>
                        </div>
                        {checkForPermission("PRODUCTMODEL_MANAGE") &&
                            <div className="modal-body">
                                <ContainerPage>
                                    <ValidationErrorComp errors={errors} />
                                    <div className=''>
                                        <div className='row mb-1'>
                                            <div className='col-md-12'>
                                                <label className="mt-2 red-asterisk">{t('product_create_input_category')}</label>
                                                <Select
                                                    options={categoryList}
                                                    value={categoryList && categoryList.find(option => option.value == product.CategoryId) || null}
                                                    onChange={(selectedOption) => onSelectChange(selectedOption, "CategoryId")}
                                                    isSearchable
                                                    name="CategoryId"
                                                    placeholder="Select option"
                                                />
                                                <div className="small text-danger"> {t(errors['CategoryId'])}</div>
                                            </div>
                                            <div className='col-md-12'>
                                                <label className="mt-2 red-asterisk">{t('product_create_input_make')}</label>
                                                <Select
                                                    options={makeList}
                                                    onChange={(selectedOption) => onSelectChange(selectedOption, "MakeId")}
                                                    value={makeList && makeList.find(option => option.value == product.MakeId) || null}
                                                    isSearchable
                                                    name="MakeId"
                                                    placeholder="Select option"
                                                />
                                                <div className="small text-danger"> {t(errors['MakeId'])}</div>
                                            </div>
                                            <div className='col-md-12'>
                                                <label className="mt-2 red-asterisk">{t('product_create_input_model_name')}</label>
                                                <input name='ModelName' onChange={onUpdateField} type='text'
                                                    value={product.ModelName ?? ""}
                                                    className={`form-control  ${errors["ModelName"] ? "is-invalid" : ""}`}
                                                ></input>
                                                <div className="invalid-feedback"> {t(errors['ModelName'])}</div>
                                            </div>
                                            <div className='col-md-12'>
                                                <label className="mt-2">{t('product_create_input_amc_value')}</label>
                                                <input name='AmcValue' onChange={onUpdateField} type='number'
                                                    value={product.AmcValue ?? ""}
                                                    className={`form-control  ${errors["AmcValue"] ? "is-invalid" : ""}`}
                                                ></input>
                                            </div>
                                            <div className='col-md-12'>
                                                <label className="mt-2">{t('product_create_input_manufacturing_year')}</label>
                                                <input name='ManufacturingYear' onChange={onUpdateField} type='number'
                                                    value={product.ManufacturingYear ?? " "}
                                                    className={`form-control  ${errors["ManufacturingYear"] ? "is-invalid" : ""}`}
                                                ></input>
                                                 <div className="invalid-feedback"> {t(errors['ManufacturingYear'])}</div>
                                            </div>
                                            <div className="col-md-12">
                                                <label className="mt-2">{t('product_create_input_description')}</label>
                                                <textarea name='Description' onChange={onUpdateField}
                                                    value={product.Description ?? ""}
                                                    className={`form-control ${errors["Description"] ? "is-invalid" : ""}`}
                                                ></textarea>
                                                <div className="invalid-feedback"> {errors['Description']}</div>
                                            </div>
                                            <div className="col-md-12 mt-2">
                                                <button type='button' className='btn float-end app-primary-bg-color text-white mt-2' onClick={onSubmit}>
                                                    {t('product_create_button')}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </ContainerPage>
                                {displayInformationModal ? <InformationModal /> : ""}
                            </div>
                        }
                    </div>
                </div>
            </div>
        </>
    );
}   