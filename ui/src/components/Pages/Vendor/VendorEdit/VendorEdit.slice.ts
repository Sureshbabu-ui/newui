import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ValidationErrors } from '../../../../types/error';
import { VendorEdit, VendorEditDetails, VendorSelectDetails, SelectDetails } from '../../../../types/vendor';
import { PostalCodeDetails, PostalCodeList } from '../../../../types/postalcode';

export interface EditVendorState {
  vendor: VendorEdit;
  errors: ValidationErrors;
  displayInformationModal: boolean;
  selectDetails: VendorSelectDetails;
  postalcodelist: PostalCodeDetails[];
}

const initialState: EditVendorState = {
  vendor:
  {
    Id: 0,
    VendorId: 0,
    Name: '',
    TenantOfficeId: 0,
    Address: '',
    CityId: 0,
    StateId: 0,
    CountryId: 0,
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
    VendorTypeId:0,
    IsMsme: false,
    IsActive: false,
    TanNumber: '',
    CinNumber: '',
    MsmeRegistrationNumber: '',
    MsmeCommencementDate:null,
    MsmeExpiryDate: null,
    GstVendorTypeCode:""
  },
  selectDetails: {
    Countrys:[],
    Cities: [],
    GstVendorType: [],
    Location: [],
    PanType: [],
    States: [],
    PrimaryCountryCode:[],
    VendorType:[]
  },
  errors: {},
  postalcodelist:[],
  displayInformationModal: false,
};

const slice = createSlice({
  name: 'vendoredit',
  initialState,
  reducers: {
    initializeVendorEdit: () => initialState,
    updateField: (
      state,
      { payload: { name, value } }: PayloadAction<{ name: keyof EditVendorState['vendor']; value: any }>) => {
      state.vendor[name] = value as never;
      if (name == "IsMsme" && value == false) {
        state.vendor.MsmeRegistrationNumber = "",
          state.vendor.MsmeCommencementDate = null,
          state.vendor.MsmeExpiryDate = null
      }
    },
    loadVendorDetails: (state, { payload: { VendorDetails } }: PayloadAction<VendorEditDetails>) => {
      state.vendor = VendorDetails;
    },
    loadSelectDetails: (state, { payload: { name, value: { Select } } }: PayloadAction<{ name: keyof EditVendorState['selectDetails']; value: SelectDetails }>) => {
      state.selectDetails[name] = Select.map((selectDetails) => (selectDetails))
    },
    updateErrors: (state, { payload: errors }: PayloadAction<ValidationErrors>) => {
      state.errors = errors;
    },
    toggleInformationModalStatus: (state) => {
      state.displayInformationModal = !state.displayInformationModal;
    },
    loadVendorEditPostalCodeList: (state, { payload: { PostalCodeList } }: PayloadAction<PostalCodeList>) => {
      state.postalcodelist = PostalCodeList.map((postalcodelist) => postalcodelist);
    },
    clearVendorEditPostalCodeList: (state) => {
      state.postalcodelist = [];
    }
  },
});

export const { initializeVendorEdit, updateField, loadVendorDetails, updateErrors, toggleInformationModalStatus, loadSelectDetails ,clearVendorEditPostalCodeList,loadVendorEditPostalCodeList} = slice.actions;
export default slice.reducer;