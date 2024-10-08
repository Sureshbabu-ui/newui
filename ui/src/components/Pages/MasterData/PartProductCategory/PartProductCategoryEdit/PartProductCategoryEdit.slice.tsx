import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ValidationErrors } from '../../../../../types/error';
import { PartProductCategoryEdit } from '../../../../../types/partProductCategory';

export interface EditPartProductCategoryState {
    productCategory: PartProductCategoryEdit;
    errors: ValidationErrors;
    submitting: boolean;
    displayInformationModal: boolean;
}

const initialState: EditPartProductCategoryState = {
    productCategory: {
        Id: 0,
        CategoryName: ""
    },
    errors: {},
    submitting: false,
    displayInformationModal: false,
};

const slice = createSlice({
    name: 'partproductcategoryedit',
    initialState,
    reducers: {
        initializeProductCategoryEdit: () => initialState,
        updateField: (
            state,
            { payload: { name, value } }: PayloadAction<{ name: keyof EditPartProductCategoryState['productCategory']; value: any }>
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
        loadPartProductCategoryDetails: (state, { payload: { Id, CategoryName } }: PayloadAction<PartProductCategoryEdit>) => {
            state.productCategory.Id = Id;
            state.productCategory.CategoryName = CategoryName;
        },
    },
});

export const {
    initializeProductCategoryEdit,
    updateErrors,
    toggleInformationModalStatus,
    updateField,
    loadPartProductCategoryDetails
} = slice.actions;

export default slice.reducer;