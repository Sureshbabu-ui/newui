import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ValidationErrors } from "../../../../../../types/error";
import { RequestForPurchaseOrder } from "../../../../../../types/purchaseorder";

interface Select {
    value: any,
    label: any
}

export interface SelectDetails {
    Select: Select[]
}

export interface RequestPOState {
    errors: ValidationErrors;
    submitting: boolean;
    displayInformationModal: boolean;
    vendornames: Select[];
    StockTypes: Select[];
    VendorTypes:Select[]
    requestforpurchaseorder: RequestForPurchaseOrder;
    PartName: string;
}

const initialState: RequestPOState = {
    errors: {},
    vendornames: [],
    submitting: false,
    displayInformationModal: false,
    requestforpurchaseorder: {
        Id: 0,
        Price: 0,
        VendorId: 0,
        VendorTypeId: null,
        StockTypeId: 0,
        WarrantyPeriod: 0
    },
    StockTypes: [],
    VendorTypes: [],
    PartName: ""
};

const slice = createSlice({
    name: 'requestpurchaseorder',
    initialState,
    reducers: {
        initializeRequestPurchaseOrder: () => initialState,
        updateField: (
            state,
            { payload: { name, value } }: PayloadAction<{ name: keyof RequestPOState['requestforpurchaseorder']; value: any }>
        ) => {
            state.requestforpurchaseorder[name] = value as never;
        },
        loadVendorNames: (state, { payload: { Select } }: PayloadAction<SelectDetails>) => {
            state.vendornames = Select.map((vendornames) => vendornames);
        },
        loadVendorType: (state, { payload: { Select } }: PayloadAction<SelectDetails>) => {
            state.VendorTypes = Select.map((VendorTypes) => VendorTypes);
        },
        loadStockTypes: (state, { payload: { Select } }: PayloadAction<SelectDetails>) => {
            state.StockTypes = Select.map((StockTypes) => StockTypes);
        },
        loadDemandId: (state, { payload: Id }: PayloadAction<any>) => {
            state.requestforpurchaseorder.Id = Id
        },
        loadPartName: (state, { payload: name }: PayloadAction<any>) => {
            state.PartName = name
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
    },
});

export const {
    initializeRequestPurchaseOrder,
    updateField,
    updateErrors,
    startSubmitting,
    loadVendorType,
    toggleInformationModalStatus,
    stopSubmitting,
    loadVendorNames,
    loadDemandId,
    loadPartName,
    loadStockTypes
} = slice.actions;

export default slice.reducer;