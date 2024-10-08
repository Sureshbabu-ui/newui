import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ValidationErrors } from '../../../../types/error';
import { ContractDocumentCreation } from '../../../../types/contractDocument';

export interface CreateDocumentState {
  documents: ContractDocumentCreation;
  errors: ValidationErrors;
  submitting: boolean;
  displayInformationModal: boolean;
}

const initialState: CreateDocumentState = {
  documents: {
    ContractId: "",
    DocumentCategoryId: "",
    DocumentUrl: "",
    DocumentTypeId: 0,
    DocumentFile: null,
    DocumentSize: 0,
    DocumentDescription: "",
  },
  errors: {},
  submitting: false,
  displayInformationModal: false,
};

const slice = createSlice({
  name: 'contractdocumentcreate',
  initialState,
  reducers: {
    initializeContractDocument: () => initialState,
    updateField: (
      state,
      { payload: { name, value } }: PayloadAction<{ name: keyof CreateDocumentState['documents']; value: any }>
    ) => {
      state.documents[name] = value;
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
  },
});

export const {
  initializeContractDocument,
  updateField,
  updateErrors,
  startSubmitting,
  toggleInformationModalStatus,
  stopSubmitting,
} = slice.actions;
export default slice.reducer;