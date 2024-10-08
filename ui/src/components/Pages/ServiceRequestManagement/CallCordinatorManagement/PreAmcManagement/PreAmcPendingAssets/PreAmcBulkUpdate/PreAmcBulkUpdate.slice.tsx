import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ValidationErrors } from '../../../../../../../types/error';

export interface PreAmcDetails {
  PreAmcCompletedDate: string
  EngineerId: number
}


export interface UpdatePreAMCDetails {
  errors: ValidationErrors;
  displayInformationModal: boolean;
  selectedContractAssets: number[];
  AssetIdList: string;
  preAmcDetails: PreAmcDetails
}

const initialState: UpdatePreAMCDetails = {
  errors: {},
  displayInformationModal: false,
  selectedContractAssets: [],
  AssetIdList: '',
  preAmcDetails: {
    EngineerId: 0,
    PreAmcCompletedDate: ""
  }
};

const slice = createSlice({
  name: 'preamcbulkupdate',
  initialState,
  reducers: {
    initializeAsset: () => initialState,
    updateField: (
      state,
      { payload: { name, value } }: PayloadAction<{ name: keyof UpdatePreAMCDetails['preAmcDetails']; value: string }>
    ) => {
      state.preAmcDetails[name] = value as never
    },
    updateErrors: (state, { payload: errors }: PayloadAction<ValidationErrors>) => {
      state.errors = errors;
    },
    toggleInformationModalStatus: (state) => {
      state.displayInformationModal = !state.displayInformationModal;
    },
    assetsSelected: (
      state, { payload: assetId }: PayloadAction<any>) => {
      if (state.selectedContractAssets.includes(assetId) == false) {
        state.selectedContractAssets.push(assetId);
      }
      state.AssetIdList = state.selectedContractAssets.join(",");
    },
    assetsUnSelected: (state, { payload: assetId }: PayloadAction<any>) => {
      var index = state.selectedContractAssets.indexOf(assetId);
      if (index !== -1) {
        state.selectedContractAssets.splice(index, 1);
      }
      state.AssetIdList = state.selectedContractAssets.join(",");
    },
    selectAllAssets: (state, { payload: { selectStaus, selectedId } }: PayloadAction<{ selectStaus: boolean, selectedId: number[] }>) => {
      if (selectStaus == true) {
        state.selectedContractAssets = selectedId;
        state.AssetIdList = state.selectedContractAssets.join(",");
      } else {
        state.selectedContractAssets = [];
        state.AssetIdList = ""
      }
    },
  },
});

export const {
  initializeAsset,
  updateField,
  updateErrors,
  toggleInformationModalStatus,
  assetsSelected,
  assetsUnSelected,
  selectAllAssets
} = slice.actions;
export default slice.reducer;