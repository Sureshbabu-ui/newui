import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ValidationErrors } from '../../../../../types/error';
import { InterimAssetDetail, InterimAssetInfo, InterimServiceRequestDetail, InterimServiceRequestDetails } from '../../../../../types/serviceRequest';
import { InterimAssetsCreation, Select, SelectDetails } from '../../../../../types/assets';

export interface MasterData {
    ProductSupportType: Select[],
    PreventiveMaintenanceFrequency: Select[]
    ProductPreAmcCondition: Select[]
    ServiceEngineers: Select[]
}

export interface RejectInterimCall {
    ReviewStatus: string;
    ReviewRemarks: string;
    ServiceRequestId: number | string;
    InterimAssetStatus: string;
}

export interface InterimCallApproval {
    ReviewStatus: string;
    ReviewRemarks: string;
    ServiceRequestId: number | string;
}

export interface CreateServiceRequestState {
    assets: InterimAssetsCreation;
    interimServiceRequestDetails: InterimServiceRequestDetail;
    interimAssetDetails: InterimAssetDetail;
    errors: ValidationErrors;
    displayInformationModal: boolean;
    masterData: MasterData;
    InterimCallReject: RejectInterimCall;
    InterimCallApproval: InterimCallApproval;
}

const initialState: CreateServiceRequestState = {
    interimAssetDetails: {
        AssetSerialNumber: "",
        ContractId: 0,
        CustomerSiteId: 0,
        CustomerSiteName: "",
        InterimAssetStatusId: 0,
        ProductCategoryId: 0,
        ProductMakeId: 0,
        ProductModelId: 0,
        ServiceRequestId: 0,
        InterimAssetId: null,
        CategoryName: "",
        Make: "",
        ModelName: "",
        CustomerSiteAddress: "",
        CustomerContactName: "",
        CustomerContactEmail: "",
        IsProductCountExceeded: false
    },
    interimServiceRequestDetails: {
        Id: 0,
        CaseId: "",
        CustomerReportedIssue: "",
        CaseReportedOn: "",
        CustomerName: "",
        CustomerSiteName: "",
        CustomerSiteAddress: "",
        CustomerContactName: "",
        CustomerContactEmail: "",
        AssetSerialNumber: "",
        CategoryName: "",
        Make: "",
        ModelName: "",
        ContractNumber: "",
        EndDate: "",
        Location: "",
        AgreementType: "",
        ServiceMode: "",
        CallExpiryDate: "",
        CallStopDate: "",
        CallStopReason: "",
        IsPreAmcApprovalNeeded: false,
        IsPreAmcCompleted: false,
        PreAmcCompletedBy: 0,
        PreAmcCompletedDate: ""
    },
    InterimCallReject: {
        ReviewRemarks: "",
        ReviewStatus: "",
        ServiceRequestId: "",
        InterimAssetStatus: "IAS_RJTD"
    },
    InterimCallApproval: {
        ReviewRemarks: "",
        ReviewStatus: "",
        ServiceRequestId: "",
    },
    assets: {
        ContractId: 0,
        SiteNameId: 0,
        ProductCategoryId: 0,
        ProductMakeId: 0,
        ProductId: 0,
        AssetSerialNumber: '',
        AccelAssetId: '',
        IsEnterpriseAssetId: -1,
        ResponseTimeInHours: 0,
        ResolutionTimeInHours: 0,
        StandByTimeInHours: 0,
        IsVipAssetId: -1,
        IsOutsourcingNeededId: -1,
        IsPreAmcCompleted: -1,
        PreAmcCompletedBy: 0,
        PreAmcCompletedDate: "",
        AmcValue: 0,
        AssetConditionId: 0,
        IsPreventiveMaintenanceNeededId: -1,
        PreventiveMaintenanceFrequencyId: null,
        WarrantyEndDate: null,
        AmcStartDate: '',
        AmcEndDate: '',
        CustomerAssetId: '',
        AssetSupportTypeId: 0,
        ReviewStatus: "",
        ReviewRemarks: "",
        ServiceRequestId: 0,
        AssetAddModeId: 0,
        InterimAssetId: null
    },
    masterData: {
        ProductSupportType: [],
        PreventiveMaintenanceFrequency: [],
        ProductPreAmcCondition: [],
        ServiceEngineers: []
    },
    errors: {},
    displayInformationModal: false,
};

