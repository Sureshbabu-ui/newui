import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ValidationErrors } from '../../../../../types/error';
import { PaymentFrequencyEdit } from '../../../../../types/paymentFrequency';

export interface EditPaymentFrequencyState {
    paymentFrequency: PaymentFrequencyEdit;
    errors: ValidationErrors;
    submitting: boolean;
    displayInformationModal: boolean;
}

const initialState: EditPaymentFrequencyState = {
    paymentFrequency: {
        Id: 0,
        Name: "",
        CalendarMonths: "",
        IsActive: ""
    },
    errors: {},
    submitting: false,
    displayInformationModal: false,
};

const slice = createSlice({
    name: 'paymentfrequencyupdate',
    initialState,
    reducers: {
        initializePaymentFrequencyEdit: () => initialState,
        updateField: (
            state,
            { payload: { name, value } }: PayloadAction<{ name: keyof EditPaymentFrequencyState['paymentFrequency']; value: string }>
        ) => {
            state.paymentFrequency[name] = value as never;
        },
        updateErrors: (state, { payload: errors }: PayloadAction<ValidationErrors>) => {
            state.errors = errors;
        },
        loadPaymentFrequencyDetails: (state, { payload: { Id, Name, IsActive, CalendarMonths } }: PayloadAction<PaymentFrequencyEdit>) => {
            state.paymentFrequency.Id = Id;
            state.paymentFrequency.IsActive = IsActive;
            state.paymentFrequency.CalendarMonths = CalendarMonths;
            state.paymentFrequency.Name = Name;
        },
        toggleInformationModalStatus: (state) => {
            state.displayInformationModal = !state.displayInformationModal;
        },
    },
});

export const {
    initializePaymentFrequencyEdit,
    updateErrors,
    loadPaymentFrequencyDetails,
    toggleInformationModalStatus,
    updateField
} = slice.actions;

export default slice.reducer;