import { Decoder, array, boolean, nullable, number, object, string } from "decoders";

export interface TenantBankAccountCreate {
  TenantId: string|number;
  BankId:string|number;
  BankBranchInfoId: string|number;
  RelationshipManager: string;
  ContactNumber: string;
  Email: string;
  BankAccountTypeId: string|number;
  AccountNumber: string;
}
export interface TenantBankAccountCreateResult {
  IsTenantBankAccountCreated: Boolean;
}

export const createDecoder: Decoder<TenantBankAccountCreateResult> = object({
  IsTenantBankAccountCreated: boolean,
});

export interface TenantBankAccountListDetails {
    Id:number;
    BranchName: string|null;
    RelationshipManager: string;
    ContactNumber: string;
    AccountNumber: string;
  } 

  export interface TenantBankAccountList{
    TenantBankAccounts:TenantBankAccountListDetails[],
    TotalRows: number;
    PerPage:number;
  }

  export const tenantBankAccountListDetailsDecoder : Decoder<TenantBankAccountListDetails> = object({
    Id:number,
    BranchName: nullable(string),
    RelationshipManager: string,
    ContactNumber: string,
    AccountNumber: string,
  });  
  
  export const tenantBankAccountListDecoder: Decoder<TenantBankAccountList> = object({
    TenantBankAccounts: array(tenantBankAccountListDetailsDecoder),
    TotalRows: number,
    PerPage:number
  });

  export interface TenantBankAccountDetails {
    Id:number|null;
    BankName:string|null, 
    BranchName: string|null;
    RelationshipManager: string;
    ContactNumber: string;
    AccountNumber: string;
    Email:string|null;
    BankAccountTypeName:string|null;
    CreatedUserName:string;
    CreatedOn:string|null;
    UpdatedUserName:string|null;
    UpdatedOn:null|string;
  } 

  export const tenantBankAccountDetailsDecoder : Decoder<TenantBankAccountDetails> = object({
    Id:number,
    BankName:nullable(string),  
    BranchName: nullable(string),
    RelationshipManager: string,
    ContactNumber: string,
    AccountNumber: string,
    Email:nullable(string),
    BankAccountTypeName:nullable(string),
    CreatedUserName:string,
    CreatedOn:nullable(string),
    UpdatedUserName:nullable(string),
    UpdatedOn:nullable(string)
  });   

  export interface TenantBankAccountName {
    Id: number;
    BankName:string;
    BranchName: string;
  }
  export const  tenantBankAccountNameDecoder: Decoder<TenantBankAccountName > = object({
    Id: number,
    BankName:string,
    BranchName: string,
  });
  
  export interface TenantBankAccountNameList {
    TenantBankAccounts: TenantBankAccountName [];
  }
  
  export const tenantBankAccountNameListDecoder: Decoder<TenantBankAccountNameList> = object({
    TenantBankAccounts: array( tenantBankAccountNameDecoder),
  });

export interface TenantBankAccountDeleteResponse {
  IsDeleted: Boolean;
}

export const tenantBankAccountDeleteResponseDecoder: Decoder<TenantBankAccountDeleteResponse> = object({
  IsDeleted: boolean
})