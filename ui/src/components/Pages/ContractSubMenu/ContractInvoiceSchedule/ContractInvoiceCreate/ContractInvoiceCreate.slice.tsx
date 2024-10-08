import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ValidationErrors } from '../../../../../types/error';
import { ContractInvoiceDetailCreate } from '../../../../../types/contractInvoiceDetail';
import { ContractInvoiceCreate } from '../../../../../types/contractInvoice';
import { ContractInvoiceScheduleDetails, ContractInvoiceSheduleData } from '../../../../../types/contractInvoiceSchedule';
import { GstActiveRates, GstRateList } from '../../../../../types/contract';

export interface ContractInvoiceCreateState {
    contractInvoice: ContractInvoiceCreate;
    contractInvoiceScheduleDetails: ContractInvoiceScheduleDetails
    contractInvoiceDetailList: ContractInvoiceDetailCreate[];
    errors: ValidationErrors;
    submitting: boolean;
    GstRates: GstActiveRates[];
    displayInformationModal: boolean;
}

const initialState: ContractInvoiceCreateState = {
    contractInvoiceScheduleDetails: {
        Id: 0,
        ContractNumber: "",
        ScheduledInvoiceDate: "",
        ScheduleNumber: "",
        RrPerDay: "",
        AmcValue: 0,
        ContractValue: 0,
        FmsValue: 0,
        TotalRrValue: "",
        ScheduledInvoiceAmount: "",
        GstNumber: "",
        PanNumber: "",
        Address: "",
        BilledToAddress: "",
        BilledToCityName: "",
        BilledToStateName: "",
        BilledToCountryName: "",
        BilledToPincode: "",
        BilledToGstNumber: "",
        ShippedToAddress: "",
        ShippedToCityName: "",
        ShippedToStateName: "",
        ShippedToCountryName: "",
        ShippedToPincode: "",
        ShippedToGstNumber: "",
        NameOnPrint: "",
        ContractStartDate: "",
        ContractEndDate: "",
        AgreementType: "",
        BookingDate: "",
        InvoiceStartDate: "",
        InvoiceEndDate: "",
        TenantOfficeName: "",
        InvoiceDueDate: "",
        PoNumber: "",
        IsSez:false
    },
    GstRates: [],
    contractInvoice: {
        ContractId: "",
        InvoiceAmount: 0,
        ContractInvoiceScheduleId: "",
        InvoiceDate: "",
        DeductionDescription: "",
        Sgst: "0",
        Cgst: "0",
        Igst: "0",
        Description: "",
        DeductionAmount: 0,
        CollectionDueDate: ""
    },
    contractInvoiceDetailList: [],
    errors: {},
    submitting: false,
    displayInformationModal: false,
};

const slice = createSlice({
    name: 'contractinvoicecreate',
    initialState,
    reducers: {
        initializeContractInvoiceCreate: () => initialState,
        updateField: (
            state,
            { payload: { name, value } }: PayloadAction<{ name: keyof ContractInvoiceCreateState['contractInvoice']; value: string }>
        ) => {
            state.contractInvoice[name] = value;
        },
        updateDetailDiscountField: (
            state,
            { payload: { index, value } }: PayloadAction<{ index: number; value: string }>
        ) => {
            state.contractInvoiceDetailList[index]["Discount"] = value;
            state.contractInvoice.DeductionAmount = state.contractInvoiceDetailList.reduce((total, item) => Number(item.Discount) + total, 0).toFixed(2)
            state.contractInvoice.Sgst = state.contractInvoiceDetailList.reduce((total, Item) => (Number(Item.Amount) - Number(Item.Discount)) * Item.Sgst / 100 + total, 0).toFixed(2)
            state.contractInvoice.Cgst = state.contractInvoiceDetailList.reduce((total, Item) => (Number(Item.Amount) - Number(Item.Discount)) * Item.Cgst / 100 + total, 0).toFixed(2)
            state.contractInvoice.Igst = state.contractInvoiceDetailList.reduce((total, Item) => (Number(Item.Amount) - Number(Item.Discount)) * Item.Igst / 100 + total, 0).toFixed(2)
        },

        updateContractInvoiceDetailList: (state, { payload }) => {
            state.contractInvoiceDetailList.push(payload)
        },
        updateContractInvoiceScheduleDetail: (state, { payload: { ContractInvoiceScheduleDetails } }: PayloadAction<ContractInvoiceSheduleData>) => {
            state.contractInvoiceScheduleDetails = ContractInvoiceScheduleDetails
            state.contractInvoice.InvoiceDate = ContractInvoiceScheduleDetails.ScheduledInvoiceDate
            state.contractInvoice.CollectionDueDate = ContractInvoiceScheduleDetails.InvoiceDueDate
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
        loadPOLineItemsList: (state, { payload }) => {
            state.contractInvoiceDetailList = []
            payload.map(item => {
                state.contractInvoiceDetailList.push(item)
            })
            state.contractInvoice.InvoiceAmount = state.contractInvoiceDetailList.reduce((total, item) => Number(item.Amount) + total, 0)
            state.contractInvoice.Sgst = state.contractInvoiceDetailList.reduce((total, Item) => Number(Item.Rate) * Item.Quantity * Item.Sgst / 100 + total, 0).toFixed(2)
            state.contractInvoice.Cgst = state.contractInvoiceDetailList.reduce((total, Item) => Number(Item.Rate) * Item.Quantity * Item.Cgst / 100 + total, 0).toFixed(2)
            state.contractInvoice.Igst = state.contractInvoiceDetailList.reduce((total, Item) => Number(Item.Rate) * Item.Quantity * Item.Igst / 100 + total, 0).toFixed(2)
        },
        loadGstRates: (state, { payload: { Gstrates } }: PayloadAction<GstRateList>) => {
            state.GstRates = Gstrates.map((gstrates) => gstrates)
        },
    },
});

export const {
    initializeContractInvoiceCreate,
    updateErrors,
    startSubmitting,
    toggleInformationModalStatus,
    updateField,
    updateDetailDiscountField,
    stopSubmitting,
    loadPOLineItemsList,
    updateContractInvoiceScheduleDetail,
    loadGstRates
} = slice.actions;

export default slice.reducer;