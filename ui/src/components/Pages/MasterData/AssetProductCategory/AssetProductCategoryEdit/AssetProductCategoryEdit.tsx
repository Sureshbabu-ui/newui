import { useTranslation } from "react-i18next";
import { ContainerPage } from "../../../../ContainerPage/ContainerPage";
import { ValidationErrorComp } from "../../../../ValidationErrors/ValidationError";
import { CreateAssetProductCategoryState , initializeAssetProductCategoryEdit, toggleInformationModalStatus, updateErrors, updateField } from "./AssetProductCategoryEdit.slice";
import { store } from "../../../../../state/store";
import { startPreloader, stopPreloader } from "../../../../Preloader/Preloader.slice";
import { useStore } from '../../../../../state/storeHooks';
import { useEffect, useRef, useState } from "react";
import SweetAlert from "react-bootstrap-sweetalert";
import { loadAssetProductCategories } from "../AssetProductCategoryList/AssetProductCategoryList.slice";
import { convertBackEndErrorsToValidationErrors, formatSelectInput } from "../../../../../helpers/formats";
import * as yup from 'yup';
import { getAssetProductCategoryList, assetProductCategoryCreate, getProductCategoryDetails, assetProductCategoryEdit } from "../../../../../services/assetProductCategory";
import { checkForPermission } from "../../../../../helpers/permissions";
import Select from 'react-select';
import { getProductCategory } from "../../../../../services/product";

export const AssetProductCategoryEdit = () => {
    const { t } = useTranslation();
    const modalRef = useRef<HTMLButtonElement>(null);
    const {
        assetproductcategoryedit: { productCategory, displayInformationModal, errors },
    } = useStore(({ assetproductcategoryedit, app }) => ({ assetproductcategoryedit, app }));
    const [partProductCategoryList, setPartProductCategoryList] = useState<any>([])

    useEffect(() => {
        onLoad()
    }, [])

    const onLoad = async () => {
        store.dispatch(initializeAssetProductCategoryEdit())
        const { ProductCategoryNames } = await getProductCategory()
        setPartProductCategoryList(formatSelectInput(ProductCategoryNames, "CategoryName", "Id"))
    }

    const onUpdateField = (ev: any) => {
        var { name, value } = ev.target
        store.dispatch(updateField({ name: name as keyof CreateAssetProductCategoryState ['productCategory'], value }));
    }

    const onSubmit = async () => {
        store.dispatch(updateErrors({}))
        try {
            await validationSchema.validate(productCategory, { abortEarly: false });
        } catch (error: any) {
            const errors = error.inner.reduce((allErrors: any, currentError: any) => {
                return { ...allErrors, [currentError.path as string]: currentError.message };
            }, {});
            store.dispatch(updateErrors(errors))
            if (errors)
                return;
        }
        store.dispatch(startPreloader());
        const result = await assetProductCategoryEdit(productCategory)
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
            <SweetAlert success title="Success" onConfirm={updateProductCategoryList}>
                {t('assetproduct_category_update_success_message')}
            </SweetAlert>
        );
    }

    const updateProductCategoryList = async () => {
        store.dispatch(toggleInformationModalStatus());
        const relult = await getAssetProductCategoryList(store.getState().assetproductcategorylist.search, 1);
        store.dispatch(loadAssetProductCategories(relult));
        modalRef.current?.click()
    }

    const onModalClose = () => {
        store.dispatch(initializeAssetProductCategoryEdit())
    }

    function onSelectChange(selectedOption: any, Name: any) {
        var value = selectedOption.value
        var name = Name
        store.dispatch(updateField({ name: name as keyof CreateAssetProductCategoryState ['productCategory'], value }));
    }

    const validationSchema = yup.object().shape({
        CategoryName: yup.string().required('validation_error_assetproduct_category_edit_category_name_required').max(64, ('validation_error_assetproduct_category_edit_category_name_max')),
        PartProductCategoryId: yup.number().moreThan(0, ('validation_error_assetproduct_category_edit_partproduct_category_required')),
    });
    return (
        <>
            <div
                className="modal fade"
                id='EditAssetProductCategory'
                data-bs-backdrop='static'
                data-bs-keyboard='false'
                aria-hidden='true'
            >
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header mx-2">
                            <h5 className="modal-title">{t('assetproduct_category_edit_title')}</h5>
                            <button
                                type='button'
                                className="btn-close"
                                data-bs-dismiss='modal'
                                id='closeCreateAssetProductCategoryModal'
                                aria-label='Close'
                                onClick={onModalClose}
                                ref={modalRef}
                            ></button>
                        </div>
                        {checkForPermission("ASSETPRODUCTCATEGORY_MANAGE") &&
                            <div className="modal-body">
                                <ContainerPage>
                                    <ValidationErrorComp errors={errors} />
                                    <div className=''>
                                        <div className='row mb-1'>
                                            <div className='col-md-12'>
                                                <label className="mt-2 red-asterisk">{t('assetproduct_category_edit_input_category_name')}</label>
                                                <input name='CategoryName' onChange={onUpdateField} type='text'
                                                    value={productCategory.CategoryName}
                                                    className={`form-control  ${errors["CategoryName"] ? "is-invalid" : ""}`}
                                                ></input>
                                                <div className="invalid-feedback"> {t(errors['CategoryName'])}</div>
                                            </div>
                                            <div className='col-md-12'>
                                                <label className="mt-2 red-asterisk">{t('assetproduct_category_edit_label_partproductCategory')}</label>
                                                <Select
                                                    value={partProductCategoryList && partProductCategoryList.find(option => option.value == productCategory.PartProductCategoryId) || null}
                                                    options={partProductCategoryList}
                                                    onChange={(selectedOption) => onSelectChange(selectedOption, "PartProductCategoryId")}
                                                    isSearchable
                                                    name="PartProductCategoryId"
                                                    placeholder={t('assetproduct_category_edit_placeholder_partproductCategory')}
                                                />
                                                <div className="small text-danger"> {t(errors['PartProductCategoryId'])}</div>
                                            </div>
                                            <div className='col-md-12'>
                                                <label className="mt-2">{t('assetproduct_category_edit_input_generalnotcovered')}</label>
                                                <textarea name='GeneralNotCovered' onChange={onUpdateField} 
                                                    value={productCategory.GeneralNotCovered??''}
                                                    className="form-control"
                                                ></textarea>
                                            </div>
                                            <div className='col-md-12'>
                                                <label className="mt-2">{t('assetproduct_category_edit_input_softwarenotcovered')}</label>
                                                <textarea name='SoftwareNotCovered' onChange={onUpdateField} 
                                                    value={productCategory.SoftwareNotCovered??''}
                                                    className="form-control"
                                                ></textarea>
                                            </div>
                                            <div className='col-md-12'>
                                                <label className="mt-2">{t('assetproduct_category_edit_input_hardwarenotcovered')}</label>
                                                <textarea name='HardwareNotCovered' onChange={onUpdateField} 
                                                    value={productCategory.HardwareNotCovered??''}
                                                    className="form-control"
                                                ></textarea>
                                            </div>
                                            <div className="col-md-12 mt-2">
                                                <button type='button' className='btn float-end app-primary-bg-color text-white mt-2' onClick={onSubmit}>
                                                    {t('assetproduct_category_edit_button')}
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