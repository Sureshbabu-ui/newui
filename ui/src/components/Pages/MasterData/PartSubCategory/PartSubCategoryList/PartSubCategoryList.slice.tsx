import { None, Option, Some } from '@hqoss/monads';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PartSubCategoryDetails, PartSubCategoryList } from '../../../../../types/partSubCategory';

export interface partSubCategoryList {
    partSubCategory: PartSubCategoryDetails;
}

export interface PartSubCategoryState {
    partSubCategorys: Option<readonly partSubCategoryList[]>;
    currentPage: number;
    search: any;
    totalRows: number;
    perPage: number;
    createRoleModalStatus: boolean;
    searchSubmit: boolean;
}

const initialState: PartSubCategoryState = {
    partSubCategorys: None,
    currentPage: 1,
    search: null,
    totalRows: 0,
    perPage: 0,
    createRoleModalStatus: false,
    searchSubmit: false
};
const slice = createSlice({
    name: 'partsubcategorylist',
    initialState,
    reducers: {
        initializePartSubCategoryList: () => initialState,
        loadPartSubCategories: (state, { payload: { PartSubCategories, TotalRows, PerPage } }: PayloadAction<PartSubCategoryList>) => {
            state.partSubCategorys = Some(PartSubCategories.map((partSubCategory) => ({ partSubCategory })));
            state.totalRows = TotalRows;
            state.perPage = PerPage;
        },
        changePage: (state, { payload: page }: PayloadAction<number>) => {
            state.currentPage = page;
            state.partSubCategorys = None;
        },
        setSearch: (state, { payload: Searchname }: PayloadAction<string>) => {
            state.search = Searchname;
        },
        setSearchSubmit: (state, { payload: value }: PayloadAction<any>) => {
            state.searchSubmit = value;
        }
    },
});

export const { initializePartSubCategoryList, loadPartSubCategories, changePage, setSearch, setSearchSubmit } = slice.actions;
export default slice.reducer;