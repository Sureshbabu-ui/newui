import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TenantBankAccountDetails } from '../../../../../../types/tenantBankAccount';

export interface TenantBankAccountState {
    tenantBankAccount: TenantBankAccountDetails;
}

const initialState: TenantBankAccountState = {
    tenantBankAccount:{
        Id:null, 
        BankName:"",
        BranchName:"",
        RelationshipManager:"",
        AccountNumber:"",
        ContactNumber:"",
        Email:"",
        BankAccountTypeName:"",
        CreatedUserName:"",
        CreatedOn:null,
        UpdatedUserName:null,
        UpdatedOn:null
    }, 
};

const slice = createSlice({
  name: 'tenantbankaccountdetails',
  initialState,
  reducers: {
    initializeTenantBankAccountDetails: () => initialState,
    loadTenantBankAccountDetails: (state, { payload }: PayloadAction<TenantBankAccountDetails>) => {
      state.tenantBankAccount = payload
    },
  }, 
});

export const {
    initializeTenantBankAccountDetails,
    loadTenantBankAccountDetails
} = slice.actions;
export default slice.reducer;