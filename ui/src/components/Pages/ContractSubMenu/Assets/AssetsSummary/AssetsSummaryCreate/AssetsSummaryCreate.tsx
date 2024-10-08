import { store } from '../../../../../../state/store';
import { useStore, useStoreWithInitializer } from '../../../../../../state/storeHooks';
import SweetAlert from 'react-bootstrap-sweetalert';
import { ContainerPage } from '../../../../../ContainerPage/ContainerPage';
import { useTranslation } from 'react-i18next';
import { startPreloader, stopPreloader } from '../../../../../Preloader/Preloader.slice';
import {
    CreateAssetSummaryState,
    initializeAssetSummary,
    loadPartsCategory,
    partCategoryUnSelect,
    partCategorySelect,
    startSubmitting,
    stopSubmitting,
    toggleInformationModalStatus,
    updateErrors,
    updateField,
    loadproductCategoryList,
    initializeAssetSummaryCreate
} from './AssetsSummaryCreate.slice';
import { useParams } from 'react-router-dom';
import { useRef } from 'react';
import * as yup from 'yup';
import { useEffect, useState } from 'react';
import Select from 'react-select';
import { convertBackEndErrorsToValidationErrors, formatSelectInput } from '../../../../../../helpers/formats';
import { ValidationErrorComp } from '../../../../../ValidationErrors/ValidationError';
import { createAssetSummary, getContractProductCategoryPartnotCovered } from '../../../../../../services/assetsSummary';
import { getAssetProductCategoryNames } from '../../../../../../services/assetProductCategory';

