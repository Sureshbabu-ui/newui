import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SelectedContract, SelectedContractDetail } from '../../../../../types/contract';

export interface ContractsList {
  SelectedContractItem: SelectedContractDetail;
}

export interface ContractState {
  singlecontract: SelectedContractDetail;
}

const initialState: ContractState = {
  singlecontract:
  {
    Id:0,
    ContractNumber:"",
    CustomerName: '',
    BilledToAddress: "",
    ContractInvoicePrerequisite:'',
    CreditPeriod: '',
    AgreementTypeId: 0,
    AmcValue: 0,
    FmsValue: 0,
    AgreementTypeCode: '',
    CustomerInfoId: 0,
    TenantOfficeName: '',
    TenantOfficeId: 0,
    FirstApprovedOn: '',
    FirstApprover: '',
    FirstApproverId: null,
    SecondApprovedOn: '',
    SecondApprover: '',
    SecondApproverId: null,
    AgreementType: '',
    BookingType: '',
    BookingDate: '',
    QuotationReferenceNumber: '',
    QuotationReferenceDate:'',
    PoNumber: '',
    PoDate: '',
    ContractValue: 0,
    ContractStatusId: 0,
    StartDate: '',
    EndDate: '',
    IsMultiSite: false,
    SiteCount: 0,
    ServiceMode: '',
    PaymentMode: '',
    PaymentFrequency: '',
    NeedPm: false,
    PmFrequency: '',
    SalesContactPerson: '',
    CallExpiryDate: '',
    CallStopDate: '',
    CallStopReason: '',
    ReviewComment: '',
    CreatedBy: '',
    CreatedById: 0,
    CreatedOn: '',
    UpdatedBy: '',
    UpdatedOn: '',
    IsDeleted: false,
    RenewContractId: null,
    ContractStatus: null,
    BackToBackScope: '',
    BookingValueDate: '',
    IsBackToBackAllowed: false,
    IsPerformanceGuaranteeRequired: false,
    IsPreAmcNeeded: false,
    IsSez: false,
    IsStandByFullUnitRequired: false,
    IsStandByImprestStockRequired: false,
    PerformanceGuaranteeAmount: 0,
    ServiceWindow: '',
    ContractStatusCode:''
  },
};

const slice = createSlice({
  name: 'contractsettinglist',
  initialState,
  reducers: {
    initializeContract: () => initialState,
    loadContracts: (state, { payload: { ContractDetails } }: PayloadAction<SelectedContract>) => {
      state.singlecontract = ContractDetails;
    },
  },
});

export const {
  initializeContract,
  loadContracts,
} = slice.actions;

export default slice.reducer;