import { store } from '../../../../state/store';
import { useStore, useStoreWithInitializer } from '../../../../state/storeHooks';
import SweetAlert from 'react-bootstrap-sweetalert';
import { ContainerPage } from '../../../ContainerPage/ContainerPage';
import { useTranslation } from 'react-i18next';
import { startPreloader, stopPreloader } from '../../../Preloader/Preloader.slice';
import { AssetsCreation } from '../../../../types/assets';
import {
  CreateAssetsState,
  initializeAsset,
  loadCustomerSite,
  startSubmitting,
  stopSubmitting,
  toggleInformationModalStatus,
  updateErrors,
  updateField,
  loadMasterData,
  loadModalNames,
  initializeAssetCreateDeatil,
} from './CreateAssets.slice';
import { getContractCustomerSites } from '../../../../services/customer';
import { createAssets, getAssetList } from '../../../../services/assets';
import { useParams } from 'react-router-dom';
import { useRef } from 'react';
import * as yup from 'yup';
import { useEffect, useState } from 'react';
import Select from 'react-select';
import { convertBackEndErrorsToValidationErrors, formatSelectInput } from '../../../../helpers/formats';
import { getPartMake } from '../../../../services/part';
import { loadAssets } from './AssetsList.slice';
import { getValuesInMasterDataByTable } from '../../../../services/masterData';
import { getProductModelNames } from '../../../../services/serviceRequest';
import { ValidationErrorComp } from '../../../ValidationErrors/ValidationError';
import { getAssetProductCategoryNames } from '../../../../services/assetProductCategory';
import { getRegionWiseServiceEngineers } from '../../../../services/users';

