import { None, Option, Some } from '@hqoss/monads';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ValidationErrors } from '../../../../../../types/error';
import { Select } from '../../../../../../types/customer';
import { PreAmcPendingSiteDetail, PreAmcPendingSiteList } from '../../../../../../types/contractPreAmc';
import { SelectDetails } from '../../../../../../types/user';

export interface PreAmcSitesList {
  PreAmcSites: PreAmcPendingSiteDetail;
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
    CustomerId: number | null;
  },
  SelectDetails: {
    ContractNumbers: Select[],
    CustomerNames: Select[],
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
    ContractId: 0,
    CustomerId: 0
  },
  SelectDetails: {
    ContractNumbers: [],
    CustomerNames: [],
  },
  displayInformationModal: false,
};

const slice = createSlice({
  name: 'preamcpendingsitelist',
  initialState,
  reducers: {
    initializePreAmcPendingSites: () => initialState,
    loadPreAmcSites: (state, { payload: { CustomerSites, TotalRows, PerPage } }: PayloadAction<PreAmcPendingSiteList>) => {
      state.PreAmcSites = Some(CustomerSites.map((PreAmcSites) => ({ PreAmcSites })));
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
    loadSiteSelectDetails: (state, { payload: { name, value: { Select } } }: PayloadAction<{ name: keyof PreAmcSiteListState['SelectDetails']; value: SelectDetails }>) => {
      state.SelectDetails[name] = Select.map((SelectDetails) => SelectDetails);
    },
    toggleInformationModalStatus: (state) => {
      state.displayInformationModal = !state.displayInformationModal;
    }
  },
});

export const { initializePreAmcPendingSites, toggleInformationModalStatus, updateErrors, siteUpdateField, loadSiteSelectDetails, loadPreAmcSites, changePage, setSearch } = slice.actions;
export default slice.reducer;