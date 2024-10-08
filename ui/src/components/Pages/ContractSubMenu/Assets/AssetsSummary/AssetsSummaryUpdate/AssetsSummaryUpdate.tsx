import { store } from '../../../../../../state/store';
import { useStore } from '../../../../../../state/storeHooks';
import SweetAlert from 'react-bootstrap-sweetalert';
import { ContainerPage } from '../../../../../ContainerPage/ContainerPage';
import { useTranslation } from 'react-i18next';
import { startPreloader, stopPreloader } from '../../../../../Preloader/Preloader.slice';
import {
    initializeAssetSummary,
    loadPartsCategory,
    partCategoryUnSelect,
    partCategorySelect,
    startSubmitting,
    stopSubmitting,
    toggleInformationModalStatus,
    updateErrors,
    updateField,
    UpdateAssetSummaryState,
    setParts,
    toggleConformationModalStatus,
    initializeAssetSummaryUpdate
} from './AssetsSummaryUpdate.slice';
import { useParams } from 'react-router-dom';
import { useRef } from 'react';
import * as yup from 'yup';
import { useEffect, useState } from 'react';
import Select from 'react-select';
import { convertBackEndErrorsToValidationErrors, formatSelectInput } from '../../../../../../helpers/formats';
import { ValidationErrorComp } from '../../../../../ValidationErrors/ValidationError';
import { getProductCategory } from '../../../../../../services/product';
import { editAssetSummary, getContractProductCategoryPartnotCovered, getSelectedPartsNotCovered, } from '../../../../../../services/assetsSummary';

