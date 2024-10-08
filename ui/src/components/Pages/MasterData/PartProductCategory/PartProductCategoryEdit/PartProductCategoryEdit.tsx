import { useTranslation } from "react-i18next";
import { ValidationErrorComp } from "../../../../ValidationErrors/ValidationError";
import { EditPartProductCategoryState, initializeProductCategoryEdit, toggleInformationModalStatus, updateErrors, updateField } from "./PartProductCategoryEdit.slice";
import { store } from "../../../../../state/store";
import { startPreloader, stopPreloader } from "../../../../Preloader/Preloader.slice";
import { useStore } from '../../../../../state/storeHooks';
import { useEffect, useRef } from "react";
import SweetAlert from "react-bootstrap-sweetalert";
import { loadProductCategories } from "../PartProductCategoryList/PartProductCategoryList.slice";
import { convertBackEndErrorsToValidationErrors } from "../../../../../helpers/formats";
import * as yup from 'yup';
import { getPartProductCategoryList, productCategoryEdit } from "../../../../../services/partProductCategory";
import { checkForPermission } from "../../../../../helpers/permissions";

export const PartProductCategoryEdit = () => {
    const { t } = useTranslation();
    const modalRef = useRef<HTMLButtonElement>(null);
    const {
        partproductcategoryedit: { productCategory, displayInformationModal, errors },
    } = useStore(({ partproductcategoryedit }) => ({ partproductcategoryedit }));

    useEffect(() => {
        store.dispatch(initializeProductCategoryEdit())
    }, [])

    const onUpdateField = (ev: any) => {
        var { name, value } = ev.target
        store.dispatch(updateField({ name: name as keyof EditPartProductCategoryState['productCategory'], value }));
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
        const result = await productCategoryEdit(productCategory)
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
                {t('partproduct_category_update_success_message')}
            </SweetAlert>
        );
    }

    const updateProductCategoryList = async () => {
        store.dispatch(toggleInformationModalStatus());
        const relult = await getPartProductCategoryList(store.getState().partproductcategorylist.search, 1);
        store.dispatch(loadProductCategories(relult));
        modalRef.current?.click()
    }

    const onModalClose = () => {
        store.dispatch(initializeProductCategoryEdit())
    }

    const validationSchema = yup.object().shape({
        CategoryName: yup.string().required('validation_error_partproduct_category_update_category_name_required').max(64, ('validation_error_partproduct_category_create_category_name_max')),
    });
    return (
        <>
            <div
                className="modal fade"
                id='EditPartProductCategory'
                data-bs-backdrop='static'
                data-bs-keyboard='false'
                aria-hidden='true'
            >
                <div className="modal-dialog modal-md">
                    <div className="modal-content">
                        <div className="modal-header mx-2">
                            <h5 className="modal-title">{t('partproduct_category_update_title')}</h5>
                            <button
                                type='button'
                                className="btn-close"
                                data-bs-dismiss='modal'
                                id='closeEditPartProductCategoryModal'
                                aria-label='Close'
                                onClick={onModalClose}
                                ref={modalRef}
                            ></button>
                        </div>
                        {checkForPermission("PARTPRODUCTCATEGORY_MANAGE") &&
                            <div className="modal-body">
                                <div className="container-fluid">
                                    <ValidationErrorComp errors={errors} />
                                    <div className=''>
                                        <div className='row mb-1'>
                                            <div className='col-md-12'>
                                                <label className="mt-2 red-asterisk">{t('partproduct_category_update_input_category_name')}</label>
                                                <input name='CategoryName' onChange={onUpdateField} type='text'
                                                    value={productCategory.CategoryName}
                                                    className={`form-control  ${errors["CategoryName"] ? "is-invalid" : ""}`}
                                                ></input>
                                                <div className="invalid-feedback"> {t(errors['CategoryName'])}</div>
                                            </div>
                                            <div className="col-md-12 mt-2">
                                                <button type='button' className='btn float-end app-primary-bg-color text-white mt-2' onClick={onSubmit}>
                                                    {t('partproduct_category_update_button')}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {displayInformationModal ? <InformationModal /> : ""}
                            </div>
                        }

                    </div>
                </div>
            </div>
        </>
    );
}