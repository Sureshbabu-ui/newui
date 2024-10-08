import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GstTaxRateListDetail } from "../../../../../types/GstTaxRate";

export interface ViewGstTaxRateState {
    selectedGstTaxRate: GstTaxRateListDetail
}
const initialState: ViewGstTaxRateState = {
    selectedGstTaxRate: {
        Id: 0,
        TenantServiceCode: "",
        TenantServiceName:"",
        ServiceAccountCode:"",
        ServiceAccountDescription:"",
        Cgst:0,
        Sgst: 0,
        Igst:0,
        IsActive: false ,
        CreatedBy: "",
}
};
const slice = createSlice({
    name: 'gsttaxview',
    initialState,
    reducers: {
        initializeGstTaxRateView: () => initialState,
        loadGstDetails: (state,{ payload:  GstTaxRateListDetail  }: PayloadAction<GstTaxRateListDetail>) => {
            state.selectedGstTaxRate = GstTaxRateListDetail
        },
    },
});
export const {
    initializeGstTaxRateView,
    loadGstDetails,
} = slice.actions;

export default slice.reducer;