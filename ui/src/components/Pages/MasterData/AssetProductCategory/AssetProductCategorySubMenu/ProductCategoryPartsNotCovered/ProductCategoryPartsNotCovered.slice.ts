import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ValidationErrors } from '../../../../../../types/error';
import { PartCategoryNameList, PartCategoryNames } from '../../../../../../types/partCategory';
import { PartsNotCovered } from '../../../../../../types/assetProductCategory';

export interface SnapPartsNotCovered {
    ProductCategoryId: number | string;
    PartCategoryData: string;
}
export interface PCPartsNotCovered {
    ProductCategoryId: number | string;
    PartCategoryData: string;
}
export interface PCPartsNotCoveredList {
    notcovered: PartsNotCovered;
}

export interface PartsCategoryName {
    PartCategory: PartCategoryNames;
}

export interface ProductCategoryPartsNotCoveredState {
    productCategoryPartNotCovered: PCPartsNotCovered;
    snapPartNotCovered: SnapPartsNotCovered;
    errors: ValidationErrors;
    submitting: boolean;
    notcovered: PCPartsNotCoveredList[],
    displayInformationModal: boolean;
    PartCategory: PartsCategoryName[];
    selectedPartsCategory: number[];
}

const initialState: ProductCategoryPartsNotCoveredState = {
    productCategoryPartNotCovered: {
        ProductCategoryId: 0,
        PartCategoryData: "",
    },
    snapPartNotCovered: {
        ProductCategoryId: 0,
        PartCategoryData: "",
    },
    notcovered: [],
    selectedPartsCategory: [],
    PartCategory: [],
    errors: {},
    submitting: false,
    displayInformationModal: false,
};

const slice = createSlice({
    name: 'partsnotcovered',
    initialState,
    reducers: {
        initializeProductCategoryPartsCovered: () => initialState,
        updateField: (
            state,
            { payload: { name, value } }: PayloadAction<{ name: keyof ProductCategoryPartsNotCoveredState['productCategoryPartNotCovered']; value: any }>
        ) => {
            state.productCategoryPartNotCovered[name] = value;
        },
        loadPCPartsNotCovered: (state, { payload: ProductCategoryPartsNotCovered }: PayloadAction<any>) => {
            state.productCategoryPartNotCovered.PartCategoryData = ProductCategoryPartsNotCovered;
            state.snapPartNotCovered.PartCategoryData = ProductCategoryPartsNotCovered;
        },
        updateErrors: (state, { payload: errors }: PayloadAction<ValidationErrors>) => {
            state.errors = errors;
        },
        startSubmitting: (state) => {
            state.submitting = true;
        },
        loadPartsCategory: (state, { payload: { PartProductCategoryDetails } }: PayloadAction<PartCategoryNameList>) => {
            state.PartCategory = PartProductCategoryDetails.map((PartCategory) => ({ PartCategory }));
        },
        stopSubmitting: (state) => {
            state.submitting = false;
        },
        toggleInformationModalStatus: (state) => {
            state.displayInformationModal = !state.displayInformationModal;
        },
        PartCategorySelected: (
            state, { payload: partsCategoryId }: PayloadAction<any>) => {
            if (!state.productCategoryPartNotCovered.PartCategoryData.split(",").includes(partsCategoryId)) {
                state.productCategoryPartNotCovered.PartCategoryData = partsCategoryId.toString();
            }
            state.productCategoryPartNotCovered.PartCategoryData = [state.productCategoryPartNotCovered.PartCategoryData].join(",");
        },
        PartCategoryUnSelected: (
            state, { payload: partsCategoryId }: PayloadAction<any>
        ) => {
            state.productCategoryPartNotCovered.PartCategoryData = partsCategoryId
        }
    },
});

export const {
    initializeProductCategoryPartsCovered,
    updateErrors,
    startSubmitting,
    toggleInformationModalStatus,
    updateField,
    stopSubmitting,
    loadPartsCategory,
    PartCategorySelected,
    PartCategoryUnSelected,
    loadPCPartsNotCovered
} = slice.actions;

export default slice.reducer;