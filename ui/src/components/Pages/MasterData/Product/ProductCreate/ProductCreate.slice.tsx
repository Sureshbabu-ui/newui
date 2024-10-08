import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ValidationErrors } from '../../../../../types/error';
import {  MakeName, MakeNames, ProductCreate } from '../../../../../types/product';
import { AssetCategoryName, AssetProductCategoryNames } from '../../../../../types/assetProductCategory';

export interface CreateProductState {
    product: ProductCreate;
    makeNames: MakeName[];
    categoryNames: AssetCategoryName[];
    errors: ValidationErrors;
    submitting: boolean;
    displayInformationModal: boolean;
}

const initialState: CreateProductState = {
    product: {
        ModelName: '',
        Description: '',
        CategoryId: 0,
        MakeId: 0,
        AmcValue: null,
        ManufacturingYear: null
    },
    makeNames: [],
    categoryNames: [],
    errors: {},
    submitting: false,
    displayInformationModal: false,
};

const slice = createSlice({
    name: 'productcreate',
    initialState,
    reducers: { 
        initializeProductCreate: () => initialState,
        loadMakeName: (state, { payload: { MakeNames } }: PayloadAction<MakeNames>) => {
            state.makeNames = MakeNames.map((names) => names);
        },
        loadCategoryName: (state, { payload: { AssetProductCategoryNames } }: PayloadAction<AssetProductCategoryNames>) => {
            state.categoryNames = AssetProductCategoryNames.map((names) => names);
        },
        updateField: (
            state,
            { payload: { name, value } }: PayloadAction<{ name: keyof CreateProductState['product']; value: any }>
        ) => {
            state.product[name] = value;
            if (name === 'AmcValue' && value === "") {
                state.product.AmcValue = null;
            } else if (name === 'ManufacturingYear' && value === ""){
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
        toggleInformationModalStatus: (state) => {
            state.displayInformationModal = !state.displayInformationModal;
        },
    },
});

export const {
    initializeProductCreate,
    updateErrors,
    startSubmitting,
    toggleInformationModalStatus,
    updateField,
    stopSubmitting,
    loadCategoryName,
    loadMakeName
} = slice.actions;

export default slice.reducer;