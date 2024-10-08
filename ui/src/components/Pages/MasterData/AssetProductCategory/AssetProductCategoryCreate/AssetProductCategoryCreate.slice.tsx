import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ValidationErrors } from '../../../../../types/error';
import { ProductCategoryCreate } from '../../../../../types/assetProductCategory';

export interface CreateProductCategoryState {
    productCategory: ProductCategoryCreate;
    errors: ValidationErrors;
    submitting: boolean;
    displayInformationModal: boolean;
}

const initialState: CreateProductCategoryState = {
    productCategory: {
        CategoryName: "",
        PartProductCategoryId: 0,
        GeneralNotCovered:null,
        SoftwareNotCovered:null,
        HardwareNotCovered:null
    },
    errors: {},
    submitting: false,
    displayInformationModal: false,
};

const slice = createSlice({
    name: 'assetproductcategorycreate',
    initialState,
    reducers: {
        initializeAssetProductCategoryCreate: () => initialState,
        updateField: (
            state,
            { payload: { name, value } }: PayloadAction<{ name: keyof CreateProductCategoryState['productCategory']; value: any }>
        ) => {
            state.productCategory[name] = value;
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
    initializeAssetProductCategoryCreate,
    updateErrors,
    startSubmitting,
    toggleInformationModalStatus,
    updateField,
    stopSubmitting
} = slice.actions;

export default slice.reducer;