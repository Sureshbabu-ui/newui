import { None, Option, Some } from '@hqoss/monads';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PreAmcContractList, MultiplePreAmcContractList } from '../../../../../../types/assets';
import { ValidationErrors } from '../../../../../../types/error';
import { SelectDetails } from '../../../../../../types/user';
import { Select } from '../../../../../../types/contract';

export interface PreAmcContractsList {
  PreAmcContracts: PreAmcContractList;
}

export interface PreAmcListState {
  errors: ValidationErrors;
  PreAmcContracts: Option<readonly PreAmcContractsList[]>;
  CurrentPage: number;
  Search: string | null;
  TotalRows: number;
  perPage: number;
  filterDetails: {
    CustomerId: number | null;
    ContractId: number | null;
  },
  AssetSelectDetails: {
    CustomerNames: Select[],
    ContractNumbers: Select[],
  },
  displayInformationModal: boolean;
}

const initialState: PreAmcListState = {
  PreAmcContracts: None,
  errors: {},
  CurrentPage: 1,
  Search: null,
  TotalRows: 0,
  perPage: 0,
  filterDetails: {
    CustomerId: 0,
    ContractId: 0,
  },
  AssetSelectDetails: {
    ContractNumbers: [],
    CustomerNames: [],
  },
  displayInformationModal: false,
};

const slice = createSlice({
  name: 'preamccontractlist',
  initialState,
  reducers: {
    initializePreAmcList: () => initialState,
    loadPreAmcContracts: (state, { payload: { ContractList, TotalRows, PerPage } }: PayloadAction<MultiplePreAmcContractList>) => {
      state.PreAmcContracts = Some(ContractList.map((PreAmcContracts) => ({ PreAmcContracts })));
      state.TotalRows = TotalRows ? TotalRows : 0;
      state.perPage = PerPage;
    },
    updateErrors: (state, { payload: errors }: PayloadAction<ValidationErrors>) => {
      state.errors = errors;
    },
    updateField: (state, { payload: { name, value } }: PayloadAction<{ name: keyof PreAmcListState['filterDetails'], value: number }>) => {
      state.filterDetails[name] = value;
      if (name == "CustomerId") {
        state.AssetSelectDetails.ContractNumbers = initialState.AssetSelectDetails.ContractNumbers
        state.filterDetails.ContractId = null
        state.CurrentPage = 1
      }
    },
    changePage: (state, { payload: page }: PayloadAction<number>) => {
      state.CurrentPage = page;
      state.PreAmcContracts = None;
    },
    setSearch: (state, { payload: Searchname }: PayloadAction<string>) => {
      state.Search = Searchname;
      state.CurrentPage = 1;
    },
    loadAssetSelectDetails: (state, { payload: { name, value: { Select } } }: PayloadAction<{ name: keyof PreAmcListState['AssetSelectDetails']; value: SelectDetails }>) => {
      state.AssetSelectDetails[name] = Select.map((SelectDetails) => SelectDetails);
    },
    toggleInformationModalStatus: (state) => {
      state.displayInformationModal = !state.displayInformationModal;
    }
  },
});

export const { initializePreAmcList, toggleInformationModalStatus, updateErrors, updateField, loadAssetSelectDetails, loadPreAmcContracts, changePage, setSearch } = slice.actions;
export default slice.reducer;