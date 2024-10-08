import { None, Option, Some } from '@hqoss/monads';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PartStockDetailList, PartStockDetailListDetail } from '../../../../../../types/partStockDetail';

export interface PartStockDetails {
  partStockDetail: PartStockDetailListDetail;
}

export interface PartStockDetailsListState {
  partStockDetails: Option<readonly PartStockDetails[]>;
  currentPage: number;
  search: any;
  totalRows: number;
  perPage: number;
}

const initialState: PartStockDetailsListState = {
  partStockDetails: None,
  currentPage: 1, 
  search: null,
  totalRows: 0,
  perPage:0
};
const slice = createSlice({
  name: 'partstockdetaillist', 
  initialState,
  reducers: {
    initializePartStockDetailsList: () => initialState,
    loadPartStockDetails: (state, { payload: { PartStockDetails, TotalRows, PerPage  } }: PayloadAction<PartStockDetailList>) => {
      state.partStockDetails = Some(PartStockDetails.map((partStockDetail) => ({ partStockDetail })));
      state.totalRows = TotalRows;
      state.perPage=PerPage;
    },
    changePage: (state, { payload: page }: PayloadAction<number>) => {
      state.currentPage = page;
      state.partStockDetails = None;
    },
    setStockDetailSearch: (state, { payload: Searchname }: PayloadAction<string>) => {
      state.search = Searchname;
    },
  },
});

export const { initializePartStockDetailsList, loadPartStockDetails, changePage, setStockDetailSearch } = slice.actions;
export default slice.reducer;
