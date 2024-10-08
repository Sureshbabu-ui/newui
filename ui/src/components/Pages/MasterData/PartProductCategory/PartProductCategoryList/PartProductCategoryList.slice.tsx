import { None, Option, Some } from '@hqoss/monads';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProductCategoryDetails, ProductCategoryList } from '../../../../../types/partProductCategory';

export interface ProductCategories {
  productCategory: ProductCategoryDetails;
}

export interface ProductCategoryListState {
  productCategories: Option<readonly ProductCategories[]>;
  currentPage: number;
  search: string;
  totalRows: number;
  perPage:number;
  createProductCategoryModalStatus: boolean;
}

const initialState: ProductCategoryListState = {
  productCategories: None,
  currentPage: 1,
  search: "",
  totalRows: 0,
  perPage:0,
  createProductCategoryModalStatus: false,
};

const slice = createSlice({
  name: 'partproductcategorylist',
  initialState,
  reducers: {
    initializeProductCategoryList: () => initialState,
    loadProductCategories: (state, { payload: { ProductCategories, TotalRows, PerPage } }: PayloadAction<ProductCategoryList>) => {
      state.productCategories = Some(ProductCategories.map((productCategory) => ({ productCategory })));
      state.totalRows = TotalRows;
      state.perPage = PerPage;
    },
    changePage: (state, { payload: page }: PayloadAction<number>) => {
      state.currentPage = page;
      state.productCategories = None;
    },
    setSearch: (state, { payload: Searchname }: PayloadAction<string>) => {
      state.search = Searchname;
    },
  },
});

export const { initializeProductCategoryList, loadProductCategories, changePage, setSearch } = slice.actions;
export default slice.reducer;