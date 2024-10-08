import { None, Option, Some } from "@hqoss/monads";
import { CitiesList, MultipleCity } from "../../../../../types/city";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface CityInfoList {
    city: CitiesList;
}
export interface State {
    Id: number;
    Name: string;
}
export interface CityInfoListState {
    city: Option<readonly CityInfoList[]>;
    currentPage: number;
    states: State;
    searchWith: string;
    totalRows: number;
    perPage:number;
    search:string;
}
const initialState: CityInfoListState = {  
    city: None,
    states: {
        Id: 0,
        Name: ""
    },
    currentPage: 1,
    searchWith: "",
    totalRows: 0,
    perPage:0,
    search:""
};
const slice = createSlice({
    name: 'citieslist',
    initialState,
    reducers: {
        initializeCityInfoList: () => initialState,
        loadCities: (state, { payload: { Cities, totalRows, PerPage } }: PayloadAction<MultipleCity>) => {
            state.city = Some(Cities.map((city) => ({ city })));
            state.totalRows = totalRows;
            state.perPage=PerPage;
        },
        changePage: (state, { payload: page }: PayloadAction<number>) => {
            state.currentPage = page;
            state.city = None;
        },
        setFilter: (state, { payload: Search }: PayloadAction<any>) => {
            state.searchWith = Search.value;
            state.currentPage = 1;
        },
        setSearch: (state, { payload: Searchname }: PayloadAction<string>) => {
            state.search = Searchname;
            console.log(Searchname,'Searchname');
            
        },
    },
});
export const { initializeCityInfoList, setFilter, loadCities, changePage,setSearch } = slice.actions;
export default slice.reducer;