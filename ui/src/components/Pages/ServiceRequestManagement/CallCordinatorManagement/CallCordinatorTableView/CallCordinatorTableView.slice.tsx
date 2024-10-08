import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ValidationErrors } from '../../../../../types/error';
import { AssignEngineer, BulkEngineerAssign } from '../../../../../types/assignEngineer';
import { SelectDetails } from '../../../../../types/user';
import { Select } from '../../../../../types/assets';

export interface Shedules {
    Id: number,
    StartsFrom: string,
    CustomerReportedIssue: string;
    WorkOrderNumber: string;
}
const now = new Date();
const year = now.getFullYear();
const month = String(now.getMonth() + 1).padStart(2, '0'); // Add 1 because months are 0-based
const day = String(now.getDate()).padStart(2, '0');
const hours = String(now.getHours()).padStart(2, '0');
const minutes = String(now.getMinutes()).padStart(2, '0');
const formattedTime = `${year}-${month}-${day}T${hours}:${minutes}`;

export interface BulkEngineerAssignErrorList {
    Id: number | string
    AssigneeId: number | string;
    StartsFrom: string;
}

export interface CreateAssignEngineerState {
    EngineersList: Select[];
    assignengineer: BulkEngineerAssign[];
    startsFromLocalTime: string,
    errors: ValidationErrors;
    errorlist: BulkEngineerAssignErrorList[]
    displayInformationModal: boolean;
}

const initialState: CreateAssignEngineerState = {
    EngineersList: [],
    startsFromLocalTime: `${formattedTime}`,
    assignengineer: [],
    errors: {},
    errorlist: [],
    displayInformationModal: false,
};

const slice = createSlice({
    name: 'callcordinatortableview',
    initialState,
    reducers: {
        initializeCallCordiantorTableView: () => initialState,
        updateField: (
            state,
            { payload: { name, value, Id } }: PayloadAction<{ name: keyof CreateAssignEngineerState['assignengineer']; value: any; Id: number }>
        ) => {
            state.assignengineer[Id][name] = value;
        },
        updateErrors: (state, { payload: errors }: PayloadAction<ValidationErrors>) => {
            state.errors = errors;
        },
        updateErrorList: (state, { payload: errors }: PayloadAction<BulkEngineerAssignErrorList[]>) => {
            state.errorlist = errors;
        },
        loadServiceEngineers: (state, { payload: { Select } }: PayloadAction<SelectDetails>) => {
            state.EngineersList = Select.map((ServiceEngineers) => ServiceEngineers);
        },
        loadAssigneeDetails: (state, { payload: assigneeDetails }: PayloadAction<BulkEngineerAssign[]>) => {
            state.assignengineer = assigneeDetails.map((AssigneeDetails) => AssigneeDetails);
        },
        toggleInformationModalStatus: (state) => {
            state.displayInformationModal = !state.displayInformationModal;
        },
        InitializeAssignedEngineers: (state) => {
            state.assignengineer = initialState.assignengineer;
        },
    },
});

export const {
    initializeCallCordiantorTableView,
    updateErrors,
    toggleInformationModalStatus,
    updateField,
    InitializeAssignedEngineers,
    loadServiceEngineers,
    loadAssigneeDetails,
    updateErrorList
} = slice.actions;

export default slice.reducer;