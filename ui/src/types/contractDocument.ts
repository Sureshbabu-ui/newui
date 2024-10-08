import { Decoder, array, boolean, iso8601, number, object, string, optional } from 'decoders';

export interface ContractDocumentCreation {
  ContractId: string;
  DocumentUrl: string;
  DocumentCategoryId: string;
  DocumentFile: File | null;
  DocumentTypeId: number | string;
  DocumentSize: number | string;
  DocumentDescription: string | null;
}

export interface ContractDocumentList {
  Id: number;
  ContractId: number;
  DocumentUrl: string;
  DocumentType: string;
  DocumentCategory: string;
  DocumentSize: number;
  DocumentUploadedName: string;
  DocumentDescription: string;
  CreatedUserName: string;
}

export const contractDocumentListDecoder: Decoder<ContractDocumentList> = object({
  Id: number,
  ContractId: number,
  DocumentUrl: string,
  DocumentType: string,
  DocumentCategory: string,
  DocumentSize: number,
  DocumentUploadedName: string,
  DocumentDescription: string,
  CreatedUserName: string
});

export interface MultipleContractDocumentList {
  ContractDocumentList: ContractDocumentList[];
  TotalRows: number;
  PerPage:number;
}

export const multipleContractDocumentListDecoder: Decoder<MultipleContractDocumentList> = object({
  ContractDocumentList: array(contractDocumentListDecoder),
  TotalRows: number,
  PerPage:number
});

export interface EntitiesDetails {
  Id: number;
  Name: string;
}

export interface ContractDocumentData {
  IsContractDocumentCreated: Boolean;
}

export const contractDocumentDataDecoder: Decoder<ContractDocumentData> = object({
  IsContractDocumentCreated: boolean,
});

export interface ContractDocumentDownload {
  DocumentUrl: string;
}

export const contractDocumentDownloadDecoder: Decoder<ContractDocumentDownload> = object({
  DocumentUrl: string
})
