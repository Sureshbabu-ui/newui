import { array, boolean, Decoder, iso8601, nullable, object, optional, string } from 'decoders';

export interface ContractCreated {
	CustomerInfoId: number | string;
	BaseLocation: number | string;
	AgreementType: number | string;
	BookingType: number | string;
	BookingDate: Date | string | typeof iso8601;
	BookingValueDate: Date | string | typeof iso8601;
	QuotationReferenceNumber: string;
	PoNumber: string;
	PoDate: Date | string | typeof iso8601;
	PoValue: number | string;
	StartDate: Date | string | typeof iso8601;
	EndDate: Date | string | typeof iso8601;
	IsMultiSite: Boolean;
	ServiceMode: number | string;
	PaymentMode: number | string;
	PaymentFrequency: number | string;
	NeedPm: Boolean;
	PmFrequency: number | string;
	SalesContactPerson: number | string;
	CallExpiryDate: Date | string | typeof iso8601;
	CallStopDate: Date | string | typeof iso8601;
	CallStopReason: string;
}
export const contractDecoder: Decoder<ContractCreated> = object({
	CustomerInfoId: string,
	BaseLocation: string,
	AgreementType: string,
	BookingType: string,
	BookingDate: iso8601,
	BookingValueDate: iso8601,
	QuotationReferenceNumber: string,
	PoNumber: string,
	PoDate: iso8601,
	PoValue: string,
	StartDate: iso8601,
	EndDate: iso8601,
	IsMultiSite: boolean,
	ServiceMode: string,
	PaymentMode: string,
	PaymentFrequency: string,
	NeedPm: boolean,
	PmFrequency: string,
	SalesContactPerson: string,
	CallExpiryDate: iso8601,
	CallStopDate: iso8601,
	CallStopReason: string
});

export interface ContractData {
	IsContractCreated: Boolean;
}

export const createDecoder: Decoder<ContractData> = object({
	IsContractCreated: boolean,
});

export interface PreAmcScheduledResponse {
	IsPreAmcScheduled: Boolean;
}

export const PreAmcScheduledResponseDecoder: Decoder<PreAmcScheduledResponse> = object({
	IsPreAmcScheduled: boolean
});