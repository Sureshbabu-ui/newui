import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GenericErrors } from '../../../types/error';
import { EntitiesList } from '../../../types/configuration';
import { Select } from '../../../types/contract';
import { LookupDataUpdate, SelectedTableData, SelectedTableDetails } from '../../../types/configurations';
import { None, Option, Some } from '@hqoss/monads';

export interface SelectDetails {
  Select: Select[]
  TotalRows: number
  PerPage: number
  Search: string
}

export interface TableList {
  entitiesList: EntitiesList;
}
export interface SelectDetails {
	Select: Select[]
	TotalRows: number
	PerPage:number
	Search:string
}

export interface MasterEntityDataList {
  entitydata: SelectedTableData;
}
export interface ConfigurationsState {
  entitydata: Option<readonly MasterEntityDataList[]>;
  entitiesLists: Select[];
  errors: GenericErrors;
  submitting: boolean;
  displayInformationModal: boolean;
  currentPage: number;
  totalRows: number;
  perPage: number;
  search: string;
  entityDataSearch:string;
}

const initialState: ConfigurationsState = {
  entitydata: None,
  entitiesLists: [],
  errors: {},
  submitting: false,
  displayInformationModal: false,
  currentPage: 1,
  totalRows: 0,
  perPage: 0,
  search: "",
  entityDataSearch:""
};

const slice = createSlice({
  name: 'lookupdata',
  initialState,
  reducers: {
    initializeConfigurations: () => initialState,
    loadEntitiesLists: (state, { payload: { Select, TotalRows, PerPage, Search } }: PayloadAction<SelectDetails>) => {
      state.entitiesLists = Select;
      state.totalRows = TotalRows;
      state.perPage = PerPage;
      state.search = Search;
    },
    changePage: (state, { payload: page }: PayloadAction<number>) => {
      state.currentPage = page;
      state.entitydata = None;
    },
    setConfigurations: (state, { payload: { selectedTableDetails } }: PayloadAction<SelectedTableDetails>) => {
      state.entitydata = Some(selectedTableDetails.map((entitydata) => ({ entitydata })));
    },
    updateErrors: (state, { payload: errors }: PayloadAction<GenericErrors>) => {
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
    setSearch: (state, { payload: Searchname }: PayloadAction<string>) => {
      state.search = Searchname;
    },
    setEntityDataSearch: (state, { payload: Searchname }: PayloadAction<string>) => {
      state.entityDataSearch = Searchname;
    }
  },
});

export const {
  initializeConfigurations,
  loadEntitiesLists,
  setConfigurations,
  updateErrors,
  startSubmitting,
  toggleInformationModalStatus,
  stopSubmitting,
  changePage,
  setSearch,
  setEntityDataSearch
} = slice.actions;

export default slice.reducer;
