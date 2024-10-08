import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ContractInvoiceView, ContractInvoiceViewDetails } from '../../../../../types/contractInvoice';
import { ContractInvoiceDetail } from '../../../../../types/contractInvoiceDetail';

export interface InvoiceViewState {
 contractInvoice: ContractInvoiceView; 
 contractInvoiceDetailList:ContractInvoiceDetail[]
}

const initialState: InvoiceViewState = {
 contractInvoice: {
    Id: 0,
    ContractNumber:"",
    ScheduledInvoiceDate: "",
    GstNumber: "",
    PanNumber:"",
    Address: "",
    StateName:"",
    InvoicePendingReason:"",
    InvoiceNumber:"",
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
    ShippedToGstNumber:"" ,
    NameOnPrint:"",
    ContractStartDate:"",
    ContractEndDate:"",
    AgreementType:"",
    BookingDate:"",
    InvoiceStartDate:"",
    InvoiceEndDate:"",
    TenantOfficeName:"",
    InvoiceDueDate:""    ,
    PoNumber:"",
    InvoiceAmount:"",
    DeductionAmount:"",
    Sgst:0,
    Cgst:0,
    Igst:0,
    BankName:"",
    Ifsc:"",
    AccountNumber:"",
    BankEmail:"",
    AckDate:null,
    AckNo:null
   }, 
 contractInvoiceDetailList:[]
};

const slice = createSlice({
  name: 'contractinvoiceview',
  initialState,
  reducers: {
    initializeInvoiceView: () => initialState,
    loadContractInvoiceDetails: (state, { payload: ContractInvoice }: PayloadAction<ContractInvoiceViewDetails>) => {
        state.contractInvoice= ContractInvoice.ContractInvoice;
        state.contractInvoiceDetailList=ContractInvoice.ContractInvoiceDetails
      },
  },
});

export const {
  initializeInvoiceView,
  loadContractInvoiceDetails,
} = slice.actions;

export default slice.reducer;