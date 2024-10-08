import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ValidationErrors } from '../../../../../../../types/error';
import { PartStockInfo, PartStockListForGin,PartStocktDataListForGIN } from '../../../../../../../types/partStock';
import { Select, SelectDetails } from '../../../../../../../types/goodsreceivednote';

export interface GIRNCreate {
    PartIndentDemandId: number;
    TenantOfficeId: number;
    PartStockData: PartStockInfo[]
}

export interface masterDataList {
    StockType: Select[]
}

export interface DemandInfo {
    PartIndentDemandId: number;
    TenantOfficeId: number;
    WorkOrderNumber: string;
    Quantity: number;
}

export interface CreateGIRNState {
    errors: ValidationErrors;
    PartStocks: PartStockListForGin[];
    IndentDemand: DemandInfo;
    maxexceed: boolean;
    GIRNList: GIRNCreate;
    displayInformationModal: boolean;
    masterDataList: masterDataList,
    stocktypeid: number;
}

const initialState: CreateGIRNState = {
    GIRNList: {
        PartIndentDemandId: 0,
        TenantOfficeId: 0,
        PartStockData: []
    },
    masterDataList: {
        StockType: []
    },
    maxexceed: false,
    PartStocks: [],
    IndentDemand: {
        TenantOfficeId: 0,
        PartIndentDemandId: 0,
        WorkOrderNumber: "",
        Quantity: 0
    },
    stocktypeid: 0,
    errors: {},
    displayInformationModal: false,
};

const slice = createSlice({
    name: 'creategirn',
    initialState,
    reducers: {
        initializeGIRNCreate: () => initialState,
        updateField: (state, { payload: { PartStockId, Action } }: PayloadAction<{ PartStockId: number, Action: boolean }>) => {
            if (Action == true) {
                state.GIRNList.PartStockData.push({ PartStockId })
            } else {
                state.GIRNList.PartStockData = state.GIRNList.PartStockData.filter(item => item.PartStockId !== PartStockId)
            }
        },
        loadMasterData: (state, { payload: { name, value: { Select } } }: PayloadAction<{ name: keyof CreateGIRNState['masterDataList']; value: SelectDetails }>) => {
            state.masterDataList[name] = Select.map((masterData) => (masterData))
        },
        loadPartStocks: (state, { payload: { SelectPartStocks } }: PayloadAction<PartStocktDataListForGIN>) => {
            state.PartStocks = SelectPartStocks;
        },
        loadDemandData: (state, { payload: { PartIndentDemandId, TenantOfficeId, WorkOrderNumber, Quantity, StockTypeId } }: PayloadAction<{ PartIndentDemandId: number, TenantOfficeId: number, WorkOrderNumber: string, Quantity: number, StockTypeId: number }>) => {
            state.IndentDemand.PartIndentDemandId = PartIndentDemandId;
            state.IndentDemand.TenantOfficeId = TenantOfficeId;
            state.IndentDemand.WorkOrderNumber = WorkOrderNumber;
            state.IndentDemand.Quantity = Quantity;
            state.GIRNList.PartIndentDemandId = PartIndentDemandId;
            state.GIRNList.TenantOfficeId = TenantOfficeId;
            state.stocktypeid = StockTypeId
        },
        updateErrors: (state, { payload: errors }: PayloadAction<ValidationErrors>) => {
            state.errors = errors;
        },
        setMaxExceeds: (state, { payload: maxvalue }: PayloadAction<boolean>) => {
            state.maxexceed = maxvalue;
        },
        toggleInformationModalStatus: (state) => {
            state.displayInformationModal = !state.displayInformationModal;
        },
        setStockTypeCode: (state, { payload: id }: PayloadAction<any>) => {
            state.stocktypeid = id;
        },
    },
});

export const {
    updateErrors,
    updateField,
    toggleInformationModalStatus,
    initializeGIRNCreate,
    loadDemandData,
    loadPartStocks,
    setMaxExceeds,
    loadMasterData,
    setStockTypeCode
} = slice.actions;

export default slice.reducer;