import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ValidationErrors } from '../../../../../../../types/error';
import { BackToBackAssetDetails, BackToBackAssetsDetails, SelectedBackToBackAssetDetails } from '../../../../../../../types/assets';

export interface BackToBackVendorUploadState {
  assets: BackToBackAssetDetails[],
  selectedAssets: BackToBackAssetDetails[],
  errors: ValidationErrors;
  submitting: boolean;
  displayInformationModal: boolean;
}

const initialState: BackToBackVendorUploadState = {
  assets: [],
  selectedAssets: [],
  errors: {},
  submitting: false,
  displayInformationModal: false,
};

const slice = createSlice({
  name: 'backtobackvendorupload',
  initialState,
  reducers: {
    initializebackToBackVendorUpload: () => initialState,
    loadBackToBackAssetDetails: (state, { payload: { AssetDetails } }: PayloadAction<BackToBackAssetsDetails>) => {
      state.assets = AssetDetails.map((site) => (site));
    },
    loadSelectedBackToBackAssets: (state, { payload: Assets }: PayloadAction<BackToBackAssetDetails[]>) => {
      state.selectedAssets = Assets
    },
    updateErrors: (state, { payload: errors }: PayloadAction<ValidationErrors>) => {
      state.errors = errors;
    },
    toggleInformationModalStatus: (state) => {
      state.displayInformationModal = !state.displayInformationModal;
    },
  },
});

export const {
  initializebackToBackVendorUpload,
  updateErrors,
  toggleInformationModalStatus,
  loadBackToBackAssetDetails,
  loadSelectedBackToBackAssets,
} = slice.actions;
export default slice.reducer;