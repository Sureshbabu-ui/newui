import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ValidationErrors } from '../../../../../types/error';
import { BankGuaranteeDetails, BankGuaranteeEditDetail, Configurations, SelectDetails } from '../../../../../types/contractBankGuarantee';

export interface UpdateBankGuaranteeState {
    selectDetails: Configurations
    bankGuarantee: BankGuaranteeEditDetail;
    errors: ValidationErrors;
    displayInformationModal: boolean;
}

const initialState: UpdateBankGuaranteeState = {
    selectDetails: {
        BankBranchNames: [],
        GuaranteeType: []
    },
    bankGuarantee: {
        BankBranchInfoId: 0,
        GuaranteeAmount: 0,
        GuaranteeClaimPeriodInDays: 0,
        GuaranteeEndDate: "",
        GuaranteeNumber: "",
        GuaranteeStartDate: "",
        GuaranteeType: 0,
        Remarks: "",
        Id: 0
    },
    errors: {},
    displayInformationModal: false,
};

const slice = createSlice({
    name: 'bankguaranteeedit',
    initialState,
    reducers: {
        initializeBankGuaranteeUpdate: () => initialState,
        updateField: (
            state,
            { payload: { name, value } }: PayloadAction<{ name: keyof UpdateBankGuaranteeState['bankGuarantee']; value: string }>
        ) => {
            state.bankGuarantee[name] = value as never;
        },
        updateErrors: (state, { payload: errors }: PayloadAction<ValidationErrors>) => {
            state.errors = errors;
        },
        initializeBankGuaranteeEdit: (state) => {
            state.bankGuarantee = initialState.bankGuarantee;
        },
        toggleInformationModalStatus: (state) => {
            state.displayInformationModal = !state.displayInformationModal;
        },
        loadSelectDetails: (state, { payload: { name, value: { Select } } }: PayloadAction<{ name: keyof UpdateBankGuaranteeState['selectDetails']; value: SelectDetails }>) => {
            state.selectDetails[name] = Select.map((masterData) => (masterData))
        },
        loadBankGuaranteeEditDetails: (state, { payload: BankGuarantees }: PayloadAction<BankGuaranteeEditDetail>) => {
            state.bankGuarantee = BankGuarantees
        },
    },
});

export const {
    initializeBankGuaranteeUpdate,
    updateErrors,
    initializeBankGuaranteeEdit,
    loadBankGuaranteeEditDetails,
    loadSelectDetails,
    toggleInformationModalStatus,
    updateField,
} = slice.actions;

export default slice.reducer;