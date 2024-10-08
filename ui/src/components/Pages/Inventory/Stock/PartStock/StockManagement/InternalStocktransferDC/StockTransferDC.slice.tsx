import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { None, Option, Some } from '@hqoss/monads';
import { CreateDC, masterDataList, Select, SelectDetails, tenantOffices, vendorList } from '../../../../../../../types/deliverychallan';
import { VendorNames } from '../../../../../../../types/vendor';
import { TenantOfficeInfo } from '../../../../../../../types/tenantofficeinfo';

export interface StockManagementState {
  EngineersList: Select[];
  masterDataList: masterDataList;
  vendornames: Select[];
  tenantOffices: Option<readonly tenantOffices[]>;
  DemandList: Select[];
}

const initialState: StockManagementState = {
  DemandList: [],
  EngineersList: [],
  vendornames: [],
  tenantOffices: None,
  masterDataList: {
    DCType: [],
    TransportationMode: [],
    VendorTypes:[]
  }
};
const slice = createSlice({
  name: 'stocktransferdc',
  initialState,
  reducers: {
    initializeStockManagement: () => initialState,
    loadMasterData: (state, { payload: { name, value: { SelectDetails } } }: PayloadAction<{ name: keyof StockManagementState['masterDataList']; value: SelectDetails }>) => {
      state.masterDataList[name] = SelectDetails.map((masterData) => (masterData))
    },
    loadVendorNames: (state, { payload: { SelectDetails } }: PayloadAction<SelectDetails>) => {
      state.vendornames = SelectDetails.map((vendornames) => vendornames);
    },
    loadTenantOffices: (state, { payload: { TenantOfficeInfo } }: PayloadAction<TenantOfficeInfo>) => {
      state.tenantOffices = Some(TenantOfficeInfo.map((tenantOffice) => ({ tenantOffice })));
    },
    loadServiceEngineers: (state, { payload: { SelectDetails } }: PayloadAction<SelectDetails>) => {
      state.EngineersList = SelectDetails.map((ServiceEngineers) => ServiceEngineers);
    },
    loadDemandList: (state, { payload: { SelectDetails } }: PayloadAction<SelectDetails>) => {
      state.DemandList = SelectDetails.map((DemandList) => DemandList);
    }
  },
});

export const {
  initializeStockManagement,
  loadMasterData,
  loadVendorNames,
  loadTenantOffices,
  loadDemandList,
  loadServiceEngineers } = slice.actions;
export default slice.reducer;
