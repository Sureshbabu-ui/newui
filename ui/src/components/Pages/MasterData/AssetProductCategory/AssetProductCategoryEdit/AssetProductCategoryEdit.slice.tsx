import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ValidationErrors } from '../../../../../types/error';
import { ProductCategoryDetails } from '../../../../../types/assetProductCategory';

export interface CreateAssetProductCategoryState {
    productCategory: ProductCategoryDetails;
    errors: ValidationErrors;
    submitting: boolean;
    displayInformationModal: boolean;
}

const initialState: CreateAssetProductCategoryState = {
    productCategory: {
        Id:0,
        Code:"",
        PartProductCategory:"",
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
    name: 'assetproductcategoryedit',
    initialState,
    reducers: {
        initializeAssetProductCategoryEdit: () => initialState,
        updateField: (
            state,
            { payload: { name, value } }: PayloadAction<{ name: keyof CreateAssetProductCategoryState['productCategory']; value: any }>
        ) => {
            state.productCategory[name] = value as never;
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
        loadProductCategoryDetails: (state, { payload: ProductCategoryDetails }: PayloadAction<any>) => {
            state.productCategory = ProductCategoryDetails;
        },
    },
});

export const {
    initializeAssetProductCategoryEdit,
    updateErrors,
    startSubmitting,
    toggleInformationModalStatus,
    updateField,
    stopSubmitting,
    loadProductCategoryDetails
} = slice.actions;

export default slice.reducer;