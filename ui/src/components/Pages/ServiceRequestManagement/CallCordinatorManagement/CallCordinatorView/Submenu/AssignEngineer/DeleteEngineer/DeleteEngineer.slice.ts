import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GenericErrors } from '../../../../../../../../types/error';
import { DeleteEngineer } from '../../../../../../../../types/assignEngineer';

export interface ServiceRequestAssigneeDeleteState {
  engineerdelete: DeleteEngineer;
  confirmString: string;
  errors: GenericErrors;
  submitting: boolean;
  displayInformationModal: boolean;
}

const initialState: ServiceRequestAssigneeDeleteState = {
  engineerdelete: {
    Id: "",
    DeletedReason: '',
    IsDeleted: false,
  },
  confirmString: '',
  errors: {},
  submitting: false,
  displayInformationModal: false,
};

const slice = createSlice({
  name: 'deleteengineer',
  initialState,
  reducers: {
    initializeDeleteEngineer: () => initialState,
    updateField: (
      state,
      { payload: { name, value } }: PayloadAction<{ name: keyof ServiceRequestAssigneeDeleteState['engineerdelete']; value: any }>
    ) => {
      state.engineerdelete[name] = value;
    },
    setId: (state, { payload: Id }) => {
      state.engineerdelete.Id = Id;
    },
    updateErrors: (state, { payload: errors }: PayloadAction<GenericErrors>) => {
      state.errors = errors;
    },
    setConfirmString: (state, { payload: userEnteredConfirmString }) => {
      state.confirmString = userEnteredConfirmString;
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
  },
});

export const { initializeDeleteEngineer, updateField, setConfirmString, setId, updateErrors, startSubmitting, stopSubmitting, toggleInformationModalStatus } = slice.actions;

export default slice.reducer;
