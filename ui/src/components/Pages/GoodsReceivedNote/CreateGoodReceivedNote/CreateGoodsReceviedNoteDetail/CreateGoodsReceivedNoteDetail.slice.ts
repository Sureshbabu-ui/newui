import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ValidationErrors } from "../../../../../types/error";
import { GRNDetail, GoodsReceivedNoteDetail, Select, SelectDetails } from "../../../../../types/goodsreceivednote";

export interface masterDataList {
  StockType: Select[]
}

export interface ErrorList{
  Id:number;
  Barcode: string,
  SerialNumber:string,
  Rate: string,
  StockTypeId: string
}

export interface CreateGoodsReceivedNoteDetailState {
  displayInformationModal: boolean;
  masterDataList: masterDataList,
  errors: ValidationErrors;
  GrnDetail: GoodsReceivedNoteDetail[];
  grndetailList: GoodsReceivedNoteDetail[];
  GrnTransactionTypeCode:string;
  IsGrnCompleted: boolean;
  errorlist :ErrorList[];
  proceederror:boolean;
}

const initialState: CreateGoodsReceivedNoteDetailState = {
  displayInformationModal: false,
  errors: {},
  GrnDetail: [],
  grndetailList: [],
  IsGrnCompleted: false,
  masterDataList: {
    StockType: []
  },
  GrnTransactionTypeCode:"",
  errorlist:[],
  proceederror:false
};

const slice = createSlice({
  name: 'creategoodsreceivednotedetail',
  initialState,
  reducers: {
    initializeGoodsReceivedNoteDetail: () => initialState,
    updateField: (
      state,
      { payload: { id, name, value } }: PayloadAction<{ id: number; name: keyof GRNDetail; value: any }>
    ) => {
      const rowIndex = state.grndetailList.findIndex((item) => item.Id === id);
      if (rowIndex !== -1) {
        const updatedRow = { ...state.grndetailList[rowIndex], [name]: value };
        state.grndetailList[rowIndex] = updatedRow;
      }
    },
    loadMasterData: (state, { payload: { name, value: { Select } } }: PayloadAction<{ name: keyof CreateGoodsReceivedNoteDetailState['masterDataList']; value: SelectDetails }>) => {
      state.masterDataList[name] = Select.map((masterData) => (masterData))
    },
    loadGRNDetails: (state, { payload: { GoodsReceivedNote,GrnTransactionTypeCode } }: PayloadAction<GRNDetail>) => {
      state.GrnTransactionTypeCode = GrnTransactionTypeCode;      
      if (GrnTransactionTypeCode == "GTT_PORD"){
        let idCounter = 1;
        GoodsReceivedNote.forEach((grndetail) => {
          const { PartId, Quantity } = grndetail;
          for (let i = 0; i < Quantity; i++) {
            const newRecord = { ...grndetail, Quantity: 1, Id: idCounter++ };
            state.grndetailList.push(newRecord);
          }
        });
        state.GrnDetail = state.grndetailList;
      } else if (GrnTransactionTypeCode == "GTT_DCHN" || GrnTransactionTypeCode == "GTT_EPRT") {
        state.grndetailList = GoodsReceivedNote.map(item => item);
      }
    },
    removeGrnDetails: (state, { payload: Id }: PayloadAction<any>) => {
      state.grndetailList = state.grndetailList.filter(item => item.Id !== Id);
    },
    updateErrors: (state, { payload: errors }: PayloadAction<ValidationErrors>) => {
      state.errors = errors;
    },
    updateErrorList: (state, { payload: errors }: PayloadAction<ErrorList[]>) => {
      state.errorlist = errors;
    },
    setProceedError: (state, { payload: error }: PayloadAction<boolean>) => {
      state.proceederror = error;      
    },
    setGrnCompleted: (state, { payload: IsGrnCompleted }: PayloadAction<boolean>) => {
      state.IsGrnCompleted = IsGrnCompleted;
    },
    toggleInformationModalStatus: (state) => {
      state.displayInformationModal = !state.displayInformationModal;
    }
  },
});

export const {
  initializeGoodsReceivedNoteDetail,
  toggleInformationModalStatus,
  updateErrors,
  updateField,
  loadGRNDetails,
  removeGrnDetails,
  setGrnCompleted,
  loadMasterData,
  updateErrorList,
  setProceedError,
} = slice.actions;

export default slice.reducer;
