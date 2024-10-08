import { Decoder, array, nullable, number, object, string, boolean } from "decoders";

export interface FutureUpdatesDetails {
    Id: number;
    ContractNumber: null | string;
    SerialNumber: null | string;
    RenewedMergedContractNumber: null | string;
    TargetDate: null |string;
    ProbabilityPercentage: number;
    ContractFutureUpdateStatus: string;
    ContractFutureUpdateSubStatus: string;
  StatusId: number;
   SubStatusId: number;
    CreatedBy: string | null;
    CreatedOn: string | null;
    UpdatedOn: string | null;
    UpdatedBy: string | null;
}

export const futureUpdateDetailsDecoder: Decoder<FutureUpdatesDetails> = object({
    Id: number,
    ContractNumber: nullable(string),
    SerialNumber: nullable(string),
    TargetDate: nullable(string),
    ProbabilityPercentage: number,
    RenewedMergedContractNumber: nullable(string),
    ContractFutureUpdateStatus: string,
    ContractFutureUpdateSubStatus: string,
    StatusId: number,
    SubStatusId: number,
    CreatedBy: nullable(string),
    CreatedOn: nullable(string),
    UpdatedBy: nullable(string),
    UpdatedOn: nullable(string)
});
export interface FutureUpdatesList {
    FutureUpdates: FutureUpdatesDetails[],
}

export const futureUpdateListDecoder: Decoder<FutureUpdatesList> = object({
    FutureUpdates: array(futureUpdateDetailsDecoder),
});
//create
export interface FutureUpdatesCreate {
    ContractId: number | null;
    TargetDate: string | null;
    ProbabilityPercentage: number | null;
    RenewedMergedContractNumber: string;
    StatusId: number | null;
    SubStatusId: number | null;
}
export interface FutureUpdatesCreateResponse {
    IsFutureUpdateCreated: Boolean;
}
export const createDecoder: Decoder<FutureUpdatesCreateResponse> = object({
    IsFutureUpdateCreated: boolean,
});
interface Select {
    value: any,
    label: any,
    Code?: any,
}
export interface SelectDetails {
    Select: Select[]
}
export interface FutureUpdatesMasterDataItems {
    ContractFutureUpdateStatus: Select[],
    ContractFutureUpdateSubStatus: Select[]
}
export interface OldContractDetail {
    oldcontractdetails: string | null
}

export const oldContractDetailDecoder: Decoder<OldContractDetail> = object({
    oldcontractdetails: nullable(string),
});
// Future Update Edit
export interface FutureUpdateEdit {
    Id:number;
    TargetDate: string | null;
    ProbabilityPercentage: number;
    StatusId: number;
    SubStatusId: number;
}
export interface FutureUpdateEditResponse {
    IsFutureUpdateUpdated: Boolean;
}
export const editDecoder: Decoder<FutureUpdateEditResponse> = object({
    IsFutureUpdateUpdated: boolean
});
export interface FutureUpdateDeleted {
    IsDeleted: Boolean;
  }
  
  export const FutureUpdateDeletedDecoder: Decoder<FutureUpdateDeleted> = object({
    IsDeleted: boolean,
  });