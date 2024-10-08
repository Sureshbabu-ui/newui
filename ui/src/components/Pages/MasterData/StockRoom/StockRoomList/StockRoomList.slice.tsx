import { None, Option, Some } from '@hqoss/monads';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { StockRoomDetails, StockRoomList } from '../../../../../types/stockroom';

export interface stockRoomList {
    stockroom: StockRoomDetails;
}

export interface RoleListState {
    stockroom: Option<readonly stockRoomList[]>;
    search: any;
    totalRows: number;
    createRoleModalStatus: boolean;
}

const initialState: RoleListState = {
    stockroom: None,
    search: null,
    totalRows: 0,
    createRoleModalStatus: false,
};
const slice = createSlice({
    name: 'stockroomlist',
    initialState,
    reducers: {
        initializeStockRoomList: () => initialState,
        loadStockRooms: (state, { payload: { StockRooms, TotalRows } }: PayloadAction<StockRoomList>) => {
            state.stockroom = Some(StockRooms.map((stockroom) => ({ stockroom })));
            state.totalRows = TotalRows;
        },
        setSearch: (state, { payload: Searchname }: PayloadAction<string>) => {
            state.search = Searchname;
        },
    },
});

export const { initializeStockRoomList, loadStockRooms, setSearch } = slice.actions;
export default slice.reducer;