export function CreateAssets() {
  const modalRef = useRef<HTMLButtonElement>(null);
  const { t, i18n } = useTranslation();
  const { assetscreate: { entitiesList, errors, assets, displayInformationModal, ProductModelNames, masterData }, assetslist: { visibleModal } } = useStore(
    ({ assetscreate, assetslist }) => ({ assetscreate, assetslist }));
  const { ContractId } = useParams<{ ContractId: string }>();

  useEffect(() => {
    onLoad();
  }, [ContractId != null && visibleModal == "CreateNewAssets"]);

  const validationSchema = yup.object().shape({
    SiteNameId: yup.number().moreThan(0, ('validation_error_create_asset_customersite_required')),
    ProductCategoryId: yup.number().moreThan(0, ('validation_error_create_asset_asset_category_required')),
    ProductMakeId: yup.number().moreThan(0, ('validation_error_create_asset_assetmake_required')),
    ProductId: yup.number().moreThan(0, ('validation_error_create_asset_asset_model_required')),
    AssetSerialNumber: yup.string().required(('validation_error_create_asset_serielno_required')),
    IsEnterpriseAssetId: yup.number().moreThan(-1, ('validation_error_create_asset_enterprise_asset_required')),
    ResponseTimeInHours: yup.number().moreThan(0, ('Validation_error_create_asset_responsetime_required')),
    ResolutionTimeInHours: yup.number().moreThan(0, ('validation_error_create_asset_resolutiontime_required')),
    StandByTimeInHours: yup.number().moreThan(0, ('validation_error_create_asset_standbytime_required')
    ),
    IsVipAssetId: yup.number().moreThan(-1, ('validation_error_create_asset_vip_asset_required') ?? ''),
    IsRenewedAsset: yup.number().moreThan(-1, ('validation_error_create_asset_isrenewed_asset_required') ?? ''),
    AMCValue: yup.number().moreThan(0, 'validation_error_create_asset_amcvalue_required').typeError('validation_error_create_asset_amcvalue_required').max(99999999999999.99, ('validation_error_create_asset_amcvalue_exceeds')),
    IsOutsourcingNeededId: yup.number().moreThan(-1, t('validation_error_create_asset_outsourcing_required') ?? ''),
    IsPreventiveMaintenanceNeededId: yup.number().moreThan(-1, t('validation_error_create_asset_preventive_maintenance_needed_required') ?? ''),
    PreventiveMaintenanceFrequencyId: yup.string().when('IsPreventiveMaintenanceNeededId', (IsPreventiveMaintenanceNeededId, schema) =>
      assets.IsPreventiveMaintenanceNeededId == "1" || assets.IsPreventiveMaintenanceNeededId == 1
        ? schema.required('Validation_error_create_asset_pm_frequency_required')
        : schema.nullable()
    ),
    IsPreAmcCompleted: yup.number().moreThan(-1, t('validation_error_create_asset_pre_amc_completed_required') ?? ''),
    PreAmcCompletedDate: yup.string().when('IsPreAmcCompleted', (IsPreAmcCompleted, schema) =>
      assets.IsPreAmcCompleted === "1" || assets.IsPreAmcCompleted === 1
        ? schema
          .required('validation_error_update_asset_preamc_completed_required')
          .test('is-future', "validation_error_update_preamc_completed_date_validation", function (value) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return !value || new Date(value) <= today;
          })
        : schema.nullable()
    ),
    PreAmcCompletedBy: yup.string().when('IsPreAmcCompleted', (IsPreAmcCompleted, schema) =>
      assets.IsPreAmcCompleted === "1" || assets.IsPreAmcCompleted === 1
        ? schema.required('validation_error_update_asset_preamc_completedby_required')
        : schema.nullable()
    ),
    AssetConditionId: yup.number().moreThan(0, t('validation_error_create_asset_assets_condition_required') ?? ''),
    AssetSupportTypeId: yup.number().moreThan(0, t('validation_error_create_asset_assets_support_type_required') ?? ''),
    AmcStartDate: yup.string().required(t('validation_error_create_asset_amc_startdate_required') ?? ''),
    AmcEndDate: yup.string().required(t('validation_error_create_asset_amc_enddate_required') ?? ''),
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
        {t('create_assets_assets_created_successfully')}
      </SweetAlert>
    );
  }

  useEffect(() => {
    if (assets.ProductCategoryId != 0 && assets.ProductMakeId != 0) {
      getFilteredModelName()
      store.dispatch(updateField({ name: 'ProductId', value: 0 }));
    }
  }, [assets.ProductCategoryId, assets.ProductMakeId])

  const getFilteredModelName = async () => {
    const { ModelNames } = await getProductModelNames(assets.ProductCategoryId, assets.ProductMakeId)
    const ModelName = await (formatSelectInput(ModelNames, "ModelName", "Id"))
    store.dispatch(loadModalNames({ Select: ModelName }));
  }

  const reDirectRoute = async () => {
    store.dispatch(toggleInformationModalStatus());
    modalRef.current?.click()
    document.getElementById("closeCreatedAssetModal")?.click();
    store.dispatch(initializeAssetCreateDeatil())
    var result = await getAssetList("", 1, ContractId);
    store.dispatch(loadAssets(result));
  }
  const onModalClose = () => {
    store.dispatch(initializeAssetCreateDeatil())
    setSelectCustomerSiteIdList(formatSelectInput(entitiesList.CustomerSiteId, "SiteName", "Id"))
  }

  function onUpdateField(ev: any) {
    var name = ev.target.name;
    var value = ev.target.value;
    if (ev.target.name === 'IsPreAmcCompleted' && value === "1") {
      store.dispatch(updateField({ name: 'PreAmcCompletedDate', value: null }));
      store.dispatch(updateField({ name: 'PreAmcCompletedBy', value: null }));
    }
    if (name === 'WarrantyEndDate' && value == "") {
      store.dispatch(updateField({ name: 'WarrantyEndDate', value: null }));
    }
    else
      store.dispatch(updateField({ name: name as keyof CreateAssetsState['assets'], value }));
  }

  return (
    <div
      className="modal fade px-0"
      id="CreateNewAssets"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-fullscreen">
        <div className="modal-content">
          <div className="modal-header mx-3">
            <h5 className="modal-title app-primary-color">{t('assets_management_create_new_assets')}</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              id="closeCreatedAssetModal"
              aria-label="Close"
              onClick={onModalClose}
            >
            </button>
          </div>
          <div className="modal-body">
            <ContainerPage>
              <ValidationErrorComp errors={errors} />
              <div className="col-md-12" >
                {/* Create Assets form */}
                {/* Customer Site */}
                <div className="mb-1">
                  <label className='red-asterisk'>{t('create_assets_label_customer_site')}</label>
                  <Select
                    value={selectCustomerSiteIdList && selectCustomerSiteIdList.find(option => option.value == assets.SiteNameId) || null}
                    options={selectCustomerSiteIdList}
                    onChange={(selectedOption) => onSelectChange(selectedOption, "SiteNameId")}
                    isSearchable
                    name="SiteNameId"
                    placeholder="Select option"
                  />
                  <div className="small text-danger"> {t(errors['SiteNameId'])}</div>
                </div>
                {/* CustomerAssetId */}
                <div className="mb-1">
                  <div className="col-md-12">
                    <label>{t('create_assets_label_customer_asset_id')}</label>
                    <input value={assets.CustomerAssetId ?? ""} name="CustomerAssetId" onChange={onUpdateField} type="text" className={`form-control  ${errors["CustomerAssetId"] ? "is-invalid" : ""}`} ></input>
                  </div>
                </div>

                {/* MspAssetId */}
                <div className="mb-1">
                  <div className="col-md-12">
                    <label>{t('create_assets_label_msp_asset_id')}</label>
                    <input value={assets.AccelAssetId ?? ""} name="AccelAssetId" onChange={onUpdateField} type="text" className={`form-control  ${errors["AccelAssetId"] ? "is-invalid" : ""}`} ></input>
                  </div>
                </div>

                {/* Product category */}
                <div className='mb-2'>
                  <label className="mt-2 red-asterisk">{t('create_assets_label_asset_category')}</label>
                  <Select
                    value={productCategoryList && productCategoryList.find(option => option.value == assets.ProductCategoryId) || null}
                    options={productCategoryList}
                    onChange={(selectedOption) => onSelectChange(selectedOption, "ProductCategoryId")}
                    isSearchable
                    name="ProductCategoryId"
                    placeholder="Select option"
                  />
                  <div className="small text-danger"> {t(errors['ProductCategoryId'])}</div>
                </div>

                {/* Product make */}
                <div className='mb-1'>
                  <label className=" red-asterisk">{t('create_assets_label_asset_make')}</label>
                  <Select
                    value={productMakeList && productMakeList.find(option => option.value == assets.ProductMakeId) || null}
                    options={productMakeList}
                    onChange={(selectedOption) => onSelectChange(selectedOption, "ProductMakeId")}
                    isSearchable
                    name="ProductMakeId"
                    placeholder="Select option"
                  />
                  <div className="small text-danger"> {t(errors['ProductMakeId'])}</div>
                </div>

                {/* Product model */}
                <div className='mb-1'>
                  <label className="red-asterisk">{t('create_assets_label_asset_model')}</label>
                  <Select
                    value={ProductModelNames && ProductModelNames.find(option => option.value == assets.ProductId) || null}
                    options={ProductModelNames}
                    onChange={(selectedOption) => onSelectChange(selectedOption, "ProductId")}
                    isSearchable
                    name="ProductId"
                    placeholder="Select option"
                  />
                  <div className="small text-danger"> {t(errors['ProductId'])}</div>
                </div>

                {/* Product seriel number */}
                <div className="mb-1">
                  <div className="col-md-12">
                    <label className='red-asterisk'>{t('create_assets_label_asset_serial_number')}</label>
                    <input value={assets.AssetSerialNumber} name="AssetSerialNumber" onChange={onUpdateField} type="text" className={`form-control  ${errors["AssetId"] ? "is-invalid" : ""}`}></input>
                    <div className="small text-danger"> {t(errors['AssetSerialNumber'])}</div>
                  </div>
                </div>
                {/* Is Enterprise Product */}
                <div className="mb-1">
                  <label className='red-asterisk'>{t('create_assets_label_is_enterprise_asset')}</label>
                  <select value={assets.IsEnterpriseAssetId} name="IsEnterpriseAssetId" onChange={onUpdateField} className="form-select">
                    <option value={-1} selected>
                      {t('create_assets_select_is_enterprise_asset')}
                    </option>
                    <option value="1">{t('create_assets_select_is_enterprise_asset_yes')}</option>
                    <option value="0">{t('create_assets_select_is_enterprise_asset_no')}</option>
                  </select>
                  <div className="small text-danger"> {t(errors['IsEnterpriseAssetId'])}</div>
                </div>
                {/* ResponseTimeInHours */}
                <div className="mb-1">
                  <label className='red-asterisk'>{t('create_assets_label_response_time_in_hours')}</label>
                  <input value={assets.ResponseTimeInHours} name="ResponseTimeInHours" onChange={onUpdateField} type="number" className="form-control"></input>
                  <div className="small text-danger"> {t(errors['ResponseTimeInHours'])}</div>
                </div>
                {/* ResolutionTimeInHours */}
                <div className="mb-1">
                  <label className='red-asterisk'>{t('create_assets_label_resolution_time_in_hours')}</label>
                  <input value={assets.ResolutionTimeInHours} name="ResolutionTimeInHours" onChange={onUpdateField} type="number" className="form-control"></input>
                  <div className="small text-danger"> {t(errors['ResolutionTimeInHours'])}</div>
                </div>
                {/* StandByTimeInHours */}
                <div className="mb-1">
                  <label className='red-asterisk'>{t('create_assets_label_standby_time_in_hours')}</label>
                  <input value={assets.StandByTimeInHours} name="StandByTimeInHours" onChange={onUpdateField} type="number" className="form-control"></input>
                  <div className="small text-danger"> {t(errors['StandByTimeInHours'])}</div>
                </div>

                {/* IsRenewed AssetId */}
                <div className="mb-1">
                  <label className='red-asterisk'>{t('create_assets_label_is_renewed_asset')}</label>
                  <select value={assets.IsRenewedAsset} name="IsRenewedAsset" onChange={onUpdateField} className="form-select">
                    <option value={-1} selected>
                      {t('create_assets_select_is_renewed_asset')}
                    </option>
                    <option value="1">{t('create_assets_select_is_renewed_asset_yes')}</option>
                    <option value="0">{t('create_assets_select_is_renewed_asset_no')}</option>
                  </select>
                  <div className="small text-danger"> {t(errors['IsRenewedAsset'])}</div>
                </div>

                {/* IsVipAssetId */}
                <div className="mb-1">
                  <label className='red-asterisk'>{t('create_assets_label_is_vip_asset')}</label>
                  <select value={assets.IsVipAssetId} name="IsVipAssetId" onChange={onUpdateField} className="form-select">
                    <option value={-1} selected>
                      {t('create_assets_select_is_vip_asset')}
                    </option>
                    <option value="1">{t('create_assets_select_is_vip_asset_yes')}</option>
                    <option value="0">{t('create_assets_select_is_vip_asset_no')}</option>
                  </select>
                  <div className="small text-danger"> {t(errors['IsVipAssetId'])}</div>
                </div>
                {/* AmcValue */}
                <div className="mb-1">
                  <div className="col-md-12">
                    <label className='red-asterisk'>{t('create_assets_label_amc_value')}</label>
                    <input value={assets.AMCValue} name="AMCValue" onChange={onUpdateField} type="number" className="form-control"></input>
                    <div className="small text-danger"> {t(errors['AMCValue'])}</div>
                  </div>
                </div>
                {/* IsOutsourcingNeededId */}
                <div className="mb-1">
                  <label className='red-asterisk'>{t('create_assets_label_is_outsourcing_needed')}</label>
                  <select value={assets.IsOutsourcingNeededId} name="IsOutsourcingNeededId" onChange={onUpdateField} className="form-select">
                    <option value={-1} selected>
                      {t('create_assets_select_is_outsourcing_needed')}
                    </option>
                    <option value="1">{t('create_assets_select_is_outsourcing_needed_yes')}</option>
                    <option value="0">{t('create_assets_select_is_outsourcing_needed_no')}</option>
                  </select>
                  <div className="small text-danger"> {t(errors['IsOutsourcingNeededId'])}</div>
                </div>
                {/* IsPreAmcCompleted */}
                <div className="mb-1">
                  <label className='red-asterisk'>{t('create_assets_label_is_pre_amc_completed')}</label>
                  <select value={assets.IsPreAmcCompleted} name="IsPreAmcCompleted" onChange={onUpdateField} className="form-select">
                    <option value={-1} selected>{t('create_assets_select_is_pre_amc_completed')}</option>
                    <option value={0}>{t('create_assets_select_is_pre_amc_completed_no')}</option>
                    <option value={1}>{t('create_assets_select_is_pre_amc_completed_yes')}</option>
                  </select>
                  <div className="small text-danger"> {t(errors['IsPreAmcCompleted'])}</div>
                </div>
                {/* PreAmcStartDate */}
                {assets.IsPreAmcCompleted == 1 && (
                  <>
                    <div className="mb-1 mt-1">
                      <label className='red-asterisk'>{t('create_assets_label_pre_amc_completeddate')}</label>
                      <input value={assets.PreAmcCompletedDate ?? ''} type="date" name="PreAmcCompletedDate" onChange={onUpdateField} className="form-control" max={new Date().toISOString().split("T")[0]}></input>
                      <div className="small text-danger"> {t(errors['PreAmcCompletedDate'])}</div>
                    </div>
                    {/* PreAmcEndDate */}
                    <div className="mb-1 mt-1">
                      <label className="red-asterisk">{t('update_assets_label_choose_engineer')}</label>
                      <Select
                        options={masterData.ServiceEngineers}
                        value={masterData.ServiceEngineers && masterData.ServiceEngineers.find(option => option.value == assets.PreAmcCompletedBy) || null}
                        onChange={(selectedOption) => onSelectChange(selectedOption, "PreAmcCompletedBy")}
                        isSearchable
                        classNamePrefix="react-select"
                        name="PreAmcCompletedBy"
                        placeholder="Select"
                      />
                      <div className="small text-danger"> {t(errors["PreAmcCompletedBy"])}</div>
                    </div>
                  </>
                )
                }
                {/* AssetCondition */}
                <div className="col-md-12">
                  <label className='red-asterisk'>{t('create_assets_label_asset_condition')}</label>
                  <Select
                    value={masterData.ProductPreAmcCondition && masterData.ProductPreAmcCondition.find(option => option.value == assets.AssetConditionId) || null}
                    options={masterData.ProductPreAmcCondition}
                    onChange={(selectedOption) => onSelectChange(selectedOption, "AssetConditionId")}
                    isSearchable
                    name="AssetConditionId"
                    placeholder="Select option"
                  />
                  <div className="small text-danger"> {t(errors['AssetConditionId'])}</div>
                </div>
                {/* IsPreventiveMaintenanceNeededId */}
                <div className="mb-1">
                  <label className='red-asterisk'>{t('create_assets_label_is_preventive_maintenance_needed')}</label>
                  <select value={assets.IsPreventiveMaintenanceNeededId} name="IsPreventiveMaintenanceNeededId" onChange={onUpdateField} className="form-select">
                    <option value={-1} selected>
                      {t('create_assets_select_is_preventive_maintenance_needed')}
                    </option>
                    <option value={1}>{t('create_assets_select_is_preventive_maintenance_needed_yes')}</option>
                    <option value={0}>{t('create_assets_select_is_preventive_maintenance_needed_no')}</option>
                  </select>
                  <div className="small text-danger"> {t(errors['IsPreventiveMaintenanceNeededId'])}</div>
                </div>

                {/* PreventiveMaintenanceFrequency */}
                {assets.IsPreventiveMaintenanceNeededId == 1 && (
                  <div className="col-md-12">
                    <label className='red-asterisk'>{t('create_assets_label_preventive_maintenance_frequency')}</label>
                    <Select
                      value={masterData.PreventiveMaintenanceFrequency && masterData.PreventiveMaintenanceFrequency.find(option => option.value == assets.PreventiveMaintenanceFrequencyId) || null}
                      options={masterData.PreventiveMaintenanceFrequency}
                      onChange={(selectedOption) => onSelectChange(selectedOption, "PreventiveMaintenanceFrequencyId")}
                      isSearchable
                      name="PreventiveMaintenanceFrequencyId"
                      placeholder="Select option"
                    />
                    <div className="small text-danger"> {t(errors['PreventiveMaintenanceFrequencyId'])}</div>
                  </div>
                )}
                {/* ProductSupportType */}
                <div className='mb-1'>
                  <label className="mt-2 red-asterisk">{t('create_assets_label_asset_support_type')}</label>
                  <Select
                    value={masterData.ProductSupportType && masterData.ProductSupportType.find(option => option.value == assets.AssetSupportTypeId) || null}
                    options={masterData.ProductSupportType}
                    onChange={(selectedOption) => onSelectChange(selectedOption, "AssetSupportTypeId")}
                    isSearchable
                    name="AssetSupportTypeId"
                    placeholder="Select option"
                  />
                  <div className="small text-danger"> {t(errors['AssetSupportTypeId'])}</div>
                </div>
                <div className="row">
                  {/* WarrantyEndDate */}
                  <div className="">
                    <label>{t('create_assets_label_asset_warranty_end_date')}</label>
                    <input value={assets.WarrantyEndDate ?? ""} name="WarrantyEndDate" onChange={onUpdateField} type="date" className="form-control"></input>
                  </div>
                </div>
                <div className="row">
                  {/* AmcStartDate */}
                  <div className="col-md-6">
                    <label className='red-asterisk'>{t('create_assets_label_asset_amc_start_date')}</label>
                    <input value={assets.AmcStartDate ? assets.AmcStartDate.split('T')[0] : ""} name="AmcStartDate" onChange={onUpdateField} type="date" className="form-control"></input>
                    <div className="small text-danger"> {t(errors['AmcStartDate'])}</div>
                  </div>
                  {/* AmcEndDate */}
                  <div className="col-md-6">
                    <label className='red-asterisk'>{t('create_assets_label_asset_amc_end_date')}</label>
                    <input value={assets.AmcEndDate ? assets.AmcEndDate.split('T')[0] : ""} name="AmcEndDate" onChange={onUpdateField} type="date" className="form-control"></input>
                    <div className="small text-danger"> {t(errors['AmcEndDate'])}</div>
                  </div>
                </div>
                <button type="button" onClick={onSubmit(assets)} className="btn app-primary-bg-color text-white mt-2">
                  {t('create_assets_button')}
                </button>
                {/* Create assets form ends here */}
                {displayInformationModal ? <InformationModal /> : ""}
              </div>
            </ContainerPage>
          </div>
        </div>
      </div>
    </div>
  );

  async function onLoad() {
    store.dispatch(initializeAsset());
    if (visibleModal == "CreateNewAssets") {
      try {
        store.dispatch(startPreloader());
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

        store.dispatch(updateField({ name: "ContractId", value: ContractId }));
        store.dispatch(stopPreloader());
      } catch (error) {
        console.error(error);
      }
    }
  }

  function onSubmit(assets: AssetsCreation) {
    return async (ev: React.FormEvent) => {
      ev.preventDefault();
      try {
        await validationSchema.validate(assets, { abortEarly: false });
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
      const result = await createAssets(assets)
      store.dispatch(stopSubmitting());
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
    };
  }

}

function onSelectChange(selectedOption: any, Name: any) {
  var value = selectedOption.value
  var name = Name
  store.dispatch(updateField({ name: name as keyof CreateAssetsState['assets'], value }));
}