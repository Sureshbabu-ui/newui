import { None, Option, Some } from '@hqoss/monads';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BankGuaranteeDetails, BankGuaranteeList } from '../../../../../types/contractBankGuarantee';

export interface BankGuaranteeListState {
  bankGuarantee: Option<readonly BankGuaranteeDetails[]>;
  visibleModal: string
}

const initialState: BankGuaranteeListState = {
  bankGuarantee: None,
  visibleModal: ""
};

const slice = createSlice({
  name: 'bankguaranteelist',
  initialState,
  reducers: {
    initializeBankGuaranteeList: () => initialState,
    loadBankGuarantees: (state, { payload: { BankGuarantees } }: PayloadAction<BankGuaranteeList>) => {
      state.bankGuarantee = Some(BankGuarantees.map((BankGuarantee) => (BankGuarantee)));
    },
    setVisibleModal: (state, { payload: ModalName }: PayloadAction<string>) => {
      state.visibleModal = ModalName;
    },
  },
});

export const { initializeBankGuaranteeList, setVisibleModal, loadBankGuarantees } = slice.actions;
export default slice.reducer;