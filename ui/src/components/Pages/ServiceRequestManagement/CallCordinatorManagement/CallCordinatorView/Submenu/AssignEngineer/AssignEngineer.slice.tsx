import { None, Option, Some } from '@hqoss/monads';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AssigneesList, ServiceRequestAssignees } from '../../../../../../../types/assignEngineer';

export interface ServiceRequestAssignEngineers {
    Assignee: AssigneesList;
}

export interface AssignEngineerState {
    Assignees: Option<readonly ServiceRequestAssignEngineers[]>;
    currentPage: number;
    search: string;
    totalRows: number;
}

const initialState: AssignEngineerState = {
    Assignees: None,
    currentPage: 1,
    search: "",
    totalRows: 0,
};

const slice = createSlice({
    name: 'assigneeslist',
    initialState,
    reducers: {
        initializeAssignEngineer: () => initialState,
        loadAssignees: (state, { payload: { ServiceRequestAssignees,TotalRows } }: PayloadAction<ServiceRequestAssignees>) => {
            state.Assignees = Some(ServiceRequestAssignees.map((Assignee) => ({ Assignee })));
            state.totalRows = TotalRows;            
        },
        changePage: (state, { payload: page }: PayloadAction<number>) => {
            state.currentPage = page;
            state.Assignees = None;
        },
        setSearch: (state, { payload: Searchname }: PayloadAction<string>) => {
            state.search = Searchname;
            state.currentPage = 1;
        },
    },
});

export const {
    initializeAssignEngineer,
    changePage,
    loadAssignees,
    setSearch
} = slice.actions;

export default slice.reducer;