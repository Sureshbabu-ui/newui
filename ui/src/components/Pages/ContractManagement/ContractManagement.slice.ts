import { None, Option, Some } from '@hqoss/monads';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ContractSearchForFilter, ExistedContract, MultipleExistedContracts, Select, SelectDetails } from '../../../types/contract';

export interface ContractsList {
  contract: ExistedContract;
} 
export interface Configurations {
  ContractStatus: Select[],
}
export interface ContractsListState {
  masterDataList: Configurations;
  contracts: Option<readonly ContractsList[]>;
  currentPage: number;
  filters: ContractSearchForFilter;
  searchWith:any;
  AgreementTypeCode:string;
  totalRows: number;
  perPage:number
  createUserModalStatus: boolean;
  redirectedStatus:string;
}  
 
const initialState: ContractsListState = {
  contracts: None,
  masterDataList:{
    ContractStatus:[]
  },
  currentPage: 1,
  filters: {
    SearchText:'',
    StartDate:``,
    EndDate:``
  },
  AgreementTypeCode:'',
  searchWith:'ContractNumber',
  totalRows: 0,
  perPage:0,
  createUserModalStatus: false,
  redirectedStatus:'CTS_APRV'
};
const slice = createSlice({
  name: 'contractmanagement',
  initialState,
  reducers: {
    initializeContractsList: () => initialState,
    loadMasterData: (state, { payload: { name, value: { Select } } }: PayloadAction<{ name: keyof ContractsListState['masterDataList']; value: SelectDetails }>) => {
      state.masterDataList[name] = Select.map((masterData) => (masterData))
    },
    loadContracts: (state, { payload: { Contracts, TotalRows, PerPage } }: PayloadAction<MultipleExistedContracts>) => {
      state.contracts = Some(Contracts.map((contract) => ({ contract })));
      state.totalRows = TotalRows;
      state.perPage = PerPage
    },
    changePage: (state, { payload: page }: PayloadAction<number>) => {
      state.currentPage = page;
      state.contracts = None;
    },
    setRedirectedStatusTab: (state, { payload:status }: PayloadAction<any>) => {
      state.redirectedStatus=status
    },
    setAgreementTypeCode: (state, { payload: code }: PayloadAction<any>) => {
      state.AgreementTypeCode = code
    },
    updateField: (
      state,
      { payload: { name, value } }: PayloadAction<{ name: keyof ContractsListState['filters']; value: any }>) => {
      state.filters[name] = value;
    },
    setFilter: (state, { payload: Search }: PayloadAction<any>) => {
      state.searchWith = Search.value; 
      state.currentPage = 1;
    }
  },
});

export const { initializeContractsList, loadContracts, setRedirectedStatusTab, setAgreementTypeCode, changePage, updateField, setFilter, loadMasterData } = slice.actions;
export default slice.reducer;
