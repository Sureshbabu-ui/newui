import { array, number, Decoder, nullable, object, string, iso8601, boolean } from 'decoders';
export interface SalesUserDetails {
	Id: number;
	FullName: string;
}

export const salesusersDetailsDecoder: Decoder<SalesUserDetails> = object({
	Id: number,
	FullName: string,
});

export interface SalesUsers {
	Salesusers: SalesUserDetails[];
}

export const salesuserDecoder: Decoder<SalesUsers> = object({
	Salesusers: array(salesusersDetailsDecoder),
});

// contract create

export interface ExistedContract {
	Id: number;
	CreatedBy: number;
	ContractNumber: string | null;
	CustomerName: string;
	StartDate: string | null;
	EndDate: string | null;
	ContractValue: number | null;
	ContractStatus: string;

}

export const existedcontractDecoder: Decoder<ExistedContract> = object({
	Id: number,
	CreatedBy: number,
	ContractNumber: nullable(string),
	CustomerName: string,
	StartDate: nullable(string),
	EndDate: nullable(string),
	ContractValue: nullable(number),
	ContractStatus: string,
});

export interface MultipleExistedContracts {
	Contracts: ExistedContract[];
	TotalRows: number;
	PerPage: number;
}

export const multipleExistedContractsDecoder: Decoder<MultipleExistedContracts> = object({
	Contracts: array(existedcontractDecoder),
	TotalRows: number,
	PerPage: number
});

export interface ContractsCount {
	totalRows: number;
}

export const ContractsCountDecoder: Decoder<ContractsCount> = object({
	totalRows: number,
});

export interface ContractId {
	Id: number | string;
}
export const contractTemplateDecoder: Decoder<ContractId> = object({
	Id: number,

});

export interface ContractEditTemplate {
	Id: number | string;
	CustomerName: string;
	BaseLocationName: string;
	AgreementTypeName: string;
	BookingTypeName: string;
	BookingDate: string;
	BookingValueDate: string;
	QuotationReferenceNumber: string;
	PoNumber: string;
	PoDate: string;
	PoValue: number | string;
	StartDate: string;
	EndDate: string;
	IsMultiSite: Boolean | string;
	ServiceModeName: number | string;
	PaymentModeName: number | string;
	PaymentFrequencyName: number | string;
	NeedPm: Boolean | string;
	PmFrequencyName: number | string;
	SalesContactPersonName: number | string;
	CallExpiryDate: string;
	CallStopDate: string;
	CallStopReason: string;
}

export const contractEditTemplateDecoder: Decoder<ContractEditTemplate> = object({
	Id: number,
	CustomerName: string,
	BaseLocationName: string,
	AgreementTypeName: string,
	BookingTypeName: string,
	BookingDate: string,
	BookingValueDate: string,
	QuotationReferenceNumber: string,
	PoNumber: string,
	PoDate: string,
	PoValue: string,
	StartDate: string,
	EndDate: string,
	IsMultiSite: boolean,
	ServiceModeName: string,
	PaymentModeName: string,
	PaymentFrequencyName: string,
	NeedPm: boolean,
	PmFrequencyName: string,
	SalesContactPersonName: string,
	CallExpiryDate: string,
	CallStopDate: string,
	CallStopReason: string
});

export interface ContractView {
	Id: number;
	CustomerName: string;
	BaseLocationName: string;
	AgreementTypeName: string;
	BookingTypeName: string;
	BookingDate: string;
	BookingValueDate: string;
	QuotationReferenceNumber: string;
	PoNumber: string;
	PoDate: string;
	PoValue: number | string;
	StartDate: string;
	EndDate: string;
	IsMultiSite: Boolean | string;
	ServiceModeName: number | string;
	PaymentModeName: number | string;
	PaymentFrequencyName: number | string;
	NeedPm: Boolean | string;
	PmFrequencyName: number | string;
	SalesContactPersonName: number | string;
	CallExpiryDate: string;
	CallStopDate: string;
	CallStopReason: string;
}

