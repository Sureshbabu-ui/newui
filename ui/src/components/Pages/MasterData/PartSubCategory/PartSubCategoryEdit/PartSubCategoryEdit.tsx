import { useTranslation } from "react-i18next";
import { ContainerPage } from "../../../../ContainerPage/ContainerPage";
import { ValidationErrorComp } from "../../../../ValidationErrors/ValidationError";
import { EditPartSubCategoryState, initializePartSubCategoryEdit, toggleInformationModalStatus, updateErrors, updateField } from "./PartSubCategoryEdit.slice";
import { store } from "../../../../../state/store";
import { startPreloader, stopPreloader } from "../../../../Preloader/Preloader.slice";
import { useStore } from '../../../../../state/storeHooks';
import { useEffect, useRef } from "react";
import SweetAlert from "react-bootstrap-sweetalert";
import { convertBackEndErrorsToValidationErrors } from "../../../../../helpers/formats";
import * as yup from 'yup';
import { checkForPermission } from "../../../../../helpers/permissions";
import { getPartSubCategoryList, partSubCategoryEdit } from "../../../../../services/partSubCategory";
import { initializePartSubCategoryList, loadPartSubCategories } from "../PartSubCategoryList/PartSubCategoryList.slice";

export const PartSubCategoryEdit = () => {
    const { t } = useTranslation();
    const modalRef = useRef<HTMLButtonElement>(null);
    const {
        partsubcategoryedit: { partSubCategory, displayInformationModal, errors },
    } = useStore(({ partsubcategoryedit }) => ({ partsubcategoryedit }));

    useEffect(() => {
        store.dispatch(initializePartSubCategoryEdit())
    }, [])

    const onUpdateField = (ev: any) => {
        var name = ev.target.name;
        var value = ev.target.value;
        if (name == "IsActive") {
            value = ev.target.checked ? true : false;
        }
        store.dispatch(updateField({ name: name as keyof EditPartSubCategoryState['partSubCategory'], value }));
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
            if (errors)
                return;
        }
        store.dispatch(startPreloader());
        const result = await partSubCategoryEdit(partSubCategory)
        result.match({
            ok: ({ IsPartSubCategoryUpdated }) => {
                store.dispatch(toggleInformationModalStatus())
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
            <SweetAlert success title="Success" onConfirm={updatePartSubCategory}>
                {t('partsubcategory_edit_success_message')}
            </SweetAlert>
        );
    }

    const updatePartSubCategory = async () => {
        store.dispatch(toggleInformationModalStatus());
        try {
            const partSubCategory = await getPartSubCategoryList(store.getState().partsubcategorylist.search, 1);
            store.dispatch(loadPartSubCategories(partSubCategory));
        } catch (error) {
            console.error(error);
        }
        modalRef.current?.click()
    }

    const onModalClose = () => {
        store.dispatch(initializePartSubCategoryEdit())
    }
    const validationSchema = yup.object().shape({
        Name: yup.string().required(t('validation_error_partsubcategory_edit_name_required') ?? '').max(64, t('validation_error_partsubcategory_edit_name_max') ?? ''),
    });
    return (
        <>
            <div
                className="modal fade"
                id='EditPartSubCategory'
                data-bs-backdrop='static'
                data-bs-keyboard='false'
                aria-hidden='true'
            >
                <div className="modal-dialog ">
                    <div className="modal-content">
                        <div className="modal-header mx-2">
                            <h5 className="modal-title">{t('partsubcategory_edit_title')}</h5>
                            <button
                                type='button'
                                className="btn-close"
                                data-bs-dismiss='modal'
                                id='closeEditPartSubCategoryModal'
                                aria-label='Close'
                                onClick={onModalClose}
                                ref={modalRef}
                            ></button>
                        </div>
                        {checkForPermission("PARTSUBCATEGORY_MANAGE") &&
                            <div className="modal-body">
                                <ContainerPage>
                                    <ValidationErrorComp errors={errors} />
                                    <div className=''>
                                        <div className='row mb-1'>
                                            <div className='col-md-12'>
                                                <label className="mt-2 red-asterisk">{t('partsubcategory_edit_input_name')}</label>
                                                <input name='Name' onChange={onUpdateField} type='text'
                                                    value={partSubCategory.Name}
                                                    className={`form-control  ${errors["Name"] ? "is-invalid" : ""}`}
                                                ></input>
                                                <div className="invalid-feedback"> {errors['Name']}</div>
                                            </div>
                                            <div className="col-md-12">
                                                <div className="mt-2 form-check form-switch">
                                                    <label className="form-check-label" htmlFor="flexSwitchCheckDefault">
                                                        {t('partsubcategory_edit_label_status')}
                                                        <input
                                                            className="form-check-input switch-input-lg"
                                                            type="checkbox"
                                                            name="IsActive"
                                                            id="flexSwitchCheckDefault"
                                                            checked={partSubCategory.IsActive.valueOf()}
                                                            value={partSubCategory.IsActive.toString()}
                                                            onChange={onUpdateField}
                                                        />
                                                    </label>
                                                    <div className="form-text">
                                                        {t('partsubcategory_edit_label_status_help_text')}
                                                    </div>
                                                </div>
                                            </div>
                                                <div className="col-md-12 mt-4 ">
                                                    <button type='button' className='btn  app-primary-bg-color text-white mt-2 float-end' onClick={onSubmit}>
                                                        {t('partsubcategory_edit_button')}
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