export const AssetSummaryCreate = () => {
    const modalRef = useRef<HTMLButtonElement>(null);
    const MODAL_NAME = "CreateAssetSummary"
    const { t, i18n } = useTranslation();
    const { summarycreate: { displayInformationModal, productCategoryList, assetsummary, partsCategory, errors, displayConformationModal }, assetsummarylist: { visibleModal } } =
        useStore(({ summarycreate, assetsummarylist }) => ({ summarycreate, assetsummarylist }));
    const { ContractId } = useParams<{ ContractId: string }>();

    const [productCategoryName, setProductCategoryName] = useState<any>('')

    useEffect(() => {
        onLoad(ContractId);
    }, [ContractId != null && visibleModal == MODAL_NAME]);

    async function onLoad(ContractId: string) {
        store.dispatch(initializeAssetSummary());
        store.dispatch(updateField({ name: "ContractId", value: ContractId }));
        if (visibleModal == MODAL_NAME) {
            try {
                store.dispatch(startPreloader());
                const { AssetProductCategoryNames } = await getAssetProductCategoryNames()
                store.dispatch(loadproductCategoryList(formatSelectInput(AssetProductCategoryNames, "CategoryName", "Id")))
                store.dispatch(stopPreloader());
            } catch (error) {
                console.error(error);
            }
        }
    }

    const validationSchema = yup.object().shape({
        ProductCategoryId: yup.number().moreThan(0, 'validation_error_create_asset_summary_product_category_required'),
        ProductCountAtBooking: yup.number().integer().typeError('validation_error_create_asset_summary_productcount_at_booking_required').max(~(1 << 31), 'validation_error_create_asset_summary_productcount_at_booking_exceeds'),
        AmcValue: yup.number().moreThan(0, 'validation_error_create_asset_summary_amc_value_required').typeError('validation_error_create_asset_summary_amc_value_required').max(99999999999999.99, ('validation_error_create_asset_summary_amc_value_exceed')),
        IsPreventiveMaintenanceNeeded: yup.string().required('validation_error_create_asset_summary_is_pm_needed_required'),
    });

    const ToggleConfirmationModal = async () => {
        store.dispatch(updateErrors({}));
        try {
            await validationSchema.validate(assetsummary, { abortEarly: false });
        } catch (error: any) {
            const errors = error.inner.reduce((allErrors: any, currentError: any) => {
                return { ...allErrors, [currentError.path as string]: currentError.message };
            }, {});
            store.dispatch(updateErrors(errors))
            if (errors)
                return;
        }
        store.dispatch(startPreloader());
        const result = await createAssetSummary(store.getState().summarycreate.assetsummary)
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

    const ConfirmationModal = () => {
        const { t } = useTranslation();
        return (
            <SweetAlert
                custom
                showCloseButton
                showCancel
                confirmBtnText="Yes"
                cancelBtnText="No"
                confirmBtnBsStyle="primary"
                cancelBtnBsStyle="light"
                title="Are you sure?"
                closeBtnStyle={{ border: "none" }}
                onConfirm={onSubmit}
                onCancel={ToggleConfirmationModal}
            >
                {t('asset_summary_create_conformation_modal_message')}
            </SweetAlert>
        );
    }

    const onSubmit = async () => {
        store.dispatch(updateErrors({}));
        try {
            await validationSchema.validate(assetsummary, { abortEarly: false });
        } catch (error: any) {
            const errors = error.inner.reduce((allErrors: any, currentError: any) => {
                return { ...allErrors, [currentError.path as string]: currentError.message };
            }, {});
            store.dispatch(updateErrors(errors))
            if (errors)
                return;
        }
        store.dispatch(startPreloader());
        store.dispatch(startSubmitting());
        const result = await createAssetSummary(store.getState().summarycreate.assetsummary);
        store.dispatch(stopSubmitting());
        result.match({
            ok: () => {
                store.dispatch(toggleInformationModalStatus());
            },
            err: async (e) => {
                const formattedErrors = convertBackEndErrorsToValidationErrors(e)
                store.dispatch(updateErrors(formattedErrors))
            },
        });
        store.dispatch(stopPreloader())
    }

    const onModalClose = () => {
        store.dispatch(initializeAssetSummaryCreate());
        setProductCategoryName('')
        store.dispatch(updateErrors({}))
    }

    function handleCheckboxClick(ev: any) {
        if (ev.target.checked) {
            store.dispatch(partCategorySelect({ categoryId: ev.target.value, isActive: ev.target.checked }));
        } else {
            store.dispatch(partCategoryUnSelect({ categoryId: ev.target.value, isActive: ev.target.checked }));
        }
    }

    const onSelectChange = async (selectedOption: any, actionMeta: any) => {
        setProductCategoryName(selectedOption.label)
        var value = selectedOption.value
        var name = actionMeta.name
        store.dispatch(updateField({ name: name as keyof CreateAssetSummaryState['assetsummary'], value }));
        const { ProductCategoryPartnotCovered } = await getContractProductCategoryPartnotCovered(value)
        store.dispatch(loadPartsCategory(ProductCategoryPartnotCovered))
        store.dispatch(updateField({ name: 'PartCategoryId', value: '', patCategory: ProductCategoryPartnotCovered.filter(category => category.IsActive).map(category => category.Id.toString()) }));
    }

    return (
        <>
            <div
                className="modal fade"
                id='CreateAssetSummary'
                data-bs-backdrop='static'
                data-bs-keyboard='false'
                aria-hidden='true'
            >
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header mx-2">
                            <h5 className="modal-title">{t('asset_summary_create_modal_title')}</h5>
                            <button
                                type='button'
                                className="btn-close"
                                data-bs-dismiss='modal'
                                id='closeCreateAssetSummaryModal'
                                aria-label='Close'
                                onClick={onModalClose}
                                ref={modalRef}
                            ></button>
                        </div>
                        <div className="modal-body">
                            <ContainerPage>
                                <ValidationErrorComp errors={errors} />
                                <div className=''>
                                    <div className='row mb-1'>
                                        {/* Product category */}
                                        <div className='mb-2'>
                                            <label className="mt-2 red-asterisk">{t('asset_summary_create_label_product_category')}</label>
                                            <Select
                                                options={productCategoryList}
                                                value={productCategoryList && productCategoryList.find(option => option.value == assetsummary.ProductCategoryId) || null}
                                                onChange={onSelectChange}
                                                isSearchable
                                                name="ProductCategoryId"
                                                placeholder="Select option"
                                            />
                                            <div className="small text-danger"> {t(errors['ProductCategoryId'])}</div>
                                        </div>
                                        <div className="mb-1">
                                            <label className="red-asterisk">{t('asset_summary_create_label_productcount_atbooking')}</label>
                                            <input name="ProductCountAtBooking" onChange={onUpdateField} type="number" value={assetsummary.ProductCountAtBooking} className="form-control"></input>
                                            <div className="small text-danger"> {t(errors['ProductCountAtBooking'])}</div>
                                        </div>
                                        <div className="mb-1">
                                            <label className="red-asterisk">{t('asset_summary_create_label_amcvalue')}</label>
                                            <input name="AmcValue" onChange={onUpdateField} type="number" value={assetsummary.AmcValue ?? 0} className="form-control"></input>
                                            <div className="small text-danger"> {t(errors['AmcValue'])}</div>
                                        </div>

                                        {/* PartCategory */}
                                        <div className="mt-3" >
                                            {partsCategory.length > 0 && (
                                                <label className="mb-1">{t('partsnotcovered_label_partcategory')} <strong>{productCategoryName}</strong></label>
                                            )}
                                            <br></br>
                                            {partsCategory.map((eachpartcategory) => (
                                                <div className="mt-1" >
                                                    <input
                                                        onChange={handleCheckboxClick}
                                                        type="checkbox"
                                                        value={eachpartcategory.Id}
                                                        checked={eachpartcategory.IsActive}
                                                        name="PartCategoryData"
                                                        className={`form-check-input`} />&nbsp;
                                                    <label className="form-check-label ms-2">{eachpartcategory.Name}</label>&nbsp;
                                                </div>
                                            ))}
                                        </div>
                                        {assetsummary.PartCategoryId == "" ? (
                                            <div className="col-md-12 mt-4">
                                                <button type='button' className='btn  app-primary-bg-color text-white mt-2 float-end' onClick={ToggleConfirmationModal}>
                                                    {t('asset_summary_create_button_submit')}
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="col-md-12 mt-4">
                                                <button type='button' className='btn  app-primary-bg-color text-white mt-2 float-end' onClick={onSubmit}>
                                                    {t('asset_summary_create_button_submit')}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </ContainerPage>
                            {displayConformationModal ? <ConfirmationModal /> : ""}
                            {displayInformationModal ? <InformationModal /> : ""}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

const onUpdateField = (ev: any) => {
    var name = ev.target.name;
    var value = ev.target.value;
    if (name === 'IsPreventiveMaintenanceNeeded') {
        value = ev.target.checked ? true : false;
    }
    store.dispatch(updateField({ name: name as keyof CreateAssetSummaryState['assetsummary'], value }));
}

const InformationModal = () => {
    const { t, i18n } = useTranslation();
    return (
        <SweetAlert success title='Success' onConfirm={reDirectRoute}>
            {t('asset_summary_create_success_sweetalert')}
        </SweetAlert>
    );
}
const reDirectRoute = () => {
    store.dispatch(toggleInformationModalStatus());
    document.getElementById('closeCreateAssetSummaryModal')?.click();
    window.location.reload();
}