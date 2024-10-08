import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SelectedCustomerDetails } from '../../../../types/customer';

export interface CustomerList {
  SelectedCustomer: SelectedCustomerDetails;
}

export interface CustomerProfileState {
  singlecustomer: SelectedCustomerDetails;
}

const initialState: CustomerProfileState = {
  singlecustomer: {
    CustomerCode: "",
    BilledToAddress: "",
    TenantOffice: "",
    BilledToCityName: "",
    BilledToCountryName: '',
    BilledToGstNumber: '',
    BilledToPincode: "",
    BilledToStateName: "",
    CinNumber: "",
    PrimaryContactName: "",
    PrimaryContactEmail: "",
    PrimaryContactPhone: "",
    SecondaryContactName: "",
    SecondaryContactEmail: "",
    SecondaryContactPhone: "",
    CreatedBy: 0,
    CreatedOn: "",
    CustomerId: 0,
    EffectiveFrom: "",
    EffectiveTo: '',
    GroupName: "",
    Id: 0,
    IsContractCustomer: false,
    IsDeleted: false,
    IsMsme: false,
    IsVerified: false,
    ModifiedBy: 0,
    ModifiedOn: '',
    MsmeRegistrationNumber: '',
    Name: "",
    NameOnPrint: '',
    PanNumber: "",
    ShippedToAddress: "",
    ShippedToCityName: "",
    ShippedToCountryName: '',
    ShippedToGstNumber: '',
    ShippedToPincode: "",
    ShippedToStateName: "",
    TanNumber: "",
    TenantOfficeId: 0,
    TinNumber: '',
    Industry:""
  },
};

const slice = createSlice({
  name: 'customerprofile',
  initialState,
  reducers: {
    initializeCustomerProfile: () => initialState,
    loadCustomerDetails: (state, { payload: { CustomerDetails } }: PayloadAction<any>) => {
      state.singlecustomer = CustomerDetails
    },
  },
});

export const {
  initializeCustomerProfile,
  loadCustomerDetails
} = slice.actions;

export default slice.reducer;
