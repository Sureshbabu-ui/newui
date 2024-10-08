import { None, Option, Some } from '@hqoss/monads';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AssetProductCategoryList, ProductCategoryList } from '../../../../../types/assetProductCategory';

export interface ProductCategories {
  productCategory: AssetProductCategoryList;
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
  name: 'assetproductcategorylist',
  initialState,
  reducers: {
    initializeAssetProductCategoryList: () => initialState,
    loadAssetProductCategories: (state, { payload: { ProductCategories, TotalRows, PerPage } }: PayloadAction<ProductCategoryList>) => {
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

export const { initializeAssetProductCategoryList, loadAssetProductCategories, changePage, setSearch } = slice.actions;
export default slice.reducer;