import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GenericErrors, ValidationErrors } from '../../../../types/error';
import { BankApprovalEditDetail } from '../../../../types/bankApproval';


export interface EditBankPendingRequestState {
  ApprovalRequestId:number|null;
  bank: BankApprovalEditDetail;
  errors: ValidationErrors;
  submitting: boolean;
  displayInformationModal: boolean;
}

const initialState: EditBankPendingRequestState = {
  ApprovalRequestId:null,
  bank: {
    BankCode: '',
    BankName: '',
  },
  errors: {},
  submitting: false,
  displayInformationModal: false,
};

const slice = createSlice({
  name: 'bankapprovalrequestedit',
  initialState,
  reducers: {
    initializeEditPendingBank: () => initialState,
    loadSelectedPendingBankDetail: (
      state,
      { payload: BankPendingResult}: PayloadAction<BankApprovalEditDetail>
  ) => {
      state.bank= BankPendingResult
  },
    updateField: (
      state,
      { payload: { name, value } }: PayloadAction<{ name: keyof EditBankPendingRequestState['bank']; value: string }>
    ) => {
      state.bank[name] = value;
    },
    setContentForEdit: (state, { payload: Content }) => {
      state.bank = Content;
    },
    updateErrors: (state, { payload: errors }: PayloadAction<ValidationErrors>) => {
      state.errors = errors;
    },
    startSubmitting: (state) => {
      state.submitting = true;
    },
    stopSubmitting: (state) => {
      state.submitting = false;
    },
    toggleInformationModalStatus: (state) => {
      state.displayInformationModal = !state.displayInformationModal;
    },
    updateBankPendingEditApprovalRequestId: (state, { payload: Id }: PayloadAction<number|null>) => {
      state.ApprovalRequestId= Id;
  },
  },
});

export const {
  initializeEditPendingBank,
  loadSelectedPendingBankDetail,
  updateField,
  setContentForEdit,
  updateErrors,
  startSubmitting,
  toggleInformationModalStatus,
  updateBankPendingEditApprovalRequestId,
  stopSubmitting,
} = slice.actions;

export default slice.reducer;
