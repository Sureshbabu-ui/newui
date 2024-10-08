import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ValidationErrors } from '../../../../../types/error';
import { PartSubCategoryEditDetails } from '../../../../../types/partSubCategory';

export interface EditPartSubCategoryState {
    partSubCategory: PartSubCategoryEditDetails;
    errors: ValidationErrors;
    submitting: boolean;
    displayInformationModal: boolean;
}

const initialState: EditPartSubCategoryState = {
    partSubCategory: {
        Id: null,
        Name: "",
        IsActive: false
    },
    errors: {},
    submitting: false,
    displayInformationModal: false,
};

const slice = createSlice({
    name: 'partsubcategoryedit',
    initialState,
    reducers: {
        initializePartSubCategoryEdit: () => initialState,
        updateField: (
            state,
            { payload: { name, value } }: PayloadAction<{ name: keyof EditPartSubCategoryState['partSubCategory']; value: string }>
        ) => {
            state.partSubCategory[name] = value as never;
        },
        updateErrors: (state, { payload: errors }: PayloadAction<ValidationErrors>) => {
            state.errors = errors;
        },
        loadPartSubCategoryEditDetails: (state, { payload: partSubCategoryDetails }: PayloadAction<PartSubCategoryEditDetails>) => {
            state.partSubCategory = partSubCategoryDetails
        },
        toggleInformationModalStatus: (state) => {
            state.displayInformationModal = !state.displayInformationModal;
        },
    },
});

export const {
    initializePartSubCategoryEdit,
    updateErrors,
    toggleInformationModalStatus,
    updateField,
    loadPartSubCategoryEditDetails
} = slice.actions;

export default slice.reducer;