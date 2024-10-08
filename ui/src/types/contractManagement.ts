import { array, number, Decoder, nullable, object, string, boolean, iso8601 } from 'decoders';

export interface ExistedContract {
	Id: number;
	CustomerName: string;
	BaseLocationName: string;
	AgreementTypeName: string;
	BookingTypeName: string;
	CustomerInfoId: number;
  	IsDeleted: Boolean;
}

export const existedcontractDecoder: Decoder<ExistedContract> = object({
	Id: number,
	CustomerName: string,
	CustomerInfoId:number,
	BaseLocationName: string,
	AgreementTypeName: string,
	BookingTypeName: string,
  	IsDeleted: boolean,
});

export interface MultipleExistedContracts {
  contracts: ExistedContract[];
  totalRows: number;
}

export const multipleExistedContractsDecoder: Decoder<MultipleExistedContracts> = object({
  contracts: array(existedcontractDecoder),
  totalRows: number,
});

export interface UsersFilters {
  limit?: number;
  offset?: number;
}

export interface FeedFilters {
  limit?: number;
  offset?: number;
}

export interface ContractForCreation {
  CustomerInfoId: number |string;
  BaseLocation: number |string;
  AgreementType: number |string;
  BookingType: number |string;
  BookingDate : Date;
	BookingValueDate:Date;
	QuotationReferenceNumber:string;
	PoNumber:string;
	PoDate:Date;
	PoValue : number |string;
	StartDate:Date;
	EndDate:Date;
	IsMultiSite:Boolean;
	ServiceMode:number;
	PaymentMethod:number
	PaymentFrequency:number;
	NeedPm:Boolean;
	PmFrequency:number;
	SalesContactPerson:number;
	CallExpiryDate:Date;
	CallStopDate:Date;
	CallStopReason:string;
}