import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ValidationErrors } from '../../../../../types/error';
import { DocumentNumberFormatCreate } from '../../../../../types/documentnumberformat';
import { valuesInMasterDataByTableDetailsSelect, valuesInMasterDataByTableSelect } from '../../../../../types/masterData';

export interface FormatDetailType {
  key: number;
  value: string;
}

export interface DocumentNumberFormatCreateState {
  numberformat: DocumentNumberFormatCreate;
  errors: ValidationErrors;
  displayInformationModal: boolean;
  DocumentTypes: valuesInMasterDataByTableDetailsSelect[];
  IsProceed: boolean;
  CustomString: string;
  SampleDocumentFormat: FormatDetailType[];
  NumFormatArray: FormatDetailType[];
}

const initialState: DocumentNumberFormatCreateState = {
  numberformat: {
    DocumentTypeId: 0,
    Format: '',
    NumberPadding: 0,
    separator: "",
    documentNumber: 0
  },
  NumFormatArray: [],
  SampleDocumentFormat: [],
  CustomString: "",
  IsProceed: false,
  DocumentTypes: [],
  errors: {},
  displayInformationModal: false,
};

const slice = createSlice({
  name: 'numberformatcreate',
  initialState,
  reducers: {
    initializeDocumentNumberFormatCreate: () => initialState,
    updateField: (state, { payload: { name, value } }: PayloadAction<{ name: keyof DocumentNumberFormatCreateState['numberformat']; value: any }>) => {
      state.numberformat[name] = value as never;
    },
    updateErrors: (state, { payload: errors }: PayloadAction<ValidationErrors>) => {
      state.errors = errors;
    },
    loadDocTypes: (state, { payload: { MasterData } }: PayloadAction<valuesInMasterDataByTableSelect>) => {
      state.DocumentTypes = MasterData.map((types) => types);
    },
    toggleInformationModalStatus: (state) => {
      state.displayInformationModal = !state.displayInformationModal;
    },
    setProceed: (state, { payload: value }: PayloadAction<boolean>) => {
      state.IsProceed = value;
    },
    setCustomString: (state, { payload: { index, value } }: PayloadAction<{ index: any, value: any }>) => {
      state.CustomString = value;
      if (index !== 0) {
        const itemToUpdate = state.SampleDocumentFormat.find(item => item.key === index);
        if (itemToUpdate) {
          itemToUpdate.value = value;
        }
      }
    },
    NumFormatupdateField: (state, { payload: { key, value } }: PayloadAction<{ key: number; value: string }>) => {
      const item = state.NumFormatArray.find((numFormat) => numFormat.key === key);
      if (item) {
        item.value = value;
      }
    },
    createFormatArray: (state, { payload: value }: PayloadAction<boolean>) => {
      const docnumber = Number(state.numberformat.documentNumber);
      if (value == true) {
        const keyValueSampleArray = Array.from({ length: docnumber + (docnumber - 1) },
          (item, index) => ({ key: index + 1, value: '' })
        );
        state.SampleDocumentFormat = keyValueSampleArray;
        const keyValueArray = Array.from({ length: docnumber + (docnumber - 1) }, (item, index) => {
          const key = index + 1;
          const value = key % 2 == 0 ? '{NOSPACE}' : '';
          return { key, value };
        });
        state.NumFormatArray = keyValueArray;
      }
    },
    SampleNumFormatupdateField: (state, { payload: { key, value } }: PayloadAction<{ key: number; value: string }>) => {
      const item = state.SampleDocumentFormat.find((numFormat) => numFormat.key === key);
      if (item) {
        item.value = value;
      }
    },
    createFormat: (state) => {
      const customStringIndex = state.NumFormatArray.findIndex(item => item.value === "{CUSTSTR}");
      if (customStringIndex !== -1) {
        state.NumFormatArray[customStringIndex].value = state.CustomString;
      }
      state.numberformat.Format = state.NumFormatArray.map(item => item.value).join('');
    },
    clearFormatArray: (state) => {
      state.NumFormatArray = state.NumFormatArray.map(item => ({ ...item, value: item.key % 2 === 0 ? '{NOSPACE}' : '' })); // Set {NOSPACE} for even keys
      state.SampleDocumentFormat = state.SampleDocumentFormat.map(item => ({ ...item, value: '' }));
      state.CustomString = "";
    }
  },
});

export const {
  initializeDocumentNumberFormatCreate, updateField,
  updateErrors, setCustomString, toggleInformationModalStatus,
  loadDocTypes, setProceed, NumFormatupdateField, createFormatArray,
  SampleNumFormatupdateField, createFormat, clearFormatArray } = slice.actions;
export default slice.reducer;