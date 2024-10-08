import { None, Option, Some } from "@hqoss/monads";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { SelectDetails, Select } from "../../../../../types/purchaseorder";
import { ImprestPODetails, PartListImprestPo } from "../../../../../types/part";

export interface Part {
    part: ImprestPODetails;
}
export interface Filter{
    ProductCategoryId: number;
    PartCategoryId:number;
    PartSubCategoryId:number;
    MakeId:number;
}
export interface CreateImprestPOState {
    ProductCategoryList: Select[];
    MakeList: Select[];
    parts: Option<Part[]>;
    currentPage: number;
    search: string;
    searchWith: string;
    totalRows: number;
    perPage: number;
    filter:Filter;
}

const initialState: CreateImprestPOState = {
    ProductCategoryList: [],
    MakeList:[],
    parts: None,
    currentPage: 1,
    search: "",
    totalRows: 0,
    perPage: 0,
    filter:{
        MakeId:0,
        PartCategoryId:0,
        PartSubCategoryId:0,
        ProductCategoryId:0
    },
    searchWith: "PartCode"
};

const slice = createSlice({
    name: 'imprestpurchaseorderparts',
    initialState,
    reducers: {
        initializeCreateImprestPurchaseOrder: () => initialState,
        updateField: (state, { payload: { name, value } }: PayloadAction<{ name: keyof CreateImprestPOState['filter']; value: any }>
        ) => {
            state.filter[name] = value;
        },
        loadPartProductCategoryNames: (state, { payload: { Select } }: PayloadAction<SelectDetails>) => {
            state.ProductCategoryList = Select.map((ProductCategoryList) => ProductCategoryList);
        },
        loadMakeNames: (state, { payload: { Select } }: PayloadAction<SelectDetails>) => {
            state.MakeList = Select.map((ProductCategoryList) => ProductCategoryList);
        },
        loadParts: (state, { payload: { Parts, TotalRows, PerPage } }: PayloadAction<PartListImprestPo>) => {
            state.parts = Some(Parts.map((part) => ({ part })));
            state.parts.map(part => part.map(part => part.part.Quantity = 0))
            state.totalRows = TotalRows;
            state.perPage = PerPage;
        },
        changePage: (state, { payload: page }: PayloadAction<number>) => {
            state.currentPage = page;
            state.parts = None;
        },
        setSearch: (state, { payload: Searchname }: PayloadAction<string>) => {
            state.search = Searchname;
        },
        setFilter: (state, { payload: Search }: PayloadAction<any>) => {
            state.searchWith = Search.value;
            state.currentPage = 1;
        }
    },
});

export const {
    initializeCreateImprestPurchaseOrder,
    loadPartProductCategoryNames,
    loadParts,
    updateField,
    changePage,
    setSearch,
    setFilter,
    loadMakeNames,
} = slice.actions;

export default slice.reducer;