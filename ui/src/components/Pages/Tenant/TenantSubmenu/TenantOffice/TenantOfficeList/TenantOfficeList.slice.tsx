import { None, Option, Some } from '@hqoss/monads';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TenantOfficeInfoDetails, TenantOfficeList } from '../../../../../../types/tenantofficeinfo';

export interface TenantOfficeInfoList {
  tenantoffice: TenantOfficeInfoDetails;
}
export interface TenantRegion {
  Id: number;
  RegionName: string;
}

export interface TenantOfficeInfoListState {
  tenantoffice: Option<readonly TenantOfficeInfoList[]>;
  currentPage: number;
  tenantregion: TenantRegion;
  searchWith: string;
  totalRows: number;
  perPage: number;
  visibleModal: string
  createTenantOfficeInfoModalStatus: boolean;
}

const initialState: TenantOfficeInfoListState = {
  tenantoffice: None,
  tenantregion: {
    Id: 0,
    RegionName: ""
  },
  visibleModal: "",
  currentPage: 1,
  searchWith: "",
  totalRows: 0,
  perPage: 0,
  createTenantOfficeInfoModalStatus: false,
};
const slice = createSlice({
  name: 'tenantofficelist',
  initialState,
  reducers: {
    initializeTenantOfficesInfoList: () => initialState,
    loadTenantOffices: (state, { payload: { TenantOffices, totalRows, PerPage } }: PayloadAction<TenantOfficeList>) => {
      state.tenantoffice = Some(TenantOffices.map((tenantoffice) => ({ tenantoffice })));
      state.totalRows = totalRows;
      state.perPage = PerPage;
    },
    changePage: (state, { payload: page }: PayloadAction<number>) => {
      state.currentPage = page;
      state.tenantoffice = None;
    },
    setFilter: (state, { payload: Search }: PayloadAction<any>) => {
      state.searchWith = Search.value;
      state.currentPage = 1;
    },
    setVisibleModal: (state, { payload: ModalName }: PayloadAction<string>) => {
      state.visibleModal = ModalName;
    },
  },
});

export const { initializeTenantOfficesInfoList, setVisibleModal, setFilter, loadTenantOffices, changePage } = slice.actions;
export default slice.reducer;


