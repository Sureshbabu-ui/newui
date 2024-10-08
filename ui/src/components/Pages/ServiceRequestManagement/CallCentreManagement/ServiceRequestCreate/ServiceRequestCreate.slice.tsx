import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ValidationErrors } from '../../../../../types/error';
import { ServiceRequestAsset, ServiceRequestForCreation } from '../../../../../types/serviceRequest';
import { Select, SelectDetails } from '../../../../../types/contract';

const now = new Date();
const year = now.getFullYear();
const month = String(now.getMonth() + 1).padStart(2, '0'); // Add 1 because months are 0-based
const day = String(now.getDate()).padStart(2, '0');
const hours = String(now.getHours()).padStart(2, '0');
const minutes = String(now.getMinutes()).padStart(2, '0');
const formattedTime = `${year}-${month}-${day}T${hours}:${minutes}`;

export interface masterDataList {
    CallType: Select[],
    CustomerReportedIssue: Select[],
    RemoteSupportNotOptedReason: Select[],
    CustomerContactType: Select[],
    CallSource: Select[],
    CallStatus: Select[],
    ModelNames: Select[],
    MakeNames: Select[],
    CategoryNames: Select[],
    CallSeverityLevel: Select[]
}

export interface CreateServiceRequestState {
    masterDataList: masterDataList
    SearchType: string,
    SearchValue: string,
    searchStatus: boolean;
    proceedStatus: string;
    serviceRequest: ServiceRequestForCreation;
    asset: ServiceRequestAsset
    assetId: string;
    caseReportedOnLocalTime: string,
    errors: ValidationErrors;
    submitting: boolean;
    displayInformationModal: boolean;
}

const initialState: CreateServiceRequestState = {
    masterDataList: {
        CallType: [],
        CustomerContactType: [],
        CustomerReportedIssue: [],
        RemoteSupportNotOptedReason: [],
        CallSource: [],
        CallStatus: [],
        CategoryNames: [],
        MakeNames: [],
        ModelNames: [],
        CallSeverityLevel: []
    },
    SearchType: "ProductSerialNumber",
    SearchValue: "",
    searchStatus: false,
    proceedStatus: "",
    assetId: "",
    serviceRequest: {
        MspAssetId: "",
        ProductCategoryId: 0,
        ProductMakeId: 0,
        ProductModelNumber: 0,
        ProductSerialNumber: "",
        ContractAssetId: null,
        ContractId: null,
        TenantOfficeId: null,
        IncidentId: "",
        TicketNumber: null,
        CustomerReportedIssue: "",
        CustomerInfoId: 0,
        CustomerSiteId: 0,
        CaseReportedOn: `${new Date(formattedTime).toISOString()}`,
        CaseReportedCustomerEmployeeName: "",
        CallTypeId: null,
        CallStatusId: null,
        CustomerContactTypeId: null,
        CallSourceId: null,
        EndUserEmail: "",
        EndUserName: "",
        EndUserPhone: "",
        OptedForRemoteSupport: false,
        IsInterimCaseId: false,
        IsPreAmcApproval: false,
        IsFinanceApproval: false,
        RemoteSupportNotOptedReason: null,
        RepairReason: "",
        CallCenterRemarks: "",
        CustomerContactEmail: "",
        CustomerServiceAddress: "",
        RemotelyClose: false,
        ClosureRemarks: "",
        HoursSpent: 0,
        CallSeverityLevelId: null
    },
    asset: {
        Id: null,
        WarrantyEndDate: "",
        IsPreAmcCompleted: false,
        ContractId: null,
        TenantOfficeId: null,
        CustomerSiteId: null,
        ProductCategoryId: 0,
        ProductMakeId: 0,
        ProductModelNumber: 0,
        CustomerInfoId: 0,
        ProductSerialNumber: "",
        MspAssetId: "",
        CustomerAssetId: "",
        EndDate: "",
        ContractNumber: "",
        Location: "",
        CustomerSiteName: "",
        AgreementType: "",
        ServiceMode: "",
        CallExpiryDate: "",
        CallStopDate: "",
        CallStopReason: "",
        CustomerContactAddress: "",
        CustomerContactName: "",
        CustomerContactEmail: "",
        CustomerName: null,
        IsCallStopped: "",
        ContractStatus: ""
    },
    caseReportedOnLocalTime: `${formattedTime}`,
    errors: {},
    submitting: false,
    displayInformationModal: false,
};

