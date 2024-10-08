import { None, Option, Some } from '@hqoss/monads';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RoleDetails, RoleList } from '../../../../../types/role';

export interface roleList {
    role: RoleDetails;
}

export interface RoleListState {
    roles: Option<readonly roleList[]>;
    currentPage: number;
    search: any;
    totalRows: number;
    perPage:number;
    createRoleModalStatus: boolean;
    searchSubmit: boolean;
}

const initialState: RoleListState = {
    roles: None,
    currentPage: 1,
    search: null,
    totalRows: 0,
    perPage:0,
    createRoleModalStatus: false,
    searchSubmit:false
};
const slice = createSlice({
    name: 'rolelist',
    initialState,
    reducers: {
        initializeRoleList: () => initialState,
        loadRoles: (state, { payload: { Roles, TotalRows, PerPage } }: PayloadAction<RoleList>) => {
            state.roles = Some(Roles.map((role) => ({ role })));
            state.totalRows = TotalRows;
            state.perPage=PerPage;
        },
        changePage: (state, { payload: page }: PayloadAction<number>) => {
            state.currentPage = page;
            state.roles = None;
        },
        setSearch: (state, { payload: Searchname }: PayloadAction<string>) => {
            state.search = Searchname;
        },
        setSearchSubmit: (state, { payload:value }: PayloadAction<any>)=>{
            state.searchSubmit = value;
        }
    },
});

export const { initializeRoleList, loadRoles, changePage, setSearch, setSearchSubmit } = slice.actions;
export default slice.reducer;