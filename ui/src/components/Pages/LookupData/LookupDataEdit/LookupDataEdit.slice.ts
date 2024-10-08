import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ValidationErrors } from '../../../../types/error';
import { SelectedTableData, LookupDataUpdate } from '../../../../types/configurations';

export interface MasterEntitiDataEditState {
  configurations: LookupDataUpdate;
  errors: ValidationErrors;
  submitting: boolean;
  displayInformationModal: boolean;
}

const initialState: MasterEntitiDataEditState = {
  configurations: {
    Id: 0,
    IsActive: 1,
    Name: '',
  },
  errors: {},
  submitting: false,
  displayInformationModal: false,
};

const slice = createSlice({
  name: 'lookupdataedit',
  initialState,
  reducers: {
    initializeMasterEntitiDataEdit: () => initialState,
    updateField: (
      state,
      {
        payload: { name, value },
      }: PayloadAction<{ name: keyof MasterEntitiDataEditState['configurations']; value: any }>
    ) => {
      state.configurations[name] = value as never;
    },
    updateErrors: (state, { payload: errors }: PayloadAction<ValidationErrors>) => {
      state.errors = errors;
    },
    toggleInformationModalStatus: (state) => {
      state.displayInformationModal = !state.displayInformationModal;
    },
    loadMasterEntityData: (state, { payload: info }: PayloadAction<SelectedTableData>) => {
      state.configurations.Name = info.Name;
      state.configurations.Id = info.Id;
      state.configurations.IsActive = info.IsActive == true ? 1 : 0;
    },
  },
});

export const {
  initializeMasterEntitiDataEdit,
  updateField,
  updateErrors,
  toggleInformationModalStatus,
  loadMasterEntityData,
} = slice.actions;

export default slice.reducer;
