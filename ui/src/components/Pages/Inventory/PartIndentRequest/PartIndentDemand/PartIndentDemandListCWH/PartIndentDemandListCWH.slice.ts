import { None, Option, Some } from '@hqoss/monads';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PartIndentDemandList, partIndentDemandList } from '../../../../../../types/partindentdemand';

export interface PartIndentDemandData {
    indentdemand: PartIndentDemandList;
}

export interface PartIndentDemandState {
    demandscwhneeded: Option<readonly PartIndentDemandData[]>;
    demandcwhcurrentPage: number;
    demandcwhsearch: any;
    demandcwhtotalRows: number;
    demandcwhperPage: number;
    demandscwhnotneeded: Option<readonly PartIndentDemandData[]>;
}

const initialState: PartIndentDemandState = {
    demandscwhneeded: None,
    demandcwhcurrentPage: 1,
    demandcwhsearch: null,
    demandcwhtotalRows: 0,
    demandcwhperPage: 0,
    demandscwhnotneeded: None
};

const slice = createSlice({
    name: 'partindentdemandlistcwh',
    initialState,
    reducers: {
        initializePartIndentDemand: () => initialState,
        loadCWHPartIndentDemand: (state, { payload: { PartIndentDemandList, TotalRows, PerPage } }: PayloadAction<partIndentDemandList>) => {
            state.demandscwhneeded = Some(PartIndentDemandList.map((indentdemand) => ({ indentdemand })));
            state.demandcwhtotalRows = TotalRows;
            state.demandcwhperPage = PerPage;
        },
        changeCWHPage: (state, { payload: page }: PayloadAction<number>) => {
            state.demandcwhcurrentPage = page;
            state.demandscwhneeded = None;
        },
        setCWHSearch: (state, { payload: Searchname }: PayloadAction<string>) => {
            state.demandcwhsearch = Searchname;
        },
    },
});

export const {
    initializePartIndentDemand,
    changeCWHPage,
    setCWHSearch,
    loadCWHPartIndentDemand,
} = slice.actions;

export default slice.reducer;