import { None, Option, Some } from '@hqoss/monads';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BankCollectionList, BankCollectionListDetail, Select, SelectDetails } from '../../../../types/bankCollection';

export interface BankCollections {
  bankCollection: BankCollectionListDetail;
}
export interface Configurations {
  BankCollectionStatus: Select[],
}
export interface BankCollectionsListState {
  bankCollections: Option<readonly BankCollections[]>;
  masterDataList: Configurations;
  selectedStatus:string;
  currentPage: number;
  search: any;
  totalRows: number;
  perPage: number;
}

const initialState: BankCollectionsListState = {
  bankCollections: None,
  masterDataList: {
    BankCollectionStatus:[]
  },
  selectedStatus:'BCS_PNDG',
  currentPage: 1, 
  search: null,
  totalRows: 0,
  perPage: 0
};
const slice = createSlice({
  name: 'bankcollectionlist',
  initialState,
  reducers: {
    initializeBankCollectionsList: () => initialState,
    loadBankCollections: (state, { payload: { BankCollections, TotalRows, PerPage } }: PayloadAction<BankCollectionList>) => {
      state.bankCollections = Some(BankCollections.map((bankCollection) => ({ bankCollection })));
      state.totalRows = TotalRows;
      state.perPage = PerPage;
    },
    loadMasterData: (state, { payload: { name, value: { Select } } }: PayloadAction<{ name: keyof BankCollectionsListState['masterDataList']; value: SelectDetails }>) => {
      state.masterDataList[name] = Select.map((masterData) => (masterData)).sort((item1,item2)=>item1.value -item2.value )
    },
    setBankCollectionSelectedStatus:(state,{payload:status}:PayloadAction<string>)=>{
       state.selectedStatus = status;
       state.currentPage=1;
       state.totalRows=0;
       state.search=null;
    },

    changePage: (state, { payload: page }: PayloadAction<number>) => {
      state.currentPage = page;
      state.bankCollections = None;
    },

    setSearch: (state, { payload: Searchname }: PayloadAction<string>) => {
      state.search = Searchname;
    },
  },
});

export const { initializeBankCollectionsList, setBankCollectionSelectedStatus, loadMasterData, loadBankCollections, changePage, setSearch } = slice.actions;
export default slice.reducer;
