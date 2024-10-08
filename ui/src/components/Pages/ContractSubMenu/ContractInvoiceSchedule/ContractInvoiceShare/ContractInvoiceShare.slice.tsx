import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ValidationErrors } from '../../../../../types/error';
import { ShareInfo, ShareInvoiceDetail } from '../../../../../types/contractInvoice';

export interface ShareInvoice {
    To:string;
    Cc: string[];
    Id: number,
    ContractNumber: string,
    InvoiceDate: string,
    InvoiceNumber: string,
    PrimaryContactName:string;
}

export interface ContractInvoiceShareState {
    contractInvoice: ShareInvoice;
    errors: ValidationErrors;
    submitting: boolean;
    displayInformationModal: boolean;
    invoiceshareinfo: ShareInfo;
}

const initialState: ContractInvoiceShareState = {
    contractInvoice: {
        Id: 0,
        To:"",
        Cc: [],
        ContractNumber: "",
        InvoiceDate: "",
        InvoiceNumber: "",
        PrimaryContactName:"",
    },
    invoiceshareinfo:{
       ContractNumber:"",
       InvoiceDate:"",
       InvoiceNumber:"",
       PrimaryContactEmail:"",
       PrimaryContactName:"",
       SecondaryContactEmail:""
    },
    errors: {},
    submitting: false,
    displayInformationModal: false,
};

const slice = createSlice({
    name: 'contractinvoiceshare',
    initialState,
    reducers: {
        initializeContractInvoice: () => initialState,
        updateInvoiceMailCc: (
            state,
            { payload: { name, value } }: PayloadAction<{ name: keyof ContractInvoiceShareState['contractInvoice']; value: string[] }>
        ) => {
            state.contractInvoice.Cc = value                      
        },
        updateInvoiceMailTo: (
            state,
            { payload: { name, value } }: PayloadAction<{ name: keyof ContractInvoiceShareState['contractInvoice']; value: string }>
        ) => {
            state.contractInvoice.To = value
        },
        updateErrors: (state, { payload: errors }: PayloadAction<ValidationErrors>) => {
            state.errors = errors;  
        },
        startSubmitting: (state) => {
            state.submitting = true;
        },
        setInvoiceId: (state, { payload: Id }) => {
            state.contractInvoice.Id = Id;
        },
        stopSubmitting: (state) => {
            state.submitting = false;
        },
        toggleInformationModalStatus: (state) => {
            state.displayInformationModal = !state.displayInformationModal;
        },
        loadMailDetails: (state, { payload: { InvoiceShareInfo } }: PayloadAction<ShareInvoiceDetail>) => {
            state.invoiceshareinfo = InvoiceShareInfo;
        },
        updateInvoiceMailDetail: (
            state,
            { payload: { name, value } }: PayloadAction<{ name: keyof ContractInvoiceShareState['contractInvoice']; value: string }>
        ) => {
            state.contractInvoice[name] = value as never;
        },
    },
});

export const {
    initializeContractInvoice,
    updateErrors,
    startSubmitting,
    toggleInformationModalStatus, 
    updateInvoiceMailDetail,
    stopSubmitting,
    setInvoiceId,
    loadMailDetails,
    updateInvoiceMailCc,
    updateInvoiceMailTo
} = slice.actions;

export default slice.reducer;