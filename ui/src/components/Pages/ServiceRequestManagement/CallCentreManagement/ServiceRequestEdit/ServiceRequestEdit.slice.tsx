import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ValidationErrors } from '../../../../../types/error';
import { ServiceRequestAsset, ServiceRequestEdit, ServiceRequestForCreation } from '../../../../../types/serviceRequest';
import { Select, SelectDetails } from '../../../../../types/contract';

interface masterDataList {
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

export interface EditServiceRequestState {
    masterDataList: masterDataList
    searchStatus: boolean;
    serviceRequest: ServiceRequestEdit;
    asset: ServiceRequestAsset
    errors: ValidationErrors;
    displayInformationModal: boolean;
}

const initialState: EditServiceRequestState = {
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
        CallSeverityLevel:[]
    },
    searchStatus: false,
    serviceRequest: {
        Id: 0,
        IncidentId: "",
        TicketNumber:null,
        CustomerReportedIssue: "",
        CaseReportedOn: "",
        CaseReportedCustomerEmployeeName: "",
        CallTypeId: null,
        CallStatusId: null,
        CustomerContactTypeId: null,
        CallSourceId: null,
        EndUserEmail: "",
        EndUserName: "",
        EndUserPhone: "",
        OptedForRemoteSupport: true,
        IsInterimCaseId: false,
        RemoteSupportNotOptedReason: null,
        RepairReason: "",
        CallCenterRemarks: "",
        CustomerServiceAddress: "",
        ClosureRemarks: "",
        HoursSpent: 0,
        RemotelyClose: false,
        CallSeverityLevelId: null
    },
    asset: {
        Id: 0,
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
    errors: {},
    displayInformationModal: false,
};

const slice = createSlice({
    name: 'servicerequestedit',
    initialState,
    reducers: {
        initializeServiceRequestEdit: () => initialState,
        loadServiceRequestDetails: (state, { payload: ServiceRequestDetails }: PayloadAction<ServiceRequestEdit>) => {
            state.serviceRequest = ServiceRequestDetails;
        },
        loadAssetDetails: (state, { payload: AssetDetails }: PayloadAction<ServiceRequestAsset>) => {
            state.asset = AssetDetails;
        },
        loadMasterData: (state, { payload: { name, value: { Select } } }: PayloadAction<{ name: keyof EditServiceRequestState['masterDataList']; value: SelectDetails }>) => {
            state.masterDataList[name] = Select.map((masterData) => (masterData))
        },
        updateField: (
            state,
            { payload: { name, value } }: PayloadAction<{ name: keyof EditServiceRequestState['serviceRequest']; value: any }>
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
            state.serviceRequest[name] = value as never;
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
    initializeServiceRequestEdit,
    updateErrors,
    loadServiceRequestDetails,
    toggleInformationModalStatus,
    updateField,
    loadAssetDetails,
    loadMasterData
} = slice.actions;

export default slice.reducer;