import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ValidationErrors } from '../../../../types/error';
import { SiteData, SiteDetails, SiteDocumentUpload } from '../../../../types/customerSite';

export interface UploadDocumentState {
  sites: SiteDetails[],
  selectedSites: SiteDetails[],
  contractId: number | null,
  errors: ValidationErrors;
  submitting: boolean;
  displayInformationModal: boolean;
  CustomerSiteValidations: Record<number, string[] | null>
  targetRowId: number | null
}

const initialState: UploadDocumentState = {
  sites: [],
  selectedSites: [],
  contractId: null,
  errors: {},
  submitting: false,
  displayInformationModal: false,
  CustomerSiteValidations: [],
  targetRowId: null
};

const slice = createSlice({
  name: 'sitedocumentupload',
  initialState,
  reducers: {
    initializeSiteDocumentUpload: () => initialState,
    loadSiteDocumentDetails: (state, { payload: { SiteDetails, ContractId, CustomerSiteValidations } }: PayloadAction<SiteData>) => {
      state.sites = SiteDetails.map((site) => (site));
      state.contractId = ContractId
      state.CustomerSiteValidations = CustomerSiteValidations
    },
    loadSelectedSites: (state, { payload: sites }: PayloadAction<SiteDetails[]>) => {
      state.selectedSites = sites
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
    setTargetRowId: (state, { payload: rowId }) => {
      state.targetRowId = rowId
    },
  },
});

export const {
  initializeSiteDocumentUpload,
  updateErrors,
  startSubmitting,
  toggleInformationModalStatus,
  stopSubmitting,
  loadSiteDocumentDetails,
  setTargetRowId,
  loadSelectedSites,
} = slice.actions;
export default slice.reducer;