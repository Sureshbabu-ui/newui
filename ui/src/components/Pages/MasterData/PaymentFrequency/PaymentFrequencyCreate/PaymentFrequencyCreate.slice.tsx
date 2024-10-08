import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ValidationErrors } from '../../../../../types/error';
import { PaymentFrequencyCreate} from '../../../../../types/paymentFrequency';

export interface CreatePaymentFrequencyState {
    paymentFrequency: PaymentFrequencyCreate;
    errors: ValidationErrors;
    submitting: boolean;
    displayInformationModal: boolean;
}

const initialState: CreatePaymentFrequencyState = {
    paymentFrequency: {
        Code:"",
        Name: "", 
        CalendarMonths: "",
        IsActive:"1" 
    },
    errors: {},
    submitting: false,
    displayInformationModal: false,
};

const slice = createSlice({
    name: 'paymentfrequencycreate',
    initialState,
    reducers: {
        initializePaymentFrequencyCreate: () => initialState,
        updateField: (
            state,
            { payload: { name, value } }: PayloadAction<{ name: keyof CreatePaymentFrequencyState['paymentFrequency']; value: string }>
        ) => {
            state.paymentFrequency[name] = value;
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
    initializePaymentFrequencyCreate,
    updateErrors,
    startSubmitting,
    toggleInformationModalStatus,
    updateField,
    stopSubmitting
} = slice.actions;

export default slice.reducer;