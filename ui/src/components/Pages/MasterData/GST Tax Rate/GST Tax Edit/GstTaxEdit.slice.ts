import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ValidationErrors } from "../../../../../types/error";
import { GstTaxRateEdit } from "../../../../../types/GstTaxRate";

export interface EditGstTaxRateState {
    gsttax: GstTaxRateEdit;
    errors: ValidationErrors;
    submitting: boolean;
    displayInformationModal: boolean;
}
const initialState: EditGstTaxRateState = {
    gsttax: {
        Id:0,
        TenantServiceName: null,
        ServiceAccountDescription:"",
        Cgst: null,
        Sgst: null,
        Igst: null,
        IsActive: false
    },
    errors: {},
    submitting: false,
    displayInformationModal: false,
};

const slice = createSlice({
    name: 'gstedit',
    initialState,
    reducers: {
        initializeGstEdit: () => initialState,
        updateField: (
            state,
            { payload: { name, value } }: PayloadAction<{ name: keyof EditGstTaxRateState['gsttax']; value: string }>
        ) => {
            state.gsttax[name] = value as never;
        },
        updateErrors: (state, { payload: errors }: PayloadAction<ValidationErrors>) => {
            state.errors = errors;
        },
        loadGstEditDetails: (state, { payload: gstDetails }: PayloadAction<GstTaxRateEdit>) => {
            state.gsttax = gstDetails
        },
        toggleInformationModalStatus: (state) => {
            state.displayInformationModal = !state.displayInformationModal;
        },
    },
});

export const {
    initializeGstEdit,
    updateErrors,
    toggleInformationModalStatus,
    updateField,
    loadGstEditDetails
} = slice.actions;

export default slice.reducer;
