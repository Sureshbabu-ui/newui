import { ContainerPage } from "../../../../ContainerPage/ContainerPage";
import { ValidationErrorComp } from "../../../../ValidationErrors/ValidationError";
import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useStore, useStoreWithInitializer } from "../../../../../state/storeHooks";
import * as yup from 'yup';
import SweetAlert from 'react-bootstrap-sweetalert';
import Select from 'react-select';
import { store } from "../../../../../state/store";
import { initializeAsset } from "../CreateAssets.slice";
import { convertBackEndErrorsToValidationErrors, formatSelectInput } from "../../../../../helpers/formats";
import { getPartMake } from "../../../../../services/part";
import { getContractCustomerSites } from "../../../../../services/customer";
import { UpdateAssetDetails, loadCustomerSite, loadMasterData, loadModalNames, startSubmitting, stopSubmitting, updateErrors, updateField, toggleInformationModalStatus, initializeAssetUpdateDeatil } from "./AssetDetailUpdate.slice";
import { startPreloader, stopPreloader } from "../../../../Preloader/Preloader.slice";
import { getValuesInMasterDataByTable } from "../../../../../services/masterData";
import { getProductModelNames } from "../../../../../services/serviceRequest";
import { loadAssets } from "../AssetsList.slice";
import { getAssetList, updateAsset } from "../../../../../services/assets";
import { getAssetProductCategoryNames } from "../../../../../services/assetProductCategory";
import { getRegionWiseServiceEngineers } from "../../../../../services/users";
import { Preloader } from "../../../../Preloader/Preloader";

