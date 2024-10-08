import { PayloadAction, createSlice} from '@reduxjs/toolkit';
import { ValidationErrors } from '../../../../../types/error';
import { PartDetails } from '../../../../../types/partStock';

export interface PartDetailsForSmeState{
    PartDetailsForSme: PartDetails;
    errors: ValidationErrors;
}

const initialState: PartDetailsForSmeState = {
    PartDetailsForSme:{
        TenantOffice: "",
        Barcode: "",
        DemandNumber: "",
        WarrantyPeriod: "",
        WorkOrderNumber: "",
        PartWarrantyExpiryDate: "",
        PoNumber: "",
        PoDate: "",
        PartCode: "",
        PartType: "",
        Description: "",
        Vendor: "",
        GrnNumber:"",
        PartValue: 0
    },
    errors: {}
};

const slice = createSlice({
  name: 'partdetailsforsme',
  initialState,
  reducers: {
    initializePartDetailsForSme: () => initialState,
    setPartDetails: (state, { payload: partDetails }) => {
      state.PartDetailsForSme = partDetails;                  
    },
    updateErrors: (state, { payload: errors }: PayloadAction<ValidationErrors>) => {
      state.errors = errors;
    }
  },
});

export const { initializePartDetailsForSme,updateErrors, setPartDetails } = slice.actions;

export default slice.reducer;
