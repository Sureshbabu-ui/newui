import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AssetDetailForCallCordinator, AssetDetailsForCallCordinator } from '../../../../../../../types/callCordinatorManagement';

export interface CustomerProfileState {
  assetDetails: AssetDetailForCallCordinator;
}

const initialState: CustomerProfileState = {
  assetDetails: {
    CategoryName: "",
    ContractId: null,
    ProductCategoryId: null,
    Make: "",
    ModelName: null,
    ProductSerialNumber: null,
    MspAssetId: null,
    WarrantyEndDate: null,
    IsVipProduct: true,
    IsEnterpriseProduct: true,
    ProductCondition: null,
    ResponseTimeInHours: "",
    ResolutionTimeInHours: "",
    StandByTimeInHours: "",
    IsOutSourcingNeeded: true,
  },
};

const slice = createSlice({
  name: 'assetdetailsforcallcordinator',
  initialState,
  reducers: {
    initializeAssetDetailsForCallCordinator: () => initialState,
    loadAssetDetails: (state, { payload: { AssetDetails } }: PayloadAction<AssetDetailsForCallCordinator>) => {
      state.assetDetails = AssetDetails
    },
  },
});

export const {
  initializeAssetDetailsForCallCordinator,
  loadAssetDetails
} = slice.actions;

export default slice.reducer;
