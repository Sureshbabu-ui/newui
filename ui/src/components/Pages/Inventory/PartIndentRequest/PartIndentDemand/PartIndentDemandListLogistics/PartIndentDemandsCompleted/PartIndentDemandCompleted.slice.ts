import { None, Option, Some } from '@hqoss/monads';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PartIndentDemandLogistics, PartIndentDemandLogisticsList } from '../../../../../../../types/partindentdemand';
import { ValidationErrors } from '../../../../../../../types/error';

export interface PartIndentDemandData {
    indentdemand: PartIndentDemandLogistics;
}

export interface PartIndentDemandState {
    demandscwhnotneeded: Option<readonly PartIndentDemandData[]>;
    currentPage: number;
    search: any;
    totalRows: number;
    perPage: number;
    errors: ValidationErrors;
}

const initialState: PartIndentDemandState = {
    demandscwhnotneeded: None,
    currentPage: 1,
    search: null,
    totalRows: 0,
    perPage: 0,
    errors: {}
};

const slice = createSlice({
    name: 'partindentdemandlogisticsnotallocated',
    initialState,
    reducers: {
        initializePartIndentDemand: () => initialState,
        loadPartIndentDemand: (state, { payload: { PartIndentDemandList, TotalRows, PerPage } }: PayloadAction<PartIndentDemandLogisticsList>) => {
            state.demandscwhnotneeded = Some(PartIndentDemandList.map((indentdemand) => ({ indentdemand })));
            state.totalRows = TotalRows;
            state.perPage = PerPage;
        },
        updateErrors: (state, { payload: errors }: PayloadAction<ValidationErrors>) => {
            state.errors = errors;
        },
        changePage: (state, { payload: page }: PayloadAction<number>) => {
            state.currentPage = page;
            state.demandscwhnotneeded = None;
        },
        setSearch: (state, { payload: Searchname }: PayloadAction<string>) => {
            state.search = Searchname;
        }
    },
});

export const {
    initializePartIndentDemand,
    loadPartIndentDemand,
    changePage,
    setSearch,
    updateErrors
} = slice.actions;

export default slice.reducer;