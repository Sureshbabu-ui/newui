import { None, Option, Some } from '@hqoss/monads';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PrevTickets, PreviousTicketList } from '../../../../../../../../types/serviceRequest';

export interface PreviousServiceRequests {
    tickets: PrevTickets;
}

export interface PreviousTicketsState {
    tickets: Option<readonly PreviousServiceRequests[]>;
    currentPage: number;
    totalRows: number;
}

const initialState: PreviousTicketsState = {
    tickets: None,
    currentPage: 1,
    totalRows: 0,
};

const slice = createSlice({
    name: 'previoustickets',
    initialState,
    reducers: {
        initializePrevTickets: () => initialState,
        loadTickets: (state, { payload: { PreviousTickets,TotalRows } }: PayloadAction<PreviousTicketList>) => {
            state.tickets = Some(PreviousTickets.map((tickets) => ({ tickets })));
            state.totalRows = TotalRows;
        },
    },
});

export const {
    initializePrevTickets,
    loadTickets,
} = slice.actions;

export default slice.reducer;