export function UpdateAsset() {
    const modalRef = useRef<HTMLButtonElement>(null);
    const { t, i18n } = useTranslation();
    const { assetdetailupdate: { entitiesList, errors, displayInformationModal, contractAssetInfo, ProductModelNames, masterData }, assetslist: { visibleModal } } = useStore(
        ({ assetdetailupdate, assetslist }) => ({ assetdetailupdate, assetslist }));
    const { ContractId } = useParams<{ ContractId: string }>();

    useEffect(() => {
        onLoad();
    }, [ContractId != null && visibleModal == "UpdateAsset"]);

    const validationSchema = yup.object().shape({
        ProductSerialNumber: yup.string().required(('validation_error_update_asset_serielno_required')),
        IsVipProduct: yup.boolean().required('validation_error_update_asset_vip_asset_required'),
        AmcValue: yup.number().moreThan(0, 'validation_error_update_asset_amcvalue_required').typeError('validation_error_update_asset_amcvalue_required').max(99999999999999.99, ('validation_error_update_asset_amcvalue_exceeds')),
        IsOutSourcingNeeded: yup.boolean().required('validation_error_update_asset_outsourcing_required'),
        PreAmcCompletedDate: yup.string().when('IsPreAmcCompleted', (IsPreAmcCompleted, schema) =>
            contractAssetInfo.IsPreAmcCompleted === "True"
                ? schema.required('validation_error_update_asset_preamc_completed_required')
                : schema.nullable()
        ),
        PreAmcCompletedBy: yup.number().when('IsPreAmcCompleted', (IsPreAmcCompleted, schema) =>
            contractAssetInfo.IsPreAmcCompleted === "True"
                ? schema.positive('validation_error_update_asset_preamc_completedby_required')
                : schema.nullable()
        ),
        AmcStartDate: yup.string().required(t('validation_error_update_asset_amc_startdate_required') ?? ''),
        AmcEndDate: yup.string().required(t('validation_error_update_asset_amc_enddate_required') ?? '')
    });

    const [selectCustomerSiteIdList, setSelectCustomerSiteIdList] = useState<any>(null)
    const [productCategoryList, setProductCategoryList] = useState<any>(null)
    const [productMakeList, setProductMakeList] = useState<any>([]);

    useEffect(() => {
        setSelectCustomerSiteIdList(formatSelectInput(entitiesList.CustomerSiteId, "SiteName", "Id"))
    }, [entitiesList.CustomerSiteId])

    function InformationModal() {
        const { t, i18n } = useTranslation();
        return (
            <SweetAlert success title="Success" onConfirm={reDirectRoute}>
                {t('update_assets_assets_created_successfully')}
            </SweetAlert>
        );
    }

    useEffect(() => {
        if (contractAssetInfo.ProductCategoryId != 0 && contractAssetInfo.ProductMakeId != 0) {
            getFilteredModelName()
            store.dispatch(updateField({ name: 'ProductModelId', value: 0 }));
        }
    }, [contractAssetInfo.ProductCategoryId, contractAssetInfo.ProductMakeId])

    const getFilteredModelName = async () => {
        const { ModelNames } = await getProductModelNames(contractAssetInfo.ProductCategoryId, contractAssetInfo.ProductMakeId)
        const ModelName = await (formatSelectInput(ModelNames, "ModelName", "Id"))
        store.dispatch(loadModalNames({ Select: ModelName }));
    }

    const reDirectRoute = async () => {
        store.dispatch(toggleInformationModalStatus());
        modalRef.current?.click()
        store.dispatch(initializeAssetUpdateDeatil())
        var result = await getAssetList("", 1, ContractId);
        store.dispatch(loadAssets(result));
    }

    const onModalClose = () => {
        store.dispatch(initializeAssetUpdateDeatil())
    }

    function onUpdateField(ev: any) {
        var name = ev.target.name;
        var value = ev.target.value;
        var checked = ev.target.checked
        if (name === "IsActive") {
            value = checked ? true : false
        }
        if (ev.target.name === 'IsPreAmcCompleted' && value === "True") {
            store.dispatch(updateField({ name: 'PreAmcCompletedDate', value: null }));
            store.dispatch(updateField({ name: 'PreAmcCompletedBy', value: null }));
        }
        store.dispatch(updateField({ name: name as keyof UpdateAssetDetails['contractAssetInfo'], value }));
    }

    const onSubmit = async () => {
        store.dispatch(updateErrors({}))
        try {
            await validationSchema.validate(contractAssetInfo, { abortEarly: false });
        } catch (error: any) {
            const errors = error.inner.reduce((allErrors: any, currentError: any) => {
                return { ...allErrors, [currentError.path as string]: currentError.message };
            }, {});
            store.dispatch(updateErrors(errors))
            if (errors)
                return;
        }
        store.dispatch(startPreloader());
        const result = await updateAsset(contractAssetInfo)
        result.match({
            ok: () => {
                store.dispatch(toggleInformationModalStatus());
            },
            err: (e) => {
                const errorMessages = convertBackEndErrorsToValidationErrors(e)
                store.dispatch(updateErrors(errorMessages));
            }
        });
        store.dispatch(stopPreloader());
    }

    return (
        <>
            <Preloader />
            <div
                className="modal fade px-0"
                id="UpdateAsset"
                data-bs-backdrop="static"
                data-bs-keyboard="false"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-fullscreen">
                    <div className="modal-content">
                        <div className="modal-header mx-3">
                            <h5 className="modal-title app-primary-color">{t('assets_management_update_asset')}</h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                id="closeAssetModal"
                                aria-label="Close"
                                onClick={onModalClose}
                                ref={modalRef}
                            >
                            </button>
                        </div>
                        <div className="modal-body">
                            <ContainerPage>
                                <ValidationErrorComp errors={errors} />
                                <div className="col-md-12" >
                                    {/* Update Assets form */}
                                    <div className="form-check form-switch ps-4 ms-3 mb-2">
                                        <input
                                            className="form-check-input switch-input-lg ps-1"
                                            type="checkbox"
                                            name="IsActive"
                                            id="ActiveSwitch"
                                            checked={contractAssetInfo.IsActive}
                                            value={contractAssetInfo.IsActive.toString()}
                                            onChange={onUpdateField}
                                        ></input>
                                        <span>{t('update_assets_label_asset_isactive')}</span>
                                    </div>
                                    {/* Product seriel number */}
                                    <div className="mb-1">
                                        <div className="col-md-12">
                                            <label className='red-asterisk'>{t('update_assets_label_asset_serial_number')}</label>
                                            <input value={contractAssetInfo.ProductSerialNumber} name="ProductSerialNumber" onChange={onUpdateField} type="text" className={`form-control  ${errors["AssetId"] ? "is-invalid" : ""}`}></input>
                                            <div className="small text-danger"> {t(errors['ProductSerialNumber'])}</div>
                                        </div>
                                    </div>
                                    {/* IsVipProduct */}
                                    <div className="mb-1">
                                        <label className='red-asterisk'>{t('update_assets_label_is_vip_asset')}</label>
                                        <select value={contractAssetInfo.IsVipProduct.valueOf().toString()} name="IsVipProduct" onChange={onUpdateField} className="form-select">
                                            <option value="True">{t('update_assets_select_is_vip_asset_yes')}</option>
                                            <option value="False">{t('update_assets_select_is_vip_asset_no')}</option>
                                        </select>
                                        <div className="small text-danger"> {t(errors['IsVipProduct'])}</div>
                                    </div>
                                    {/* AmcValue */}
                                    <div className="mb-1">
                                        <div className="col-md-12">
                                            <label className='red-asterisk'>{t('update_assets_label_amc_value')}</label>
                                            <input value={contractAssetInfo.AmcValue} name="AmcValue" onChange={onUpdateField} type="number" className="form-control"></input>
                                            <div className="small text-danger"> {t(errors['AmcValue'])}</div>
                                        </div>
                                    </div>
                                    {/* IsOutSourcingNeeded */}
                                    <div className="mb-1">
                                        <label className='red-asterisk'>{t('update_assets_label_is_outsourcing_needed')}</label>
                                        <select value={contractAssetInfo.IsOutSourcingNeeded.valueOf().toString()} name="IsOutSourcingNeeded" onChange={onUpdateField} className="form-select">
                                            <option value="True">{t('update_assets_select_is_outsourcing_needed_yes')}</option>
                                            <option value="False">{t('update_assets_select_is_outsourcing_needed_no')}</option>
                                        </select>
                                        <div className="small text-danger"> {t(errors['IsOutSourcingNeeded'])}</div>
                                    </div>

                                    {/* IsPreAmcCompleted */}
                                    <div className="mb-1">
                                        <label className='red-asterisk'>{t('update_assets_label_is_pre_amc_completed')}</label>
                                        <select value={contractAssetInfo.IsPreAmcCompleted.valueOf().toString()} name="IsPreAmcCompleted" onChange={onUpdateField} className="form-select">
                                            <option value={"True"}>{t('update_assets_select_is_pre_amc_completed_yes')}</option>
                                            <option value={"False"}>{t('update_assets_select_is_pre_amc_completed_no')}</option>
                                        </select>
                                        <div className="small text-danger"> {t(errors['IsPreAmcCompleted'])}</div>
                                    </div>
                                    {/* PreAmcStartDate */}
                                    {contractAssetInfo.IsPreAmcCompleted == "True" &&
                                        (
                                            <div className="row">
                                                <div className="mb-1 mt-1 col">
                                                    <label className='red-asterisk'>{t('update_assets_label_pre_amc_completeddate')}</label>
                                                    <input value={contractAssetInfo.PreAmcCompletedDate ? contractAssetInfo.PreAmcCompletedDate.split('T')[0] : ""} type="date" name="PreAmcCompletedDate" onChange={onUpdateField} className="form-control"></input>
                                                    <div className="small text-danger"> {t(errors['PreAmcCompletedDate'])}</div>
                                                </div>
                                                {/* PreAmcEndDate */}
                                                <div className="mb-1 mt-1 col">
                                                    <label className="red-asterisk">{t('update_assets_label_choose_engineer')}</label>
                                                    <Select
                                                        options={masterData.ServiceEngineers}
                                                        value={masterData.ServiceEngineers && masterData.ServiceEngineers.find(option => option.value == contractAssetInfo.PreAmcCompletedBy) || null}
                                                        onChange={onSelectChange}
                                                        isSearchable
                                                        classNamePrefix="react-select"
                                                        name="PreAmcCompletedBy"
                                                        placeholder="Select"
                                                    />
                                                    <div className="small text-danger"> {t(errors["PreAmcCompletedBy"])}</div>
                                                </div>
                                            </div>
                                        )
                                    }
                                    <div className="row">
                                        {/* AmcStartDate */}
                                        <div className="col-md-6">
                                            <label className='red-asterisk'>{t('update_assets_label_asset_amc_start_date')}</label>
                                            <input value={contractAssetInfo.AmcStartDate ? contractAssetInfo.AmcStartDate.split('T')[0] : ""} name="AmcStartDate" onChange={onUpdateField} type="date" className="form-control"></input>
                                            <div className="small text-danger"> {t(errors['AmcStartDate'])}</div>
                                        </div>
                                        {/* AmcEndDate */}
                                        <div className="col-md-6">
                                            <label className='red-asterisk'>{t('update_assets_label_asset_amc_end_date')}</label>
                                            <input value={contractAssetInfo.AmcEndDate ? contractAssetInfo.AmcEndDate.split('T')[0] : ""} name="AmcEndDate" onChange={onUpdateField} type="date" className="form-control"></input>
                                            <div className="small text-danger"> {t(errors['AmcEndDate'])}</div>
                                        </div>
                                    </div>
                                    <div className="row mt-1">

                                        {/* Customer Site */}
                                        <div className="mb-1 col">
                                            <label className='red-asterisk'>{t('update_assets_label_customer_site')}</label>
                                            <Select
                                                value={selectCustomerSiteIdList && selectCustomerSiteIdList.find(option => option.value == contractAssetInfo.CustomerSiteId) || null}
                                                options={selectCustomerSiteIdList}
                                                isDisabled={true}
                                                isSearchable
                                                name="CustomerSiteId"
                                            />
                                            <div className="small text-danger"> {t(errors['CustomerSiteId'])}</div>
                                        </div>
                                        {/* CustomerAssetId */}
                                        <div className="mb-1 col">
                                            <div className="col-md-12">
                                                <label>{t('update_assets_label_customer_asset_id')}</label>
                                                <input value={contractAssetInfo.CustomerAssetId ?? ""} name="CustomerAssetId" disabled={true} type="text" className={`form-control  ${errors["CustomerAssetId"] ? "is-invalid" : ""}`} ></input>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        {/* MspAssetId */}
                                        <div className="mb-1 col">
                                            <div className="col-md-12">
                                                <label>{t('update_assets_label_msp_asset_id')}</label>
                                                <input value={contractAssetInfo.MspAssetId ?? ""} name="MspAssetId" disabled={true} type="text" className={`form-control  ${errors["MspAssetId"] ? "is-invalid" : ""}`} ></input>
                                            </div>
                                        </div>
                                        {/* Product category */}
                                        <div className='mb-2 col'>
                                            <label className="mt-2 red-asterisk">{t('update_assets_label_asset_category')}</label>
                                            <Select
                                                value={productCategoryList && productCategoryList.find(option => option.value == contractAssetInfo.ProductCategoryId) || null}
                                                options={productCategoryList}
                                                isDisabled={true}
                                                isSearchable
                                                name="ProductCategoryId"
                                            />
                                            <div className="small text-danger"> {t(errors['ProductCategoryId'])}</div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        {/* Product make */}
                                        <div className='mb-1 col'>
                                            <label className=" red-asterisk">{t('update_assets_label_asset_make')}</label>
                                            <Select
                                                value={productMakeList && productMakeList.find(option => option.value == contractAssetInfo.ProductMakeId) || null}
                                                options={productMakeList}
                                                isDisabled={true}
                                                isSearchable
                                                name="ProductMakeId"
                                            />
                                            <div className="small text-danger"> {t(errors['ProductMakeId'])}</div>
                                        </div>
                                        {/* Product model */}
                                        <div className='mb-1 col'>
                                            <label className="red-asterisk">{t('update_assets_label_asset_model')}</label>
                                            <Select
                                                value={ProductModelNames && ProductModelNames.find(option => option.value == contractAssetInfo.ProductModelId) || null}
                                                options={ProductModelNames}
                                                isDisabled={true}
                                                isSearchable
                                                name="ProductModelId"
                                            />
                                            <div className="small text-danger"> {t(errors['ProductModelId'])}</div>
                                        </div>
                                    </div>
                                    <div className="row">

                                        {/* Is Enterprise Product */}
                                        <div className="mb-1 col">
                                            <label className='red-asterisk'>{t('update_assets_label_is_enterprise_asset')}</label>
                                            <select value={contractAssetInfo.IsEnterpriseProduct.valueOf().toString()} name="IsEnterpriseProduct" disabled={true} className="form-select">
                                                <option value="True">{t('update_assets_select_is_enterprise_asset_yes')}</option>
                                                <option value="False">{t('update_assets_select_is_enterprise_asset_no')}</option>
                                            </select>
                                            <div className="small text-danger"> {t(errors['IsEnterpriseProduct'])}</div>
                                        </div>
                                        {/* ResponseTimeInHours */}
                                        <div className="mb-1 col">
                                            <label className='red-asterisk'>{t('update_assets_label_response_time_in_hours')}</label>
                                            <input value={contractAssetInfo.ResponseTimeInHours} name="ResponseTimeInHours" disabled={true} type="number" className="form-control"></input>
                                            <div className="small text-danger"> {t(errors['ResponseTimeInHours'])}</div>
                                        </div>
                                    </div>
                                    <div className="row">

                                        {/* ResolutionTimeInHours */}
                                        <div className="mb-1 col">
                                            <label className='red-asterisk'>{t('update_assets_label_resolution_time_in_hours')}</label>
                                            <input value={contractAssetInfo.ResolutionTimeInHours} name="ResolutionTimeInHours" disabled={true} type="number" className="form-control"></input>
                                            <div className="small text-danger"> {t(errors['ResolutionTimeInHours'])}</div>
                                        </div>
                                        {/* StandByTimeInHours */}
                                        <div className="mb-1 col">
                                            <label className='red-asterisk'>{t('update_assets_label_standby_time_in_hours')}</label>
                                            <input value={contractAssetInfo.StandByTimeInHours} name="StandByTimeInHours" disabled={true} type="number" className="form-control"></input>
                                            <div className="small text-danger"> {t(errors['StandByTimeInHours'])}</div>
                                        </div>
                                    </div>
                                    <div className="row">

                                        {/* AssetCondition */}
                                        <div className="col mb-1">
                                            <label className='red-asterisk'>{t('update_assets_label_asset_condition')}</label>
                                            <Select
                                                value={masterData.ProductPreAmcCondition && masterData.ProductPreAmcCondition.find(option => option.value == contractAssetInfo.ProductConditionId) || null}
                                                options={masterData.ProductPreAmcCondition}
                                                isDisabled={true}
                                                isSearchable
                                                name="ProductCondition"
                                            />
                                            <div className="small text-danger"> {t(errors['ProductCondition'])}</div>
                                        </div>
                                        {/* IsPreventiveMaintenanceNeeded */}
                                        <div className="mb-1 col">
                                            <label className='red-asterisk'>{t('update_assets_label_is_preventive_maintenance_needed')}</label>
                                            <select value={contractAssetInfo.IsPreventiveMaintenanceNeeded.valueOf().toString()} name="IsPreventiveMaintenanceNeeded" disabled={true} className="form-select">
                                                <option value={"True"}>{t('update_assets_select_is_preventive_maintenance_needed_yes')}</option>
                                                <option value={"False"}>{t('update_assets_select_is_preventive_maintenance_needed_no')}</option>
                                            </select>
                                            <div className="small text-danger"> {t(errors['IsPreventiveMaintenanceNeeded'])}</div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        {/* PreventiveMaintenanceFrequency */}
                                        {contractAssetInfo.IsPreventiveMaintenanceNeeded == "True" && (
                                            <div className="col md-1">
                                                <label className='red-asterisk'>{t('update_assets_label_preventive_maintenance_frequency')}</label>
                                                <Select
                                                    value={masterData.PreventiveMaintenanceFrequency && masterData.PreventiveMaintenanceFrequency.find(option => option.value == contractAssetInfo.PreventiveMaintenanceFrequencyId) || null}
                                                    options={masterData.PreventiveMaintenanceFrequency}
                                                    isDisabled={true}
                                                    isSearchable
                                                    name="PreventiveMaintenanceFrequency"
                                                />
                                                <div className="small text-danger"> {t(errors['PreventiveMaintenanceFrequency'])}</div>
                                            </div>
                                        )}
                                        {/* ProductSupportType */}
                                        <div className='mb-1 col'>
                                            <label className=" red-asterisk">{t('update_assets_label_asset_support_type')}</label>
                                            <Select
                                                value={masterData.ProductSupportType && masterData.ProductSupportType.find(option => option.value == contractAssetInfo.ProductSupportTypeId) || null}
                                                options={masterData.ProductSupportType}
                                                isDisabled={true}
                                                isSearchable
                                                name="ProductSupportType"
                                            />
                                            <div className="small text-danger"> {t(errors['ProductSupportType'])}</div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        {/* WarrantyEndDate */}
                                        <div className="">
                                            <label >{t('update_assets_label_asset_warranty_end_date')}</label>
                                            <input value={contractAssetInfo.WarrantyEndDate ? contractAssetInfo?.WarrantyEndDate.split('T')[0] : ""} name="WarrantyEndDate" disabled={true} type="date" className="form-control"></input>
                                            <div className="small text-danger"> {t(errors['WarrantyEndDate'])}</div>
                                        </div>
                                    </div>
                                    <button type="button" onClick={onSubmit} className="btn app-primary-bg-color text-white mt-2">
                                        {t('update_assets_button')}
                                    </button>
                                    {/* Update assets form ends here */}
                                </div>
                            </ContainerPage>
                        </div>
                    </div>
                </div>
            </div>
            <>
                {displayInformationModal ? <InformationModal /> : ""}
            </>
        </>
    );

    async function onLoad() {
        store.dispatch(initializeAsset());
        try {
            if (visibleModal == "UpdateAsset") {
                store.dispatch(startPreloader())
                const { AssetProductCategoryNames } = await getAssetProductCategoryNames()
                setProductCategoryList(formatSelectInput(AssetProductCategoryNames, "CategoryName", "Id"))

                const { MakeNames } = await getPartMake()
                setProductMakeList(formatSelectInput(MakeNames, "Name", "Id"))

                const Customers = await getContractCustomerSites(ContractId);
                store.dispatch(loadCustomerSite(Customers));

                var { MasterData } = await getValuesInMasterDataByTable("ProductSupportType")
                const ProductSupportType = await formatSelectInput(MasterData, "Name", "Id")
                store.dispatch(loadMasterData({ name: "ProductSupportType", value: { Select: ProductSupportType } }));

                var { MasterData } = await getValuesInMasterDataByTable("PreventiveMaintenanceFrequency")
                const PreventiveMaintenanceFrequency = await formatSelectInput(MasterData, "Name", "Id")
                store.dispatch(loadMasterData({ name: "PreventiveMaintenanceFrequency", value: { Select: PreventiveMaintenanceFrequency } }));

                var { MasterData } = await getValuesInMasterDataByTable("SLAType")
                const SLAType = await formatSelectInput(MasterData, "Name", "Id")
                store.dispatch(loadMasterData({ name: "SLAType", value: { Select: SLAType } }));

                var { MasterData } = await getValuesInMasterDataByTable("ProductPreAmcCondition")
                const ProductPreAmcCondition = await formatSelectInput(MasterData, "Name", "Id")
                store.dispatch(loadMasterData({ name: "ProductPreAmcCondition", value: { Select: ProductPreAmcCondition } }));

                const { ServiceEngineers } = await getRegionWiseServiceEngineers();
                const ServiceEngineer = await formatSelectInput(ServiceEngineers, "FullName", "Id")
                store.dispatch(loadMasterData({ name: "ServiceEngineers", value: { Select: ServiceEngineer } }));
                store.dispatch(stopPreloader())
            }
        } catch (error) {
            console.error(error);
        }
    }

}

function onSelectChange(selectedOption: any, Name: any) {
    var value = selectedOption.value
    var name = Name.name
    store.dispatch(updateField({ name: name as keyof UpdateAssetDetails['contractAssetInfo'], value }));
}