export const contractviewTemplateDecoder: Decoder<ContractView> = object({
	Id: number,
	CustomerName: string,
	BaseLocationName: string,
	AgreementTypeName: string,
	BookingTypeName: string,
	BookingDate: string,
	BookingValueDate: string,
	QuotationReferenceNumber: string,
	PoNumber: string,
	PoDate: string,
	PoValue: string,
	StartDate: string,
	EndDate: string,
	IsMultiSite: boolean,
	ServiceModeName: string,
	PaymentModeName: string,
	PaymentFrequencyName: string,
	NeedPm: boolean,
	PmFrequencyName: string,
	SalesContactPersonName: string,
	CallExpiryDate: string,
	CallStopDate: string,
	CallStopReason: string,
});

export interface SelectedExistedContract {
	contract: ContractView[];
}

export const selectedContractsDecoder: Decoder<SelectedExistedContract> = object({
	contract: array(contractviewTemplateDecoder),
});

export interface ContractStatusTemplate {
	Id: number | string;
	IsDeleted: Boolean;
}

export interface ContractDetails {
	CustomerInfoId: number | null | string;
	AccelLocation: number | null | string;
	AgreementTypeId: number | string;
	ContractValue: number | null | string;
	AmcValue: number | string;
	FmsValue: number | string;
	StartDate: string;
	EndDate: string;
	BookingType: number | null | string;
	BookingDate: string | null;
	BookingValueDate: string,
	QuotationReferenceNumber: string;
	QuotationReferenceDate: string | null;
	PoNumber: string;
	PoDate: string | null;
	IsMultiSite: Boolean;
	IsPAVNeeded: Boolean;
	SiteCount: number | null | string;
	IsPerformanceGuarentee: Boolean;
	PerformanceGuaranteeAmount: number | null | string;
	PaymentMode: number | null | string;
	PaymentFrequency: number | null | string;
	IsSez: Boolean;
	CreditPeriod: number | null | string;
	ServiceMode: number | null | string;
	ServiceWindow: number | null | string;
	IsBackToBackAllowed: Boolean;
	BackToBackScopeId: number | null | string;
	PmFrequency: null | number | string;
	IsPreventiveMaintenanceNeeded: Boolean;
	IsStandByRequired: Boolean;
	IsStandByFullUnitRequired: Boolean;
	IsStandByImpressStockRequired: Boolean;
	MarketingExecutive: number | null | string;
}

export interface PoDetails {
	ItemCode: string,
	Description: string,
	Quantity: number | string,
	Rate: number | string,
	PoValue: number | string,
	Sgst: number | string,
	Cgst: number | string,
	Igst: number | string,
	Remarks: string
}

export interface EntitiesDetails {
	Id: number;
	Name: string;
}

export interface Select {
	value: any,
	label: any,
	code?: any
}

export interface SelectDetails {
	Select: Select[]
}

export interface CustomerDetails {
	Id: number;
	Name: string;
}

export interface Configurations {
	AgreementType: Select[],
	BookingType: Select[],
	ServiceMode: Select[],
	PaymentMode: Select[],
	PaymentType: Select[],
	PreventiveMaintenanceFrequency: Select[],
	BaseLocation: Select[],
	ServiceWindow: Select[],
	BackToBackScope: Select[],
	CreditPeriod: Select[]
}

