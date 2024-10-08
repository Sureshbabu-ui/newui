import { None, Option, Some } from '@hqoss/monads';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ContractInvoiceScheduleList, ContractInvoiceScheduleListDetails } from '../../../../../types/contractInvoiceSchedule';
import { ValidationErrors } from '../../../../../types/error';
import { AppKeyValue, AppSettingAppKeyValues } from '../../../../../types/appSetting';

export interface contractInvoiceScheduleList {
  contractInvoiceSchedule: ContractInvoiceScheduleListDetails;
}

export interface ContractInvoiceSchedulesListState {
  contractInvoiceSchedules: Option<readonly contractInvoiceScheduleList[]>;
  totalRows: number;
  createContractInvoiceSchedulesModalStatus: boolean;
  errors: ValidationErrors;
  displayInformationModal: boolean,
  appvalues: AppKeyValue
}

const initialState: ContractInvoiceSchedulesListState = {
  contractInvoiceSchedules: None,
  totalRows: 0,
  errors: {},
  displayInformationModal: false,
  createContractInvoiceSchedulesModalStatus: false,
  appvalues: {
    AppKey: '',
    AppValue: ''
  },
};
const slice = createSlice({
  name: 'contractinvoiceschedulelist',
  initialState,
  reducers: {
    initializeContractInvoiceScheduleList: () => initialState,
    loadContractInvoiceSchedules: (state, { payload: { ContractInvoiceScheduleList, TotalRows } }: PayloadAction<ContractInvoiceScheduleList>) => {
      state.contractInvoiceSchedules = Some(ContractInvoiceScheduleList.map((contractInvoiceSchedule) => ({ contractInvoiceSchedule })));
      state.totalRows = TotalRows;
    },
    updateErrors: (state, { payload: errors }: PayloadAction<ValidationErrors>) => {
      state.errors = errors;
    },
    toggleInformationModalStatus: (state) => {
      state.displayInformationModal = !state.displayInformationModal;
    },
    loadAppkeyValues: (state, { payload: { AppKeyValues } }: PayloadAction<AppSettingAppKeyValues>) => {
      state.appvalues = AppKeyValues;
    }
  },
});

export const { initializeContractInvoiceScheduleList, loadContractInvoiceSchedules, updateErrors, toggleInformationModalStatus,loadAppkeyValues } = slice.actions;
export default slice.reducer;