import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { InvoiceReceiptDetail, ReceiptView, ReceiptViewDetails } from '../../../../types/receipt';

export interface ReceiptViewState {
 receipt: ReceiptView; 
 invoiceReceiptDetailList:InvoiceReceiptDetail[] 
}

const initialState: ReceiptViewState = {
 receipt: {
    ReceiptNumber:"",
    ReceiptDate:"",
    CustomerName: "",
    PaymentMethod: "",
    TransactionReferenceNumber: "",
    TenantBankAccount: "",
    ReceiptAmount: 0
   }, 
 invoiceReceiptDetailList:[]
};

const slice = createSlice({
  name: 'receiptview',
  initialState, 
  reducers: {
    initializeReceiptView: () => initialState,
    loadReceiptViewDetails: (state, { payload: receiptData }: PayloadAction<ReceiptViewDetails>) => {
        state.receipt= receiptData.Receipt; 
        state.invoiceReceiptDetailList=receiptData.InvoiceReceiptList
      },
  },
});

export const {
  initializeReceiptView,
  loadReceiptViewDetails,
} = slice.actions;

export default slice.reducer; 