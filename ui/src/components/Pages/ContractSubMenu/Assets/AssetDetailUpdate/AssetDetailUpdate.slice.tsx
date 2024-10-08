import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ValidationErrors } from '../../../../../types/error';
import { MultipleCustomerSites } from '../../../../../types/customer';
import { AssetDetails, AssetEditDetails, AssetsCreation, Configurations, Select, SelectDetails, SelectedAssetInfo, UpdateAssetDetail } from '../../../../../types/assets';

export interface MasterData {
  ProductSupportType: Select[],
  PreventiveMaintenanceFrequency: Select[]
  SLAType: Select[],
  ProductPreAmcCondition: Select[],
  ServiceEngineers: Select[],
}
export interface UpdateAssetDetails {
  entitiesList: Configurations
  errors: ValidationErrors;
  submitting: boolean;
  masterData: MasterData;
  displayInformationModal: boolean;
  ProductModelNames: Select[];
  contractAssetInfo: SelectedAssetInfo;
}

const initialState: UpdateAssetDetails = {
  entitiesList: {
    CustomerSiteId: [],
  },
  contractAssetInfo: {
    Id: 0,
    AmcEndDate: "",
    AmcStartDate: "",
    AmcValue: 0,
    IsEnterpriseProduct: "",
    IsPreAmcCompleted: "",
    IsPreventiveMaintenanceNeeded: "",
    IsVipProduct: "",
    CustomerAssetId: "",
    ProductSerialNumber: "",
    ProductSupportTypeId: 0,
    ResolutionTimeInHours: 0,
    ResponseTimeInHours: 0,
    StandByTimeInHours: 0,
    WarrantyEndDate: "",
    CustomerSiteId: 0,
    IsOutSourcingNeeded: "",
    MspAssetId: "",
    PreAmcCompletedDate: "",
    PreAmcCompletedBy: 0,
    PreventiveMaintenanceFrequencyId: null,
    ProductCategoryId: 0,
    ProductConditionId: 0,
    ProductMakeId: 0,
    ProductModelId: 0,
    IsActive: false,
  },
  ProductModelNames: [],
  masterData: {
    ProductSupportType: [],
    PreventiveMaintenanceFrequency: [],
    SLAType: [],
    ProductPreAmcCondition: [],
    ServiceEngineers: [],
  },
  errors: {},
  submitting: false,
  displayInformationModal: false,
};

const slice = createSlice({
  name: 'assetdetailupdate',
  initialState,
  reducers: {
    initializeAsset: () => initialState,
    loadMasterData: (state, { payload: { name, value: { Select } } }: PayloadAction<{ name: keyof UpdateAssetDetails['masterData']; value: SelectDetails }>) => {
      state.masterData[name] = Select.map((masterData) => (masterData))
    },
    loadCustomerSite: (state, { payload: { ContractCustomerSites } }: PayloadAction<MultipleCustomerSites>) => {
      state.entitiesList.CustomerSiteId = ContractCustomerSites.map((customerSite) => customerSite);
    },
    updateField: (
      state,
      { payload: { name, value } }: PayloadAction<{ name: keyof UpdateAssetDetails['contractAssetInfo']; value: any }>
    ) => {
      state.contractAssetInfo[name] = value as never;
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
    loadAssetEditDetails: (state, { payload: { ContractAssetInfo } }: PayloadAction<AssetEditDetails>) => {
      state.contractAssetInfo = ContractAssetInfo;
    },
    initializeAssetUpdateDeatil: (state) => {
      state.contractAssetInfo = initialState.contractAssetInfo;
    },
  },
});

export const {
  initializeAsset,
  updateField,
  updateErrors,
  startSubmitting,
  initializeAssetUpdateDeatil,
  toggleInformationModalStatus,
  stopSubmitting,
  loadCustomerSite,
  loadMasterData,
  loadModalNames,
  loadAssetEditDetails
} = slice.actions;
export default slice.reducer;