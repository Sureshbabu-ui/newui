import { Decoder, array, boolean,  nullable,  number, object, string } from "decoders";

export interface EngineerList {
  Id: number;
  FullName: string;
  RoleId: number;
}

export interface Configurations {
  ManpowerAllocationStatus: Select[],
}

export interface Select {
  value: any,
  label: any
}

export interface SelectMasterDataDetails {
  Select: Select[]
}

export interface Engineers {
  Id: number;
  FullName: string;
  RoleId: number;
}

export const engineersnamesDecoder: Decoder<Engineers> = object({
  Id: number,
  FullName: string,
  RoleId: number
});

export interface EngineersNamesList {
  EngineersNames: Engineers[];
}

export const engineersnameslistDecoder: Decoder<EngineersNamesList> = object({
  EngineersNames: array(engineersnamesDecoder),
});

export interface ManpowerAllocationCreate {
  ContractId: number | string;
  EmployeeId: number | string;
  CustomerSiteId: number | string;
  CustomerAgreedAmount: number;
  BudgetedAmount: number;
  StartDate: string | null;
  EndDate: string | null;
  Remarks: string;
}
  export interface TenantData {
     IsTenantCreated: Boolean; 
  }

  export const tenantDataDecoder: Decoder<TenantData>=object({
   IsTenantCreated:boolean
  })
  
  export interface ManpowerAllocationList {
    Id: number;
    ContractId: number;
    EmployeeName: string;
    CustomerSite: string;
    CustomerAgreedAmount: string;
    BudgetedAmount: string;
    MarginAmount: string;
    StartDate: string | null;
    EndDate: string | null;
    AllocationStatus: string;
    Remarks: string|null;
  }
  
  export const  contractManpowerAllocationsDecoder: Decoder<ManpowerAllocationList> = object({
    Id:number,
    ContractId:number,
    EmployeeName:string,
    CustomerSite:string,
    CustomerAgreedAmount: string ,
    BudgetedAmount:string,
    MarginAmount:string,
    StartDate:nullable(string),
    EndDate: nullable(string),
    AllocationStatus:string,
    Remarks:nullable(string)
  });
  
export interface ContractManpowerAllocationList {
  ManpowerAllocations: ManpowerAllocationList[];
   TotalRows: number;
   PerPage:number;
 }
 
 export const contractManpowerAllocationListDecoder: Decoder<ContractManpowerAllocationList> = object({
   ManpowerAllocations: array(contractManpowerAllocationsDecoder),
  TotalRows: number,
  PerPage:number
});

export interface ManPowerAllocationResponse {
  IsManpowerAllocated: Boolean;
}

export const createManPowerAllocationDecoder: Decoder<ManPowerAllocationResponse> = object({
  IsManpowerAllocated: boolean
});

export interface ManPowerAllocationEditResponse {
  IsUpdated: Boolean;
}

export const manPowerAllocationEditDecoder: Decoder<ManPowerAllocationEditResponse> = object({
  IsUpdated: boolean,
});

export interface ManpowerAllocationDetails {
  Id: number;
  ContractId:number;
  CustomerSiteId: number;
  CustomerAgreedAmount: number;
  EmployeeId: number;
  AllocationStatusId: number;
  EndDate: string | null;
  StartDate: string | null;
  Remarks: string|null;
  BudgetedAmount: number;
}

export const manpowerAllocationDetailsDecoder: Decoder<ManpowerAllocationDetails> = object({
  Id: number,
  ContractId: number,
  CustomerSiteId: number,
  CustomerAgreedAmount: number,
  EmployeeId: number,
  BudgetedAmount: number,
  StartDate: nullable(string),
  EndDate: nullable(string),
  AllocationStatusId: number,
  Remarks: nullable(string)
});

export interface ContractManpowerAllocation {
  AllocationDetails: ManpowerAllocationDetails;
}

export const contractManpowerAllocationDecoder: Decoder<ContractManpowerAllocation> = object({
  AllocationDetails: manpowerAllocationDetailsDecoder
});