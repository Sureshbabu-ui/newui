import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CallCenterServiceRequestDetail, CallCenterServiceRequestDetails } from '../../../../../types/callCentreManagement';

export interface SelectedServiceRequestState {
    selectedServiceRequest: CallCenterServiceRequestDetail
}

const initialState: SelectedServiceRequestState = {
    selectedServiceRequest: {
        Id: 0,
        WorkOrderNumber: "",
        CaseId: "",
        CaseReportedOn: "",
        CaseReportedCustomerEmployeeName: "",
        CustomerReportedIssue: "",
        CallCenterRemarks: "",
        IncidentId: "",
        CreatedBy: "",
        CreatedOn: "",
        CallSource: "",
        OptedForRemoteSupport: false,
        RemoteSupportNotOptedReason: "",
        AssignedBy: "",
        CallStatus: "",
        CustomerName: "",
        CustomerCode: "",
        SiteAddress: "",
        CustomerServiceAddress: "",
        Make: "",
        ModelName: "",
        CategoryName: "",
        ProductSerialNumber: "",
        ContractNumber: "",
        InterimReviewRemarks: "",
        InterimReviewedOn: "",
        InterimStatus: "",
        ReviewedBy: "",
        Diagnosis: "",
        MspProvidedSolution: "",
        ClosureRemarks: "",
        ClosedBy: "",
        ClosedOn: "",
        HoursSpent: "",
        ResolutionTimeInHours:null,
        ResponseTimeInHours:null,
        StandByTimeInHours:null,
        CallType:"",
        CustomerContactType:"",
        EndUserEmail:"",
        EndUserName:"",
        EndUserPhone:"",
        RepairReason:"",
        TicketNumber:""
    },
};
const slice = createSlice({
    name: 'callcentreservicerequestdetails',
    initialState,
    reducers: {
        initializeServiceRequestInfo: () => initialState,
        loadSelectedServiceRequest: (
            state,
            { payload: { ServiceRequestDetails } }: PayloadAction<CallCenterServiceRequestDetails>
        ) => {
            state.selectedServiceRequest = ServiceRequestDetails
        },
    },
});

export const { initializeServiceRequestInfo, loadSelectedServiceRequest } = slice.actions;
export default slice.reducer;