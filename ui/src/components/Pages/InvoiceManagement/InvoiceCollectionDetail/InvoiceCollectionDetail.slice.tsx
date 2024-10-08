import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { InvoiceCollectionDetail, InvoiceCollectionView, ReceiptDetailForInvoiceCollection } from '../../../../types/invoice';

export interface InvoiceCollectionViewState {
 InvoiceDetail: InvoiceCollectionDetail; 
 InvoiceReceiptDetailList:ReceiptDetailForInvoiceCollection[] 
}

const initialState: InvoiceCollectionViewState= {
 InvoiceDetail: {
    Id: null,
    NetInvoiceAmount: null,
    CollectedAmount:null,
    OutstandingAmount:null,
    TdsDeductedAmount:null,
    TdsPaidAmount:null,
    GstTdsDeductedAmount:null,
    GstTdsPaidAmount:null,
    OtherDeductionAmount:null,
    CustomerExpenseAmount:null,
    SecurityDepositAmount:null,
    PenaltyAmount:null,
    WriteOffAmount:null,
    InvoiceNumber:null,
    CustomerName:null,
    ContractNumber:null,
    InvoiceDate:null
   }, 
 InvoiceReceiptDetailList:[]
};

const slice = createSlice({
  name: 'invoicecollectiondetail',
  initialState, 
  reducers: {
    initializeInvoiceCollectionDetail: () => initialState,
    loadInvoiceCollectionDetail: (state, { payload: invoiceData }: PayloadAction<InvoiceCollectionView>) => {
        state.InvoiceDetail= invoiceData.InvoiceDetail; 
        state.InvoiceReceiptDetailList=invoiceData.InvoiceReceiptList
      },
  },
});

export const {
  initializeInvoiceCollectionDetail,
  loadInvoiceCollectionDetail,
} = slice.actions;

export default slice.reducer; 