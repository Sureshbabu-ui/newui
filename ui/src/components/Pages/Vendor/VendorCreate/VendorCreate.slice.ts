import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ValidationErrors } from '../../../../types/error';
import { VendorForCreation, VendorSelectDetails, SelectDetails } from '../../../../types/vendor';
import { PostalCodeDetails, PostalCodeList } from '../../../../types/postalcode';

export interface CreateVendorState {
  vendor: VendorForCreation;
  errors: ValidationErrors;
  displayInformationModal: boolean;
  selectDetails: VendorSelectDetails;
  pincodecheck: boolean;
  postalcodelist: PostalCodeDetails[];
}

const initialState: CreateVendorState = {
  vendor:
  {
    Name: '',
    TenantOfficeId: 0,
    IsMsme: false,
    Address: '',
    CityId: null,
    StateId: null,
    CountryId: null,
    Pincode: '',
    ContactName: '',
    Email: '',
    ContactNumberOneCountryCode: '',
    ContactNumberOne: '',
    ContactNumberTwoCountryCode: '',
    ContactNumberTwo: '',
    CreditPeriodInDays: '',
    GstNumber: '',
    GstVendorTypeId: 0,
    ArnNumber: '',
    EsiNumber: '',
    PanNumber: '',
    PanTypeId: 0,
    VendorTypeId: 0,
    TanNumber: '',
    CinNumber: '',
    MsmeRegistrationNumber: '',
    MsmeCommencementDate: null,
    MsmeExpiryDate: null
  },
  selectDetails: {
    Cities: [],
    Countrys: [],
    GstVendorType: [],
    Location: [],
    PanType: [],
    States: [],
    PrimaryCountryCode: [],
    VendorType: []
  },
  errors: {},
  displayInformationModal: false,
  postalcodelist: [],
  pincodecheck: false
};

const slice = createSlice({
  name: 'vendorcreate',
  initialState,
  reducers: {
    initializeVendorCreate: () => initialState,
    updateField: (
      state,
      { payload: { name, value } }: PayloadAction<{ name: keyof CreateVendorState['vendor']; value: any }>) => {
      state.vendor[name] = value as never;
      if (name == "IsMsme" && value == false) {
        state.vendor.MsmeRegistrationNumber = "",
          state.vendor.MsmeCommencementDate = '',
          state.vendor.MsmeExpiryDate = ''
      }
    },
    loadSelectDetails: (state, { payload: { name, value: { Select } } }: PayloadAction<{ name: keyof CreateVendorState['selectDetails']; value: SelectDetails }>) => {
      state.selectDetails[name] = Select.map((selectDetails) => (selectDetails));
    },
    updateErrors: (state, { payload: errors }: PayloadAction<ValidationErrors>) => {
      state.errors = errors;
    },
    toggleInformationModalStatus: (state) => {
      state.displayInformationModal = !state.displayInformationModal;
    },
    loadPostalCodeList: (state, { payload: { PostalCodeList } }: PayloadAction<PostalCodeList>) => {
      state.postalcodelist = PostalCodeList.map((postalcodelist) => postalcodelist);
    },
    clearPostalCodeList: (state) => {
      state.postalcodelist = [];
      state.vendor.CityId = null;
      state.vendor.CountryId = null;
      state.vendor.StateId = null;
      state.vendor.Pincode = ""
    },
  },
});

export const { initializeVendorCreate, updateField, updateErrors, loadSelectDetails, toggleInformationModalStatus, clearPostalCodeList, loadPostalCodeList } = slice.actions;
export default slice.reducer;