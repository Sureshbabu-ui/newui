import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PmScheduleDetail, PmScheduleView } from '../../../../../types/pmSchedule';
import { None, Option, Some } from '@hqoss/monads';

export interface PmSchedulesList {
    PmScheduleDetails: PmScheduleDetail;
}
export interface PmScheduleDetailsState {
    PmScheduleDetails: Option<readonly PmSchedulesList[]>;
}
const initialState: PmScheduleDetailsState = {
    PmScheduleDetails: None,
};
const slice = createSlice({
    name: 'pmscheduledetails',
    initialState,
    reducers: {
        initializePmScheduleDetails: () => initialState,
        loadPmScheduleDetails: (state, { payload: { PmScheduleDetails } }: PayloadAction<PmScheduleView>) => {
            state.PmScheduleDetails = Some(PmScheduleDetails.map((PmScheduleDetails) => ({ PmScheduleDetails })));
        },
    },
});

export const { initializePmScheduleDetails, loadPmScheduleDetails } = slice.actions;
export default slice.reducer;