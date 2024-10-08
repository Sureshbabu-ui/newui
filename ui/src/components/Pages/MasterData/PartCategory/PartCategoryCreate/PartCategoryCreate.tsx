import { useTranslation } from "react-i18next";
import { ContainerPage } from "../../../../ContainerPage/ContainerPage";
import { ValidationErrorComp } from "../../../../ValidationErrors/ValidationError";
import { CreatePartCategoryState, initializePartCategoryCreate, toggleInformationModalStatus, updateErrors, updateField } from "./PartCategoryCreate.slice";
import { store } from "../../../../../state/store";
import { startPreloader, stopPreloader } from "../../../../Preloader/Preloader.slice";
import { useStoreWithInitializer } from '../../../../../state/storeHooks';
import { useRef, useState } from "react";
import SweetAlert from "react-bootstrap-sweetalert";
import { loadPartCategories } from "../PartCategoryList/PartCategoryList.slice";
import { convertBackEndErrorsToValidationErrors, formatSelectInput } from "../../../../../helpers/formats";
import * as yup from 'yup';
import { getPartCategoryList, partCategoryCreate } from "../../../../../services/partCategory";
import { getProductCategory } from "../../../../../services/product";
import Select from 'react-select';
import { checkForPermission } from "../../../../../helpers/permissions";

export const PartCategoryCreate = () => {
    const { t } = useTranslation();
    const modalRef = useRef<HTMLButtonElement>(null);
    const [categoryList, setCategoryList] = useState<any>(null)
    const [selectedCategory, setSelectedCategory] = useState<any>([]);
    const [selectedValues, setSelectedValues] = useState<any>([]);

    const handleSelectChange = (selectedOption: any) => {
        setSelectedCategory(selectedOption);
    };

    const getSelectListData = async () => {
        store.dispatch(initializePartCategoryCreate())
        const { ProductCategoryNames } = await getProductCategory()
        setCategoryList(formatSelectInput(ProductCategoryNames, "CategoryName", "Id"))
    }

    const {
        partCategory, displayInformationModal, errors
    } = useStoreWithInitializer(({ partcategorycreate }) => partcategorycreate, getSelectListData);

    const onUpdateField = (ev: any) => {
        var { name, value } = ev.target
        store.dispatch(updateField({ name: name as keyof CreatePartCategoryState['partCategory'], value }));
    }

    const onSubmit = async () => {
        var partCategoryDetails = {
            ...partCategory, ProductCategoryId: [...selectedCategory.map((selectedCategory) => (selectedCategory.value))].join(","),
            PartAttribute: [...selectedValues.map((attribute) => ({ [attribute.value]: "" }))]
        }
        store.dispatch(updateErrors({}))
        try {
            await validationSchema.validate(partCategoryDetails, { abortEarly: false });
        } catch (error: any) {
            const errors = error.inner.reduce((allErrors: any, currentError: any) => {
                return { ...allErrors, [currentError.path as string]: currentError.message };
            }, {});
            store.dispatch(updateErrors(errors))
            if (errors)
                return;
        }
        store.dispatch(startPreloader());
        const result = await partCategoryCreate(partCategoryDetails)
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
            <SweetAlert success title="Success" onConfirm={updatePartCategoryList}>
                {t('part_category_create_success_message')}
            </SweetAlert>
        );
    }

    const updatePartCategoryList = async () => {
        store.dispatch(toggleInformationModalStatus());
        modalRef.current?.click()
        const result = await getPartCategoryList(store.getState().partcategorylist.search, store.getState().partcategorylist.searchWith, 1);
        store.dispatch(loadPartCategories(result));
    }

    const onModalClose = () => {
        store.dispatch(initializePartCategoryCreate())
        setSelectedCategory([])
        setSelectedValues([])
    }

    const validationSchema = yup.object().shape({
        Name: yup.string().required('validation_error_part_category_create_category_name_required').max(64, ('validation_error_part_category_create_name_max')),
        ProductCategoryId: yup.string().required('validation_error_part_category_create_product_category_required'),
    });
    return (
        <>
            <div
                className="modal fade"
                id='CreatePartCategory'
                data-bs-backdrop='static'
                data-bs-keyboard='false'
                aria-hidden='true'
            >
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header mx-2">
                            <h5 className="modal-title">{t('part_category_create_title')}</h5>
                            <button
                                type='button'
                                className="btn-close"
                                data-bs-dismiss='modal'
                                id='closeCreatePartCategoryModal'
                                aria-label='Close'
                                onClick={onModalClose}
                                ref={modalRef}
                            ></button>
                        </div>
                        {checkForPermission("PARTCATEGORY_MANAGE") &&
                            <div className="modal-body">
                                <ContainerPage>
                                    <ValidationErrorComp errors={errors} />
                                    <div className=''>
                                        <div className='row mb-1'>
                                            <div className='col-md-12'>
                                                <label className="mt-2 red-asterisk">{t('part_category_create_input_category_name')}</label>
                                                <input name='Name' onChange={onUpdateField} type='text'
                                                    value={partCategory.Name}
                                                    className={`form-control  ${errors["Name"] ? "is-invalid" : ""}`}
                                                ></input>
                                                <div className="invalid-feedback"> {t(errors['Name'])}</div>
                                            </div>
                                            <div className='col-md-12'>
                                                <label className="mt-2 red-asterisk">{t('part_category_create_input_product_category')}</label>
                                                <Select
                                                    options={categoryList}
                                                    isMulti={true}
                                                    onChange={handleSelectChange}
                                                    isSearchable={true}
                                                    value={selectedCategory}
                                                    name="ProductCategoryId"
                                                    placeholder="Select option"
                                                />
                                                <div className="small text-danger"> {t(errors['ProductCategoryId'])}</div>
                                            </div>
                                            <div className="col-md-12 mt-2">
                                                <button type='button' className='btn float-end app-primary-bg-color text-white mt-2' onClick={onSubmit}>
                                                    {t('part_category_create_button')}
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