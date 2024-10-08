import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ValidationErrors } from '../../../../../types/error';
import { DocumentNumberFormatDetails, DocumentNumberFormatEdit } from '../../../../../types/documentnumberformat';
import { valuesInMasterDataByTableDetailsSelect, valuesInMasterDataByTableSelect } from '../../../../../types/masterData';

export interface FormatDetailType {
  key: number;
  value: string;
}

export interface DocumentNumberFormatEditState {
  numberformat: DocumentNumberFormatEdit;
  errors: ValidationErrors;
  displayInformationModal: boolean;
  DocumentTypes: valuesInMasterDataByTableDetailsSelect[];
  IsProceed: boolean;
  CustomString: string;
  SampleDocumentFormat: FormatDetailType[];
  NumFormatArray: FormatDetailType[];
}

const initialState: DocumentNumberFormatEditState = {
  numberformat: {
    Id: 0,
    DocumentTypeId: 0,
    Format: '',
    NumberPadding: 0,
    separator: "",
    documentNumber: 0
  },
  NumFormatArray: [],
  SampleDocumentFormat: [],
  CustomString: "",
  IsProceed: true,
  DocumentTypes: [],
  errors: {},
  displayInformationModal: false,
};

const slice = createSlice({
  name: 'numberformatedit',
  initialState,
  reducers: {
    initializeDocumentNumberFormatEdit: () => initialState,
    updateField: (state, { payload: { name, value } }: PayloadAction<{ name: keyof DocumentNumberFormatEditState['numberformat']; value: any }>) => {
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
    loadDocumentNumberFormatDetails: (state, { payload: numberformatinfo }: PayloadAction<DocumentNumberFormatDetails>) => {
      // Update the state's numberformat properties with the new values from payload
      const { DocumentTypeId, NumberPadding, DocumentNumberFormat, Id } = numberformatinfo;
      state.numberformat.DocumentTypeId = DocumentTypeId;
      state.numberformat.NumberPadding = NumberPadding;
      state.numberformat.Format = DocumentNumberFormat;
      state.numberformat.Id = Id;

      // Create a new array [key,value] using regexPattern and matches
      const regexPattern = /(\{[^}]*\}|\/|[A-Z]+\d*|\d+[A-Z]*|[!@#$%^&*()_+/\-=;':"\\|,.<>?`~[\]]+)/g;
      const matches = DocumentNumberFormat.match(regexPattern) || [];

      // Find the  CustomString
      const customStringPattern = /^[A-Za-z]+\d*$/;
      const generateFormattedArray = (matches) =>
        matches.map((match, index) => ({
          key: index + 1,
          value: customStringPattern.test(match) ? "{CUSTSTR}" : match
        }));
      const customString = matches.find(value => customStringPattern.test(value));
      if (customString) {
        state.CustomString = customString;
      }

      // Set the  NumFormatArray , SampleDocumentFormat with the generated formatted array
      state.NumFormatArray = generateFormattedArray(matches);
      state.SampleDocumentFormat = generateFormattedArray(matches);

      // Filter out special characters and '{NOSPACE}' from the matches to determine the document number count
      const specialCharacterRegex = /^[!@#$%^&*()_+/\-=;':"\\|,.<>?`~[\]]+$/;
      const filteredResult = matches.filter(item => !specialCharacterRegex.test(item) && item !== '{NOSPACE}');
      state.numberformat.documentNumber = filteredResult.length;
      
      // Find separator or delimiter using specialCharacterRegex
      const firstSpecialCharacterValue = matches.find(item => specialCharacterRegex.test(item));
      if (firstSpecialCharacterValue) {
        state.numberformat.separator = firstSpecialCharacterValue; 
      }
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
      state.numberformat = { ...state.numberformat,Format: '', NumberPadding: 0, separator: "", documentNumber: 0 };
      state.NumFormatArray = [],
        state.SampleDocumentFormat = [],
        state.CustomString = "",
        state.IsProceed = false
    },
    setSampleArray: (state, { payload: value }: PayloadAction<any>) => {
      state.SampleDocumentFormat = value;
    },
  },
});

export const {
  initializeDocumentNumberFormatEdit, updateField,
  updateErrors, setCustomString, toggleInformationModalStatus,
  loadDocTypes, setProceed, NumFormatupdateField, createFormatArray,
  SampleNumFormatupdateField, createFormat, setSampleArray,
  clearFormatArray, loadDocumentNumberFormatDetails } = slice.actions;
export default slice.reducer;