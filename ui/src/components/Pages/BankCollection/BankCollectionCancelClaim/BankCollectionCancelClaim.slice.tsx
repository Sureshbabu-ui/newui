import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BankCollectionClaimCancelDetail, BankCollectionDetail, BankCollectionDetailWithReceiptList, BankCollectionListDetail, BankCollectionReceiptDetail } from '../../../../types/bankCollection';
import { ValidationErrors } from '../../../../types/error';

export interface BankCollectionCancelClaimState {
    CollectionCancelDetail: BankCollectionClaimCancelDetail;
    BankCollectionDetail: BankCollectionDetail;
    CollectionReceiptList: BankCollectionReceiptDetail[]
    createBankCollectionModalStatus: boolean;
    errors: ValidationErrors;
    submitting: boolean;
    displayInformationModal: boolean;
}

const initialState: BankCollectionCancelClaimState = {
    BankCollectionDetail: {
        Id: null,
        TransactionReferenceNumber: null,
        TransactionDate: null,
        TransactionAmount: null,
        ChequeRealizedOn: null,
        ChequeReturnedOn: null,
        ChequeReturnedReason: null,
        PaymentMethodCode: null,
        PaymentMethodName:null,
        CustomerName:null,
                TotalReceiptAmount: null,
        ClaimedBy: null
    },
    CollectionReceiptList: [],
    CollectionCancelDetail: {
        Id: null,
        CancelReason: null
    },
    createBankCollectionModalStatus: false,
    errors: {},
    submitting: false,
    displayInformationModal: false,
};
const slice = createSlice({
    name: 'bankcollectioncancelclaim',
    initialState,
    reducers: {

        initializeBankCollectionClaimCancel: () => initialState,
        loadClaimCancelCollectionDetail: (state, { payload: bankCollection }: PayloadAction<BankCollectionDetailWithReceiptList>) => {
            state.BankCollectionDetail = bankCollection.BankCollectionDetail
            state.CollectionReceiptList = bankCollection.CollectionReceiptList
        },

        updateCollectionCalimCancelDetailField: (
            state,
            { payload: { name, value } }: PayloadAction<{ name: keyof BankCollectionCancelClaimState['CollectionCancelDetail']; value: string | number | null }>
        ) => {
            state.CollectionCancelDetail[name] = value as never;
        },

        updateErrors: (state, { payload: errors }: PayloadAction<ValidationErrors>) => {
            state.errors = errors;
        },

        toggleInformationModalStatus: (state) => {
            state.displayInformationModal = !state.displayInformationModal;
        },

    },
});

export const { initializeBankCollectionClaimCancel,
    updateErrors,
    toggleInformationModalStatus,
    loadClaimCancelCollectionDetail,
    updateCollectionCalimCancelDetailField
} = slice.actions;
export default slice.reducer;  