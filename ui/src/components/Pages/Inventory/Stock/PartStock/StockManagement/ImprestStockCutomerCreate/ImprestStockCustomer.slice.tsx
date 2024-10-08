import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CreateDC, masterDataList, Select, SelectDetails } from '../../../../../../../types/deliverychallan';

export interface StockManagementState {
  CustomerNames: Select[];
  ServiceEngineers: Select[];
  ContractNumbers: Select[];
  CustomerSiteNames: Select[];
  masterDataList: masterDataList;
  ProceedPreview: boolean;
  VendorNames:Select[];
}

const initialState: StockManagementState = {
  ServiceEngineers: [],
  CustomerNames: [],
  ContractNumbers: [],
  CustomerSiteNames: [],
  VendorNames:[],
  masterDataList: {
    DCType: [],
    TransportationMode: [],
    VendorTypes:[]
  },
  ProceedPreview: false

};
const slice = createSlice({
  name: 'impreststockcustomer',
  initialState,
  reducers: {
    initializeStockManagement: () => initialState,
    loadServiceEngineersForIS: (state, { payload: { SelectDetails } }: PayloadAction<SelectDetails>) => {
      state.ServiceEngineers = SelectDetails.map((ServiceEngineers) => ServiceEngineers);
    },
    loadCustomerList: (state, { payload: { SelectDetails } }: PayloadAction<SelectDetails>) => {
      state.CustomerNames = SelectDetails.map((CustomerNames) => CustomerNames);
    },
    loadContractNumbers: (state, { payload: { SelectDetails } }: PayloadAction<SelectDetails>) => {
      state.ContractNumbers = SelectDetails.map((ContractNumbers) => ContractNumbers);
    },
    loadCustomerSites: (state, { payload: { SelectDetails } }: PayloadAction<SelectDetails>) => {
      state.CustomerSiteNames = SelectDetails.map((CustomerSiteNames) => CustomerSiteNames);
    },
    loadMasterData: (state, { payload: { name, value: { SelectDetails } } }: PayloadAction<{ name: keyof StockManagementState['masterDataList']; value: SelectDetails }>) => {
      state.masterDataList[name] = SelectDetails.map((masterData) => (masterData))
    },
    setProceedToPreview: (state, { payload: status }: PayloadAction<boolean>) => {
      state.ProceedPreview = status;
    },
    loadVendorNames: (state, { payload: { SelectDetails } }: PayloadAction<SelectDetails>) => {
      state.VendorNames = SelectDetails.map((vendornames) => vendornames);
    }
  },
});

export const {
  initializeStockManagement,
  loadCustomerList,
  loadContractNumbers,
  loadCustomerSites,
  loadServiceEngineersForIS,
  loadMasterData,
  setProceedToPreview,
  loadVendorNames
} = slice.actions;
export default slice.reducer;
