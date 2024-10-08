import { None, Option, Some } from '@hqoss/monads';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProductDetails, ProductList } from '../../../../../types/product';

export interface Products {
  product: ProductDetails;
}

export interface ProductListState {
  products: Option<readonly Products[]>;
  currentPage: number;
  search: string;
  totalRows: number;
  perPage:number;
  createProductModalStatus: boolean;
}

const initialState: ProductListState = {
  products: None,
  currentPage: 1,
  search: "",
  totalRows: 0,
  perPage:0,
  createProductModalStatus: false,
};

const slice = createSlice({
  name: 'productlist',
  initialState,
  reducers: {
    initializeProductList: () => initialState,
    loadProducts: (state, { payload: { Products, TotalRows, PerPage } }: PayloadAction<ProductList>) => {
      state.products = Some(Products.map((product) => ({ product })));
      state.totalRows = TotalRows;
      state.perPage=PerPage;
    },
    changePage: (state, { payload: page }: PayloadAction<number>) => {
      state.currentPage = page;
      state.products = None;
    },
    setSearch: (state, { payload: Searchname }: PayloadAction<string>) => {
      state.search = Searchname;
    },
  },
});

export const { initializeProductList, loadProducts, changePage, setSearch } = slice.actions;
export default slice.reducer;