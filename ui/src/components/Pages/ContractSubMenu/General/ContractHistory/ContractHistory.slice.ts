import { None, Option, Some } from '@hqoss/monads';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ContractVersion, SelectedContractVersion } from '../../../../../types/contracthistory';
import { SelectedContract } from '../../../../../types/contract';

export interface ContractVersionsList {
  SelectedContractItem: SelectedContractVersion;
}

export interface ContractVersionState {
  version: Option<readonly ContractVersionsList[]>;
  CurrentPage: number;
  search: any;
  totalrows:number;
}

const initialState: ContractVersionState = {
version:None,
CurrentPage: 1,
search: null,
totalrows: 0
};

const slice = createSlice({
  name: 'contracthistory', 
  initialState,
  reducers: {
    initializeContractVersion: () => initialState,
    loadContractVersions: (state, { payload: { ContractVersions,TotalRows } }: PayloadAction<ContractVersion>) => {
      state.version = Some(ContractVersions.map((SelectedContractItem) => ({ SelectedContractItem })));      
      state.totalrows = TotalRows;
    },
    changePage: (state, { payload: page }: PayloadAction<number>) => {
      state.CurrentPage = page;
      state.version = None;
    },
    setSearch: (state, { payload: Searchname }: PayloadAction<string>) => {
      state.search = Searchname;
      state.CurrentPage = 1;
    }
  },
}); 
 
export const {
  initializeContractVersion,
  loadContractVersions,
  changePage,
  setSearch
} = slice.actions;

export default slice.reducer;