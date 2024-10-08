import { Decoder, array, boolean, nullable, number, object, string } from "decoders";

export interface CustomerGroupCreate {
  GroupCode: string;
  GroupName: string;
}

export interface CustomerGroupUpdate {
  Id: number;
  GroupName: string;
}

export interface CustomerGroupCreateResult {
  IsCustomerGroupCreated: Boolean;
}

export const customerGroupCreateResultDecoder: Decoder<CustomerGroupCreateResult> = object({
  IsCustomerGroupCreated: boolean,
});

export interface CustomerGroupUpdatedResult {
  IsCustomerGroupUpdated: Boolean;
}

export const customerGroupUpdatedResultDecoder: Decoder<CustomerGroupUpdatedResult> = object({
  IsCustomerGroupUpdated: boolean,
});


export interface CustomerGroupDetails {
  Id: number;
  GroupCode: string;
  GroupName: string;
  CreatedBy: string;
  CreatedOn: string;
}

export interface CustomerGroupList {
  CustomerGroups: CustomerGroupDetails[]
  TotalRows: number;
  PerPage:number;
}

export const customerGroupDetailsDecoder: Decoder<CustomerGroupDetails> = object({
  Id: number,
  GroupCode: string,
  GroupName: string,
  CreatedBy: string,
  CreatedOn: string
})

export const customerGroupListDecoder: Decoder<CustomerGroupList> = object({
  CustomerGroups: array(customerGroupDetailsDecoder),
  TotalRows: number,
  PerPage:number
});

export interface EntityDetails {
  Id: number;
  GroupName: string;
}

export const entityDetailsDecoder: Decoder<EntityDetails> = object({
  Id: number,
  GroupName: string,
});

export interface GroupNames {
  CustomerGroupNames: EntityDetails[];
}

export const customerGroupNamesDecoder: Decoder<GroupNames> = object({
  CustomerGroupNames: array(entityDetailsDecoder),
});

export interface CustomerGroupDeleted {
  IsDeleted: Boolean;
}

export const customergroupDeletedDecoder: Decoder<CustomerGroupDeleted> = object({
  IsDeleted: boolean,
});

