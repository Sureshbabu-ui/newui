import { Decoder, array, boolean, nullable, number, object, string } from "decoders";

export interface TenentForCreation {
  Name: string;
  NameOnPrint: string;
  Address: string;

}
export interface TenantData {
  IsTenantCreated: Boolean;
}

export const tenantDataDecoder: Decoder<TenantData> = object({
  IsTenantCreated: boolean
})

export interface TenantList {
  Id: number,
  TenantCode: string,
  TenantId: string,
  Name: string;
  NameOnPrint: string;
  CreatedOn: string;
  IsVerified: string;
}

export const tenantDetailsDecoder: Decoder<TenantList> = object({
  Id: number,
  TenantCode: string,
  TenantId: string,
  Name: string,
  NameOnPrint: string,
  CreatedOn: string,
  IsVerified: string
});

export interface MultipleTenantDetails {
  Tenants: TenantList[];
  TotalRows: number;
  PerPage: number;
}

export const multipleTenantDetailsDecoder: Decoder<MultipleTenantDetails> = object({
  Tenants: array(tenantDetailsDecoder),
  TotalRows: number,
  PerPage: number
});

export interface SelectedTenantDetails {
  TenantCode: string;
  Name: string;
  NameOnPrint: string;
  CreatedOn: string;
  CreatedBy: string;
  EffectiveFrom: string;
  EffectiveTo: string | null;
  CWHAddress: string;
  GRCAddress: string;
  HOAddress: string;
  PanNumber: string;
  Country: string;
  TenantState: string;
  City: string;
  Pincode: string;
  Address: string;
}
export const selectedtenantDetailDecoder: Decoder<SelectedTenantDetails> = object({
  TenantCode: string,
  Name: string,
  NameOnPrint: string,
  CreatedOn: string,
  CreatedBy: string,
  EffectiveFrom: string,
  EffectiveTo: nullable(string),
  CWHAddress: string,
  GRCAddress: string,
  HOAddress: string,
  PanNumber: string,
  Country: string,
  TenantState: string,
  City: string,
  Pincode: string,
  Address: string

});

export interface SelectedTenant {
  TenantDetails: SelectedTenantDetails[];
}

export const selectedtenantDetailsDecoder: Decoder<SelectedTenant> = object({
  TenantDetails: array(selectedtenantDetailDecoder),
});

export interface TenantUpdateDetails {
  TenantId?: number
  Name: string;
  NameOnPrint: string;
  PanNumber: string;
  CWHAddress: string;
  GRCAddress: string;
  HOAddress: string;
  Address: string;
  Pincode: string,
  City: number;
  State: number;
  Country: number;
  Id: number;
  CWHId: number,
  GRCId: number,
  HDOFId: number,
}
export const tenantUpdateDetailDecoder: Decoder<TenantUpdateDetails> = object({
  Name: string,
  NameOnPrint: string,
  PanNumber: string,
  CWHAddress: string,
  GRCAddress: string,
  HOAddress: string,
  Id: number,
  Address: string,
  City: number,
  State: number,
  Country: number,
  Pincode: string,
  CWHId: number,
  GRCId: number,
  HDOFId: number,
});

export interface TenantUpdate {
  TenantDetails: TenantUpdateDetails
}

export const tenantUpdateDetailsDecoder: Decoder<TenantUpdate> = object({
  TenantDetails: (tenantUpdateDetailDecoder),
});

export interface UpdateTenant {
  IsTenantUpdated: Boolean;
}

export const updateTenantDecoder: Decoder<UpdateTenant> = object({
  IsTenantUpdated: boolean
})

export interface Select {
  value: any,
  label: any,
  code?: any
}

export interface SelectDetails {
  Select: Select[]
}

export interface TenantSelectDetails {
  States: Select[],
  Countrys: Select[],
  Cities: Select[],
}