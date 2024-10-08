import { None, Option, Some } from '@hqoss/monads';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MultiplePreAmcPendingAssetList, PreAmcPendingAssetList } from '../../../../../../types/assets';
import { ValidationErrors } from '../../../../../../types/error';
import { SelectDetails } from '../../../../../../types/user';
import { Select } from '../../../../../../types/contract';

export interface PreAmcPendingAssetsList {
  preAmcPendingAsset: PreAmcPendingAssetList;
}

export interface AssetsListState {
  errors: ValidationErrors;
  preAmcPendingAsset: Option<readonly PreAmcPendingAssetsList[]>;
  CurrentPage: number;
  Search: string | null;
  TotalRows: number;
  perPage: number;
  filterDetails: {
    CustomerId: number | null;
    ContractId: number | null;
    CustomerSiteId: number | null;
  },
  AssetSelectDetails: {
    CustomerNames: Select[],
    ContractNumbers: Select[],
    CustomerSiteNames: Select[],
  },
  displayInformationModal: boolean;
}

const initialState: AssetsListState = {
  preAmcPendingAsset: None,
  errors: {},
  CurrentPage: 1,
  Search: null,
  TotalRows: 0,
  perPage: 0,
  filterDetails: {
    CustomerId: 0,
    ContractId: 0,
    CustomerSiteId: 0,
  },
  AssetSelectDetails: {
    ContractNumbers: [],
    CustomerNames: [],
    CustomerSiteNames: []
  },
  displayInformationModal: false,
};

const slice = createSlice({
  name: 'preamcpendingassetlist',
  initialState,
  reducers: {
    initializeAssetsList: () => initialState,
    loadPreAmcPendingAssets: (state, { payload: { ContractAssetsList, TotalRows, PerPage } }: PayloadAction<MultiplePreAmcPendingAssetList>) => {
      state.preAmcPendingAsset = Some(ContractAssetsList.map((preAmcPendingAsset) => ({ preAmcPendingAsset })));
      state.TotalRows = TotalRows;
      state.perPage = PerPage;
    },
    updateErrors: (state, { payload: errors }: PayloadAction<ValidationErrors>) => {
      state.errors = errors;
    },
    updateField: (state, { payload: { name, value } }: PayloadAction<{ name: keyof AssetsListState['filterDetails'], value: number }>) => {
      state.filterDetails[name] = value;
      if (name == "CustomerId") {
        state.AssetSelectDetails.ContractNumbers = initialState.AssetSelectDetails.ContractNumbers
        state.AssetSelectDetails.CustomerSiteNames = initialState.AssetSelectDetails.CustomerSiteNames
        state.filterDetails.ContractId = null
        state.filterDetails.CustomerSiteId = null
        state.CurrentPage = 1
      }
      if (name == "ContractId") {
        state.filterDetails.CustomerSiteId = null
        state.AssetSelectDetails.CustomerSiteNames = initialState.AssetSelectDetails.CustomerSiteNames
        state.CurrentPage = 1
      }
    },
    changePreAmcPendingAssetPage: (state, { payload: page }: PayloadAction<number>) => {
      state.CurrentPage = page;
      state.preAmcPendingAsset = None;
    },
    setPreAmcPendingSearch: (state, { payload: Searchname }: PayloadAction<string>) => {
      state.Search = Searchname;
      state.CurrentPage = 1;
    },
    loadAssetSelectDetails: (state, { payload: { name, value: { Select } } }: PayloadAction<{ name: keyof AssetsListState['AssetSelectDetails']; value: SelectDetails }>) => {
      state.AssetSelectDetails[name] = Select.map((SelectDetails) => SelectDetails);
    },
    toggleInformationModalStatus: (state) => {
      state.displayInformationModal = !state.displayInformationModal;
    },
  },
});

export const { initializeAssetsList, toggleInformationModalStatus, updateErrors, updateField, loadAssetSelectDetails, loadPreAmcPendingAssets, changePreAmcPendingAssetPage, setPreAmcPendingSearch } = slice.actions;
export default slice.reducer;