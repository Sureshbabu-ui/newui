import { None, Option, Some } from '@hqoss/monads';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { InterimServiceRequestList, InterimServiceRequest } from '../../../../../../types/serviceRequest';

export interface InterimSearchFilter {
  SearchText: string;
  StartDate: string;
  EndDate: string;
}

export interface serviceRequestList {
  serviceRequest: InterimServiceRequest;
}

export interface ServiceRequestListState {
  serviceRequests: Option<readonly serviceRequestList[]>;
  currentPage: number;
  filters: InterimSearchFilter;
  searchWith: any;
  totalRows: number;
  perPage: number;
  createServiceRequestModalStatus: boolean;
}

const initialState: ServiceRequestListState = {
  serviceRequests: None,
  currentPage: 1,
  filters: {
    SearchText: '',
    StartDate: ``,
    EndDate: ``
  },
  searchWith: 'CaseId',
  totalRows: 0,
  perPage: 0,
  createServiceRequestModalStatus: false,
};
const slice = createSlice({
  name: 'financeinterimservicerequestlist',
  initialState,
  reducers: {
    initializeInterimRequestList: () => initialState,
    loadServiceRequests: (state, { payload: { ServiceRequestList, TotalRows, PerPage } }: PayloadAction<InterimServiceRequestList>) => {
      state.serviceRequests = Some(ServiceRequestList.map((serviceRequest) => ({ serviceRequest })));
      state.totalRows = TotalRows;
      state.perPage = PerPage;
    },
    updateField: (
      state,
      { payload: { name, value } }: PayloadAction<{ name: keyof ServiceRequestListState['filters']; value: any }>) => {
      state.filters[name] = value;
    },
    changePage: (state, { payload: page }: PayloadAction<number>) => {
      state.currentPage = page;
    },
    setFilter: (state, { payload: Search }: PayloadAction<any>) => {
      state.searchWith = Search.value; 
      state.currentPage = 1;
    }
  },
});

export const { initializeInterimRequestList, loadServiceRequests, changePage, updateField, setFilter } = slice.actions;
export default slice.reducer;