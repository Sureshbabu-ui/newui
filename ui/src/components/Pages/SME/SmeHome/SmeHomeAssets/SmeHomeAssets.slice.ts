import { None, Option, Some } from '@hqoss/monads';
import { PayloadAction, createSlice} from '@reduxjs/toolkit';
import { AssetDetailsForSmeView } from '../../../../../types/assets';
import { ValidationErrors } from '../../../../../types/error';

export interface AssetDetailsForSmeState{
    AssetDetailsForSme: AssetDetailsForSmeView;
    errors: ValidationErrors;
}

const initialState: AssetDetailsForSmeState = {
    AssetDetailsForSme:{
      MspAssetId: "",
      CustomerAssetId: "",
      AssetProductCategory: "",
      Make: "",
      ModelName: "",
      ProductSerialNumber: "",
      WarrantyEndDate: "",
      CustomerSite: "",
      AmcValue: "",
      ContractNumber: "",
      ResolutionTimeInHours: "",
      ResponseTimeInHours: "",
      StandByTimeInHours: "",
      IsOutSourcingNeeded: "",
      IsPreAmcCompleted: "",
      AmcStartDate: "",
      AmcEndDate: ""
    },
    errors: {}
};

const slice = createSlice({
  name: 'assetdetailsforsme',
  initialState,
  reducers: {
    initializeAssetDetailsForSme: () => initialState,
    setAssetDetails: (state, { payload: assetDetails }) => {
      state.AssetDetailsForSme = assetDetails;                  
    },
    updateErrors: (state, { payload: errors }: PayloadAction<ValidationErrors>) => {
      state.errors = errors;
  }
  },
});

export const { initializeAssetDetailsForSme,updateErrors, setAssetDetails } = slice.actions;

export default slice.reducer;
