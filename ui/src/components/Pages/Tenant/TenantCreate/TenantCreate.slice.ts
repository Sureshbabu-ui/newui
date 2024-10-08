import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { None, Option, Some } from '@hqoss/monads';
import { GenericErrors } from '../../../../types/error';
import { UserForCreation,MultipleUserRoles,UserRole } from '../../../../types/user';
import { TenentForCreation } from '../../../../types/tenant';

export interface CreateTenentState {
  tenant: TenentForCreation;
  errors: GenericErrors;
  submitting: boolean;
  displayInformationModal: boolean; 
}

const initialState: CreateTenentState = {
    tenant: {
    Name: '',
    NameOnPrint: '',
    Address: ''
  },
 
  errors: {},
  submitting: false,
  displayInformationModal: false,
};

const slice = createSlice({
  name: 'tenantcreate',
  initialState,
  reducers: {
    initializeTenant: () => initialState,
    updateField: (
      state,
      { payload: { name, value } }: PayloadAction<{ name: keyof CreateTenentState['tenant']; value: string }>) => {
        state.tenant[name] = value;
    },
    
    updateErrors: (state, { payload: errors }: PayloadAction<GenericErrors>) => {
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
  },
});

export const { initializeTenant, updateField, updateErrors, startSubmitting, toggleInformationModalStatus, stopSubmitting } = slice.actions;

export default slice.reducer;
