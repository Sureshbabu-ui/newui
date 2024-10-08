import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SelectedCustomerDetails } from '../../../../types/customer';

export interface EditContractState {
  customer: SelectedCustomerDetails;
}

const initialState: EditContractState = {
  customer: {
    CustomerCode: "",
    TenantOffice: "",
    BilledToAddress: "",
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
  name: 'contractcustomer',
  initialState,
  reducers: {
    initializeContractCustomer: () => initialState,
    loadContractCustomer: (state, { payload: { CustomerDetails } }: PayloadAction<any>) => {
      state.customer = CustomerDetails
    },
  },
});

export const {
  initializeContractCustomer,
  loadContractCustomer
} = slice.actions;

export default slice.reducer; 
