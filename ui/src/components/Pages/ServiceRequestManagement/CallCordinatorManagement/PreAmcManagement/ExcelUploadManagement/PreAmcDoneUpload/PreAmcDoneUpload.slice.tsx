import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ValidationErrors } from '../../../../../../../types/error';
import { PreAmcDoneAssetDetails, PreAmcDoneAssetsDetails } from '../../../../../../../types/assets';

export interface PreAmcDoneUploadUploadState {
  assets: PreAmcDoneAssetDetails[],
  selectedAssets: PreAmcDoneAssetDetails[],
  errors: ValidationErrors;
  submitting: boolean;
  displayInformationModal: boolean;
}

const initialState: PreAmcDoneUploadUploadState = {
  assets: [],
  selectedAssets: [],
  errors: {},
  submitting: false,
  displayInformationModal: false,
};

const slice = createSlice({
  name: 'preamcdonebulkupload',
  initialState,
  reducers: {
    initializePreAmcDoneAssetsUpload: () => initialState,
    loadPreAmcDoneAssetDetails: (state, { payload: { AssetDetails } }: PayloadAction<PreAmcDoneAssetsDetails>) => {
      state.assets = AssetDetails.map((assets) => (assets));
    },
    loadSelectedPreAmcDoneAssets: (state, { payload: Assets }: PayloadAction<PreAmcDoneAssetDetails[]>) => {
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
  initializePreAmcDoneAssetsUpload,
  updateErrors,
  toggleInformationModalStatus,
  loadPreAmcDoneAssetDetails,
  loadSelectedPreAmcDoneAssets,
} = slice.actions;
export default slice.reducer;