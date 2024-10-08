import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ValidationErrors } from '../../../../../types/error';
import { PartCategoryEdit } from '../../../../../types/partCategory';

export interface EditPartCategoryState {
    partCategory: PartCategoryEdit;
    errors: ValidationErrors;
    submitting: boolean;
    displayInformationModal: boolean;
}

const initialState: EditPartCategoryState = {
    partCategory: {
        Id:0,
        Name: "",
        MappingId:0,
        PartProductCategoryId: 0
    },
    errors: {},
    submitting: false,
    displayInformationModal: false,
};

const slice = createSlice({
    name: 'partcategoryedit',
    initialState,
    reducers: {
        initializePartCategoryEdit: () => initialState,
        updateField: (
            state,
            { payload: { name, value } }: PayloadAction<{ name: keyof EditPartCategoryState['partCategory']; value: any }>
        ) => {
            state.partCategory[name] = value as never;
        },
        updateErrors: (state, { payload: errors }: PayloadAction<ValidationErrors>) => {
            state.errors = errors;
        },
        toggleInformationModalStatus: (state) => {
            state.displayInformationModal = !state.displayInformationModal;
        },
        loadPartCategoryDetails: (state, { payload: { Id, Name, PartProductCategoryId, MappingId } }: PayloadAction<PartCategoryEdit>) => {
            state.partCategory.Id = Id;
            state.partCategory.Name = Name;
            state.partCategory.PartProductCategoryId = PartProductCategoryId;
            state.partCategory.MappingId = MappingId
        },
    },
});

export const {
    initializePartCategoryEdit,
    updateErrors,
    toggleInformationModalStatus,
    updateField,
    loadPartCategoryDetails
} = slice.actions;

export default slice.reducer;