import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ValidationErrors } from "../../../../../types/error";
import { CreateGoodsReceivedNote, Select, SelectDetails } from "../../../../../types/goodsreceivednote";
import { store } from "../../../../../state/store";

export interface CreateGoodsReceivedNoteState {
  errors: ValidationErrors;
  transactiontypes: Select[];
  creategrn: CreateGoodsReceivedNote;
}

const initialState: CreateGoodsReceivedNoteState = {
  errors: {},
  transactiontypes: [],
  creategrn: {
    ReferenceNumber: "",
    Remarks: "",
    SourceEngineerId: null,
    SourceLocationId: null,
    SourceVendorId: null,
    TransactionId: 0,
    TransactionTypeCode: "",
    ReferenceDate: null,
    ConfirmReferenceNumber: ""
  }
};

const slice = createSlice({
  name: 'creategrn',
  initialState,
  reducers: {
    initializeGRN: () => initialState,
    updateField: (
      state,
      { payload: { name, value } }: PayloadAction<{ name: keyof CreateGoodsReceivedNoteState['creategrn']; value: any }>
    ) => {
      state.creategrn[name] = value as never;
    },
    updateErrors: (state, { payload: errors }: PayloadAction<ValidationErrors>) => {
      state.errors = errors;
    },
    loadTransactionTypes: (state, { payload: { Select } }: PayloadAction<SelectDetails>) => {
      state.transactiontypes = Select.map((transactiontypes) => transactiontypes);
    },
    setVendorId: (state, { payload: vendorId }: PayloadAction<any>) => {
      state.creategrn.SourceVendorId = vendorId;
    },
    setLocationId: (state, { payload: locationid }: PayloadAction<any>) => {
      state.creategrn.SourceLocationId = locationid;
    }
  },
});

export const {
  initializeGRN,
  loadTransactionTypes,
  updateErrors,
  updateField,
  setVendorId,
  setLocationId
} = slice.actions;

export default slice.reducer;
