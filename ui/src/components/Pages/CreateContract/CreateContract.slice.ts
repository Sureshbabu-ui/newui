import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ValidationErrors } from '../../../types/error';
import { Configurations, ContractDetails, SelectDetails } from '../../../types/contract';
import { InvoicePrerequisite, InvoicePrerequisites } from '../../../types/invoicePrerequisite';
import { AppKeyValue, AppSettingAppKeyValues } from '../../../types/appSetting';

interface Select {
  value: any,
  label: any
}

export interface CreateContractState {
  masterDataList: Configurations;
  ContractValue: number;
  contract: ContractDetails;
  TenantOfficeInfo: Select[],
  Customer: Select[],
  Employee: Select[]
  InvoicePrerequisite: InvoicePrerequisite[],
  PaymentFrequency: Select[],
  errors: ValidationErrors;
  submitting: boolean;
  displayInformationModal: boolean;
  searchWith: any;
  appvalues: AppKeyValue;
  SelectedContractInvoicePrerequisite: InvoicePrerequisite[]
}

const initialState: CreateContractState = {
  masterDataList: {
    AgreementType: [],
    BookingType: [],
    ServiceMode: [],
    PaymentMode: [],
    PreventiveMaintenanceFrequency: [],
    BaseLocation: [],
    BackToBackScope: [],
    ServiceWindow: [],
    CreditPeriod: [],
    PaymentType: []
  },
  appvalues: {
    AppKey: '',
    AppValue: ''
  },
  ContractValue: 0,
  contract: {
    CustomerInfoId: null,
    AccelLocation: null,
    AgreementTypeId: 0,
    MarketingExecutive: null,
    ContractValue: 0,
    AmcValue: 0,
    FmsValue: 0,
    StartDate: '',
    EndDate: '',
    BookingType: null,
    BookingValueDate: `${new Date().toISOString().split('T')[0]}`,
    BookingDate: `${new Date().toISOString().split('T')[0]}`,
    QuotationReferenceNumber: '',
    QuotationReferenceDate: null,
    PoNumber: '',
    PoDate: null,
    IsMultiSite: false,
    SiteCount: 1,
    IsPAVNeeded: false,
    IsPerformanceGuarentee: false,
    PerformanceGuaranteeAmount: null,
    ServiceMode: null,
    PaymentMode: null,
    PaymentFrequency: null,
    IsSez: false,
    CreditPeriod: null,
    ServiceWindow: null,
    IsPreventiveMaintenanceNeeded: false,
    IsStandByRequired: false,
    IsStandByFullUnitRequired: false,
    IsStandByImpressStockRequired: false,
    IsBackToBackAllowed: false,
    BackToBackScopeId: null,
    PmFrequency: null,
  },
  TenantOfficeInfo: [],
  Customer: [],
  Employee: [],
  InvoicePrerequisite: [],
  SelectedContractInvoicePrerequisite: [],
  PaymentFrequency: [],
  errors: {},
  submitting: false,
  displayInformationModal: false,
  searchWith: null,
};


const slice = createSlice({
  name: 'contractcreate',
  initialState,
  reducers: {
    initializeContract: () => initialState,
    loadMasterData: (state, { payload: { name, value: { Select } } }: PayloadAction<{ name: keyof CreateContractState['masterDataList']; value: SelectDetails }>) => {
      state.masterDataList[name] = Select.map((masterData) => (masterData))
      if (name == 'PaymentType') {
        state.masterDataList['PaymentType'] = state.masterDataList['PaymentType'].filter(item => !state.appvalues.AppValue.includes(item.code))
      }
    },
    loadTenantlocations: (state, { payload: { Select } }: PayloadAction<SelectDetails>) => {
      state.TenantOfficeInfo = Select.map((TenantOfficeInfo) => TenantOfficeInfo);
    },
    loadCustomers: (state, { payload: { Select } }: PayloadAction<SelectDetails>) => {
      state.Customer = Select.map((Customers) => Customers);
    },
    loadEmployees: (state, { payload: { Select } }: PayloadAction<SelectDetails>) => {
      state.Employee = Select.map((Salesusers) => Salesusers);
    },
    loadAppkeyValues: (state, { payload: { AppKeyValues } }: PayloadAction<AppSettingAppKeyValues>) => {
      state.appvalues = AppKeyValues;
    },
    loadInvoicePrerequisite: (state, { payload: { InvoicePrerequisites } }: PayloadAction<InvoicePrerequisites>) => {
      state.InvoicePrerequisite = InvoicePrerequisites.map((invoicePrerequisites) => invoicePrerequisites);
    },
    loadPaymentFrequency: (state, { payload: { Select } }: PayloadAction<SelectDetails>) => {
      state.PaymentFrequency = Select.map((PaymentFrequencyList) => PaymentFrequencyList);
    },
    updateField: (
      state,
      { payload: { name, value } }: PayloadAction<{ name: keyof CreateContractState['contract']; value: any }>
    ) => {
      switch (name) {
        case 'IsMultiSite':
          if (value === false) {
            state.contract['SiteCount'] = null
          }
          state.contract[name] = value
          break;
        case 'IsPerformanceGuarentee':
          if (value === false) {
            state.contract['PerformanceGuaranteeAmount'] = null
          }
          state.contract[name] = value
          break;
        case 'IsPreventiveMaintenanceNeeded':
          if (value === false) {
            state.contract['PmFrequency'] = null
          }
          state.contract[name] = value
          break;
        case 'IsStandByRequired':
          if (value === false) {
            state.contract['IsStandByFullUnitRequired'] = false
            state.contract['IsStandByImprestStockRequired'] = false
          }
          state.contract[name] = value
          break;
        case 'IsBackToBackAllowed':
          if (value === false) {
            state.contract['BackToBackScopeId'] = null
          }
          state.contract[name] = value
          break;
        case 'BookingDate':
        case 'QuotationReferenceDate':
        case 'PoDate':
        case 'SiteCount':
        case 'PerformanceGuaranteeAmount':
        case 'CreditPeriod':
          if (value == '') {
            state.contract[name] = null
          } else {
            state.contract[name] = value
          }
          break;
        default:
          state.contract[name] = value
      }
      state.contract.ContractValue = Number(state.contract.AmcValue??0) + Number(state.contract.FmsValue??0)
    },
    updateErrors: (state, { payload: errors }: PayloadAction<ValidationErrors>) => {
      state.errors = errors;
    },
    setSelectedInvoicePrerequisite: (state, { payload: InvoicePrerequisite }: PayloadAction<InvoicePrerequisite[]>) => {
      state.SelectedContractInvoicePrerequisite = InvoicePrerequisite.map((InvoicePrerequisite) => InvoicePrerequisite);
    },
    startSubmitting: (state) => {
      state.submitting = true;
    },
    stopSubmitting: (state) => {
      state.submitting = false;
    },
    toggleInformationModalStatus: (state) => {
      state.displayInformationModal = !state.displayInformationModal;
    },
    setFilter: (state, { payload: Search }: PayloadAction<any>) => {
      state.searchWith = Search.value;
    }
  },
});

export const {
  initializeContract,
  updateField,
  updateErrors,
  startSubmitting,
  toggleInformationModalStatus,
  stopSubmitting,
  loadMasterData,
  loadInvoicePrerequisite,
  loadCustomers,
  loadTenantlocations,
  loadPaymentFrequency,
  loadEmployees,
  setFilter,
  setSelectedInvoicePrerequisite,
  loadAppkeyValues,
} = slice.actions;

export default slice.reducer;
