import { Decoder, array, boolean, nullable, number, object, string } from "decoders";

export interface GoodsReceivedNoteList {
	Id: number;
	GrnNumber: string;
	GrnDate: string;
	TransactionType: string;
	ReferenceNumber: string | null;
	ReferenceDate:string | null;
	TransactionTypeCode: string;
	PoNumber: string | null;
	DCNumber: string | null;
	ReceivedBy: string;
	SourceLocation: string | null;
	SourceEngineer: string | null;
	SourceVendor: string | null;
	IsProcessed: boolean;
	ReceivedLocation: string;
}

export const goodsReceivedNoteListDecoder: Decoder<GoodsReceivedNoteList> = object({
	Id: number,
	GrnNumber: string,
	GrnDate: string,
	TransactionType: string,
	ReferenceNumber: nullable(string),
	ReferenceDate:nullable(string),
	TransactionTypeCode: string,
	PoNumber: nullable(string),
	DCNumber: nullable(string),
	ReceivedBy: string,
	SourceLocation: nullable(string),
	SourceEngineer: nullable(string),
	SourceVendor: nullable(string),
	IsProcessed: boolean,
	ReceivedLocation: string
});

export interface GRNList {
	GoodsReceivedNoteList: GoodsReceivedNoteList[],
	TotalRows: number;
	PerPage: number;
}

export const grnListDecoder: Decoder<GRNList> = object({
	GoodsReceivedNoteList: array(goodsReceivedNoteListDecoder),
	TotalRows: number,
	PerPage: number
});

export interface TransactionTypes {
	Id: number;
	TransactionType: string;
	TransactionTypeCode: string;
}

export const transactionTypesDecoder: Decoder<TransactionTypes> = object({
	Id: number,
	TransactionType: string,
	TransactionTypeCode: string
});

export interface GrnTransactionTypes {
	Transactiontypes: TransactionTypes[];
}

export const grnTransactionTypesDecoder: Decoder<GrnTransactionTypes> = object({
	Transactiontypes: array(transactionTypesDecoder),
});

export interface Select {
	value: any,
	label: any,
	code?: any
}

export interface SelectDetails {
	Select: Select[]
}

export interface CreateGoodsReceivedNote {
	TransactionId: number;
	TransactionTypeCode: string;
	Remarks: string;
	SourceVendorId: number | null;
	SourceLocationId: number | null;
	SourceEngineerId: number | null;
	ReferenceNumber: string | null;
	ConfirmReferenceNumber: string;
	ReferenceDate: string | null
}

export interface CreateGRNResponse {
	IsGrnCreated: Boolean;
	GoodsReceivedNoteId: number;
}

export const createGRNResponseDecoder: Decoder<CreateGRNResponse> = object({
	IsGrnCreated: boolean,
	GoodsReceivedNoteId: number
});

export interface CreateGoodsReceivedNoteDetails {
	GoodsReceivedNoteId: number;
	PartId: number;
	PartName: string | null;
	SerialNumber: string | null;
	Rate: number;
	HsnCode: string | null;
	OemPartNumber: string | null;
	PartCode: string | null;
	Id: number;
}

export interface CreateGRNDetailResponse {
	IsGRNDetailCreated: boolean;
}

export const createGRNDetailResponseDecoder: Decoder<CreateGRNDetailResponse> = object({
	IsGRNDetailCreated: boolean,
});

export interface CreateGRNDetail {
	Id: number;
	GoodsReceivedNoteId: number;
	GrnNumber: string;
	PartId: number;
	PartName: string;
	HsnCode: string;
	OemPartNumber: string;
	PartCode: string;
	Quantity: number;
	SerialNumber: string | null;
	Barcode: string;
	Rate: number;
}

export interface GoodsReceivedNoteDetail {
	Id: number;
	GoodsReceivedNoteId: number;
	GrnNumber: string;
	PartId: number;
	PartName: string;
	HsnCode: string;
	OemPartNumber: string;
	PartCode: string;
	Quantity: number;
	SerialNumber: string | null;
	Barcode: string | null;
	Rate: number | null;
	StockTypeId: number | null;
	PartStockId: number | null;
}

export const goodsReceivedNoteDetailDecoder: Decoder<GoodsReceivedNoteDetail> = object({
	Id: number,
	GoodsReceivedNoteId: number,
	GrnNumber: string,
	PartId: number,
	PartName: string,
	HsnCode: string,
	OemPartNumber: string,
	PartCode: string,
	Quantity: number,
	SerialNumber: nullable(string),
	Barcode: nullable(string),
	Rate: nullable(number),
	StockTypeId: nullable(number),
	PartStockId: nullable(number)
});

export interface GRNDetail {
	GoodsReceivedNote: GoodsReceivedNoteDetail[];
	GrnTransactionTypeCode: string;
}

export const grnDetailDecoder: Decoder<GRNDetail> = object({
	GoodsReceivedNote: array(goodsReceivedNoteDetailDecoder),
	GrnTransactionTypeCode: string
});

export interface GoodsReceivedNoteDetailList {
	Id: number;
	SerialNumber: string | null;
	Rate: string;
	PartName: string;
	PartCode: string;
	HsnCode: string;
	PoNumber: string | null;
	OemPartNumber: string;
}

export const goodsReceivedNoteDetailListDecoder: Decoder<GoodsReceivedNoteDetailList> = object({
	Id: number,
	SerialNumber: nullable(string),
	Rate: string,
	PartName: string,
	PartCode: string,
	HsnCode: string,
	PoNumber: nullable(string),
	OemPartNumber: string
});

export interface GRNDList {
	GoodsReceivedNoteDetailList: GoodsReceivedNoteDetailList[],
	TotalRows: number;
	PerPage: number;
}

export const grndListDecoder: Decoder<GRNDList> = object({
	GoodsReceivedNoteDetailList: array(goodsReceivedNoteDetailListDecoder),
	TotalRows: number,
	PerPage: number
});


export interface PartReturnList {
	Id: number;
	SerialNumber: string | null;
	WorkOrderNumber: string;
	PartName: string;
	ReturnedPartType: string;
	ReturnInitiatedOn: string;
	ReturnInitiatedBy: string;
	ReceivingLocation:string;
	ReceivingLocationId:number;
}

export const partReturnListDecoder: Decoder<PartReturnList> = object({
	Id: number,
	SerialNumber: nullable(string),
	WorkOrderNumber: string,
	PartName: string,
	ReturnedPartType: string,
	ReturnInitiatedOn: string,
	ReturnInitiatedBy: string,
	ReceivingLocation: string,
	ReceivingLocationId: number
});

export interface ListOfPartReturns {
	PartReturnList: PartReturnList[],
	TotalRows: number;
	PerPage: number;
}

export const listOfPartReturnsDecoder: Decoder<ListOfPartReturns> = object({
	PartReturnList: array(partReturnListDecoder),
	TotalRows: number,
	PerPage: number
});