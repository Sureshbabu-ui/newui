import { useTranslation } from "react-i18next";
import { ContainerPage } from "../../../../ContainerPage/ContainerPage";
import { ValidationErrorComp } from "../../../../ValidationErrors/ValidationError";
import { EditPartState, initializePartEdit, toggleInformationModalStatus, updateErrors, updateField } from "./PartEdit.slice";
import { store } from "../../../../../state/store";
import { startPreloader, stopPreloader } from "../../../../Preloader/Preloader.slice";
import { useStoreWithInitializer } from '../../../../../state/storeHooks';
import { useRef, useState, useEffect } from "react";
import SweetAlert from "react-bootstrap-sweetalert";
import { loadParts } from "../PartList/PartList.slice";
import { convertBackEndErrorsToValidationErrors, formatPartCategorySelectInput, formatSelectInput } from "../../../../../helpers/formats";
import * as yup from 'yup';
import { getPartList, partEdit, getPartMake } from "../../../../../services/part";
import Select from 'react-select';
import { checkForPermission } from "../../../../../helpers/permissions";
import { getProductCategory } from "../../../../../services/product";
import { getProductPartsCategory } from "../../../../../services/partCategory";
import { getPartSubCategoryNames } from "../../../../../services/partSubCategory";

export const PartEdit = () => {
    const { t } = useTranslation();
    const modalRef = useRef<HTMLButtonElement>(null);
    const [partCategoryList, setPartCategoryList] = useState<any>(null)
    const [partMakeList, setPartMakeList] = useState<any>([]);
    const [productCategoryList, setProductCategoryList] = useState<any>([]);
    const [PartSubCategoryList, setPartSubCategoryList] = useState<any>([]);

    const getSelectListData = async () => {
        store.dispatch(initializePartEdit())

        const { MakeNames } = await getPartMake()
        setPartMakeList(formatSelectInput(MakeNames, "Name", "Id"))

        const { ProductCategoryNames } = await getProductCategory()
        setProductCategoryList(formatSelectInput(ProductCategoryNames, "CategoryName", "Id"))
    }

    const {
        part, displayInformationModal, errors
    } = useStoreWithInitializer(({ partedit }) => partedit, getSelectListData);

    useEffect(() => {
        if (part.PartProductCategoryId != 0) {
            getFilteredPartCategory()
        }
    }, [part.PartProductCategoryId])

    const getFilteredPartCategory = async () => {
        const { PartProductCategoryDetails } = await getProductPartsCategory(part.PartProductCategoryId)
        setPartCategoryList(formatPartCategorySelectInput(PartProductCategoryDetails))
    }

    useEffect(() => {
        if (part.PartCategoryId > 0 && partCategoryList != null) {
            getFilteredPartSubCategory()
        }
    }, [part.PartCategoryId, partCategoryList])

    const getFilteredPartSubCategory = async () => {
        const { PartSubCategoryDetails } = await getPartSubCategoryNames(partCategoryList.find(item => item.value == part.PartCategoryId).PartProductCategoryToPartCategoryMappingId)
        setPartSubCategoryList(formatSelectInput(PartSubCategoryDetails, "Name", "Id"))
    }

    const onSelectChange = async (selectedOption: any, name: string) => {
        var value = selectedOption.value
        store.dispatch(updateField({ name: name as keyof EditPartState['part'], value }));
    }

    const onUpdateField = (ev: any) => {
        var { name, value } = ev.target
        store.dispatch(updateField({ name: name as keyof EditPartState['part'], value }));
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
                return;
            }
        }
        store.dispatch(startPreloader());
        const result = await partEdit(part)
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
                {t('part_edit_success_message')}
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
        store.dispatch(initializePartEdit())
    }

    const validationSchema = yup.object().shape({
        PartName: yup.string().required('validation_error_part_edit_name_required').max(64, ('validation_error_part_edit_Name_max')),
        HsnCode: yup.string().required('validation_error_part_edit_hsn_code_required')
    });
    return (
        <>
            <div
                className="modal fade"
                id='EditPart'
                data-bs-backdrop='static'
                data-bs-keyboard='false'
                aria-hidden='true'
            >
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header mx-2">
                            <h5 className="modal-title">{t('part_edit_title')}</h5>
                            <button
                                type='button'
                                className="btn-close"
                                data-bs-dismiss='modal'
                                id='closeEditPartModal'
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
                                        <div className='row'>
                                            <div className='col-md-6'>
                                                <label className="red-asterisk">{t('part_edit_input_part_name')}</label>
                                                <input name='PartName' onChange={onUpdateField} type='text'
                                                    value={part.PartName}
                                                    className={`form-control  ${errors["PartName"] ? "is-invalid" : ""}`}
                                                ></input>
                                                <div className="invalid-feedback"> {t(errors['PartName'])}</div>
                                            </div>
                                            <div className='col-md-6'>
                                                <label className="red-asterisk">{t('part_edit_input_hsn_code')}</label>
                                                <input name='HsnCode'
                                                    value={part.HsnCode}
                                                    className={`form-control  ${errors["HsnCode"] ? "is-invalid" : ""}`}
                                                    onChange={onUpdateField} type='text' ></input>
                                                <div className="invalid-feedback"> {t(errors['HsnCode'])}</div>
                                            </div>
                                            <div className='col-md-6'>
                                                <label className="mt-2 red-asterisk">{t('part_edit_input_product_category')}</label>
                                                <Select
                                                    options={productCategoryList}
                                                    value={productCategoryList && productCategoryList.find(option => option.value == part.PartProductCategoryId) || null}
                                                    onChange={(selectedOption) => onSelectChange(selectedOption, "PartProductCategoryId")}
                                                    isSearchable
                                                    isDisabled
                                                    name="PartProductCategoryId"
                                                    placeholder={t('part_edit_productcategory_select')}
                                                />
                                                <div className="small text-danger"> {t(errors['PartProductCategoryId'])}</div>
                                            </div>
                                            <div className='col-md-6'>
                                                <label className="mt-2 red-asterisk">{t('part_edit_input_part_category')}</label>
                                                <Select
                                                    options={partCategoryList}
                                                    value={partCategoryList && partCategoryList.find(option => option.value == part.PartCategoryId) || null}
                                                    onChange={(selectedOption) => onSelectChange(selectedOption, "PartCategoryId")}
                                                    isSearchable
                                                    isDisabled
                                                    name="PartCategoryId"
                                                    placeholder={t('part_edit_partcategory_select')}
                                                />
                                                <div className="small text-danger"> {t(errors['PartCategoryId'])}</div>
                                            </div>
                                            <div className='col-md-6'>
                                                <label className="mt-2">{t('part_edit_input_partsubcategory')}</label>
                                                <Select
                                                    options={PartSubCategoryList}
                                                    value={PartSubCategoryList && PartSubCategoryList.find(option => option.value == part.PartSubCategoryId) || null}
                                                    onChange={(selectedOption) => onSelectChange(selectedOption, "PartSubCategoryId")}
                                                    isSearchable
                                                    isDisabled
                                                    name="PartSubCategoryId"
                                                    placeholder={t('part_edit_subcategory_select')}
                                                />
                                            </div>
                                            <div className='col-md-6'>
                                                <label className="mt-2 red-asterisk">{t('part_edit_input_part_make')}</label>
                                                <Select
                                                    options={partMakeList}
                                                    value={partMakeList && partMakeList.find(option => option.value == part.MakeId) || null}
                                                    onChange={(selectedOption) => onSelectChange(selectedOption, "MakeId")}
                                                    isSearchable
                                                    isDisabled
                                                    name="MakeId"
                                                    placeholder={t('part_edit_make_select')}
                                                />
                                                <div className="small text-danger"> {t(errors['MakeId'])}</div>
                                            </div>
                                            <div className='col-md-12'>
                                                <label className="mt-2 red-asterisk">{t('part_edit_input_oem_part_number')}</label>
                                                <input name='OemPartNumber' onChange={onUpdateField} type='text'
                                                    value={part.OemPartNumber}
                                                    disabled
                                                    className={`form-control  ${errors["OemPartNumber"] ? "is-invalid" : ""}`}
                                                ></input>
                                                <div className="invalid-feedback"> {t(errors['OemPartNumber'])}</div>
                                            </div>
                                            <div className="col-md-12 mt-2">
                                                <button type='button' className='btn float-end app-primary-bg-color text-white mt-2' onClick={onSubmit}>
                                                    {t('part_edit_button')}
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