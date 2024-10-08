import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PreAmcAssetUpdateDetail, SelectedAsset, SelectedAssetDetails } from '../../../../../../../types/assets';
import { ValidationErrors } from '../../../../../../../types/error';

export interface UpdatePreAMCDetails {
  errors: ValidationErrors;
  submitting: boolean;
  displayInformationModal: boolean;
  assetInfo: SelectedAssetDetails;
  preAmcInfo: PreAmcAssetUpdateDetail
  IsAssetInfo: boolean,
}

const initialState: UpdatePreAMCDetails = {
  assetInfo: {
    Id: 0,
    AssetProductCategory: "",
    ProductMake: "",
    ProductModel: "",
    ProductSerialNumber: "",
    MspAssetId: "",
    CustomerAssetId: "",
    AmcEndDate: "",
    IsEnterpriseProduct: false,
    IsOutSourcingNeeded: false,
    VendorBranch: "",
    IsPreventiveMaintenanceNeeded: false,
    ResolutionTimeInHours: 0,
    ResponseTimeInHours: 0,
    StandByTimeInHours: 0,
    IsVipProduct: false,
    ProductCondition: "",
    WarrantyEndDate: "",
    CustomerSite: "",
    ProductSupportType: "",
    PreventiveMaintenanceFrequency: "",
  },
  preAmcInfo: {
    Id: 0,
    IsPreAmcCompleted: false,
    PreAmcCompletedDate: "",
    EngineerId: 0,
  },
  IsAssetInfo: false,
  errors: {},
  submitting: false,
  displayInformationModal: false,
};

const slice = createSlice({
  name: 'preamcupdate',
  initialState,
  reducers: {
    initializeAsset: () => initialState,
    updateField: (
      state,
      { payload: { name, value } }: PayloadAction<{ name: keyof UpdatePreAMCDetails['preAmcInfo']; value: any }>
    ) => {
      state.preAmcInfo[name] = value as never;
      if (name == "IsPreAmcCompleted" && value == false) {
        state.preAmcInfo.EngineerId = 0
        state.preAmcInfo.PreAmcCompletedDate = ""
        state.errors = {}
      }
    },
    updateErrors: (state, { payload: errors }: PayloadAction<ValidationErrors>) => {
      state.errors = errors;
    },
    toggleInformationModalStatus: (state) => {
      state.displayInformationModal = !state.displayInformationModal;
    },
    setIsAssetInfo: (state, { payload: IsAssetDetails }) => {
      state.IsAssetInfo = IsAssetDetails;
    },
    loadAssetDetails: (state, { payload: { AssetDetails } }: PayloadAction<SelectedAsset>) => {
      state.assetInfo = AssetDetails;
    },
  },
});

export const {
  initializeAsset,
  updateField,
  updateErrors,
  setIsAssetInfo,
  toggleInformationModalStatus,
  loadAssetDetails
} = slice.actions;
export default slice.reducer;