import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserName, UserNamesList, UsersNamesList } from '../../../../types/userManagement';
import { BusinessModuleName, BusinessModuleNamesList } from '../../../../types/businessModule';
import { BaseTableNameList, } from '../../../../types/masterData';
import { AuditLogData } from '../../../../types/auditlogs';
import { ValidationErrors } from '../../../../types/error';

export interface AuditLogsState {
    TableList:BusinessModuleName[];
    AuditLog:AuditLogData
    errors: ValidationErrors;
}

const initialState: AuditLogsState = {
    TableList:[],
    AuditLog:{
      TableName: "",
      StartDate: "",
      EndDate:"",
      Action: '',
    },
    errors: {},
};

const slice = createSlice({
  name: 'auditlogs',
  initialState,
  reducers: {
    initializeAuditLogs: () => initialState,
    loadDatabaseTables: (state, { payload: { TableNames } }: PayloadAction<BaseTableNameList>) => {
    state.TableList = TableNames.map((name) => name);
    },
    updateField: (
      state,
      { payload: { name, value } }: PayloadAction<{ name: keyof AuditLogsState['AuditLog']; value: any }>
    ) => {  
      state.AuditLog[name] = value as never;
    },
    updateErrors: (state, { payload: errors }: PayloadAction<ValidationErrors>) => {
      state.errors = errors;
  }
  }
});

export const { initializeAuditLogs,loadDatabaseTables,updateField,updateErrors} = slice.actions;
export default slice.reducer;
