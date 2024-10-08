import { useTranslation } from "react-i18next";
import { ContainerPage } from "../../../../../ContainerPage/ContainerPage";
import { ValidationErrorComp } from "../../../../../ValidationErrors/ValidationError";
import { CreatePartStockState, initializePartStockCreate, loadPartSelectDetails, toggleInformationModalStatus, updateErrors, updateField } from "./PartStockCreate.slice";
import { store } from "../../../../../../state/store";
import { startPreloader, stopPreloader } from "../../../../../Preloader/Preloader.slice";
import { useStoreWithInitializer } from '../../../../../../state/storeHooks';
import { useEffect, useRef } from "react";
import SweetAlert from "react-bootstrap-sweetalert";
import { loadPartStocks } from "../PartStockList/PartStockList.slice";
import { convertBackEndErrorsToValidationErrors, formatSelectInput } from "../../../../../../helpers/formats";
import * as yup from 'yup';
import { getPartStockList, partStockCreate } from "../../../../../../services/partStock";
import { checkForPermission } from "../../../../../../helpers/permissions";
import { getProductCategory } from "../../../../../../services/product";
import Select from 'react-select' 
import { getProductPartsCategory } from "../../../../../../services/partCategory";
import { getPartNames } from "../../../../../../services/part";

export const PartStockCreate = () => {
    const { t } = useTranslation();
    const modalRef = useRef<HTMLButtonElement>(null);

    const onLoad=async()=>{
        const { ProductCategoryNames } = await getProductCategory()
        const ProductCategorys = await (formatSelectInput(ProductCategoryNames, "CategoryName", "Id"))
        console.log(ProductCategoryNames)
        store.dispatch(loadPartSelectDetails({ name: "ProductCategory", value: { MasterData: ProductCategorys } }));
    }

    const {
        partstockcreate: { partStock,partSelectDetails, displayInformationModal, errors },
    } = useStoreWithInitializer(({ partstockcreate, app }) => ({ partstockcreate, app, }),onLoad);


    useEffect(() => {
        store.dispatch(initializePartStockCreate())
    }, [])

    useEffect(() => {
        if (partStock.ProductCategoryId != 0) {
            getFilteredPartCategory()
        }
    }, [partStock.ProductCategoryId])

    const getFilteredPartCategory = async () => {
        const { PartProductCategoryDetails } = await getProductPartsCategory(String(partStock.ProductCategoryId))
        const PartCategoryName = await (formatSelectInput(PartProductCategoryDetails, "Name", "Id"))
        store.dispatch(loadPartSelectDetails({ name: "PartCategory", value: { MasterData: PartCategoryName } }));
    } 

    useEffect(() => {
        if (partStock.PartCategoryId != 0) {
            getFilteredParts()
        }
    }, [partStock.PartCategoryId])

    const getFilteredParts = async () => {
        const { PartsNames } = await getPartNames(String(partStock.PartCategoryId))
        const PartsName = await (formatSelectInput(PartsNames, "PartName", "Id"))
        store.dispatch(loadPartSelectDetails({ name: "Part", value: { MasterData: PartsName } }));
    } 

    const onSelectChange = (selectedOption: any, Name: any) => {
        var value = selectedOption.value
        var name = Name
        store.dispatch(updateField({ name: name as keyof CreatePartStockState['partStock'], value }));
    } 

    const onUpdateField = (ev: any) => {
        var { name, value } = ev.target
        store.dispatch(updateField({ name: name as keyof CreatePartStockState['partStock'], value }));
    }  

    const onSubmit = async () => {
        store.dispatch(updateErrors({}))
        try {
            await validationSchema.validate(partStock, { abortEarly: false });
        } catch (error: any) {
            const errors = error.inner.reduce((allErrors: any, currentError: any) => {
                return { ...allErrors, [currentError.path as string]: currentError.message };
            }, {});
            store.dispatch(updateErrors(errors))
            if (errors)
                return;
        }
        store.dispatch(startPreloader());
        const result = await partStockCreate(partStock)
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
            <SweetAlert success title="Success" onConfirm={updatePartStockList}>
                {t('partstockcreate_success_message')}
            </SweetAlert>
        );
    }

    const updatePartStockList = async () => {
        store.dispatch(toggleInformationModalStatus());
        const relult = await getPartStockList(store.getState().partstocklist.search, 1);
        store.dispatch(loadPartStocks(relult));
        modalRef.current?.click()
    }

    const onModalClose = () => {
        store.dispatch(initializePartStockCreate())
    }
    const validationSchema = yup.object().shape({
        ProductCategoryId: yup.number().typeError('validation_error_partstockcreate_product_category'),
        PartCategoryId: yup.number().typeError('validation_error_partstockcreate_part_category'),
        PartId: yup.number().typeError('validation_error_partstockcreate_part_id'),
    });
    return (
        <>
            <div
                className="modal fade"
                id='CreatePartStock'
                data-bs-backdrop='static'
                data-bs-keyboard='false'
                aria-hidden='true'
            >
                <div className="modal-dialog modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header mx-2">
                            <h5 className="modal-title">{t('partstock_create_title')}</h5>
                            <button
                                type='button'
                                className="btn-close"
                                data-bs-dismiss='modal'
                                id='closeCreatePartStockModal'
                                aria-label='Close'
                                onClick={onModalClose}
                                ref={modalRef}
                            ></button>
                        </div>
                        {checkForPermission("APP_MANAGE") &&
                        <div className="modal-body">
                            <ContainerPage>
                                <ValidationErrorComp errors={errors} />
                                <div className=''>
                                    <div className='row mb-1'>
                                    <div className="col-md-12">
                                            <label className="mt-2 red-asterisk">{t('partstockcreate_label_product_category')}</label>
                                            <Select
                                                options={partSelectDetails.ProductCategory}
                                               value={partSelectDetails.ProductCategory && partSelectDetails.ProductCategory.find(option => option.value == partStock.ProductCategoryId) || null}
                                                 onChange={(selectedOption) => onSelectChange(selectedOption, "ProductCategoryId")}
                                                isSearchable
                                                name="ProductCategoryId"
                                                placeholder="Select option"
                                            /> 
                                            <div className="small text-danger"> {t(errors['ProductCategoryId'])}</div>
                                        </div>
                                        <div className="col-md-12">
                                            <label className="mt-2 red-asterisk">{t('partstockcreate_label_part_category')}</label>
                                            <Select
                                                options={partSelectDetails.PartCategory}
                                               value={partSelectDetails.PartCategory && partSelectDetails.PartCategory.find(option => option.value == partStock.PartCategoryId) || null}
                                                 onChange={(selectedOption) => onSelectChange(selectedOption, "PartCategoryId")}
                                                isSearchable
                                                name="PartCategoryId"
                                                placeholder="Select option"
                                            /> 
                                            <div className="small text-danger"> {t(errors['PartCategoryId'])}</div>
                                        </div>
                                        <div className="col-md-12">
                                            <label className="mt-2 red-asterisk">{t('partstockcreate_label_part')}</label>
                                            <Select
                                                options={partSelectDetails.Part}
                                               value={partSelectDetails.Part && partSelectDetails.Part.find(option => option.value == partStock.PartId) || null}
                                                 onChange={(selectedOption) => onSelectChange(selectedOption, "PartId")}
                                                isSearchable
                                                name="PartId" 
                                                placeholder="Select option"
                                            /> 
                                            <div className="small text-danger"> {t(errors['PartId'])}</div>
                                        </div>
                                        <div className='col-md-12'>
                                            <label className="mt-2 red-asterisk">{t('partstockcreate_input_quantity')}</label>
                                            <input name='Quantity'
                                                value={partStock.Quantity??''}
                                                className={`form-control  ${errors["Quantity"] ? "is-invalid" : ""}`}
                                                onChange={onUpdateField} type='text' ></input>
                                            <div className="invalid-feedback"> {t(errors['Quantity'])}</div>
                                        </div>
                                      

                                        <div className="col-md-12 mt-2">
                                            <button type='button' className='btn float-end app-primary-bg-color text-white mt-2' onClick={onSubmit}>
                                                {t('partstockcreate_button')}
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