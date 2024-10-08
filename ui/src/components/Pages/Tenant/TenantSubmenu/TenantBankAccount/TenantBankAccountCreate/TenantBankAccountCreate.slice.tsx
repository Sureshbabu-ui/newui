import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ValidationErrors } from '../../../../../../types/error';
import { TenantBankAccountCreate } from '../../../../../../types/tenantBankAccount';
import { BankDetailsSelect, BanksSelect } from '../../../../../../types/bankManagement';
import { BankBranchesSelect, BankBranchDetailsSelect } from '../../../../../../types/bankBranch';
import { ValuesInMasterDataByTable, valuesInMasterDataByTableDetailsSelect, valuesInMasterDataByTableSelect } from '../../../../../../types/masterData';

export interface CreateTenantBankAccountState {
    tenantBankAccount: TenantBankAccountCreate;
    banks: BankDetailsSelect[];
    bankBranches: BankBranchDetailsSelect[];
    bankAccountTypes: valuesInMasterDataByTableDetailsSelect[];
    errors: ValidationErrors;
    submitting: boolean;
    displayInformationModal: boolean;
}

const initialState: CreateTenantBankAccountState = {
    tenantBankAccount: {
        TenantId: "",
        BankId: 0,
        BankBranchInfoId: 0,
        RelationshipManager: "",
        ContactNumber: "",
        Email: "",
        BankAccountTypeId: 0,
        AccountNumber: ""
    },
    banks: [],
    bankBranches: [],
    bankAccountTypes: [],
    errors: {},
    submitting: false,
    displayInformationModal: false,
};

const slice = createSlice({
    name: 'tenantbankaccountcreate',
    initialState,
    reducers: {
        initializeTenantBankAccountCreate: () => initialState,
        updateField: (
            state,
            { payload: { name, value } }: PayloadAction<{ name: keyof CreateTenantBankAccountState['tenantBankAccount']; value: any }>
        ) => {
            state.tenantBankAccount[name] = value;
        },
        updateErrors: (state, { payload: errors }: PayloadAction<ValidationErrors>) => {
            state.errors = errors;
        },
        toggleInformationModalStatus: (state) => {
            state.displayInformationModal = !state.displayInformationModal;
        },
        loadBanks: (state, { payload: { Banks } }: PayloadAction<BanksSelect>) => {
            state.banks = Banks.map((Bank) => Bank);
        },
        loadBankBranches: (state, { payload: { BankBranches } }: PayloadAction<BankBranchesSelect>) => {
            state.bankBranches = BankBranches.map((BankBranch) => BankBranch);
        },
        loadBankAccountTypes: (state, { payload: { MasterData } }: PayloadAction<valuesInMasterDataByTableSelect>) => {
            state.bankAccountTypes = MasterData.map((Data) => Data);
        },
        initializeBankAccountCreate: (state) => {
            state.tenantBankAccount = initialState.tenantBankAccount;
        }
    },
});

export const {
    initializeTenantBankAccountCreate,
    updateErrors,
    initializeBankAccountCreate,
    toggleInformationModalStatus,
    updateField,
    loadBanks,
    loadBankBranches,
    loadBankAccountTypes
} = slice.actions;

export default slice.reducer;