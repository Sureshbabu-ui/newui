import { array, boolean, Decoder, nullable, number, object, string } from 'decoders';

export interface PaymentFrequencyDetails {
    Id: number;
    Name: string;
    Code:string;
    CalendarMonths: number;
    IsActive: boolean;
    CreatedByFullName: string;
    CreatedOn: string;
    UpdatedByFullName: null | string;
    UpdatedOn: null | string;
}

export interface PaymentFrequencyCreate {
    Name: string;
    Code: string;
    CalendarMonths: number | string;
    IsActive: string;
}

export interface PaymentFrequencyEdit {
    Name: string;
    Id: number;
    CalendarMonths: number | string;
    IsActive: string;
}

export interface PaymentFrequencyCreateResult {
    IsPaymentFrequencyCreated: Boolean;
}

export const createPaymentFrequencyDecoder: Decoder<PaymentFrequencyCreateResult> = object({
    IsPaymentFrequencyCreated: boolean,
});

export const paymentFrequencyDetailsDecoder: Decoder<PaymentFrequencyDetails> = object({
    Id: number,
    Name: string,
    Code:string,
    CalendarMonths: number,
    IsActive: boolean,
    CreatedByFullName: string,
    CreatedOn: string,
    UpdatedByFullName: nullable(string),
    UpdatedOn: nullable(string)
});

export interface PaymentFrequencyList {
    PaymentFrequencyList: PaymentFrequencyDetails[];
    TotalRows: number
    PerPage:number
}

export const paymentFrequencyListDecoder: Decoder<PaymentFrequencyList> = object({
    PaymentFrequencyList: array(paymentFrequencyDetailsDecoder),
    TotalRows: number,
    PerPage:number
});

export interface PaymentFrequencyDetailsSelect {
    value: any,
    label: any
}

export interface PaymentFrequenciesSelect {
    PaymentFrequencies: PaymentFrequencyDetailsSelect[];
}

export interface PaymentFrequencyName {
    Id: number;
    Name: string;
    Code:string;
    CalendarMonths: number
}

export const paymentFrequencyNameDecoder: Decoder<PaymentFrequencyName> = object({
    Id: number,
    Name: string,
    Code:string,
    CalendarMonths: number
});

export interface PaymentFrequencyNames {
    PaymentFrequencies: PaymentFrequencyName[]
}

export const paymentFrequencyNamesDecoder: Decoder<PaymentFrequencyNames> = object({
    PaymentFrequencies: array(paymentFrequencyNameDecoder)
});

export interface PaymentFrequencyUpdateResult {
    IsPaymentFrequencyUpdated: Boolean;
}

export const updatePaymentFrequencyDecoder: Decoder<PaymentFrequencyUpdateResult> = object({
    IsPaymentFrequencyUpdated: boolean,
});

export interface PaymentFrequencyDeleted {
    IsPaymentFrequencyDeleted: Boolean;
}

export const paymentFrequencyDeletedDecoder: Decoder<PaymentFrequencyDeleted> = object({
    IsPaymentFrequencyDeleted: boolean,
});
