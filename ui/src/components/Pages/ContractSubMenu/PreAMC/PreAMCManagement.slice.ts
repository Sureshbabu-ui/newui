import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CustomerSiteDetails, MultipleCustomerSiteDetails } from '../../../../types/customer';
import { PreAmcScheduleDetailsArray } from '../../../../types/contractPreAmc';
import { ValidationErrors } from '../../../../types/error';
import { PreAmcScheduledEngineersDetailsArray } from '../../../../types/contractPreAmc';


export interface CustomerSiteList {
  customerSite: CustomerSiteDetails;
}

export interface Schedule {
  ContractId: string
  CustomerSiteId: string
  StartsOn: string
  EndsOn: string
}

export interface PreAmcDetailsState {
  customerSites: CustomerSiteList[];
  preAmcScheduled: PreAmcScheduleDetailsArray;
  preAmcScheduledEngineers: PreAmcScheduledEngineersDetailsArray;
  preAmcSchedule: Schedule[]
  displayInformationModal: boolean;
  errors: ValidationErrors;
  currentPage: number;
  totalRows: number;
  perPage: number;
}

const initialState: PreAmcDetailsState = {
  customerSites: [],
  preAmcScheduled: [],
  preAmcScheduledEngineers: [],
  preAmcSchedule: [{
    StartsOn: '',
    EndsOn: '',
    ContractId: '',
    CustomerSiteId: ''
  }],
  displayInformationModal: false,
  errors: {},
  currentPage: 1,
  totalRows: 0,
  perPage: 0,
};
const slice = createSlice({
  name: 'contractpreamcmanagement',
  initialState,
  reducers: {
    initializePreAmcManagement: () => initialState,
    loadPreAmcScheduled: (state, { payload: siteList }: PayloadAction<PreAmcScheduleDetailsArray>) => {
      state.preAmcScheduled = (siteList.map((customerSite) => (customerSite)));
    },
    loadPreAmcCustomerSite: (state, { payload: { CustomerSiteList, PerPage, TotalRows } }: PayloadAction<MultipleCustomerSiteDetails>) => {
      state.totalRows = TotalRows;
      state.perPage = PerPage;
      state.customerSites = CustomerSiteList.map((customerSite) => ({ customerSite }));
    },
    loadPreAmcScheduledEngineers: (state, { payload: AssignedEngineers }: PayloadAction<PreAmcScheduledEngineersDetailsArray>) => {
      state.preAmcScheduledEngineers = (AssignedEngineers.map((engineers) => (engineers)));
    },
    changePage: (state, { payload: page }: PayloadAction<number>) => {
      state.currentPage = page;
      state.customerSites = [];
    },
    scheduleUpdateField: (state, { payload: { Date, FieldName, CustomerSiteId, ContractId } }: PayloadAction<{ Date: string, FieldName: string, CustomerSiteId: string, ContractId: string }>) => {
      const index = state.preAmcSchedule.findIndex(item => item.CustomerSiteId === CustomerSiteId);
      if (index !== -1) {
        state.preAmcSchedule[index] = {
          ...state.preAmcSchedule[index],
          [FieldName]: Date
        };
      } else {
        state.preAmcSchedule.push({
          StartsOn: FieldName === 'StartsOn' ? Date : '',
          EndsOn: FieldName === 'EndsOn' ? Date : '',
          ContractId: ContractId,
          CustomerSiteId: CustomerSiteId
        });
      }
    },
    updateErrors: (state, { payload: errors }: PayloadAction<ValidationErrors>) => {
      state.errors = errors;
    },
    toggleInformationModalStatus: (state) => {
      state.displayInformationModal = !state.displayInformationModal;
    },
  },
});

export const { initializePreAmcManagement, loadPreAmcScheduled, loadPreAmcCustomerSite,changePage, loadPreAmcScheduledEngineers, scheduleUpdateField, updateErrors, toggleInformationModalStatus } = slice.actions;
export default slice.reducer;