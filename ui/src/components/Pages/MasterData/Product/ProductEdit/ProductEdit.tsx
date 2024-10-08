import { useTranslation } from "react-i18next";
import { ContainerPage } from "../../../../ContainerPage/ContainerPage";
import { ValidationErrorComp } from "../../../../ValidationErrors/ValidationError";
import { store } from "../../../../../state/store";
import SweetAlert from "react-bootstrap-sweetalert";
import * as yup from 'yup';
import { convertBackEndErrorsToValidationErrors, formatSelectInput, formatSelectInputWithThreeArg } from "../../../../../helpers/formats";
import { useStoreWithInitializer } from "../../../../../state/storeHooks";
import { startPreloader, stopPreloader } from "../../../../Preloader/Preloader.slice";
import { getTenantOfficeName } from "../../../../../services/tenantOfficeInfo";
import Select from 'react-select';
import { useRef, useState } from "react";
import { editProduct, getProductCategory, getProductList, getProductMake } from "../../../../../services/product";
import { UpdateProductState, initializeProductUpdate, loadTenantOffices, toggleInformationModalStatus, updateErrors, updateField } from "./ProdutEdit.slice";
import { loadProducts } from "../ProductList/ProductList.slice";
import { getAssetProductCategoryNames } from "../../../../../services/assetProductCategory";

