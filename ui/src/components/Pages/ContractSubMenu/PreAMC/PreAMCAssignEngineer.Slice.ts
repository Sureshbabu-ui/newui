import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {ValidationErrors } from '../../../../types/error';
import { EngineerDetailsArray, MultipleAssignedEngineerExistingSchedule } from '../../../../types/contractPreAmc';

export interface AssignEngineer {
    PreAmcScheduleId: string,
    EngineerId: string,
    PlannedFrom: string,
    PlannedTo: string
}

interface SelectedSiteDetails {
    SiteName: string,
    Address: string,
    StartsOn: string,
    EndsOn: string
}
export interface Shedules {
    PlannedFrom: string;
    PlannedTo: string;
    EngineerId: number,
}
export interface ExistingShedules {
    existingShedules: Shedules;
}

export interface AssignEngineerState {
    engineersList: EngineerDetailsArray
    assignEngineer: AssignEngineer;
    errors: ValidationErrors;
    selectedSiteDetails: SelectedSiteDetails
    submitting: boolean;
    displayInformationModal: boolean;
    existingShedules: ExistingShedules[];
}

const initialState: AssignEngineerState = {
    engineersList: [{
        Id: 0,
        FullName: ''
    }],
    assignEngineer: {
        PreAmcScheduleId: '',
        EngineerId: '',
        PlannedFrom: '',
        PlannedTo: '',
    },
    selectedSiteDetails: {
        Address: '',
        EndsOn: '',
        SiteName: '',
        StartsOn: '',
    },
    errors: {},
    submitting: false,
    displayInformationModal: false,
     existingShedules: [],
};

const slice = createSlice({
    name: 'assignengineer',
    initialState,
    reducers: {
        initializeAssignEngineer: () => initialState,
        loadEngineers: (state, { payload: Engineers }: PayloadAction<EngineerDetailsArray>) => {
            state.engineersList = Engineers.map((Engineers) => Engineers);
        },
        updateField: (
            state,
            { payload: { name, value } }: PayloadAction<{ name: keyof AssignEngineerState['assignEngineer']; value: any }>
        ) => {
            state.assignEngineer[name] = value;            
        },
        updateErrors: (state, { payload: errors }: PayloadAction<ValidationErrors>) => {
            state.errors = errors;
        }, 
        loadSelectedSite: (
            state,
            { payload: { Address, SiteName, EndsOn, StartsOn } }: PayloadAction<{ Address: string, SiteName: string, EndsOn: string, StartsOn: string }>
        ) => {
            state.selectedSiteDetails.Address = Address
            state.selectedSiteDetails.SiteName = SiteName
            state.selectedSiteDetails.EndsOn = EndsOn
            state.selectedSiteDetails.StartsOn = StartsOn
        },
        loadPreAmcScheduleId: (state, { payload: Id }) => {
            state.assignEngineer.PreAmcScheduleId = Id
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
         ShedulesExist: (state, { payload: { ExistingShedules } }: PayloadAction<MultipleAssignedEngineerExistingSchedule>) => {
            state.existingShedules = ExistingShedules.map((existingShedules) => ({ existingShedules }));           
        },
    },
});

export const {
    initializeAssignEngineer,
    updateField,
    loadEngineers,
    updateErrors,
    loadSelectedSite,
    loadPreAmcScheduleId,
    startSubmitting,
    toggleInformationModalStatus,
    stopSubmitting,
    ShedulesExist
} = slice.actions;
export default slice.reducer;