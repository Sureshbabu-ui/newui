import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GenericErrors, ValidationErrors } from '../../../../../../types/error';
import { AssetSummaryCreation, ProductCategoryPartnotCovered } from '../../../../../../types/assetsSummary';
import { Select } from '../../../../../../types/customer';
import { init } from 'i18next';

export interface CreateAssetSummaryState {
    assetsummary: AssetSummaryCreation;
    errors: ValidationErrors;
    submitting: boolean;
    displayInformationModal: boolean;
    displayConformationModal: boolean;
    partsCategory: ProductCategoryPartnotCovered[],
    selectedPartCategory: number[]
    productCategoryList: Select[]
}

const initialState: CreateAssetSummaryState = {
    assetsummary: {
        ContractId: 0,
        ProductCategoryId: 0,
        ProductCountAtBooking: '',
        AmcValue: null,
        PartCategoryId: '',
        IsPreventiveMaintenanceNeeded: false,
    },
    productCategoryList: [],
    partsCategory: [],
    errors: {},
    selectedPartCategory: [],
    submitting: false,
    displayConformationModal: false,
    displayInformationModal: false,
};

const slice = createSlice({
    name: 'summarycreate',
    initialState,
    reducers: {
        initializeAssetSummary: () => initialState,
        updateField: (
            state,
            { payload: { name, value, patCategory } }: PayloadAction<{ name: keyof CreateAssetSummaryState['assetsummary']; value: any; patCategory?: any }>
        ) => {
            if (name == 'PartCategoryId') {
                state.selectedPartCategory = patCategory
                state.assetsummary.PartCategoryId = state.selectedPartCategory.join(",");
            }
            else {
                state.assetsummary[name] = value;
            }
        },
        loadPartsCategory: (state, { payload: PartProductCategoryDetails }: PayloadAction<ProductCategoryPartnotCovered[]>) => {
            state.partsCategory = PartProductCategoryDetails.map((PartCategory) => (PartCategory));
        },
        loadproductCategoryList: (state, { payload: productCategoryList }: PayloadAction<Select[]>) => {
            state.productCategoryList = productCategoryList.map((productCategory) => (productCategory));
        },
        partCategorySelect: (
            state, { payload: { categoryId, isActive } }: PayloadAction<{ categoryId: any, isActive: boolean }>) => {
            if (state.selectedPartCategory.includes(categoryId) == false) {
                state.selectedPartCategory.push(categoryId);
            }
            const categoryIndex = state.partsCategory.findIndex((category) => category.Id == categoryId);
            if (categoryIndex !== -1) {
                state.partsCategory[categoryIndex].IsActive = isActive;
            }
            state.assetsummary.PartCategoryId = state.selectedPartCategory.join(",");
        },
        partCategoryUnSelect: (state, { payload: { categoryId, isActive } }: PayloadAction<{ categoryId: any, isActive: boolean }>) => {
            var index = state.selectedPartCategory.indexOf(categoryId);
            if (index !== -1) {
                state.selectedPartCategory.splice(index, 1);
            }
            const categoryIndex = state.partsCategory.findIndex((category) => category.Id == categoryId);
            if (categoryIndex !== -1) {
                state.partsCategory[categoryIndex].IsActive = isActive;
            }
            state.assetsummary.PartCategoryId = state.selectedPartCategory.join(",");
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
        toggleConformationModalStatus: (state) => {
            state.displayConformationModal = !state.displayConformationModal;
        },
        initializeAssetSummaryCreate: (state) => {
            state.assetsummary = initialState.assetsummary
            state.partsCategory = initialState.partsCategory
            state.selectedPartCategory = initialState.selectedPartCategory
        }
    },
});

export const {
    initializeAssetSummary,
    updateField,
    loadproductCategoryList,
    initializeAssetSummaryCreate,
    updateErrors,
    startSubmitting,
    stopSubmitting,
    toggleInformationModalStatus,
    loadPartsCategory,
    partCategorySelect,
    partCategoryUnSelect,
    toggleConformationModalStatus,
} = slice.actions;

export default slice.reducer;