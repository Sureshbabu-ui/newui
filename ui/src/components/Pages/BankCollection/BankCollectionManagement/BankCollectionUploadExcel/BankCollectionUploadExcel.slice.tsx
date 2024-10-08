import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BankCollectionDocumentUpload } from '../../../../../types/bankCollection';
import { ValidationErrors } from '../../../../../types/error';
import { valuesInMasterDataByTableDetailsSelect, valuesInMasterDataByTableSelect } from '../../../../../types/masterData';

export interface BankCollectionUploadState {
  documents: BankCollectionDocumentUpload;
  errors: ValidationErrors;
  submitting: boolean;
  displayInformationModal: boolean;
  filteredTenantBankAccounts: valuesInMasterDataByTableDetailsSelect[]
}

const initialState: BankCollectionUploadState = {
  documents: {
    TenantBankAccountId: 1,
    BankCollectionFile: null,
  },
  filteredTenantBankAccounts: [],
  errors: {},
  submitting: false,
  displayInformationModal: false,
};

const slice = createSlice({
  name: 'bankcollectionuploadexcel',
  initialState,
  reducers: {
    initializeCollectionExcelUpload: () => initialState,
    updateField: (
      state,
      { payload: { name, value } }: PayloadAction<{ name: keyof BankCollectionUploadState['documents']; value: any }>
    ) => {
      state.documents[name] = value;
    },

    loadTenantBankNames: (state, { payload: Banks }: PayloadAction<valuesInMasterDataByTableSelect>) => {
      state.filteredTenantBankAccounts = Banks.MasterData
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
  initializeCollectionExcelUpload,
  loadTenantBankNames,
  updateField,
  updateErrors,
  startSubmitting,
  toggleInformationModalStatus,
  stopSubmitting,
} = slice.actions;
export default slice.reducer;