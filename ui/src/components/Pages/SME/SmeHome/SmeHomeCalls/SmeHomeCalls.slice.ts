import { None, Option, Some } from '@hqoss/monads';
import { PayloadAction, createSlice} from '@reduxjs/toolkit';
import { CallDetailsForSme, CallDetailsForSmeView } from '../../../../../types/serviceRequest';
import { ValidationErrors } from '../../../../../types/error';

export interface ServiceRequest {
  serviceRequest: CallDetailsForSmeView;
}

export interface CallDetailsForSmeState{
  serviceRequests: Option<readonly ServiceRequest[]>;
  currentPage: number;
  search: any;
  searchWith: string;
  totalRows: number;
  perPage: number;
  createServiceRequestModalStatus: boolean;
  errors: ValidationErrors;
}

const initialState: CallDetailsForSmeState = {
  serviceRequests: None,
  currentPage: 1,
  search: '',
  searchWith: 'WorkOrderNumber',
  totalRows: 0,
  perPage: 0,
  createServiceRequestModalStatus: false,
  errors: {}
};

const slice = createSlice({
  name: 'calldetailsforsme',
  initialState,
  reducers: {
    initializeCallDetailsForSme: () => initialState,
    loadServiceRequests: (state, { payload: { ServiceRequestListDetailsForSme, TotalRows, PerPage } }: PayloadAction<CallDetailsForSme>) => {
      state.serviceRequests = Some(ServiceRequestListDetailsForSme.map((serviceRequest) => ({ serviceRequest })));
      state.totalRows = TotalRows;
      state.perPage = PerPage;
    },
    changePage: (state, { payload: page }: PayloadAction<number>) => {
      state.currentPage = page;
    },
    setSearch: (state, { payload: Searchname }: PayloadAction<string>) => {
      state.search = Searchname;
    },
    setFilter: (state, { payload: { Value, Name } }: PayloadAction<{ Value: string, Name: keyof CallDetailsForSmeState }>) => {
      state[Name] = Value as never;
    },
    updateErrors: (state, { payload: errors }: PayloadAction<ValidationErrors>) => {
      state.errors = errors;
  }
  },
});

export const { initializeCallDetailsForSme,loadServiceRequests,updateErrors, changePage,setSearch,setFilter } = slice.actions;

export default slice.reducer;
