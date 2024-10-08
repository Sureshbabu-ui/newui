import { None, Option, Some } from '@hqoss/monads';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AssetsList, MultipleAssetsList } from '../../../../types/assets';
import { MultipleCustomerSites } from '../../../../types/customer';
import { ValidationErrors } from '../../../../types/error';

export interface Assets {
  Assets: AssetsList;
}

export interface CustomerDetails {
  Id: number;
  SiteName: string;
}

export interface AssetsListState {
  CustomerSiteId: CustomerDetails[];
  selectedContractAssets: number[];
  errors: ValidationErrors;
  Assets: Option<readonly Assets[]>;
  AssetIdList: string;
  CurrentPage: number;
  Search: string | null;
  TotalRows: number;
  perPage: number;
  createAssetsModalStatus: boolean;
  displayInformationModal: boolean;
  contractcustomersitescount: number;
  visibleModal: string
}

const initialState: AssetsListState = {
  CustomerSiteId: [],
  selectedContractAssets: [],
  Assets: None,
  AssetIdList: '',
  errors: {},
  CurrentPage: 1,
  Search: null,
  TotalRows: 0,
  perPage: 0,
  createAssetsModalStatus: false,
  displayInformationModal: false,
  contractcustomersitescount: 0,
  visibleModal: ""
};
const slice = createSlice({
  name: 'assetslist',
  initialState,
  reducers: {
    initializeAssetsList: () => initialState,
    loadCustomerSite: (state, { payload: { ContractCustomerSites } }: PayloadAction<MultipleCustomerSites>) => {
      state.CustomerSiteId = ContractCustomerSites.map((customerSite) => customerSite);
    },
    loadAssets: (state, { payload: { ContractAssetsList, TotalRows, PerPage } }: PayloadAction<MultipleAssetsList>) => {
      state.Assets = Some(ContractAssetsList.map((Assets) => ({ Assets })));
      state.TotalRows = TotalRows;
      state.perPage = PerPage;
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
    updateErrors: (state, { payload: errors }: PayloadAction<ValidationErrors>) => {
      state.errors = errors;
    },
    changePage: (state, { payload: page }: PayloadAction<number>) => {
      state.CurrentPage = page;
      state.Assets = None;
    },
    setSearch: (state, { payload: Searchname }: PayloadAction<string>) => {
      state.Search = Searchname;
      state.CurrentPage = 1;
    },
    toggleInformationModalStatus: (state) => {
      state.displayInformationModal = !state.displayInformationModal;
    },
    assetIdListInitialState: (state) => {
      state.AssetIdList = '',
        state.selectedContractAssets = []
    },
    loadSiteCount: (state, { payload: count }: PayloadAction<number>) => {
      state.contractcustomersitescount = count;
    },
    setVisibleModal: (state, { payload: ModalName }: PayloadAction<string>) => {
      state.visibleModal = ModalName;
    },
  },
});

export const { initializeAssetsList, setVisibleModal, toggleInformationModalStatus, loadSiteCount, assetIdListInitialState, updateErrors, loadCustomerSite, loadAssets, changePage, setSearch, assetsUnSelected, assetsSelected } = slice.actions;
export default slice.reducer;