export interface SelectedContractDetail {
	Id: number | string;
	ContractNumber:string | null;
	CreditPeriod: string | null,
	AgreementTypeId: string | number;
	AmcValue: number;
	FmsValue: number;
	AgreementTypeCode: string;
	CustomerName: string;
	BilledToAddress:string;
	ContractInvoicePrerequisite: string | null;
	CustomerInfoId: number;
	TenantOfficeId: string | number;
	TenantOfficeName: string;
	FirstApprover: string | null
	FirstApproverId: number | null
	SecondApprover: string | null
	SecondApproverId: number | null
	FirstApprovedOn: string | null
	SecondApprovedOn: string | null
	AgreementType: string;
	BookingType: string | null;
	BookingValueDate: string | null;
	BookingDate: string | null;
	QuotationReferenceNumber: string | null;
	QuotationReferenceDate: string | null;
	PoNumber: string | null;
	PoDate: string | null;
	ServiceWindow: string | null;
	ContractValue: number;
	ContractStatusId: number
	StartDate: string;
	EndDate: string;
	IsMultiSite: Boolean | string;
	IsPreAmcNeeded: Boolean | string | null;
	IsPerformanceGuaranteeRequired: Boolean | string | null;
	PerformanceGuaranteeAmount: number | null;
	IsSez: Boolean | string | null;
	SiteCount: number | null;
	ServiceMode: number | string | null;
	PaymentMode: number | string | null;
	PaymentFrequency: number | string | null;
	NeedPm: Boolean | string;
	PmFrequency: number | string | null;
	SalesContactPerson: number | string | null;
	CallExpiryDate: string | null;
	CallStopDate: string | null;
	CallStopReason: string | null;
	ReviewComment: string | null;
	IsDeleted: Boolean;
	CreatedOn: string;
	CreatedBy: string;
	CreatedById: number;
	UpdatedOn: string | null;
	UpdatedBy: string | null;
	RenewContractId: number | null;
	ContractStatus: string | null;
	IsBackToBackAllowed: Boolean | string | null;
	BackToBackScope: string | null;
	IsStandByFullUnitRequired: Boolean | string | null;
	IsStandByImprestStockRequired: Boolean | string | null;
	ContractStatusCode: string;
}

export const selectedcontractDetailDecoder: Decoder<SelectedContractDetail> = object({
	Id: number,
	BilledToAddress:string,
	ContractNumber:nullable(string),
	CustomerName: string,
	ServiceWindow: nullable(string),
	BookingValueDate: nullable(string),
	ContractInvoicePrerequisite: nullable(string),
	IsSez: nullable(boolean),
	IsPreAmcNeeded: nullable(boolean),
	IsPerformanceGuaranteeRequired: nullable(boolean),
	PerformanceGuaranteeAmount: nullable(number),
	AgreementTypeId: number,
	AgreementTypeCode: string,
	CreditPeriod: nullable(string),
	AmcValue: number,
	FmsValue: number,
	CustomerInfoId: number,
	TenantOfficeId: number,
	TenantOfficeName: string,
	FirstApprover: nullable(string),
	FirstApproverId: nullable(number),
	SecondApprover: nullable(string),
	SecondApproverId: nullable(number),
	FirstApprovedOn: nullable(string),
	SecondApprovedOn: nullable(string),
	AgreementType: string,
	BookingType: nullable(string),
	BookingDate: nullable(string),
	QuotationReferenceNumber: nullable(string),
	QuotationReferenceDate: nullable(string),
	PoNumber: nullable(string),
	PoDate: nullable(string),
	ContractValue: number,
	ContractStatusId: number,
	StartDate: string,
	EndDate: string,
	IsMultiSite: boolean,
	SiteCount: nullable(number),
	ServiceMode: nullable(string),
	PaymentMode: nullable(string),
	PaymentFrequency: nullable(string),
	NeedPm: boolean,
	PmFrequency: nullable(string),
	SalesContactPerson: nullable(string),
	CallExpiryDate: nullable(string),
	CallStopDate: nullable(string),
	CallStopReason: nullable(string),
	ReviewComment: nullable(string),
	IsDeleted: boolean,
	CreatedOn: string,
	CreatedBy: string,
	CreatedById: number,
	UpdatedOn: nullable(string),
	UpdatedBy: nullable(string),
	RenewContractId: nullable(number),
	ContractStatus: nullable(string),
	IsBackToBackAllowed: nullable(boolean),
	BackToBackScope: nullable(string),
	IsStandByFullUnitRequired: nullable(boolean),
	IsStandByImprestStockRequired: nullable(boolean),
	ContractStatusCode: string
});

export interface SelectedContract {
	ContractDetails: SelectedContractDetail;
}

export const selectedcontractDetailsDecoder: Decoder<SelectedContract> = object({
	ContractDetails: selectedcontractDetailDecoder,
});

// Contract Edit

