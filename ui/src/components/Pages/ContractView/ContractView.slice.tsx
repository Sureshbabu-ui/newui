import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ContractId } from '../../../types/contract';
import { GenericErrors } from '../../../types/error';

export interface ViewContractState {
  contract: ContractId;
  contractStatus: string,
  errors: GenericErrors;
  signingUp: boolean;
  submitting: boolean;
  displayInformationModal: boolean;
}

const initialState: ViewContractState = {
  contract: {
    Id: 0,
  },
  contractStatus: '',
  errors: {},
  signingUp: false,
  submitting: false,
  displayInformationModal: false,
};

const slice = createSlice({
  name: 'contractview',
  initialState,
  reducers: {
    initializeContract: () => initialState,
    setContract: (state, { payload: contractDeails }: PayloadAction<any>) => {
      state.contract = contractDeails;
    },
    setContractStatus: (state, { payload: status }: PayloadAction<any>) => {
      state.contractStatus = status;
    },
  },
});

export const {
  initializeContract,
  setContract,
  setContractStatus
} = slice.actions;

export default slice.reducer;
