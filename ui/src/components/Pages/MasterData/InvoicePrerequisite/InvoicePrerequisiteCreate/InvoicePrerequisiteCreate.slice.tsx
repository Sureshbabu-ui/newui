import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ValidationErrors } from '../../../../../types/error';
import { InvoicePrerequisiteCreate} from '../../../../../types/invoicePrerequisite';

export interface CreateInvoicePrerequisiteState {
    invoicePrerequisite: InvoicePrerequisiteCreate;
    errors: ValidationErrors;
    submitting: boolean;
    displayInformationModal: boolean;
}

const initialState: CreateInvoicePrerequisiteState = {
    invoicePrerequisite: {
        DocumentName: "", 
        Description: "",
        IsActive:"1" ,
        DocumentCode: ""
    },
    errors: {},
    submitting: false,
    displayInformationModal: false,
};

const slice = createSlice({
    name: 'invoiceprerequisitecreate',
    initialState,
    reducers: {
        initializeInvoicePrerequisiteCreate: () => initialState,
        updateField: (
            state,
            { payload: { name, value } }: PayloadAction<{ name: keyof CreateInvoicePrerequisiteState['invoicePrerequisite']; value: string }>
        ) => {
            state.invoicePrerequisite[name] = value;
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
    initializeInvoicePrerequisiteCreate,
    updateErrors,
    startSubmitting,
    toggleInformationModalStatus,
    updateField,
    stopSubmitting
} = slice.actions;

export default slice.reducer;