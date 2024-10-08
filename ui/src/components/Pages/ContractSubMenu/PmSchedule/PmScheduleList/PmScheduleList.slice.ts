import { None, Option, Some } from '@hqoss/monads';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PmScheduleList, PmScheduleListDetail } from '../../../../../types/pmSchedule';

export interface PmSchedulesList {
    PmSchedules: PmScheduleList;
}
export interface PmScheduleListState {
    PmSchedules: Option<readonly PmSchedulesList[]>;
}
const initialState: PmScheduleListState = {
    PmSchedules: None,
};

const slice = createSlice({
    name: 'pmschedulelist',
    initialState,
    reducers: {
        initializePmSchedulesList: () => initialState,
        loadPmSchedules: (state, { payload: { PmSchedules } }: PayloadAction<PmScheduleListDetail>) => {
            state.PmSchedules = Some(PmSchedules.map((PmSchedules) => ({ PmSchedules })));
        },
    },
});

export const { initializePmSchedulesList, loadPmSchedules } = slice.actions;
export default slice.reducer;