export const ProductEdit = () => {
    const { t } = useTranslation();
    const modalRef = useRef<HTMLButtonElement>(null);
    const [makeList, setMakeList] = useState<any>(null)
    const [categoryList, setCategoryList] = useState<any>(null)

    const getSelectListData = async () => {
        store.dispatch(initializeProductUpdate())
        const { MakeNames } = await getProductMake()
        setMakeList(formatSelectInput(MakeNames, "Name", "Id"))
        const { AssetProductCategoryNames } = await getAssetProductCategoryNames()
        setCategoryList(formatSelectInput(AssetProductCategoryNames, "CategoryName", "Id"))
    }
 
    const {
        product, displayInformationModal, errors
    } = useStoreWithInitializer(({ productupdate }) => productupdate, getSelectListData);

    const onSelectChange = (selectedOption: any, actionMeta: any) => {
        const name = actionMeta.name;
        const value = selectedOption.value;
        store.dispatch(updateField({ name: name as keyof UpdateProductState['product'], value }));
    }

    const onUpdateField = (ev: any) => {
        var { name, value } = ev.target
        store.dispatch(updateField({ name: name as keyof UpdateProductState['product'], value }));
    }
    const validationSchema = yup.object().shape({
        ModelName: yup.string().required('validation_error_product_update_model_name_required').max(64, ('validation_error_product_update_model_name_max')),
        AssetProductCategoryId: yup.number().required('validation_error_product_update_category_required').min(1,('validation_error_product_update_category_required')),
        MakeId: yup.number().required('validation_error_product_update_make_required').min(1, ('validation_error_product_update_make_required')),
        ManufacturingYear: yup.number()
        .nullable()
        .max(9999, 'validation_error_product_create_manufacturing_year_max')
        .min(1000, 'validation_error_product_create_manufacturing_year_min')
    });

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
        const result = await editProduct(product)
        result.match({
            ok: () => {
                store.dispatch(toggleInformationModalStatus());
            },
            err: (e) => {
                const formattedErrors = convertBackEndErrorsToValidationErrors(e)
                store.dispatch(updateErrors(formattedErrors))
            },
        });
        store.dispatch(stopPreloader());
    }

    const InformationModal = () => {
        const { t } = useTranslation();
        return (
            <SweetAlert success title="Success" onConfirm={updateProductList}>
                {t('product_update_success_message')}
            </SweetAlert>
        );
    }

    const updateProductList = async () => {
        store.dispatch(toggleInformationModalStatus());
        const result = await getProductList(store.getState().productlist.search, 1);
        store.dispatch(loadProducts(result));
        modalRef.current?.click()
    }

    const onModalClose = () => {
        store.dispatch(initializeProductUpdate())
        GetMasterDataItems()
    }

    async function GetMasterDataItems() {
        store.dispatch(initializeProductUpdate);
        try {
            const TenantLocations = await getTenantOfficeName();
            const TenantLocation = await formatSelectInputWithThreeArg(TenantLocations.TenantOfficeName, "OfficeName", "Address", "Id")
            store.dispatch(loadTenantOffices({ Select: TenantLocation }));
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <>
            <div
                className="modal fade"
                id='EditProduct'
                data-bs-backdrop='static'
                data-bs-keyboard='false'
                aria-hidden='true'
            >
                <div className="modal-dialog ">
                    <div className="modal-content">
                        <div className="modal-header mx-3">
                            <h5 className="modal-title app-primary-color">{t('product_update_title')}</h5>
                            <button
                                type='button'
                                className="btn-close"
                                data-bs-dismiss='modal'
                                id='closeEditProduct'
                                onClick={onModalClose}
                                aria-label='Close'
                                ref={modalRef}
                            ></button>
                        </div>
                        <div className="modal-body">
                            <ContainerPage>
                                <ValidationErrorComp errors={errors} />
                                <div className=''>
                                    <div className='row mb-1'>
                                    <div className='col-md-12'>
                                            <label className="mt-2 red-asterisk">{t('product_update_input_category')}</label>
                                            <Select
                                                options={categoryList}
                                                value={categoryList && categoryList.find(option => option.value == product.AssetProductCategoryId) || null}
                                                onChange={onSelectChange}
                                                isSearchable
                                                isDisabled
                                                name="AssetProductCategoryId"
                                                placeholder="Select option"
                                            />
                                            <div className="small text-danger"> {t(errors['AssetProductCategoryId'])}</div>
                                        </div>
                                        <div className='col-md-12'>
                                            <label className="mt-2 red-asterisk">{t('product_update_input_make')}</label>
                                            <Select
                                                options={makeList}
                                                value={makeList && makeList.find(option => option.value == product.MakeId) || null}
                                                onChange={onSelectChange}
                                                isSearchable
                                                isDisabled
                                                name="MakeId"
                                                placeholder="Select option"
                                            />
                                            <div className="small text-danger"> {t(errors['MakeId'])}</div>
                                        </div>
                                        <div className='col-md-12'>
                                            <label className="mt-2 red-asterisk">{t('product_update_input_model_name')}</label>
                                            <input name='ModelName' onChange={onUpdateField} type='text'
                                                value={product.ModelName} disabled
                                                className={`form-control  ${errors["ModelName"] ? "is-invalid" : ""}`}
                                            ></input>
                                            <div className="invalid-feedback"> {t(errors['ModelName'])}</div>
                                        </div>
                                        <div className='col-md-12'>
                                            <label className="mt-2">{t('product_update_input_amc_value')}</label>
                                            <input name='AmcValue' onChange={onUpdateField} type='number'
                                                value={product.AmcValue!}
                                                className={`form-control  ${errors["AmcValue"] ? "is-invalid" : ""}`}
                                            ></input>
                                        </div>
                                        <div className='col-md-12'>
                                            <label className="mt-2">{t('product_update_input_manufacturing_year')}</label>
                                            <input name='ManufacturingYear' onChange={onUpdateField} type='number'
                                                value={product.ManufacturingYear!}
                                                className={`form-control  ${errors["ManufacturingYear"] ? "is-invalid" : ""}`}
                                            ></input>
                                             <div className="small text-danger"> {t(errors['ManufacturingYear'])}</div>
                                        </div>
                                        <div className="col-md-12">
                                            <label className="mt-2">{t('product_update_input_description')}</label>
                                            <textarea name='Description' onChange={onUpdateField}
                                                value={product.Description? product.Description: "" }
                                                className="form-control"
                                            ></textarea>
                                        </div>
                                        <div className="col-md-12 mt-2">
                                            <button type='button' className='btn float-end app-primary-bg-color text-white mt-2' onClick={onSubmit}>
                                                {t('product_update_button')}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </ContainerPage>
                            {displayInformationModal ? <InformationModal /> : ""}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
} 