import { None, Option, Some } from '@hqoss/monads';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CallCenterServiceRequest, CallCenterServiceRequestList } from '../../../../types/callCentreManagement';

export interface ServiceRequest {
  serviceRequest: CallCenterServiceRequest;
}

export interface CallCenterServiceRequestState {
  serviceRequests: Option<readonly ServiceRequest[]>;
  currentPage: number;
  search: any;
  searchWith: string;
  filterWith: string;
  totalRows: number;
  perPage: number;
  createServiceRequestModalStatus: boolean;
}

const initialState: CallCenterServiceRequestState = {
  serviceRequests: None,
  currentPage: 1,
  search: '',
  searchWith: '',
  totalRows: 0,
  filterWith: '',
  perPage: 0,
  createServiceRequestModalStatus: false,
};

const slice = createSlice({
  name: 'callcentremanagement',
  initialState,
  reducers: {
    initializeCallCenterManagement: () => initialState,
    loadServiceRequests: (state, { payload: { ServiceRequestList, TotalRows, PerPage } }: PayloadAction<CallCenterServiceRequestList>) => {
      state.serviceRequests = Some(ServiceRequestList.map((serviceRequest) => ({ serviceRequest })));
      state.totalRows = TotalRows;
      state.perPage = PerPage;
    },
    changePage: (state, { payload: page }: PayloadAction<number>) => {
      state.currentPage = page;
    },
    setSearch: (state, { payload: Searchname }: PayloadAction<string>) => {
      state.search = Searchname;
    },
    setFilter: (state, { payload: { Value, Name } }: PayloadAction<{ Value: string, Name: keyof CallCenterServiceRequestState }>) => {
      state[Name] = Value as never;
    },
  },
});

export const { initializeCallCenterManagement, loadServiceRequests, changePage, setSearch, setFilter } = slice.actions;
export default slice.reducer;