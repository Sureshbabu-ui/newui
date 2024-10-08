import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BankCollectionApproveDetail, BankCollectionListDetail } from '../../../../types/bankCollection';
import { valuesInMasterDataByTableDetailsSelect, valuesInMasterDataByTableSelect } from '../../../../types/masterData';
import { InvoiceInContractDetail, InvoiceInContractList } from '../../../../types/contractInvoice';
import { InvoiceReceiptDetailCreate } from '../../../../types/receipt';
import { ValidationErrors } from '../../../../types/error';

export interface BankCollectionProcessState {
  collectionApproveDetail: BankCollectionApproveDetail;
  selectedBankCollection: BankCollectionListDetail | null;
  Customers: valuesInMasterDataByTableDetailsSelect[],
  PaymentMethods: valuesInMasterDataByTableDetailsSelect[],
  createBankCollectionModalStatus: boolean;
  FilteredCustomerInvoices: valuesInMasterDataByTableDetailsSelect[],
  CustomerInvoices: InvoiceInContractDetail[],
  InvoiceIds: number[],
  invoicereceipts: InvoiceReceiptDetailCreate[];
  errors: ValidationErrors;
  submitting: boolean;
  displayInformationModal: boolean;
}

const initialState: BankCollectionProcessState = {
  PaymentMethods: [],
  Customers: [],
  selectedBankCollection: null,
  collectionApproveDetail: {
    Id: null,
    TransactionAmount: 0,
    Particulars: null,
    TransactionDate: null,
    TransactionReferenceNumber: null,
    PaymentMethodId: null,
    CustomerInfoId: null,
    TenantBankAccountId: null
  },
  invoicereceipts: [],
  CustomerInvoices: [],
  FilteredCustomerInvoices: [],
  InvoiceIds: [],
  createBankCollectionModalStatus: false,
  errors: {},
  submitting: false,
  displayInformationModal: false,
};
const slice = createSlice({
  name: 'bankcollectionprocess',
  initialState,
  reducers: {

    initializeBankCollectionsList: () => initialState,
    loadSelectedBankCollection: (state, { payload: bankCollection }: PayloadAction<BankCollectionListDetail | null>) => {
      state.selectedBankCollection = bankCollection
      state.invoicereceipts = []
      state.InvoiceIds = []
    },
    loadapproveDetail: (state, { payload: bankCollection }: PayloadAction<BankCollectionApproveDetail>) => {
      state.collectionApproveDetail = bankCollection
    },
    loadPaymentMethods: (state, { payload: { MasterData } }: PayloadAction<valuesInMasterDataByTableSelect>) => {
      state.PaymentMethods = MasterData.map((PaymentMethods) => PaymentMethods);
    },

    loadCustomers: (state, { payload: Customers }: PayloadAction<valuesInMasterDataByTableDetailsSelect[]>) => {
      state.Customers = Customers;
    },

    loadPendingInvoiceDetails: (state, { payload: { value: { ContractInvoices } } }: PayloadAction<{ value: InvoiceInContractList }>) => {
      state.CustomerInvoices = ContractInvoices.map((Data) => Data) as never
    },

    loadFormattedInvoices: (state, { payload: { MasterData } }: PayloadAction<valuesInMasterDataByTableSelect>) => {
      state.FilteredCustomerInvoices = MasterData.map((PaymentMethods) => PaymentMethods);
    },

    updateDetailField: (
      state,
      { payload: { name, value } }: PayloadAction<{ name: keyof BankCollectionProcessState['collectionApproveDetail']; value: string | number | null }>
    ) => {
      state.collectionApproveDetail[name] = value as never;
    },

    updateMultiSelectedItems: (
      state,
      { payload: { name, value: { MasterData } } }: PayloadAction<{ name: string; value: valuesInMasterDataByTableSelect }>
    ) => {

      if (name == "InvoiceIds") {
        state.InvoiceIds = []
        MasterData.map(item => state.InvoiceIds.push(item.value))
        state.invoicereceipts = state.invoicereceipts.filter(x => state.InvoiceIds.includes(x.InvoiceId));
      }
    },

    calculateInvoiceReceipts: (state) => {
      if (state.InvoiceIds.length > 0) {
        state.invoicereceipts = []
        let remainingAmount = (state.selectedBankCollection?.TransactionAmount??0)-(state.selectedBankCollection?.TotalReceiptAmount??0)
        state.CustomerInvoices.map((item) => {
          remainingAmount = Number(remainingAmount);
          if (state.InvoiceIds.includes(item.Id)) {
            const amount = remainingAmount - item.PendingAmount > 0 ? item.PendingAmount : remainingAmount
            state.invoicereceipts.push({
              InvoiceId: item.Id,
              InvoiceNumber: item.InvoiceNumber,
              CollectionDueDate: item.CollectionDueDate,
              PaidAmount: item.PaidAmount,
              PendingAmount: item.PendingAmount,
              Amount: amount
            })
            remainingAmount = remainingAmount - amount
          }
        })
      }
    },

    updateErrors: (state, { payload: errors }: PayloadAction<ValidationErrors>) => {
      state.errors = errors;
    },

    toggleInformationModalStatus: (state) => {
      state.displayInformationModal = !state.displayInformationModal;
    },

    updateReceiptDetailField: (
      state,
      { payload: { index, value } }: PayloadAction<{ index: number; value: number }>
    ) => {
      if (value <= state.invoicereceipts[index]["PendingAmount"])
        state.invoicereceipts[index]["Amount"] = value;
    },
  },
});

export const { initializeBankCollectionsList, updateErrors, updateReceiptDetailField, toggleInformationModalStatus, calculateInvoiceReceipts, loadPendingInvoiceDetails, loadSelectedBankCollection, updateDetailField, loadCustomers, loadPaymentMethods, updateMultiSelectedItems, loadFormattedInvoices } = slice.actions;
export default slice.reducer;  