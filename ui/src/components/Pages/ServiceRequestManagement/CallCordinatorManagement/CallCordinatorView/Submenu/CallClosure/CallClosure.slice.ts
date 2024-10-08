import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ValidationErrors } from '../../../../../../../types/error';

export interface CallServiceRequest {
    ServiceRequestId: number;
    SlaBreachedReason: string;
    ClosureRemarks: string;
    CaseStatusCode: number | string;
    HoursSpent: string;
    IsSlaBreached: boolean
}
export interface CallClosureState {
    servicereqclosure: CallServiceRequest;
    errors: ValidationErrors;
    displayInformationModal: boolean;
}

const initialState: CallClosureState = {
    servicereqclosure: {
        ClosureRemarks: "",
        ServiceRequestId: 0,
        CaseStatusCode: '',
        HoursSpent: "",
        SlaBreachedReason: "",
        IsSlaBreached: false
    },
    errors: {},
    displayInformationModal: false,
};

const slice = createSlice({
    name: 'callclosure',
    initialState,
    reducers: {
        initializeCallClosure: () => initialState,
        updateField: (
            state,
            { payload: { name, value } }: PayloadAction<{ name: keyof CallClosureState['servicereqclosure']; value: any }>
        ) => {
            state.servicereqclosure[name] = value as never;
        },
        setServiceRequestDetail: (state, { payload: Id }: PayloadAction<any>) => {
            state.servicereqclosure.ServiceRequestId = Id;
        },
        updateErrors: (state, { payload: errors }: PayloadAction<ValidationErrors>) => {
            state.errors = errors;
        },
        toggleInformationModalStatus: (state) => {
            state.displayInformationModal = !state.displayInformationModal;
        },
    },
});

export const {
    initializeCallClosure,
    updateErrors,
    toggleInformationModalStatus,
    updateField,
    setServiceRequestDetail
} = slice.actions;

export default slice.reducer;