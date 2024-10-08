import { None, Option, Some } from '@hqoss/monads';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CallCordiantorServiceRequestDetail, CallCordiantorServiceRequestDetails, CallCordinatorServiceRequestList, CallCordinatorServiceRequest, CallCordinatorServiceRequestCount, CallCordinatorServiceRequestCounts } from '../../../../types/callCordinatorManagement';

export interface ServiceRequest {
  serviceRequest: CallCordinatorServiceRequest;
}

export interface CallCordinatorServiceRequestState {
  serviceRequests: Option<readonly ServiceRequest[]>;
  selectedServiceRequest: CallCordiantorServiceRequestDetail
  serviceRequestCounts: CallCordinatorServiceRequestCount
  selectedStatus: string
  currentPage: number;
  activeTab: number;
  searchWith: string;
  search: string;
  totalRows: number;
  perPage: number;
  serviceRequestId: number | null
}

const initialState: CallCordinatorServiceRequestState = {
  serviceRequests: None,
  currentPage: 1,
  activeTab: 0,
  search: "",
  searchWith: 'WorkOrderNumber',
  totalRows: 0,
  perPage: 0,
  serviceRequestId: null,
  selectedServiceRequest: {
    Id: 0,
    WorkOrderNumber: "",
    WorkOrderCreatedOn: "",
    CaseId: "",
    CustomerReportedIssue: "",
    CallCenterRemarks: "",
    CreatedBy: "",
    EndUserName: "",
    EndUserPhone: "",
    EndUserEmail: "",
    CustomerName: "",
    CustomerCode: "",
    SiteAddress: "",
    CustomerServiceAddress: "",
    CustomerSiteName: "",
    CallStatusCode: "",
    ContractNumber:"",
    CallStatus:"",
    CallType:"",
    CaseReportedCustomerEmployeeName:"",
    CaseReportedOn:"",
    CustomerContactType:"",
    IncidentId:"",
    OptedForRemoteSupport:false,
    RemoteSupportNotOptedReason:"",
    TicketNumber:""
  },
  serviceRequestCounts: {
    TotalCalls: 0,
    EngAccepted: 0,
    EngNotAccepted: 0,
    VisitStarted: 0,
    VisitClosed: 0,
    CallResolved: 0,
    NewCalls: 0,
    OnsiteClosed: 0,
    RemotelyClosed: 0
  },
  selectedStatus: "UNASSIGNED"
};
const slice = createSlice({
  name: 'callcordinatormanagement',
  initialState,
  reducers: {
    initializeCallCordinatorManagement: () => initialState,
    loadServiceRequests: (state, { payload: { ServiceRequestList, TotalRows, PerPage } }: PayloadAction<CallCordinatorServiceRequestList>) => {
      state.serviceRequests = Some(ServiceRequestList.map((serviceRequest) => ({ serviceRequest })));
      state.totalRows = TotalRows;
      state.perPage = PerPage;
    },
    loadServiceRequestCounts: (state, { payload: { ServiceRequestCounts } }: PayloadAction<CallCordinatorServiceRequestCounts>) => {
      state.serviceRequestCounts = ServiceRequestCounts;
    },
    changePage: (state, { payload: page }: PayloadAction<number>) => {
      state.currentPage = page;
    },
    setActiveTab: (state, { payload: index }: PayloadAction<number>) => {
      state.activeTab = index;
    },
    setSelectedStatus: (state, { payload: selectedStatus }: PayloadAction<string>) => {
      state.selectedStatus = selectedStatus;
    },
    setSearch: (state, { payload: Searchname }: PayloadAction<string>) => {
      state.search = Searchname;
    },
    setFilter: (state, { payload: { Value, Name } }: PayloadAction<{ Value: string, Name: keyof CallCordinatorServiceRequestState }>) => {
      state[Name] = Value as never;
    },
    setServiceRequestId: (state, { payload: Id }: PayloadAction<number>) => {
      state.serviceRequestId = Id;
    },
    loadSelectedServiceRequest: (
      state,
      { payload: { ServiceRequestDetails } }: PayloadAction<CallCordiantorServiceRequestDetails>
    ) => {
      state.selectedServiceRequest = ServiceRequestDetails
    },
  },
});

export const { initializeCallCordinatorManagement, loadServiceRequestCounts, setActiveTab, setServiceRequestId, loadServiceRequests, changePage, setSelectedStatus, setSearch, setFilter, loadSelectedServiceRequest } = slice.actions;
export default slice.reducer;