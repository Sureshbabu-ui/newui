import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ValidationErrors } from '../../../../../../types/error';
import { EditAssetsSummary, ProductCategoryPartnotCovered, ProductCategoryPartnotCoveredList, SelectedAssetSummary, selectedPartCategory, SelectedPartnotCoveredList } from '../../../../../../types/assetsSummary';
export interface ContractPartsCategory {
    PartsNotCovered: ProductCategoryPartnotCovered;
}
export interface UpdateAssetSummaryState {
    assetsummary: EditAssetsSummary;
    errors: ValidationErrors;
    submitting: boolean;
    PartsNotCovered: ContractPartsCategory[];
    displayInformationModal: boolean;
    displayConformationModal: boolean;
    partsCategory: selectedPartCategory[],
    selectedPartCategory: number[]
}

const initialState: UpdateAssetSummaryState = {
    assetsummary: {
        Id: 0,
        CategoryName: '',
        PartCategoryList: '',
        ContractId: 0,
        ProductCategoryId: 0,
        ProductCountAtBooking: 0,
        AmcValue: 0,
    },
    PartsNotCovered: [],
    partsCategory: [],
    errors: {},
    selectedPartCategory: [],
    submitting: false,
    displayInformationModal: false,
    displayConformationModal: false
};

const slice = createSlice({
    name: 'assetsummaryupdate',
    initialState,
    reducers: {
        initializeAssetSummary: () => initialState,
        updateField: (
            state,
            { payload: { name, value, patCategory } }: PayloadAction<{ name: keyof UpdateAssetSummaryState['assetsummary']; value: any; patCategory?: any }>
        ) => {
            if (name == 'PartCategoryList') {
                state.selectedPartCategory = patCategory
                state.assetsummary.PartCategoryList = state.selectedPartCategory.join(",");
            }
            else {
                state.assetsummary[name] = value;
            }
        },
        loadPartsCategory: (state, { payload: { ProductCategoryPartnotCovered } }: PayloadAction<ProductCategoryPartnotCoveredList>) => {
            state.PartsNotCovered = ProductCategoryPartnotCovered.map((PartsNotCovered) => ({ PartsNotCovered }));
        },
        loadSelectedAssetSummary: (state, { payload: AssetSummary }: PayloadAction<any>) => {
            state.assetsummary = AssetSummary
        },
        setParts: (state, { payload: Parts }: PayloadAction<any>) => {
            state.assetsummary.PartCategoryList = Parts;
        },
        partCategorySelect: (
            state, { payload: categoryId }: PayloadAction<any>) => {
            if (!state.assetsummary.PartCategoryList.split(",").includes(categoryId)) {
                state.assetsummary.PartCategoryList += categoryId.toString();
            }
            state.assetsummary.PartCategoryList = [state.assetsummary.PartCategoryList].join(",");
        },
        partCategoryUnSelect: (state, { payload: categoryId }: PayloadAction<any>) => {
            const parts = state.assetsummary.PartCategoryList ? state.assetsummary.PartCategoryList.split(",") : [];
            const updatedParts = parts.filter((role) => role !== categoryId.toString());
            state.assetsummary.PartCategoryList = updatedParts.join(",");
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
        initializeAssetSummaryUpdate: (state) => {
            state.assetsummary = initialState.assetsummary
            state.partsCategory = initialState.partsCategory
            state.selectedPartCategory = initialState.selectedPartCategory
        }
    },
});

export const {
    initializeAssetSummary,
    updateField,
    updateErrors,
    initializeAssetSummaryUpdate,
    setParts,
    startSubmitting,
    stopSubmitting,
    toggleInformationModalStatus,
    loadPartsCategory,
    loadSelectedAssetSummary,
    partCategorySelect,
    partCategoryUnSelect,
    toggleConformationModalStatus
} = slice.actions;

export default slice.reducer;