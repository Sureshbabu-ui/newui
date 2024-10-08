import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CallStatusSingleDetail,  CallStatusPartIndentRequestDetail, CallStatusPartIndentDetails,  CallStatusPartAllocationDetail, CallStatusEngineerVisitDetails, CallStatusEngineerVisitDetail, CallStatusDetails } from '../../../../../../../../../types/callCentreManagement';

export interface CallStatusState {
    callStatusDetails: CallStatusSingleDetail
    callStatusPartIndentRequestDetails: CallStatusPartIndentRequestDetail[]
    callStatusPartAllocationDetails:CallStatusPartAllocationDetail[]
    callStatusEngineerVisitDetails:CallStatusEngineerVisitDetail[]
}

const initialState: CallStatusState = {
    callStatusDetails: {
        Id: 0,
        WorkOrderNumber: "",
        CaseId: "",
        CallCenterRemarks: "",
        CustomerReportedIssue: "",
        CallCreatedBy: "",
        CallCreatedOn: "",
        CallSource: "",
        OptedForRemoteSupport: false,
        IsInterim: false,
        CallType: "",
        CustomerName: "",
        SiteAddress: "",
        CustomerAddress: "",
        EndUserEmail: "",
        EndUserName: "",
        EndUserPhone: "",
        ProductSerialNumber: "",
        CategoryName: "",
        Make: "",
        ModelName: "",
        WarrantyEndDate: "",
        IsPreAmcCompleted: false,
        AssigneeName: "",
        AssignedBy: "",
        AssignedOn: "",
        AssignedFrom: "",
        AssignedTo: "",
        AgreementType:"",
        ContractEndDate:"",
        ContractNumber:"",
        ContractStartDate:""
    },
    callStatusPartIndentRequestDetails:[],
    callStatusPartAllocationDetails:[],
    callStatusEngineerVisitDetails:[]
};
const slice = createSlice({
    name: 'callstatusdetails',
    initialState,
    reducers: {
        initializeCallStatusDetails: () => initialState,
        loadCallStatusDetails: (
            state,
            { payload: { CallStatusReportDetails,PartAllocationDetails,PartIndentRequest,ServiceEngineerVisitsDetails} }: PayloadAction<CallStatusDetails>
        ) => {
            state.callStatusDetails = CallStatusReportDetails,
            state.callStatusPartIndentRequestDetails = PartIndentRequest,
            state.callStatusPartAllocationDetails = PartAllocationDetails,
            state.callStatusEngineerVisitDetails = ServiceEngineerVisitsDetails
        }   
    },
});

export const { initializeCallStatusDetails,loadCallStatusDetails } = slice.actions;
export default slice.reducer;