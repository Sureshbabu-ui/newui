import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ValidationErrors } from '../../../../../types/error';
import { PartSubCategoryCreate } from '../../../../../types/partSubCategory';

export interface PartSubCateogyCreateState  {
    partSubCategory: PartSubCategoryCreate;
    errors: ValidationErrors;
    submitting: boolean;
    displayInformationModal: boolean;
}

const initialState: PartSubCateogyCreateState = {
    partSubCategory: {
        PartSubCategoryName: "",
        ProductCategoryId:0, 
        PartProductCategoryToPartCategoryMappingId: 0      
    },
    errors: {},
    submitting: false,
    displayInformationModal: false,
};

const slice = createSlice({
    name: 'partsubcategorycreate',
    initialState,
    reducers: {
        initializePartSubCategoryCreate: () => initialState,
        updateField: (
            state,
            { payload: { name, value } }: PayloadAction<{ name: keyof PartSubCateogyCreateState['partSubCategory']; value: any }>
        ) => {
            state.partSubCategory[name] = value;
        },
        updateErrors: (state, { payload: errors }: PayloadAction<ValidationErrors>) => {
            state.errors = errors;
        },
        toggleInformationModalStatus: (state) => {
            state.displayInformationModal = !state.displayInformationModal;
        },
    },
});

export const {
    initializePartSubCategoryCreate,
    updateErrors,
    toggleInformationModalStatus,
    updateField
} = slice.actions;

export default slice.reducer;