export interface ContractEditDetail {
	Id: number | string | null;
	CustomerInfoId: number | null | string;
	AccelLocation: number | null | string;
	AgreementTypeId: number | string;
	ContractValue: number | null | string;
	AmcValue: number | null | string;
	FmsValue: number | null | string;
	StartDate: string | null;
	EndDate: string | null;
	BookingTypeId: number | null | string;
	BookingDate: string | null,
	BookingValueDate: string,
	QuotationReferenceNumber: string | null;
	QuotationReferenceDate: string | null;
	PoNumber: string | null;
	PoDate: string | null;
	IsMultiSite: Boolean;
	IsPAVNeeded: Boolean;
	SiteCount: number | null | string;
	IsPerformanceGuaranteeRequired: Boolean;
	PerformanceGuaranteeAmount: number | null | string;
	PaymentModeId: number | null | string;
	PaymentFrequencyId: number | null | string;
	IsSez: Boolean;
	CreditPeriod: number | null | string;
	CreditPeriodName: string | null;
	ServiceModeId: number | null | string;
	ServiceWindowId: number | null | string;
	IsBackToBackAllowed: Boolean;
	BackToBackScopeId: number | null | string;
	PmFrequencyId: null | number | string;
	IsPmRequired: Boolean;
	IsStandByRequired?: Boolean;
	IsStandByFullUnitRequired: Boolean;
	IsStandByImprestStockRequired: Boolean;
	SalesContactPersonId: number | null | string;
	ContractStatusId: number | string;
	ContractStatusCode: string;
}

export interface SelectedContractInfo {
	Id: number;
	CustomerInfoId: number;
	AccelLocation: number;
	AgreementTypeId: number;
	ContractValue: number | string;
	AmcValue: number | string;
	FmsValue: number | string;
	StartDate: string | null;
	EndDate: string | null;
	BookingTypeId: number;
	BookingDate: string | null,
	BookingValueDate: string,
	QuotationReferenceNumber: string | null;
	QuotationReferenceDate: string | null;
	PoNumber: string | null;
	PoDate: string | null;
	IsMultiSite: Boolean;
	IsPAVNeeded: Boolean;
	SiteCount: number | null | string;
	IsPerformanceGuaranteeRequired: Boolean;
	PerformanceGuaranteeAmount: number | null | string;
	PaymentModeId: number | null | string;
	PaymentFrequencyId: number | null | string;
	IsSez: Boolean;
	CreditPeriod: number | null | string;
	CreditPeriodName: null | string;
	ServiceModeId: number | null | string;
	ServiceWindowId: number | null | string;
	IsBackToBackAllowed: Boolean;
	BackToBackScopeId: number | null | string;
	PmFrequencyId: null | number | string;
	IsPmRequired: Boolean;
	IsStandByRequired?: Boolean;
	IsStandByFullUnitRequired: Boolean;
	IsStandByImprestStockRequired: Boolean;
	SalesContactPersonId: number | null | string;
	ContractStatusId: number;
	ContractStatusCode: string
}

export const selectedcontractDecoder: Decoder<SelectedContractInfo> = object({
	Id: number,
	CustomerInfoId: number,
	AccelLocation: number,
	AgreementTypeId: number,
	ContractValue: number,
	AmcValue: number,
	FmsValue: number,
	StartDate: nullable(string),
	EndDate: nullable(string),
	BookingTypeId: number,
	BookingDate: nullable(string),
	BookingValueDate: string,
	QuotationReferenceNumber: nullable(string),
	QuotationReferenceDate: nullable(string),
	PoNumber: nullable(string),
	PoDate: nullable(string),
	IsMultiSite: boolean,
	IsPAVNeeded: boolean,
	SiteCount: nullable(number),
	IsPerformanceGuaranteeRequired: boolean,
	PerformanceGuaranteeAmount: nullable(number),
	PaymentModeId: nullable(number),
	PaymentFrequencyId: nullable(number),
	IsSez: boolean,
	CreditPeriod: nullable(number),
	CreditPeriodName: nullable(string),
	ServiceModeId: nullable(number),
	ServiceWindowId: nullable(number),
	IsBackToBackAllowed: boolean,
	BackToBackScopeId: nullable(number),
	PmFrequencyId: nullable(number),
	IsPmRequired: boolean,
	IsStandByFullUnitRequired: boolean,
	IsStandByImprestStockRequired: boolean,
	SalesContactPersonId: nullable(number),
	ContractStatusId: number,
	ContractStatusCode: string
});

