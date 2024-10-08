import { None, Option, Some } from '@hqoss/monads';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PartStockFilter, PartStockList, PartStockListDetail } from '../../../../../../types/partStock';
import { SelectDetails } from '../../../../../../types/contract';

export interface PartStocks {
  partStock: PartStockListDetail;
}

interface Select {
  value: any,
  label: any,
}

export interface PartStocksListState {
  partStocks: Option<readonly PartStocks[]>;
  partStockFilter: PartStockFilter;
  currentPage: number;
  search: any;
  totalRows: number;
  perPage: number;
  TenantRegion: Select[];
  AreaOfficeInfo: Select[];
  StockType: Select[];
  Make: Select[];
  ProductCategory: Select[];
  PartCategory: Select[];
  StockRoom: Select[];
  StockRoomName: string;
}

const initialState: PartStocksListState = {
  partStocks: None,
  partStockFilter: {
    TenantRegionId: 0,
    TenantOfficeId: 0,
    PartType: 0,
    Make: 0,
    ProductCategory: 0,
    PartCategory: 0,
    SubCategory: 0,
    StockRoom: 0,
    IsUnderWarranty: false
  },
  StockRoomName: "",
  currentPage: 1,
  search: null,
  totalRows: 0,
  perPage: 0,
  TenantRegion: [],
  AreaOfficeInfo: [],
  StockType: [],
  Make: [],
  ProductCategory: [],
  PartCategory: [],
  StockRoom: []
};
const slice = createSlice({
  name: 'partstocklist',
  initialState,
  reducers: {
    initializePartStocksList: () => initialState,
    updateField: (
      state,
      { payload: { name, value } }: PayloadAction<{ name: keyof PartStocksListState['partStockFilter']; value: any }>
    ) => {
      state.partStockFilter[name] = value as never;
    },
    loadPartStocks: (state, { payload: { PartStocks, TotalRows, PerPage } }: PayloadAction<PartStockList>) => {
      state.partStocks = Some(PartStocks.map((partStock) => ({ partStock })));
      state.totalRows = TotalRows;
      state.perPage = PerPage;
    },
    changePage: (state, { payload: page }: PayloadAction<number>) => {
      state.currentPage = page;
      state.partStocks = None;
    },
    setSearch: (state, { payload: Searchname }: PayloadAction<string>) => {
      state.search = Searchname;
    },
    loadTenantRegions: (state, { payload: { Select } }: PayloadAction<SelectDetails>) => {
      state.TenantRegion = Select.map((TenantRegions) => TenantRegions);
    }, loadAreaOffices: (state, { payload: { Select } }: PayloadAction<SelectDetails>) => {
      state.AreaOfficeInfo = Select.map((TenantOfficeInfo) => TenantOfficeInfo);
    },
    loadPartStock: (state, { payload: { Select } }: PayloadAction<SelectDetails>) => {
      state.StockType = Select.map((StockTypeInfo) => StockTypeInfo);
    },
    loadMake: (state, { payload: { Select } }: PayloadAction<SelectDetails>) => {
      state.Make = Select.map((Make) => Make);
    },
    loadProductCategories: (state, { payload: { Select } }: PayloadAction<SelectDetails>) => {
      state.ProductCategory = Select.map((ProductCategory) => ProductCategory);
    },
    loadPartCategories: (state, { payload: { Select } }: PayloadAction<SelectDetails>) => {
      state.PartCategory = Select.map((PartCategory) => PartCategory);
    },
    loadStockRooms: (state, { payload: { Select } }: PayloadAction<SelectDetails>) => {
      state.StockRoom = Select.map((StockRoom) => StockRoom);
    },
    setStockRoom: (state, { payload: roomname }: PayloadAction<string>) => {
      state.StockRoomName = roomname;
    }
  },
});

export const { initializePartStocksList,
  loadStockRooms,
  loadPartCategories,
  loadProductCategories,
  loadMake,
  loadPartStocks,
  changePage,
  updateField,
  loadPartStock,
  setSearch,
  loadTenantRegions,
  loadAreaOffices,
  setStockRoom } = slice.actions;
export default slice.reducer;
