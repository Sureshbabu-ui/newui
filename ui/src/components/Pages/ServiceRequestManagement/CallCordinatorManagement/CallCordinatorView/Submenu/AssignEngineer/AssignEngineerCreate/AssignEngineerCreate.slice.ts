import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ValidationErrors } from '../../../../../../../../types/error';
import { AssignEngineer, EngineersNamesList, MultipleExistingAssigneeShedules } from '../../../../../../../../types/assignEngineer';
import { ServiceEngineersCategoryWiseList, ServiceEngineersList } from '../../../../../../../../types/user';

export interface Shedules {
    Id: number,
    StartsFrom: string,
    CustomerReportedIssue: string;
    WorkOrderNumber: string;
    Assignee: string;
}
const now = new Date();
const year = now.getFullYear();
const month = String(now.getMonth() + 1).padStart(2, '0'); // Add 1 because months are 0-based
const day = String(now.getDate()).padStart(2, '0');
const hours = String(now.getHours()).padStart(2, '0');
const minutes = String(now.getMinutes()).padStart(2, '0');
const formattedTime = `${year}-${month}-${day}T${hours}:${minutes}`;

export interface ExistingShedules {
    existingShedules: Shedules;
}
export interface EntitiesDetails {
    Id: number;
    FullName: string;
}

export interface CreateAssignEngineerState {
    existingShedules: ExistingShedules[];
    EngineersList: ServiceEngineersList[];
    assignengineer: AssignEngineer;
    startsFromLocalTime: string,
    errors: ValidationErrors;
    submitting: boolean;
    displayInformationModal: boolean;
}

const initialState: CreateAssignEngineerState = {
    EngineersList: [],
    existingShedules: [],
    startsFromLocalTime: `${formattedTime}`,
    assignengineer: {
        AssigneeId: "",
        StartsFrom: "",
        Remarks: "",
        ServiceRequestId: 0,
        IsFirstAssignment: false
    },
    errors: {},
    submitting: false,
    displayInformationModal: false,
};

const slice = createSlice({
    name: 'assignengineercreate',
    initialState,
    reducers: {
        initializeTAssignEngineerCreate: () => initialState,
        updateField: (
            state,
            { payload: { name, value } }: PayloadAction<{ name: keyof CreateAssignEngineerState['assignengineer']; value: any }>
        ) => {
            state.assignengineer[name] = value as never;
        },
        ShedulesExist: (state, { payload: { ExistingShedules } }: PayloadAction<MultipleExistingAssigneeShedules>) => {
            state.existingShedules = ExistingShedules.map((existingShedules) => ({ existingShedules }));
        },
        setServiceRequestId: (state, { payload: Id }: PayloadAction<any>) => {
            state.assignengineer.ServiceRequestId = Id;
        },
        getFirstAssignment: (state, { payload: TotalRows }: PayloadAction<any>) => {
            state.assignengineer.IsFirstAssignment = TotalRows;
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
        loadServiceEngineers: (state, { payload: { ServiceEngineers } }: PayloadAction<ServiceEngineersCategoryWiseList>) => {
            state.EngineersList = ServiceEngineers.map((ServiceEngineers) => ServiceEngineers);
        },
        toggleInformationModalStatus: (state) => {
            state.displayInformationModal = !state.displayInformationModal;
        },
    },
});

export const {
    initializeTAssignEngineerCreate,
    updateErrors,
    startSubmitting,
    toggleInformationModalStatus,
    updateField,
    setServiceRequestId,
    loadServiceEngineers,
    stopSubmitting,
    getFirstAssignment,
    ShedulesExist
} = slice.actions;

export default slice.reducer;