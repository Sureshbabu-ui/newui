import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GenericErrors, ValidationErrors } from '../../../types/error';
import { ConfigurationUpdateField } from '../../../types/configurations';

export interface ConfigurationState {
  configurations: ConfigurationUpdateField;
  errors: ValidationErrors;
  submitting: boolean;
  displayInformationModal: boolean;
}

const initialState: ConfigurationState = {
  configurations: {
    Code: "",
    EntityId: 0,
    IsActive: 1,
    Name: ""
  },
  errors: {},
  submitting: false,
  displayInformationModal: false,
};

const slice = createSlice({
  name: 'lookupdatacreate',
  initialState,
  reducers: {
    initializeConfigurations: () => initialState,
    updateField: (
      state,
      { payload: { name, value } }: PayloadAction<{ name: keyof ConfigurationState['configurations']; value: any }>
    ) => {
      state.configurations[name] = value as never;
    },
    updateEntityId: (state, { payload: Id }: PayloadAction<any>) => {
      state.configurations.EntityId = Id;
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
  },
});

export const {
  initializeConfigurations,
  updateField,
  updateEntityId,
  updateErrors,
  startSubmitting,
  toggleInformationModalStatus,
  stopSubmitting,
} = slice.actions;

export default slice.reducer;
