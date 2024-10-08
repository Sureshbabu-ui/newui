import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ValidationErrors } from '../../../../types/error';
import { MultipleCustomerSites } from '../../../../types/customer';
import { AssetsCreation, Configurations, Select, SelectDetails } from '../../../../types/assets';

export interface MasterData {
  ProductSupportType: Select[],
  PreventiveMaintenanceFrequency: Select[]
  SLAType: Select[],
  ProductPreAmcCondition: Select[],
  ServiceEngineers: Select[]
}
export interface CreateAssetsState {
  entitiesList: Configurations
  assets: AssetsCreation;
  errors: ValidationErrors;
  submitting: boolean;
  masterData: MasterData;
  displayInformationModal: boolean;
  ProductModelNames: Select[];
}

const initialState: CreateAssetsState = {
  entitiesList: {
    CustomerSiteId: [],
  },
  ProductModelNames: [],
  masterData: {
    ProductSupportType: [],
    PreventiveMaintenanceFrequency: [],
    SLAType: [],
    ProductPreAmcCondition: [],
    ServiceEngineers: []
  },
  assets: {
    ContractId: 0,
    SiteNameId: 0,
    ProductCategoryId: 0,
    ProductMakeId: 0,
    ProductId: 0,
    AssetSerialNumber: '',
    AccelAssetId: null,
    IsEnterpriseAssetId: -1,
    ResponseTimeInHours: 0,
    ResolutionTimeInHours: 0,
    StandByTimeInHours: 0,
    IsVipAssetId: -1,
    IsOutsourcingNeededId: -1,
    IsPreAmcCompleted: -1,
    PreAmcCompletedDate: null,
    PreAmcCompletedBy: null,
    AMCValue: 0,
    AssetConditionId: 0,
    IsPreventiveMaintenanceNeededId: -1,
    PreventiveMaintenanceFrequencyId: null,
    WarrantyEndDate: null,
    AmcStartDate: '',
    AmcEndDate: '',
    CustomerAssetId: null,
    AssetSupportTypeId: 0,
    IsRenewedAsset: -1
  },
  errors: {},
  submitting: false,
  displayInformationModal: false,
};

const slice = createSlice({
  name: 'assetscreate',
  initialState,
  reducers: {
    initializeAsset: () => initialState,
    loadMasterData: (state, { payload: { name, value: { Select } } }: PayloadAction<{ name: keyof CreateAssetsState['masterData']; value: SelectDetails }>) => {
      state.masterData[name] = Select.map((masterData) => (masterData))
    },
    loadCustomerSite: (state, { payload: { ContractCustomerSites } }: PayloadAction<MultipleCustomerSites>) => {
      state.entitiesList.CustomerSiteId = ContractCustomerSites.map((customerSite) => customerSite);
    },
    updateField: (
      state,
      { payload: { name, value } }: PayloadAction<{ name: keyof CreateAssetsState['assets']; value: any }>
    ) => {
      if ((name == "CustomerAssetId" || name == "AccelAssetId") && value == "") {
        value = null
      }
      state.assets[name] = value as never;
    },
    updateErrors: (state, { payload: errors }: PayloadAction<ValidationErrors>) => {
      state.errors = errors;
    },
    startSubmitting: (state) => {
      state.submitting = true;
    },
    stopSubmitting: (state) => {
      state.submitting = false;
    },
    toggleInformationModalStatus: (state) => {
      state.displayInformationModal = !state.displayInformationModal;
    },
    loadModalNames: (state, { payload: { Select } }: PayloadAction<SelectDetails>) => {
      state.ProductModelNames = Select.map((SelectDetails) => SelectDetails);
    },
    initializeAssetCreateDeatil: (state) => {
      state.assets = initialState.assets;
    },
  },
});

export const {
  initializeAsset,
  updateField,
  updateErrors,
  startSubmitting,
  toggleInformationModalStatus,
  stopSubmitting,
  loadCustomerSite,
  loadMasterData,
  initializeAssetCreateDeatil,
  loadModalNames
} = slice.actions;
export default slice.reducer;