const slice = createSlice({
    name: 'interimrequestreview',
    initialState,
    reducers: {
        initializeServiceRequestCreate: () => initialState,
        loadMasterData: (state, { payload: { name, value: { Select } } }: PayloadAction<{ name: keyof CreateServiceRequestState['masterData']; value: SelectDetails }>) => {
            state.masterData[name] = Select.map((masterData) => (masterData))
        },
        updateField: (
            state,
            { payload: { name, value } }: PayloadAction<{ name: keyof CreateServiceRequestState['assets']; value: any }>
        ) => {
            state.assets[name] = value as never;
            if (state.interimAssetDetails.ServiceRequestId != 0) {
                state.assets.ContractId = state.interimAssetDetails.ContractId;
                state.assets.SiteNameId = state.interimAssetDetails.CustomerSiteId;
                state.assets.ProductCategoryId = state.interimAssetDetails.ProductCategoryId;
                state.assets.ProductMakeId = state.interimAssetDetails.ProductMakeId;
                state.assets.ProductId = state.interimAssetDetails.ProductModelId;
                state.assets.ServiceRequestId = state.interimAssetDetails.ServiceRequestId;
                state.assets.AssetAddModeId = state.interimAssetDetails.InterimAssetStatusId;
                state.assets.AssetSerialNumber = state.interimAssetDetails.AssetSerialNumber;
                state.assets.InterimAssetId = state.interimAssetDetails.InterimAssetId;
            }
            if (name == "IsPreAmcCompleted") {
                if (value == 1) {
                    state.interimServiceRequestDetails.IsPreAmcCompleted = true
                } else {
                    state.interimServiceRequestDetails.IsPreAmcCompleted = false
                    state.assets.PreAmcCompletedBy = null,
                        state.assets.PreAmcCompletedDate = null
                }
            }
        },
        rejectCall: (
            state,
            { payload: { name, value } }: PayloadAction<{ name: keyof CreateServiceRequestState['InterimCallReject']; value: any }>
        ) => {
            state.InterimCallReject[name] = value;
            if (state.interimAssetDetails.ServiceRequestId != 0) {
                state.InterimCallReject.ServiceRequestId = state.interimAssetDetails.ServiceRequestId;
            } else {
                state.InterimCallReject.ServiceRequestId = state.interimServiceRequestDetails.Id;
            }
        },
        interimCallApproval: (
            state,
            { payload: { name, value } }: PayloadAction<{ name: keyof CreateServiceRequestState['InterimCallApproval']; value: any }>
        ) => {
            state.InterimCallApproval[name] = value;
            if (state.interimAssetDetails.ServiceRequestId != 0) {
                state.InterimCallApproval.ServiceRequestId = state.interimAssetDetails.ServiceRequestId;
            } else {
                state.InterimCallApproval.ServiceRequestId = state.interimServiceRequestDetails.Id;
            }
        },
        loadInterimServiceRequestDetails: (state, { payload: { InterimServiceRequestDetails } }: PayloadAction<InterimServiceRequestDetails>) => {
            state.interimServiceRequestDetails = InterimServiceRequestDetails
        },
        updateErrors: (state, { payload: errors }: PayloadAction<ValidationErrors>) => {
            state.errors = errors;
        },
        toggleInformationModalStatus: (state) => {
            state.displayInformationModal = !state.displayInformationModal;
        },
        loadInterimAsset: (state, { payload: { InterimAssetDetails } }: PayloadAction<InterimAssetInfo>) => {
            state.interimAssetDetails = InterimAssetDetails
        },
    },
});

export const {
    initializeServiceRequestCreate,
    updateErrors,
    loadInterimServiceRequestDetails,
    toggleInformationModalStatus,
    updateField,
    loadMasterData,
    rejectCall,
    loadInterimAsset,
    interimCallApproval
} = slice.actions;

export default slice.reducer;