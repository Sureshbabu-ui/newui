import { array, number, Decoder, nullable, object, string,iso8601, boolean } from 'decoders';

export interface Configurations{
  EngineerType: Select[],
  EngineerLevel: Select[],
  }

export interface Select {
  value: any,
  label: any
}

export interface SelectMasterDataDetails {
  Select: Select[]
}


  export interface EntitiesDetails {
    Id: number;
    Name: string;
  } 

  export interface CustomerSites{
    Id:number;
    SiteName: string;
  }
  
  export interface EngineersDetails {
    Id: number;
    FullName: string;
  }

export interface ManpowerSummaryCreation {
  ContractId: string;
  CustomerSiteId: number | string;
  TenantOfficeInfoId: number | string;
  EngineerMonthlyCost: number | string;
  EngineerCount: number | string;
  DurationInMonth: number | string;
  EngineerTypeId: number | string;
  EngineerLevelId: number | string;
  CustomerAgreedAmount: number | string;
  Remarks: string | null;
}

export interface EntitiesDetails {
  Id: number;
  Name: string;
}

export interface ManPowerEditTemplate {
  Id: number | string;
  ContractId: string | number;
  CustomerSiteId: number | string;
  TenantOfficeInfoId: number | string;
  EngineerMonthlyCost: number | string;
  EngineerCount: number | string;
  DurationInMonth: number | string;
  EngineerTypeId: number | string;
  EngineerLevelId: number | string;
  CustomerAgreedAmount: number | string;
  Remarks: string | null;
}

export const  manpowerEditTemplateDecoder: Decoder<ManPowerEditTemplate> = object({
  Id:number,
  ContractId:number,
  TenantOfficeInfoId: number,
  EngineerMonthlyCost: number,
  CustomerSiteId : number,
  EngineerCount : number,
  DurationInMonth : number,
  EngineerTypeId: number,
  CustomerAgreedAmount: number,
	EngineerLevelId:number,
  Remarks: nullable(string),
});


export interface SelectedManPowerDetails {
  ContractManpowerSummary: ManPowerEditTemplate;
}

export const selectedManPowerDetailsDecoder: Decoder<SelectedManPowerDetails> = object({
  ContractManpowerSummary: manpowerEditTemplateDecoder,
});

export interface ManPowerStatusTemplate {
  Id:number;
  CustomerSiteName : string;
  MspLocationName : string;
  DistanceToCustomerSite: string;
  DistanceUnitId :  number;
  EngineerTypeId :  number ;
  EngineerLevelId :  number;
  BudgetedCost  :  string;
  EmployeeName :  string;
  EmployeeReportedOn : typeof iso8601 | string;
  EmployeeBillingRate : string;
  IsDeleted:Boolean;
}

export interface ManPowerEditResponse {
  IsUpdated: Boolean; 
}

export const manPowerEditDecoder: Decoder<ManPowerEditResponse> = object({
  IsUpdated: boolean,
});

export interface ManpowerSummaryList {
  Id: number;
  CustomerSite: string;
  CustomerAgreedAmount: number;
  EngineerType: string;
  EngineerLevel: string;
  EngineerCount: number;
  DurationInMonth: number;
  TenantOffice: string;
  EngineerMonthlyCost: number;
  Remarks: string | null;
  MarginAmount: number;
  BudgetedAmount: number;
}

export const manpowerSummaryListDecoder: Decoder<ManpowerSummaryList> = object({
  Id: number,
  CustomerSite: string,
  CustomerAgreedAmount:number,
  EngineerType: string,
  EngineerLevel: string,
  EngineerCount: number,
  DurationInMonth: number,
  TenantOffice: string,
  EngineerMonthlyCost: number,
  Remarks: nullable(string),
  MarginAmount: number,
  BudgetedAmount: number
});

export interface ContractManpowerSummaryList {
  ContractManPowerSummaryList: ManpowerSummaryList[];
  TotalRows: number;
  PerPage:number;
}

export const contractManpowerSummaryListDecoder: Decoder<ContractManpowerSummaryList> = object({
  ContractManPowerSummaryList: array(manpowerSummaryListDecoder),
  TotalRows: number,
  PerPage:number
});