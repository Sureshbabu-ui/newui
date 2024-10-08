import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ValidationErrors } from '../../../../types/error';
import { AssetsDetails, AssetDetails, AssetDocumentPreview } from '../../../../types/assets';

export interface CreateDocumentState {
  documents: AssetDocumentPreview;
  assets: AssetDetails[],
  ContractId: null | number,
  AssetValidations: Record<number, string[] | null>
  selectedAssets: AssetDetails[],
  errors: ValidationErrors;
  submitting: boolean;
  targetRowId: null | number;
  displayInformationModal: boolean;
}

const initialState: CreateDocumentState = {
  documents: {
    ContractId: "",
    DocumentFile: null,
  },
  assets: [],
  ContractId: null,
  selectedAssets: [],
  AssetValidations: [],
  errors: {},
  submitting: false,
  targetRowId: null,
  displayInformationModal: false,
};

const slice = createSlice({
  name: 'assetdocumentupload',
  initialState,
  reducers: {
    initializeContractDocument: () => initialState,
    updateField: (
      state,
      { payload: { name, value } }: PayloadAction<{ name: keyof CreateDocumentState['documents']; value: any }>
    ) => {
      state.documents[name] = value;
    },
    loadAssetDocumentDetails: (state, { payload: { AssetDetails, ContractId, AssetValidations } }: PayloadAction<AssetsDetails>) => {
      state.assets = AssetDetails.map((asset) => (asset));
      state.ContractId = ContractId
      state.AssetValidations = AssetValidations
    },
    loadSelectedAssets: (state, { payload: assets }: PayloadAction<AssetDetails[]>) => {
      state.selectedAssets = assets
    },
    updateErrors: (state, { payload: errors }: PayloadAction<ValidationErrors>) => {
      state.errors = errors;
    },
    toggleInformationModalStatus: (state) => {
      state.displayInformationModal = !state.displayInformationModal;
    },
    setTargetRowId: (state, { payload: rowId }) => {
      state.targetRowId = rowId
    },
  },
});

export const {
  initializeContractDocument,
  updateField,
  setTargetRowId,
  updateErrors,
  toggleInformationModalStatus,
  loadAssetDocumentDetails,
  loadSelectedAssets
} = slice.actions;
export default slice.reducer;