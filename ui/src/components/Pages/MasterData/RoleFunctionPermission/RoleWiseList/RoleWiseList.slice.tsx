
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RoleFunctionPermissionListDetails, RoleFunctionPermissionListResponse, RoleFunctionPermissionSelectTitle, RoleFunctionPermissionSelectTitleDetails } from '../../../../../types/roleFunctionPermission';
import { valuesInMasterDataByTableDetailsSelect, valuesInMasterDataByTableSelect } from '../../../../../types/masterData';
import i18n from 'i18next';

//state
export interface RoleWiseState {
  roleTitles: RoleFunctionPermissionSelectTitleDetails[],
  roleFunctionPermissions: RoleFunctionPermissionListDetails[]
  roleId: number;
  isUpdateEnabled: boolean;
  submitting: boolean;
  displayInformationModal: boolean;
  activeTab: string;
  selectedPermissionMessage: string;
  selectedRole: string;
  BusinessModuleList: valuesInMasterDataByTableDetailsSelect[],
  BusinessFunctionTypeList: valuesInMasterDataByTableDetailsSelect[],
  SelectedModuleId: number | null
}

const initialState: RoleWiseState = {
  roleTitles: [],
  roleId: -1,
  roleFunctionPermissions: [],
  isUpdateEnabled: false,
  submitting: false,
  displayInformationModal: false,
  activeTab: 'BFT_WKFL',
  selectedPermissionMessage: '',
  selectedRole: '',
  BusinessModuleList: [],
  BusinessFunctionTypeList:[],
  SelectedModuleId: null
};

const slice = createSlice({
  name: 'rolewiselist',
  initialState,
  reducers: {
    initialize: () => initialState,

    updateCheckbox: (
      state,
      { payload: { name, value, status } }: PayloadAction<{ name: keyof RoleWiseState['roleFunctionPermissions']; value: any, status: boolean }>
    ) => {
      state.roleFunctionPermissions.map((item, index) => {
        if (index == value)
          item[name] = status
      })
    },

    updateModuleCheckbox: (
      state,
      { payload: { moduleId, status } }: PayloadAction<{ moduleId: number, status: boolean }>
    ) => {
      state.roleFunctionPermissions.map((item, index) => {
        if (item.BusinessModuleId == moduleId)
          item.Status = status
      })
    },

    updateField: (
      state,
      { payload: { name, value } }: PayloadAction<{ name: keyof RoleWiseState; value: any }>
    ) => {
      state[name] = value as never;
    },

    loadRoleTitles: (state, { payload: { RoleFunctionPermissionTitles } }: PayloadAction<RoleFunctionPermissionSelectTitle>) => {
      state.roleTitles = RoleFunctionPermissionTitles.map((RoleTitle) => (RoleTitle));
    },

    loadRoleWiseList: (state, { payload: { RoleFunctionPermissionList } }: PayloadAction<RoleFunctionPermissionListResponse>) => {
      state.roleFunctionPermissions = RoleFunctionPermissionList.map((List) => List);
    },
    loadBusinessModules: (state, { payload: { MasterData } }: PayloadAction<valuesInMasterDataByTableSelect>) => {
      state.BusinessModuleList = MasterData.map(MasterData => MasterData);
    },
    toggleUpdate: (state,{ payload: status }: PayloadAction<boolean>) => {
      state.isUpdateEnabled = status;
    },
    loadBusinessFunctionTypes: (state, { payload: { MasterData } }: PayloadAction<valuesInMasterDataByTableSelect>) => {
      state.BusinessFunctionTypeList = MasterData.map(MasterData => MasterData);
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

    getSelectedPermissionMessage: (state) => {
      const filteredITems = state.roleFunctionPermissions.filter((item, index) =>
        item.Status == true
      )
      const permissionCount = filteredITems.length;
      const moduleCount = new Set(filteredITems.map(item => item.BusinessModuleId)).size;
      if (permissionCount == 0)
        state.selectedPermissionMessage = `${i18n.t('rolewiselist_message_nopermissioncount')}`
      else
        state.selectedPermissionMessage = `${permissionCount} ${i18n.t('rolewiselist_message_permissioncount')}${moduleCount}`
    },
  }
});

export const { initialize,
  loadRoleTitles,
  loadRoleWiseList,
  toggleUpdate,
  startSubmitting,
  stopSubmitting,
  updateCheckbox,
  updateModuleCheckbox,
  updateField,
  toggleInformationModalStatus,
  getSelectedPermissionMessage,
  loadBusinessModules,
  loadBusinessFunctionTypes
} = slice.actions;

export default slice.reducer;