export const AssetSummaryUpdate = () => {
    const modalRef = useRef<HTMLButtonElement>(null);
    const { t, i18n } = useTranslation();
    const { assetsummaryupdate: { displayInformationModal, assetsummary, PartsNotCovered, displayConformationModal, errors }, assetsummarylist: { visibleModal } } =
        useStore(({ assetsummaryupdate, assetsummarylist }) => ({ assetsummaryupdate, assetsummarylist }));
    const { ContractId } = useParams<{ ContractId: string }>();

    useEffect(() => {
        onLoad(ContractId);
    }, [ContractId != null && visibleModal == "UpdateAssetSummary"]);

    const [productCategoryList, setProductCategoryList] = useState<any>(null)

    async function onLoad(ContractId: string) {
        try {
            if (visibleModal === "UpdateAssetSummary") {
                store.dispatch(startPreloader());
                const { ProductCategoryNames } = await getProductCategory()
                setProductCategoryList(formatSelectInput(ProductCategoryNames, "CategoryName", "Id"))
                const data = await getSelectedPartsNotCovered(store.getState().assetsummaryupdate.assetsummary.ProductCategoryId.toString(), ContractId)
                store.dispatch(setParts(data.ProductCategoryPartnotCovered[0].PartCategoryList));
                store.dispatch(updateField({ name: "ContractId", value: ContractId }));
                const category = await getContractProductCategoryPartnotCovered(store.getState().assetsummaryupdate.assetsummary.ProductCategoryId.toString());
                store.dispatch(loadPartsCategory(category));
                store.dispatch(stopPreloader());
            }
        }
        catch (error) {
            return
        }
    }

    const validationSchema = yup.object().shape({
        ProductCategoryId: yup.number().moreThan(0, t('validation_error_update_asset_summary_product_category_required') ?? ''),
        ProductCountAtBooking: yup.number().integer().typeError('validation_error_update_asset_summary_productcount_at_booking_required').max(~(1 << 31), 'validation_error_update_asset_summary_productcount_at_booking_exceeds'),
        AmcValue: yup.number().typeError('validation_error_update_asset_summary_amc_value_required').max(99999999999999.98, ('validation_error_update_asset_summary_amc_value_exceed')),
    });
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
        const result = await editAssetSummary(assetsummary);
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
        store.dispatch(initializeAssetSummaryUpdate())
    }

    function handleCheckboxClick(ev: any) {
        const partcategory = store.getState().assetsummaryupdate.assetsummary.PartCategoryList;
        if (ev.target.checked === true) {
            if (!partcategory.split(",").includes(ev.target.value)) {
                const updatedCategory = partcategory !== '' ? ',' + ev.target.value : ev.target.value;
                store.dispatch(partCategorySelect(updatedCategory));
            }
        } else {
            store.dispatch(partCategoryUnSelect(ev.target.value));
        }
    }

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
        store.dispatch(toggleConformationModalStatus());
    }

    const onConfirmSubmit = async () => {
        store.dispatch(toggleConformationModalStatus());
        await onSubmit();
    }

    const onCancelSubmit = () => {
        store.dispatch(toggleConformationModalStatus());
    }

    const ConfirmationModal = () => {
        const { t, i18n } = useTranslation();
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
                onConfirm={onConfirmSubmit}
                onCancel={onCancelSubmit}
            >
                {t('asset_summary_create_conformation_modal_message')}
            </SweetAlert>
        );
    }

    function isAssigned(PartCategoryId: number) {
        const partCategoryList = store.getState().assetsummaryupdate.assetsummary.PartCategoryList;
        if (typeof partCategoryList === "undefined") {
            return false;
        }
        return partCategoryList.split(",").includes(PartCategoryId.toString());
    }

    return (
        <>
            <div
                className="modal fade"
                id='UpdateAssetSummary'
                data-bs-backdrop='static'
                data-bs-keyboard='false'
                aria-hidden='true'
            >
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header mx-2">
                            <h5 className="modal-title">{t('asset_summary_update_modal_title')}</h5>
                            <button
                                type='button'
                                className="btn-close"
                                data-bs-dismiss='modal'
                                id='closeUpdateAssetSummaryModal'
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
                                            <label className="mt-2">{t('asset_summary_update_label_product_category')} &nbsp;<strong>{assetsummary.CategoryName}</strong></label>
                                        </div>
                                        <div className="mb-1 pt-1">
                                            <label className="red-asterisk">{t('asset_summary_update_label_productcount_atbooking')}</label>
                                            <input name="ProductCountAtBooking" onChange={onUpdateField} type="number" value={assetsummary.ProductCountAtBooking} className="form-control"></input>
                                            <div className="small text-danger"> {t(errors['ProductCountAtBooking'])}</div>
                                        </div>
                                        <div className="mb-1">
                                            <label className="red-asterisk">{t('asset_summary_update_label_amcvalue')}</label>
                                            <input name="AmcValue" onChange={onUpdateField} type="number" value={assetsummary.AmcValue} className="form-control"></input>
                                            <div className="small text-danger"> {t(errors['AmcValue'])}</div>
                                        </div>

                                        {/* PartCategory */}
                                        <div className="mt-3" >
                                            <label className="mb-1">{t('asset_summary_partsnotcovered_label_partcategory')} <strong>{assetsummary.CategoryName}</strong></label>
                                            <br></br>
                                            <div className="text-danger small">
                                                {errors['PartCategoryList']}
                                            </div>
                                            {PartsNotCovered.map((eachpartcategory) => (
                                                <div className="mt-1" >
                                                    <input
                                                        onChange={handleCheckboxClick}
                                                        type="checkbox"
                                                        name="PartCategoryList"
                                                        value={eachpartcategory.PartsNotCovered.Id}
                                                        checked={isAssigned(eachpartcategory.PartsNotCovered.Id)}
                                                        className={`form-check-input ${errors["PartCategoryList"] ? "is-invalid" : ""}`} />&nbsp;
                                                    <label className="form-check-label ms-2">{eachpartcategory.PartsNotCovered.Name}</label>&nbsp;
                                                </div>
                                            ))}
                                        </div>
                                        {assetsummary.PartCategoryList == "" ? (
                                            <div className="col-md-12 mt-4">
                                                <button type='button' className='btn  app-primary-bg-color text-white mt-2 float-end' onClick={ToggleConfirmationModal}>
                                                    {t('asset_summary_update_button_submit')}
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="col-md-12 mt-4">
                                                <button type='button' className='btn  app-primary-bg-color text-white mt-2 float-end' onClick={onSubmit}>
                                                    {t('asset_summary_update_button_submit')}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </ContainerPage>
                        </div>
                    </div>
                </div>
            </div>
            {displayConformationModal ? <ConfirmationModal /> : ""}
            {displayInformationModal ? <InformationModal /> : ""}
        </>
    );
}

const onUpdateField = (ev: any) => {
    var name = ev.target.name;
    var value = ev.target.value;
    if (name === 'IsPreventiveMaintenanceNeeded') {
        value = ev.target.checked ? true : false;
    }
    store.dispatch(updateField({ name: name as keyof UpdateAssetSummaryState['assetsummary'], value }));
}

const InformationModal = () => {
    const { t, i18n } = useTranslation();
    return (
        <SweetAlert success title='Success' onConfirm={reDirectRoute}>
            {t('asset_summary_update_success_sweetalert')}
        </SweetAlert>
    );
}
async function reDirectRoute() {
    store.dispatch(toggleInformationModalStatus());
    document.getElementById('closeUpdateAssetSummaryModal')?.click();
    window.location.reload();
}