import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ValidationErrors } from '../../../../../../types/error';
import { SelectDetails, Select, ServiceRequestAsset } from '../../../../../../types/serviceRequest';

export interface InterimCallCreateState {
    assetDetails: ServiceRequestAsset;
    interimSelectDetails: {
        CustomerNames: Select[],
        ProductCategory: Select[],
        Make: Select[],
        ProductModel: Select[],
        ContractNumbers: Select[],
        CustomerSiteNames: Select[],
    }
    interimDetails: {
        CustomerId: number,
        ContractId: number
        ProductCategoryId: number,
        ProductMakeId: number,
        ProductModelNumber: number,
        CustomerSiteId: number,
    }
    errors: ValidationErrors;
    submitting: boolean;
    displayInformationModal: boolean;
}

const initialState: InterimCallCreateState = {
    assetDetails: {
        Id: null,
        WarrantyEndDate:"",
        CustomerSiteId: null,
        ProductCategoryId: 0,
        ProductMakeId: 0,
        ProductModelNumber: 0,
        ProductSerialNumber: "",
        MspAssetId: "",
        CustomerAssetId: "",
        ContractId: null, 
        IsPreAmcCompleted:true,
        TenantOfficeId: null,
        CustomerInfoId: 0,
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
        CustomerName: "",
        IsCallStopped: "",
        ContractStatus:""
    },
    interimDetails: {
        ContractId: 0,
        CustomerId: 0,
        ProductMakeId: 0,
        ProductModelNumber: 0,
        ProductCategoryId: 0,
        CustomerSiteId: 0,
    },
    interimSelectDetails: {
        ProductCategory: [],
        ProductModel: [],
        Make: [],
        CustomerNames: [],
        ContractNumbers: [],
        CustomerSiteNames: [],
    },
    errors: {},
    submitting: false,
    displayInformationModal: false,
};

const slice = createSlice({
    name: 'interimcallcreate',
    initialState,
    reducers: {
        initializeInterimCallCreate: () => initialState,
        updateField: (
            state,
            { payload: { name, value } }: PayloadAction<{ name: keyof InterimCallCreateState['interimDetails']; value: any }>
        ) => {
            state.interimDetails[name] = value;
        },
        updateAsetField: (
            state,
            { payload: { valuesToUpdate } }: PayloadAction<{ valuesToUpdate: Record<string, any> }>
        ) => {
            for (const key in valuesToUpdate) {
                if (key in state.assetDetails) {
                    state.assetDetails[key] = valuesToUpdate[key];
                }
            }
        },
        updateRemainingAssetDdetails: (state, { payload: { name, value } }: PayloadAction<{ name: keyof InterimCallCreateState['assetDetails']; value: any }>) => {
            state.assetDetails[name] = value as never
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
        toggleInformationModalStatus: (state) => {
            state.displayInformationModal = !state.displayInformationModal;
        },
        loadInterimCallDetails: (state, { payload: { name, value: { SelectDetails } } }: PayloadAction<{ name: keyof InterimCallCreateState['interimSelectDetails']; value: SelectDetails }>) => {
            state.interimSelectDetails[name] = SelectDetails.map((SelectDetails) => SelectDetails);
        },
    },
});

export const {
    initializeInterimCallCreate,
    updateErrors,
    updateRemainingAssetDdetails,
    updateAsetField,
    loadInterimCallDetails,
    startSubmitting,
    toggleInformationModalStatus,
    updateField,
    stopSubmitting
} = slice.actions;

export default slice.reducer;
