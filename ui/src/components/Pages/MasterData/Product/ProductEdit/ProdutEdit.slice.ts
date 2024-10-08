import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ValidationErrors } from '../../../../../types/error';
import { SelectedProduct, SelectedProductDetails } from '../../../../../types/product';

export interface Select {
    value: any,
    label: any
}

export interface SelectDetails {
    Select: Select[]
}

export interface UpdateProductState {
    TenantOffices: Select[],
    product: SelectedProductDetails;
    errors: ValidationErrors;
    submitting: boolean;
    displayInformationModal: boolean;
}

const initialState: UpdateProductState = {
    TenantOffices: [],
    product: {
        ProductId: 0,
        AssetProductCategoryId: 0,
        AmcValue: null,
        Description: "",
        MakeId: 0,
        ManufacturingYear: null,
        ModelName: ""
    },
    errors: {},
    submitting: false,
    displayInformationModal: false,
};

const slice = createSlice({
    name: 'productupdate',
    initialState,
    reducers: {
        initializeProductUpdate: () => initialState,
        loadProductDetails: (state, { payload: { ProductData } }: PayloadAction<SelectedProduct>) => {
            state.product = ProductData;
        },
        updateField: (
            state,
            { payload: { name, value } }: PayloadAction<{ name: keyof UpdateProductState['product']; value: any }>
        ) => {
            state.product[name] = value;
            if (name === 'AmcValue' && value === "") {
                state.product.AmcValue = null;
            } else if (name === 'ManufacturingYear' && value === "") {
                state.product.ManufacturingYear = null;
            }
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
        loadTenantOffices: (state, { payload: { Select } }: PayloadAction<SelectDetails>) => {
            state.TenantOffices = Select.map((TenantOfficeInfo) => TenantOfficeInfo);
        },
        toggleInformationModalStatus: (state) => {
            state.displayInformationModal = !state.displayInformationModal;
        },
    },
});

export const {
    initializeProductUpdate,
    updateErrors,
    startSubmitting,
    toggleInformationModalStatus,
    updateField,
    loadTenantOffices,
    stopSubmitting,
    loadProductDetails
} = slice.actions;

export default slice.reducer;