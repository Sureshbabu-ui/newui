import { None, Option, Some } from '@hqoss/monads';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PreAmcSiteWiseList, MultiplePreAmcSiteWiseList } from '../../../../../../../types/assets';
import { ValidationErrors } from '../../../../../../../types/error';
import { SelectDetails } from '../../../../../../../types/user';
import { Select } from '../../../../../../../types/contract';

export interface PreAmcSitesList {
  PreAmcSites: PreAmcSiteWiseList;
}

export interface PreAmcSiteListState {
  errors: ValidationErrors;
  PreAmcSites: Option<readonly PreAmcSitesList[]>;
  CurrentPage: number;
  Search: string | null;
  TotalRows: number;
  perPage: number;
  filterDetails: {
    ContractId: number | null;
    CustomerSiteId: number | null;
  },
  AssetSelectDetails: {
    CustomerSiteNames: Select[],
  },
  displayInformationModal: boolean;
}

const initialState: PreAmcSiteListState = {
  PreAmcSites: None,
  errors: {},
  CurrentPage: 1,
  Search: null,
  TotalRows: 0,
  perPage: 0,
  filterDetails: {
    ContractId: null,
    CustomerSiteId: null,
  },
  AssetSelectDetails: {
    CustomerSiteNames: []
  },
  displayInformationModal: false,
};

const slice = createSlice({
  name: 'preamcsitewiselist',
  initialState,
  reducers: {
    initializePreAmcList: () => initialState,
    loadPreAmcSites: (state, { payload: { SiteList, TotalRows, PerPage } }: PayloadAction<MultiplePreAmcSiteWiseList>) => {
      state.PreAmcSites = Some(SiteList.map((PreAmcSites) => ({ PreAmcSites })));
      state.TotalRows = TotalRows ? TotalRows : 0;
      state.perPage = PerPage;
    },
    updateErrors: (state, { payload: errors }: PayloadAction<ValidationErrors>) => {
      state.errors = errors;
    },
    siteUpdateField: (state, { payload: { name, value } }: PayloadAction<{ name: keyof PreAmcSiteListState['filterDetails'], value: number }>) => {
      state.filterDetails[name] = value;
    },
    changePage: (state, { payload: page }: PayloadAction<number>) => {
      state.CurrentPage = page;
      state.PreAmcSites = None;
    },
    setSearch: (state, { payload: Searchname }: PayloadAction<string>) => {
      state.Search = Searchname;
      state.CurrentPage = 1;
    },
    loadSiteWiseAssetSelectDetails: (state, { payload: { name, value: { Select } } }: PayloadAction<{ name: keyof PreAmcSiteListState['AssetSelectDetails']; value: SelectDetails }>) => {
      state.AssetSelectDetails[name] = Select.map((SelectDetails) => SelectDetails);
    },
    toggleInformationModalStatus: (state) => {
      state.displayInformationModal = !state.displayInformationModal;
    }
  },
});

export const { initializePreAmcList, toggleInformationModalStatus, updateErrors, siteUpdateField, loadSiteWiseAssetSelectDetails, loadPreAmcSites, changePage, setSearch } = slice.actions;
export default slice.reducer;