export interface SelectedContractData {
	ContractInfo: SelectedContractInfo;
}

export const selectedContractInfoDecoder: Decoder<SelectedContractData> = object({
	ContractInfo: selectedcontractDecoder,
});

export interface ContractEditResponse {
	IsUpdated: Boolean;
}

export const contractEditDecoder: Decoder<ContractEditResponse> = object({
	IsUpdated: boolean,
});

export interface ContractSearchForFilter {
	SearchText: string;
	StartDate: string;
	EndDate: string;
}
// contract view 

export interface ContractTab {
	id: number;
	component: string;
	displaytext: string;
	name: string;
	icon: string;
}

export type ContractTabArray = ContractTab[];

export interface ContractRenewDetail {
	Id: number | string | null;
	CustomerInfoId: number | null | string;
	AccelLocation: number | null | string;
	AgreementTypeId: number | string;
	ContractValue: number | string;
	AmcValue: number | string;
	FmsValue: number | string;
	StartDate: string | null;
	EndDate: string | null;
	BookingTypeId: number | null | string;
	BookingDate: string | null,
	BookingValueDate: string,
	QuotationReferenceNumber: string | null;
	QuotationReferenceDate: string | null;
	PoNumber: string | null;
	PoDate: string | null;
	IsMultiSite: Boolean;
	IsPAVNeeded: Boolean;
	SiteCount: number | null | string;
	IsPerformanceGuaranteeRequired: Boolean;
	PerformanceGuaranteeAmount: number | null | string;
	PaymentModeId: number | null | string;
	PaymentFrequencyId: number | null | string;
	IsSez: Boolean;
	CreditPeriod: number | null | string;
	CreditPeriodName: number | null | string;
	ServiceModeId: number | null | string;
	ServiceWindowId: number | null | string;
	IsBackToBackAllowed: Boolean;
	BackToBackScopeId: number | null | string;
	PmFrequencyId: null | number | string;
	IsPmRequired: Boolean;
	IsStandByRequired?: Boolean;
	IsStandByFullUnitRequired: Boolean;
	IsStandByImprestStockRequired: Boolean;
	SalesContactPersonId: number | null | string;
}

export interface ContractRenewResponse {
	IsRenewed: Boolean;
}

export const contractRenewDecoder: Decoder<ContractRenewResponse> = object({
	IsRenewed: boolean,
});

export interface ContractDeleted {
	IsDeleted: Boolean;
}

export const contractDeletedDecoder: Decoder<ContractDeleted> = object({
	IsDeleted: boolean,
});

export interface GstActiveRates {
	TenantServiceCode: string;
	ServiceAccountDescription: string;
	Cgst: number;
	Sgst: number;
	Igst: number;
}

export const gstRateDecoder: Decoder<GstActiveRates> = object({
	TenantServiceCode: string,
	ServiceAccountDescription: string,
	Cgst: number,
	Sgst: number,
	Igst: number,
});

export interface GstRateList {
	Gstrates: GstActiveRates[];
}

export const gstRateListDecoder: Decoder<GstRateList> = object({
	Gstrates: array(gstRateDecoder),
});

export interface SelectedContractPeriod {
	StartDate: string | null;
	EndDate: string | null;
}

export const selectedcontractperiodDecoder: Decoder<SelectedContractPeriod> = object({
	StartDate: nullable(string),
	EndDate: nullable(string),
});

export interface ContractPeriod {
	ContractPeriod: SelectedContractPeriod;
}

export const contractPeriodDecoder: Decoder<ContractPeriod> = object({
	ContractPeriod: selectedcontractperiodDecoder,
});

export interface ContractNamesByFilterDetail {
	Id: number;
	ContractNumber: string;
  }
  
  export const contractNamesByFilterDetailDecoder: Decoder<ContractNamesByFilterDetail> = object({
	Id: number,
	ContractNumber: string,
  });

export interface ContractNamesByFilter {
	ContractNumbersByCustomer: ContractNamesByFilterDetail[];
  }
  
  export const contractNamesByFilterDecoder: Decoder<ContractNamesByFilter> = object({
	ContractNumbersByCustomer: array(contractNamesByFilterDetailDecoder),
  });
 