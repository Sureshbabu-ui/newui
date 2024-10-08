import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BankBranchInfo, SelectedBankBranch } from '../../../../../types/bankBranch';

export interface SelectedBranchState {
    selectedBranch: BankBranchInfo
}

const initialState: SelectedBranchState = {
    selectedBranch: {
        Id:0,
        BankId: 0,
        StateId: 0,
        CityId: 0,
        CountryId: 0,
        BankName:"",
        BranchCode:"",
        BranchName:"",
        City:"",
        State:"",
        Country:"",
        Address:"",
        Pincode:"",
        ContactNumberOne:"",
        ContactNumberOneCountryCode:"",
        ContactNumberTwo:"",
        ContactNumberTwoCountryCode:"",
        ContactPerson:"",
        Ifsc:"",
        MicrCode:"",
        SwiftCode:"",
        Email:"",
        CreatedBy:"",
        CreatedOn:"",
        BranchId:0
    },
};
const slice = createSlice({
    name: 'bankbranchinfo',
    initialState,
    reducers: {
        initializeBankBranch: () => initialState,
        loadSelectedBranch: (
            state,
            { payload: { BankBranchDetails } }: PayloadAction<SelectedBankBranch>
        ) => {
            state.selectedBranch = BankBranchDetails            
        },
    },
});

export const { initializeBankBranch, loadSelectedBranch } = slice.actions;
export default slice.reducer;
