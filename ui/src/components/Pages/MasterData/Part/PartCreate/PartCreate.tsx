import { useTranslation } from "react-i18next";
import { ContainerPage } from "../../../../ContainerPage/ContainerPage";
import { ValidationErrorComp } from "../../../../ValidationErrors/ValidationError";
import { CreatePartState, initializePartCreate, toggleInformationModalStatus, updateErrors, updateField } from "./PartCreate.slice";
import { store } from "../../../../../state/store";
import { startPreloader, stopPreloader } from "../../../../Preloader/Preloader.slice";
import { useStoreWithInitializer } from '../../../../../state/storeHooks';
import { useRef, useState, useEffect } from "react";
import SweetAlert from "react-bootstrap-sweetalert";
import { loadParts } from "../PartList/PartList.slice";
import { convertBackEndErrorsToValidationErrors, formatPartCategorySelectInput, formatSelectInput } from "../../../../../helpers/formats";
import * as yup from 'yup';
import { getPartList, partCreate, getPartMake } from "../../../../../services/part";
import Select from 'react-select';
import { checkForPermission } from "../../../../../helpers/permissions";
import { getProductCategory } from "../../../../../services/product";
import { getProductPartsCategory } from "../../../../../services/partCategory";
import { getPartSubCategoryNames } from "../../../../../services/partSubCategory";
import { PartCategoryList } from "../../PartCategory/PartCategoryList/PartCategoryList";