const slice = createSlice({
    name: 'servicerequestcreate',
    initialState,
    reducers: {
        initializeServiceRequestCreate: () => initialState,
        loadAssetDetails: (state, { payload: AssetDetails }: PayloadAction<ServiceRequestAsset>) => {
            state.asset = AssetDetails;
            state.serviceRequest.ContractAssetId = AssetDetails.Id
            state.serviceRequest.ContractId = AssetDetails.ContractId;
            state.serviceRequest.TenantOfficeId = AssetDetails.TenantOfficeId;
            state.serviceRequest.CustomerContactEmail = AssetDetails.CustomerContactEmail;
            state.serviceRequest.CustomerInfoId = AssetDetails.CustomerInfoId
            state.serviceRequest.CustomerSiteId = AssetDetails.CustomerSiteId
            state.serviceRequest.ProductCategoryId = AssetDetails.ProductCategoryId
            state.serviceRequest.ProductModelNumber = AssetDetails.ProductModelNumber
            state.serviceRequest.ProductMakeId = AssetDetails.ProductMakeId
            state.serviceRequest.MspAssetId = AssetDetails.MspAssetId
            state.serviceRequest.ProductSerialNumber = AssetDetails.ProductSerialNumber
        },
        loadMasterData: (state, { payload: { name, value: { Select } } }: PayloadAction<{ name: keyof CreateServiceRequestState['masterDataList']; value: SelectDetails }>) => {
            state.masterDataList[name] = Select.map((masterData) => (masterData))
        },
        updateAssetField: (
            state,
            { payload: { name, value } }: PayloadAction<{ name: keyof CreateServiceRequestState['asset']; value: any }>
        ) => {
            state.asset[name] = value as never;
        },
        updateField: (
            state,
            { payload: { name, value } }: PayloadAction<{ name: keyof CreateServiceRequestState['serviceRequest']; value: any }>
        ) => {
            if ((name === "OptedForRemoteSupport" || name === "RemotelyClose")) {
                value == true ? state.serviceRequest.RemoteSupportNotOptedReason = null : ""
                if (value == false && name === "RemotelyClose") {
                    state.serviceRequest.ClosureRemarks = "";
                    state.serviceRequest.HoursSpent = 0;
                }
                if (name === "RemotelyClose") {
                    state.serviceRequest.OptedForRemoteSupport = value;
                }
            }
            if (name == "CaseReportedOn") {
                state.caseReportedOnLocalTime = value
                value = new Date(value).toISOString()
            }
            state.serviceRequest[name] = value as never;
        },
        updateSearchField: (
            state,
            { payload: { name, value } }: PayloadAction<{ name: keyof CreateServiceRequestState; value: any }>
        ) => {
            if (name == "SearchType") {
                state.SearchType = value;
            }
            else if (name == "SearchValue")
                state.SearchValue = value
        },
        searchStatusStartSubmitting: (state, { payload: status }) => {
            state.searchStatus = status;
        },
        proceedStatusStartSubmitting: (state, { payload: { name, value } }: PayloadAction<{ name: keyof CreateServiceRequestState; value: any }>) => {
            state.proceedStatus = value;
            state.serviceRequest.ContractAssetId = 0;
            state.serviceRequest.CustomerInfoId = 0;
            if (value == 0) {
                state.SearchValue = "";
                state.searchStatus = false
                state.proceedStatus = ""
            } else {
                state.serviceRequest.IsInterimCaseId = true
            }
        },
        updateErrors: (state, { payload: errors }: PayloadAction<ValidationErrors>) => {
            state.errors = errors;
        },
        startSubmitting: (state) => {
            state.submitting = true;
        },
        initializingData: (state) => {
            state.asset = initialState.asset
            state.serviceRequest = initialState.serviceRequest
        },
        stopSubmitting: (state) => {
            state.submitting = false;
        },
        setIsInterim: (state, { payload: approvalType }: PayloadAction<string>) => {
            state.serviceRequest.IsInterimCaseId = true
            if (approvalType == "BothApproval") {
                state.serviceRequest.IsPreAmcApproval = true
                state.serviceRequest.IsFinanceApproval = true
            } else if (approvalType == "PreAmcApproval") {
                state.serviceRequest.IsPreAmcApproval = true
            } else {
                state.serviceRequest.IsFinanceApproval = true
            }
        },
        toggleInformationModalStatus: (state) => {
            state.displayInformationModal = !state.displayInformationModal;
        },
    },
});

export const {
    initializeServiceRequestCreate,
    updateErrors,
    startSubmitting,
    toggleInformationModalStatus,
    updateField,
    stopSubmitting,
    updateSearchField,
    loadAssetDetails,
    searchStatusStartSubmitting,
    proceedStatusStartSubmitting,
    initializingData,
    setIsInterim,
    updateAssetField,
    loadMasterData
} = slice.actions;

export default slice.reducer;