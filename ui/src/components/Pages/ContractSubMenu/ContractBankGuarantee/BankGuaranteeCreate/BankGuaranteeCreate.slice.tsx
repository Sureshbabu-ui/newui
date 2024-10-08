import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ValidationErrors } from '../../../../../types/error';
import { BankGuaranteeCreate, Configurations, SelectDetails } from '../../../../../types/contractBankGuarantee';

export interface CreateBankGuaranteeState {
    selectDetails: Configurations
    bankGuarantee: BankGuaranteeCreate;
    errors: ValidationErrors;
    displayInformationModal: boolean;
}

const initialState: CreateBankGuaranteeState = {
    selectDetails: {
        BankBranchNames: [],
        GuaranteeType: []
    },
    bankGuarantee: {
        BankBranchInfoId: 0,
        ContractId: "",
        GuaranteeAmount: 0,
        GuaranteeClaimPeriodInDays: 0,
        GuaranteeEndDate: "",
        GuaranteeNumber: "",
        GuaranteeStartDate: "",
        GuaranteeType: 0,
        Remarks: ""
    },
    errors: {},
    displayInformationModal: false,
};

const slice = createSlice({
    name: 'bankguaranteecreate',
    initialState,
    reducers: {
        initializeBankGuaranteeCreate: () => initialState,
        updateField: (
            state,
            { payload: { name, value } }: PayloadAction<{ name: keyof CreateBankGuaranteeState['bankGuarantee']; value: string }>
        ) => {
            state.bankGuarantee[name] = value as never;
        },
        updateErrors: (state, { payload: errors }: PayloadAction<ValidationErrors>) => {
            state.errors = errors;
        },
        toggleInformationModalStatus: (state) => {
            state.displayInformationModal = !state.displayInformationModal;
        },
        loadSelectDetails: (state, { payload: { name, value: { Select } } }: PayloadAction<{ name: keyof CreateBankGuaranteeState['selectDetails']; value: SelectDetails }>) => {
            state.selectDetails[name] = Select.map((masterData) => (masterData))
        },
        initializeBankGuarantee: (state) => {
            state.bankGuarantee = initialState.bankGuarantee
        },
    },
});

export const {
    initializeBankGuaranteeCreate,
    updateErrors,
    initializeBankGuarantee,
    loadSelectDetails,
    toggleInformationModalStatus,
    updateField,
} = slice.actions;

export default slice.reducer;