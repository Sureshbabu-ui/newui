import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ValidationErrors } from '../../../../../types/error';
import { CallStopHistoryDetail, CallStopStatus, CallStopUpdateData } from '../../../../../types/contractSetting';

export interface CallStopSettingsState {
    callStatusDetails: CallStopStatus;
    callStopHistory: CallStopHistoryDetail[]
    callStatusUpdateData: CallStopUpdateData;
    displayInformationModal: boolean;
    errors: ValidationErrors;
    submitting: boolean;
    isUpdateEnabled: string;
}

const initialState: CallStopSettingsState = {
    callStatusDetails: {
        Id: 0,
        CallExpiryDate: "",
        CallStopDate: null,
        CallStopReason: ""
    },
    callStatusUpdateData: {
        Status: null,
        Reason: "",
        CallStopDate: ""
    },
    callStopHistory: [],
    displayInformationModal: false,
    errors: {},
    submitting: false,
    isUpdateEnabled: "CALL_STATUS_UPDATE"
};

const slice = createSlice({
    name: 'callstopsetting',
    initialState,
    reducers: {
        initializeCallStopStatusDetails: () => initialState,
        callStatusDetails: (state, { payload: CallStatusDetails }: PayloadAction<any>) => {
            state.callStatusDetails = CallStatusDetails;
        },
        loadCallStophistory: (state, { payload: CallStopHistory }: PayloadAction<CallStopHistoryDetail[]>) => {
            state.callStopHistory = CallStopHistory.map((history) => (history))
        },
        loadCallStopStatus: (state, { payload: CallStatusDetails }: PayloadAction<any>) => {
            state.callStatusDetails = CallStatusDetails;
            state.callStatusUpdateData.Status = state.callStatusDetails.CallStopDate != null
        },
        updateField: (
            state,
            { payload: { name, value } }: PayloadAction<{ name: keyof CallStopSettingsState['callStatusUpdateData']; value: any }>
        ) => {
            state.callStatusUpdateData[name] = value as never;
        },
        toggleInformationModalStatus: (state) => {
            state.displayInformationModal = !state.displayInformationModal;
        },
        updateErrors: (state, { payload: errors }: PayloadAction<ValidationErrors>) => {
            state.errors = errors;
        }, startSubmitting: (state) => {
            state.submitting = true;
        },
        stopSubmitting: (state) => {
            state.submitting = false;
        },
        toggleUpdate: (state, { payload: status }: PayloadAction<string>) => {
            state.isUpdateEnabled = status
        },
    },
});

export const {
    initializeCallStopStatusDetails,
    callStatusDetails,
    loadCallStopStatus,
    updateField,
    toggleInformationModalStatus,
    updateErrors,
    startSubmitting,
    stopSubmitting,
    loadCallStophistory,
    toggleUpdate
} = slice.actions;

export default slice.reducer;