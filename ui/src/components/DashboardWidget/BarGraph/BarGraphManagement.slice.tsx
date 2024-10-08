import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BarGraphDetails, ContractBarGraphDetail, ContractBarGraphDetails, CollectionBarGraphDetail, CollectionBarGraphDetails, InvoicePendingBarGraphDetails, InvoicePendingBarGraphDetail } from '../../../types/barGraphTabMangement';

export interface BarGraphManagementState {
  barGraphDetails: BarGraphDetails;
  contractBarGraphDetails: ContractBarGraphDetail[];
  collectionMadeBarGraphDetails: CollectionBarGraphDetail[];
  collectionPendingBarGraphDetails: CollectionBarGraphDetail[];
  invoicePendingBarGraphDetails: InvoicePendingBarGraphDetail[];
}

const initialState: BarGraphManagementState = {
  barGraphDetails: {
    EndDate: new Date().toISOString().split('T')[0],
    RegionId: null,
    StartDate: new Date(new Date().getFullYear() - (new Date().getMonth() >= 2 ? 0 : 1), 3, 2).toISOString().split('T')[0],
  },
  contractBarGraphDetails: [],
  collectionMadeBarGraphDetails: [],
  collectionPendingBarGraphDetails: [],
  invoicePendingBarGraphDetails: [],
};

const slice = createSlice({
  name: 'bargraphmanagement',
  initialState,
  reducers: {
    initializeBarGraphDetails: () => initialState,
    loadContractBarGraphDetails: (state, { payload: { ContractBarGraphDetails } }: PayloadAction<ContractBarGraphDetails>) => {
      state.contractBarGraphDetails = ContractBarGraphDetails.map((barGraphDetails) => (barGraphDetails));
    },
    loadCollectionMadeGraphDetails: (state, { payload: { CollectionBarGraphDetails } }: PayloadAction<CollectionBarGraphDetails>) => {
      state.collectionMadeBarGraphDetails = CollectionBarGraphDetails.map((barGraphDetails) => (barGraphDetails));
    },
    loadCollectionPendingGraphDetails: (state, { payload: { CollectionBarGraphDetails } }: PayloadAction<CollectionBarGraphDetails>) => {
      state.collectionPendingBarGraphDetails = CollectionBarGraphDetails.map((barGraphDetails) => (barGraphDetails));
    },
    loadInvoicePendingGraphDetails: (state, { payload: { InvoicePendingBarGraphDetails } }: PayloadAction<InvoicePendingBarGraphDetails>) => {
      state.invoicePendingBarGraphDetails = InvoicePendingBarGraphDetails.map((barGraphDetails) => (barGraphDetails));
    },
    barGraphUpdateField: (
      state,
      { payload: { name, value } }: PayloadAction<{ name: keyof BarGraphManagementState['barGraphDetails']; value: string }>) => {
      state.barGraphDetails[name] = value as never;
    },
  },
});

export const { initializeBarGraphDetails, barGraphUpdateField, loadContractBarGraphDetails, loadCollectionMadeGraphDetails, loadCollectionPendingGraphDetails, loadInvoicePendingGraphDetails } = slice.actions;
export default slice.reducer;