import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ContractServiceRequestCount, ServiceRequestCount } from '../../../../types/serviceRequest';

export interface ContractDashboardState {
    servicerequestcount: ContractServiceRequestCount;
}

const initialState: ContractDashboardState = {
    servicerequestcount:
    {
        ClosedServiceRequestCount:0,
        OpenServiceRequestCount:0,
        TotalServiceRequestCount:0
    },
};

const slice = createSlice({
    name: 'contractdashboard',
    initialState,
    reducers: {
        initializeContractDashboard: () => initialState,
        loadContractServiceRequest: (state, { payload: { ContractServiceRequestCount } }: PayloadAction<ServiceRequestCount>) => {
            state.servicerequestcount = ContractServiceRequestCount;
        },
    },
});

export const {
    initializeContractDashboard,
    loadContractServiceRequest
} = slice.actions;

export default slice.reducer;