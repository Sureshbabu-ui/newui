import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DNSDetails, DNSList } from '../../../../types/documentnumberseries';
import { valuesInMasterDataByTableDetailsSelect, valuesInMasterDataByTableSelect } from '../../../../types/masterData';

export interface DNSListState {
  documentnumberseries: DNSDetails[];
  DocumentTypes: valuesInMasterDataByTableDetailsSelect[]
  currentPage: number;
  search: number | null;
  totalRows: number;
  perPage: number;
}

const initialState: DNSListState = {
  documentnumberseries: [],
  currentPage: 1,
  search: null,
  totalRows: 0,
  perPage: 0,
  DocumentTypes: [],
};

const slice = createSlice({
  name: 'documentnumberserieslist',
  initialState,
  reducers: {
    initializeDNSList: () => initialState,
    loadDNSList: (state, { payload: { DNSList, TotalRows, PerPage } }: PayloadAction<DNSList>) => {
      state.documentnumberseries = DNSList.map((documentnumberseries) => (documentnumberseries))
      state.totalRows = TotalRows;
      state.perPage = PerPage;
    },
    changePage: (state, { payload: page }: PayloadAction<number>) => {
      state.currentPage = page;
      state.documentnumberseries = [];
    },
    setSearch: (state, { payload: typeid }: PayloadAction<number>) => {
      state.search = typeid;
    },
    loadDocTypes: (state, { payload: { MasterData } }: PayloadAction<valuesInMasterDataByTableSelect>) => {
      state.DocumentTypes = MasterData.map((types) => types);
    }
  },
});

export const { initializeDNSList, loadDNSList, changePage, setSearch, loadDocTypes } = slice.actions;
export default slice.reducer;