export const PartCreate = () => {
    const { t } = useTranslation();
    const modalRef = useRef<HTMLButtonElement>(null);
    const [partCategoryList, setPartCategoryList] = useState<any>(null)
    const [partMakeList, setPartMakeList] = useState<any>([]);
    const [productCategoryList, setProductCategoryList] = useState<any>([]);
    const [PartSubCategoryList, setPartSubCategoryList] = useState<any>([]);

    const getSelectListData = async () => {
        store.dispatch(initializePartCreate())

        const { MakeNames } = await getPartMake()
        setPartMakeList(formatSelectInput(MakeNames, "Name", "Id"))

        const { ProductCategoryNames } = await getProductCategory()
        setProductCategoryList(formatSelectInput(ProductCategoryNames, "CategoryName", "Id"))
    }

    const {
        part, displayInformationModal, errors
    } = useStoreWithInitializer(({ partcreate }) => partcreate, getSelectListData);

    useEffect(() => {
        if (part.ProductCategoryId != 0) {
            getFilteredPartCategory()
        }
    }, [part.ProductCategoryId])

    const getFilteredPartCategory = async () => {
        const { PartProductCategoryDetails } = await getProductPartsCategory(part.ProductCategoryId)
        setPartCategoryList(formatPartCategorySelectInput(PartProductCategoryDetails))
    }

    useEffect(() => {
        if (Number(part.PartCategoryId) > 0) {
            getFilteredPartSubCategory()
        }
    }, [part.PartCategoryId])

    const getFilteredPartSubCategory = async () => {
        const { PartSubCategoryDetails } = await getPartSubCategoryNames(partCategoryList.find(item => item.value == part.PartCategoryId).PartProductCategoryToPartCategoryMappingId)
        setPartSubCategoryList(formatSelectInput(PartSubCategoryDetails, "Name", "Id"))
    }

    const onSelectChange = async (selectedOption: any, name: string) => {
        var value = selectedOption.value
        store.dispatch(updateField({ name: name as keyof CreatePartState['part'], value }));
    }

    const onUpdateField = (ev: any) => {
        var { name, value } = ev.target
        store.dispatch(updateField({ name: name as keyof CreatePartState['part'], value }));
    }

    const onSubmit = async () => {
        store.dispatch(updateErrors({}))
        try {
            await validationSchema.validate(part, { abortEarly: false });
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
        const result = await partCreate(part)
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
                {t('part_create_success_message')}
            </SweetAlert>
        );
    }

    const updatePartList = async () => {
        store.dispatch(toggleInformationModalStatus());
        modalRef.current?.click()
        const result = await getPartList(store.getState().partlist.search, store.getState().partlist.searchWith, 1);
        store.dispatch(loadParts(result));
    }

    const onModalClose = () => {
        store.dispatch(initializePartCreate())
    }

    const validationSchema = yup.object().shape({
        ProductCategoryId: yup.number().required('validation_error_part_create_product_category_required').min(1, ('validation_error_part_create_product_category_required')),
        PartName: yup.string().required('validation_error_part_create_name_required').max(64, ('validation_error_part_create_Name_max')),
        PartCategoryId: yup.number().required('validation_error_part_create_part_category_required').min(1, ('validation_error_part_create_part_category_required')),
        MakeId: yup.number().required('validation_error_part_create_make_required').min(1, ('validation_error_part_create_make_required')),
        HsnCode: yup.string().required('validation_error_part_create_hsn_code_required'),
        OemPartNumber: yup.string().required('validation_error_part_create_oem_part_number_required')
    });
    return (
        <>
            <div
                className="modal fade"
                id='CreatePart'
                data-bs-backdrop='static'
                data-bs-keyboard='false'
                aria-hidden='true'
            >
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header mx-2">
                            <h5 className="modal-title">{t('part_create_title')}</h5>
                            <button
                                type='button'
                                className="btn-close"
                                data-bs-dismiss='modal'
                                id='closeCreatePartModal'
                                aria-label='Close'
                                onClick={onModalClose}
                                ref={modalRef}
                            ></button>
                        </div>
                        {checkForPermission("PART_MANAGE") && <>
                            <div className="modal-body">
                                <ContainerPage>
                                    <ValidationErrorComp errors={errors} />
                                    <div className=''>
                                        <div className='row mb-1'>
                                            <div className='col-md-12'>
                                                <label className="mt-2 red-asterisk">{t('part_create_input_product_category')}</label>
                                                <Select
                                                    options={productCategoryList}
                                                    value={productCategoryList && productCategoryList.find(option => option.value == part.ProductCategoryId) || null}
                                                    onChange={(selectedOption) => onSelectChange(selectedOption, "ProductCategoryId")}
                                                    isSearchable
                                                    name="ProductCategoryId"
                                                    placeholder={t('partcreate_productcategory_select')}
                                                />
                                                <div className="small text-danger"> {t(errors['ProductCategoryId'])}</div>
                                            </div>
                                            <div className='col-md-12'>
                                                <label className="mt-2 red-asterisk">{t('part_create_input_part_category')}</label>
                                                <Select
                                                    options={partCategoryList}
                                                    value={partCategoryList && partCategoryList.find(option => option.value == part.PartCategoryId) || null}
                                                    onChange={(selectedOption) => onSelectChange(selectedOption, "PartCategoryId")}
                                                    isSearchable
                                                    name="PartCategoryId"
                                                    placeholder={t('partcreate_partcategory_select')}
                                                />
                                                <div className="small text-danger"> {t(errors['PartCategoryId'])}</div>
                                            </div>
                                            <div className='col-md-12'>
                                                <label className="mt-2">{t('part_create_input_partsubcategory')}</label>
                                                <Select
                                                    options={PartSubCategoryList}
                                                    value={PartSubCategoryList && PartSubCategoryList.find(option => option.value == part.PartSubCategoryId) || null}
                                                    onChange={(selectedOption) => onSelectChange(selectedOption, "PartSubCategoryId")}
                                                    isSearchable
                                                    name="PartSubCategoryId"
                                                    placeholder={t('partcreate_subcategory_select')}
                                                />
                                            </div>
                                            <div className='col-md-12'>
                                                <label className="mt-2 red-asterisk">{t('part_create_input_part_make')}</label>
                                                <Select
                                                    options={partMakeList}
                                                    value={partMakeList && partMakeList.find(option => option.value == part.MakeId) || null}
                                                    onChange={(selectedOption) => onSelectChange(selectedOption, "MakeId")}
                                                    isSearchable
                                                    name="MakeId"
                                                    placeholder={t('partcreate_make_select')}
                                                />
                                                <div className="small text-danger"> {t(errors['MakeId'])}</div>
                                            </div>
                                            <div className='col-md-12'>
                                                <label className="red-asterisk">{t('part_create_input_hsn_code')}</label>
                                                <input name='HsnCode'
                                                    value={part.HsnCode}
                                                    className={`form-control  ${errors["HsnCode"] ? "is-invalid" : ""}`}
                                                    onChange={onUpdateField} type='text' ></input>
                                                <div className="invalid-feedback"> {t(errors['HsnCode'])}</div>
                                            </div>
                                            <div className='col-md-12'>
                                                <label className="mt-2 red-asterisk">{t('part_create_input_oem_part_number')}</label>
                                                <input name='OemPartNumber' onChange={onUpdateField} type='text'
                                                    value={part.OemPartNumber}
                                                    className={`form-control  ${errors["OemPartNumber"] ? "is-invalid" : ""}`}
                                                ></input>
                                                <div className="invalid-feedback"> {t(errors['OemPartNumber'])}</div>
                                            </div>
                                            <div className='col-md-12'>
                                                <label className="mt-2 red-asterisk">{t('part_create_input_part_name')}</label>
                                                <input name='PartName' onChange={onUpdateField} type='text'
                                                    value={part.PartName}
                                                    className={`form-control  ${errors["PartName"] ? "is-invalid" : ""}`}
                                                ></input>
                                                <div className="invalid-feedback"> {t(errors['PartName'])}</div>
                                            </div>
                                            <div className="col-md-12 mt-2">
                                                <button type='button' className='btn float-end app-primary-bg-color text-white mt-2' onClick={onSubmit}>
                                                    {t('part_create_button')}
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