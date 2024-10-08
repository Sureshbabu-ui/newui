import { None, Option, Some } from '@hqoss/monads';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ContractDocumentList, MultipleContractDocumentList } from '../../../../types/contractDocument';

export interface ContractDocumentsList {
  contractDocument: ContractDocumentList;
}

export interface ContractDocumentListState {
  contractDocuments: Option<readonly ContractDocumentsList[]>;
  currentPage: number;
  search: any;
  totalRows: number;
  perPage: number;
  createContractDocumentModalStatus: boolean;
  visibleModal: string
}

const initialState: ContractDocumentListState = {
  contractDocuments: None,
  currentPage: 1,
  search: null,
  totalRows: 0,
  perPage: 0,
  createContractDocumentModalStatus: false,
  visibleModal: ""
};
const slice = createSlice({
  name: 'contractdocumentlist',
  initialState,
  reducers: {
    initializeContractList: () => initialState,
    loadContractDocuments: (state, { payload: { ContractDocumentList, TotalRows, PerPage } }: PayloadAction<MultipleContractDocumentList>) => {
      state.contractDocuments = Some(ContractDocumentList.map((contractDocument) => ({ contractDocument })));
      state.totalRows = TotalRows;
      state.perPage = PerPage;
    },
    changePage: (state, { payload: page }: PayloadAction<number>) => {
      state.currentPage = page;
      state.contractDocuments = None;
    },
    setSearch: (state, { payload: Searchname }: PayloadAction<string>) => {
      state.search = Searchname;
      state.currentPage = 1;
    },
    setVisibleModal: (state, { payload: ModalName }: PayloadAction<string>) => {
      state.visibleModal = ModalName;
    },
  },
});

export const { initializeContractList, setVisibleModal, loadContractDocuments, changePage, setSearch } = slice.actions;
export default slice.reducer;