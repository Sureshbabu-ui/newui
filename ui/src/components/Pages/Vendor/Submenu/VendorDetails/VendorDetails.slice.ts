import { None, Option, Some } from '@hqoss/monads';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SelectedVendorDetail, selectedVendorDetails } from '../../../../../types/vendor';

export interface VendorDetailsState {
  vendorDetails: SelectedVendorDetail
}

const initialState: VendorDetailsState = {
  vendorDetails: {
    OfficeName: "",
    Name: "",
    Address: "",
    City: "",
    State: "",
    Pincode: "",
    ContactName: "",
    Email: "",
    ContactNumberOneCountryCode: "",
    ContactNumberOne: "",
    ContactNumberTwoCountryCode: null,
    ContactNumberTwo: null,
    CreditPeriodInDays: 0,
    GstNumber: "",
    GstVendorType: "",
    VendorType:"",
    ArnNumber: null,
    EsiNumber: null,
    PanNumber: null,
    PanType: null,
    TanNumber: null,
    CinNumber: null,
    IsMsme: false,
    MsmeRegistrationNumber: null,
    MsmeCommencementDate: null,
    MsmeExpiryDate: null,
  }
};

const slice = createSlice({
  name: 'vendordetails',
  initialState,
  reducers: {
    initializeVendorDetails: () => initialState,
    loadVendorDetails: (state, { payload: { VendorDetails } }: PayloadAction<selectedVendorDetails>) => {
      state.vendorDetails = VendorDetails
    }
  },
});

export const {
  initializeVendorDetails,
  loadVendorDetails
} = slice.actions;

export default slice.reducer;
