import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ValidationErrors } from '../../../types/error';
import { Configurations, SelectDetails, Select } from '../../../types/contract';
import { ContractEditDetail, SelectedContractData } from '../../../types/contract';
import { ContractInvoicePrerequisite, ContractInvoicePrerequisites } from '../../../types/contractInvoicePrerequisite';
import { InvoicePrerequisite, InvoicePrerequisites } from '../../../types/invoicePrerequisite';
import { AppKeyValue, AppSettingAppKeyValues } from '../../../types/appSetting';

export interface ContractEditState {
  masterDataList: Configurations;
  contract: ContractEditDetail;
  TenantOfficeInfo: Select[],
  Customer: Select[],
  Employee: Select[],
  InvoicePrerequisite: InvoicePrerequisite[],
  ContractInvoicePrerequisite: ContractInvoicePrerequisite[],
  PaymentFrequency: Select[],
  errors: ValidationErrors;
  submitting: boolean;
  appvalues: AppKeyValue;
  displayInformationModal: boolean;
}

const initialState: ContractEditState = {
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
  contract: {
    Id: null,
    CustomerInfoId: null,
    AccelLocation: null,
    AgreementTypeId: 0,
    SalesContactPersonId: null,
    ContractValue: 0,
    AmcValue: 0,
    FmsValue: 0,
    StartDate: '',
    EndDate: '',
    BookingTypeId: null,
    BookingValueDate: `${new Date().toISOString().split('T')[0]}`,
    BookingDate: null,
    QuotationReferenceNumber: '',
    QuotationReferenceDate: null,
    PoNumber: '',
    PoDate: null,
    IsMultiSite: false,
    IsPAVNeeded: false,
    SiteCount: null,
    IsPerformanceGuaranteeRequired: false,
    PerformanceGuaranteeAmount: null,
    ServiceModeId: null,
    PaymentModeId: null,
    PaymentFrequencyId: null,
    IsSez: false,
    CreditPeriod: null,
    CreditPeriodName: '',
    ServiceWindowId: null,
    IsPmRequired: false,
    IsStandByRequired: false,
    IsStandByFullUnitRequired: false,
    IsStandByImprestStockRequired: false,
    IsBackToBackAllowed: false,
    BackToBackScopeId: null,
    PmFrequencyId: null,
    ContractStatusId: 0,
    ContractStatusCode:''
  },
  TenantOfficeInfo: [],
  Customer: [],
  Employee: [],
  InvoicePrerequisite: [],
  ContractInvoicePrerequisite: [],
  PaymentFrequency: [],
  errors: {},
  submitting: false,
  displayInformationModal: false,
};

const slice = createSlice({
  name: 'contractedit',
  initialState,
  reducers: {
    initializeContract: () => initialState,
    loadMasterData: (state, { payload: { name, value: { Select } } }: PayloadAction<{ name: keyof ContractEditState['masterDataList']; value: SelectDetails }>) => {
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
    loadInvoicePrerequisite: (state, { payload: { InvoicePrerequisites } }: PayloadAction<InvoicePrerequisites>) => {
      state.InvoicePrerequisite = InvoicePrerequisites.map((InvoicePrerequisites) => InvoicePrerequisites);
    },
    loadContractInvoicePrerequisite: (state, { payload: { ContractInvoicePrerequisites } }: PayloadAction<ContractInvoicePrerequisites>) => {
      state.ContractInvoicePrerequisite = ContractInvoicePrerequisites.map((contractInvoicePrerequisite) => contractInvoicePrerequisite);
    },
    loadPaymentFrequency: (state, { payload: { Select } }: PayloadAction<SelectDetails>) => {
      state.PaymentFrequency = Select.map((PaymentFrequencyList) => PaymentFrequencyList);
    },
    updateField: (
      state,
      { payload: { name, value } }: PayloadAction<{ name: keyof ContractEditState['contract']; value: any }>
    ) => {
      switch (name) {
        case 'IsMultiSite':
          if (value === false) {
            state.contract['SiteCount'] = null
          }
          state.contract[name] = value
          break;
        case 'IsPerformanceGuaranteeRequired':
          if (value === false) {
            state.contract['PerformanceGuaranteeAmount'] = null
          }
          state.contract[name] = value
          break;
        case 'IsPmRequired':
          if (value === false) {
            state.contract['PmFrequencyId'] = null
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
      state.contract.ContractValue = Number(state.contract.AmcValue ?? 0) + Number(state.contract.FmsValue ?? 0)
    },
    loadContractDetails: (state, { payload: { ContractInfo } }: PayloadAction<SelectedContractData>) => {
      state.contract = ContractInfo;
    },
    setSelectedInvoicePrerequisite: (state, { payload: InvoicePrerequisite }: PayloadAction<ContractInvoicePrerequisite[]>) => {
      state.ContractInvoicePrerequisite = InvoicePrerequisite.map((InvoicePrerequisite) => InvoicePrerequisite);
    },
    removeInvoicePrerequisite: (state, { payload: index }: PayloadAction<any>) => {
      state.ContractInvoicePrerequisite.splice(index, 1);
    },
    updateErrors: (state, { payload: errors }: PayloadAction<ValidationErrors>) => {
      state.errors = errors;
    },
    loadAppkeyValues: (state, { payload: { AppKeyValues } }: PayloadAction<AppSettingAppKeyValues>) => {
      state.appvalues = AppKeyValues;
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
  },
});

export const {
  initializeContract,
  loadAppkeyValues,
  updateField,
  updateErrors,
  startSubmitting,
  toggleInformationModalStatus,
  stopSubmitting,
  loadMasterData,
  removeInvoicePrerequisite,
  loadInvoicePrerequisite,
  loadContractInvoicePrerequisite,
  setSelectedInvoicePrerequisite,
  loadCustomers,
  loadTenantlocations,
  loadPaymentFrequency,
  loadEmployees,
  loadContractDetails,
} = slice.actions;

export default slice.reducer;
