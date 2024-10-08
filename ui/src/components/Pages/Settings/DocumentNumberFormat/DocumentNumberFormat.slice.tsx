import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DocumentNumberFormatDetails, DocumentNumberFormatList } from '../../../../types/documentnumberformat';
import { valuesInMasterDataByTableDetailsSelect, valuesInMasterDataByTableSelect } from '../../../../types/masterData';

export interface DocumentNumberFormatListState {
  documentnumberformat: DocumentNumberFormatDetails[];
  DocumentTypes: valuesInMasterDataByTableDetailsSelect[]
  currentPage: number;
  search: number | null;
  totalRows: number;
  perPage: number;
}

const initialState: DocumentNumberFormatListState = {
  documentnumberformat: [],
  currentPage: 1,
  search: null,
  totalRows: 0,
  perPage: 0,
  DocumentTypes: []
};

const slice = createSlice({
  name: 'documentnumberformat',
  initialState,
  reducers: {
    initializeDocumentNumberFormatList: () => initialState,
    loadDocumentNumberFormatList: (state, { payload: { DocumentNumFormatList, TotalRows, PerPage } }: PayloadAction<DocumentNumberFormatList>) => {
      state.documentnumberformat = DocumentNumFormatList.map((documentnumberformat) => (documentnumberformat))
      state.totalRows = TotalRows;
      state.perPage = PerPage;
    },
    changePage: (state, { payload: page }: PayloadAction<number>) => {
      state.currentPage = page;
      state.documentnumberformat = [];
    },
    setSearch: (state, { payload: typeid }: PayloadAction<number | null>) => {
      state.search = typeid;
    },
    loadDocTypes: (state, { payload: { MasterData } }: PayloadAction<valuesInMasterDataByTableSelect>) => {
      state.DocumentTypes = MasterData.map((types) => types);
    }
  },
});

export const { initializeDocumentNumberFormatList, loadDocumentNumberFormatList, changePage, setSearch, loadDocTypes } = slice.actions;
export default slice.reducer;