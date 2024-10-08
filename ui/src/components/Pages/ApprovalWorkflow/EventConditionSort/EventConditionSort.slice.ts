import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EventConditionSort, EventConditionListView, EventDetail, EventConditionListDetail } from '../../../../types/ApprovalWorkflow/eventCondition';
import { ValidationErrors } from '../../../../types/error';
import { None, Option, Some } from '@hqoss/monads';

export interface EventConditions {
    eventConditionDetails: EventConditionListDetail;
}

export interface SortEventConditionState {
    eventConditionList: EventConditionListDetail[];
    eventDetail: EventDetail,
    errors: ValidationErrors;
    submitting: boolean;
    displayInformationModal: boolean;
    selectedId:string|null;
}

const initialState: SortEventConditionState = {
    eventConditionList: [],
    eventDetail: {
        EventId: null,
        EventGroupName: null,
        EventName: null
    },
    errors: {},
    submitting: false,
    displayInformationModal: false,
    selectedId:null
};

const slice = createSlice({
    name: 'eventconditionsort',
    initialState,
    reducers: {
        initializeEventConditionSort: () => initialState,
        clearEventConditionSort: (state) => {
            state.selectedId = null;
        },
        upwardMove: (
            state,
            { payload: { name, value } }: PayloadAction<{ name: string; value: number }>
        ) => {
            const sortedList = [...state.eventConditionList].sort((a, b) => a.Sequence - b.Sequence);
            const currentIndex = sortedList.findIndex(condition => condition.Id == Number(name));

            if (currentIndex > 0) {  
                sortedList[currentIndex].Sequence =sortedList[currentIndex-1].Sequence;
                sortedList[currentIndex - 1].Sequence=value;
                state.eventConditionList =sortedList.sort((a, b) => a.Sequence - b.Sequence)
            }
            state.selectedId = name
        },    
          downwardMove: (
            state,
            { payload: { name, value } }: PayloadAction<{ name: string; value: number }>
        ) => {
            const sortedList = [...state.eventConditionList].sort((a, b) => a.Sequence - b.Sequence);
            const currentIndex = sortedList.findIndex(condition => condition.Id == Number(name));

            if (currentIndex < sortedList.length-1) {  
                sortedList[currentIndex].Sequence =sortedList[currentIndex+1].Sequence;
                sortedList[currentIndex + 1].Sequence=value;
                state.eventConditionList =sortedList.sort((a, b) => a.Sequence - b.Sequence)
            }
            state.selectedId = name
        },
        loadEventConditionSortDetails: (state, { payload: { EventDetail, EventConditionList } }: PayloadAction<EventConditionListView>) => {
            state.eventDetail = EventDetail;
            state.eventConditionList = EventConditionList.sort((a, b) => a.Sequence - b.Sequence);
        },
        updateErrors: (state, { payload: errors }: PayloadAction<ValidationErrors>) => {
            state.errors = errors;
        },
        startSubmitting: (state) => {
            state.submitting = true;
        },
        stopSubmitting: (state) => {
            state.submitting = false;
        },
        toggleInformationModalStatus: (state) => {
            state.displayInformationModal = !state.displayInformationModal;
        },
    },
});

export const {
    initializeEventConditionSort,
    updateErrors,
    startSubmitting,
    toggleInformationModalStatus,
    loadEventConditionSortDetails,
    upwardMove,
    downwardMove,
    stopSubmitting,
    clearEventConditionSort,
} = slice.actions;

export default slice.reducer;