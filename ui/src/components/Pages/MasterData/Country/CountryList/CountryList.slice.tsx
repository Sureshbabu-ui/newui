import { None, Option, Some } from "@hqoss/monads";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { CountryList, MultipleCountry } from "../../../../../types/country";

export interface CountryInfoList {
    country: CountryList;
}
export interface State {
    Id: number;
    Name: string;
}
export interface CountryInfoListState {
    country: Option<readonly CountryInfoList[]>;
    currentPage: number;
    searchWith: string;
    totalRows: number;
    perPage:number;
}
const initialState: CountryInfoListState = {  
    country: None,
    currentPage: 1,
    searchWith: "",
    totalRows: 0,
    perPage:0
};
const slice = createSlice({
    name: 'countrylist',
    initialState,
    reducers: {
        initializeCountryInfoList: () => initialState,
        loadCountryList: (state, { payload: { CountryList, totalRows, PerPage } }: PayloadAction<MultipleCountry>) => {
            state.country = Some(CountryList.map((country) => ({ country })));
            state.totalRows = totalRows;
            state.perPage=PerPage;
        },
        changePage: (state, { payload: page }: PayloadAction<number>) => {
            state.currentPage = page;
            state.country = None;
        },
        setFilter: (state, { payload: Search }: PayloadAction<any>) => {
            state.searchWith = Search;
            state.currentPage = 1;
        }
    },
});
export const { initializeCountryInfoList, setFilter, loadCountryList, changePage } = slice.actions;
export default slice.reducer;