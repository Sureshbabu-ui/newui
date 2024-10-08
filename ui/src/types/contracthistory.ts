import { array, number, Decoder, nullable, object, string, boolean } from 'decoders';

export interface SelectedContractVersion {
    Id: number;
    ContractId: number;
    ContractNumber: string | null;
    CustomerName: string;
    AccelLocation: string;
    AgreementType: string;
    BookingType: string;
    BookingDate: string;
    BookingValueDate: string;
    QuotationReferenceNumber: string | null;
    QuotationReferenceDate: string | null;
    PoNumber: string;
    PoDate: string;
    ContractValue: number | string;
    AmcValue: number | string;
    FmsValue: number | string;
    StartDate: string;
    EndDate: string;
    IsMultiSite: Boolean;
    IsBackToBackAllowed: Boolean;
    IsSez: Boolean,
    SiteCount: number | null;
    ServiceMode: null | string;
    PaymentMode: null | string;
    ServiceWindow: null | string;
    BackToBackScope: null | string;
    PaymentFrequency: null | string;
    PerformanceGuaranteeAmount: number | null;
    IsPmRequired: Boolean | string;
    IsStandByFullUnitRequired: Boolean | string;
    IsStandByImprestStockRequired: Boolean | string;
    IsPreAmcNeeded: Boolean | string;
    IsPerformanceGuaranteeRequired: Boolean,
    PmFrequency: number | string | null;
    SalesContactPerson: null | string;
    CallExpiryDate: string | null;
    CallStopDate: string | null;
    CallStopReason: string | null;
    CreatedOn: string;
    CreatedBy: string;
    UpdatedOn: string | null;
    UpdatedBy: string | null;
    EffectiveFrom: string;
    EffectiveTo: string;
}

export const selectedcontractVersionDecoder: Decoder<SelectedContractVersion> = object({
    Id: number,
    ContractId: number,
    ContractNumber: nullable(string),
    CustomerName: string,
    AccelLocation: string,
    AgreementType: string,
    BookingType: string,
    BookingDate: string,
    BookingValueDate: string,
    QuotationReferenceNumber: nullable(string),
    QuotationReferenceDate: nullable(string),
    PoNumber: string,
    PoDate: string,
    ContractValue: number,
    AmcValue: number,
    FmsValue: number,
    StartDate: string,
    EndDate: string,
    IsMultiSite: boolean,
    IsBackToBackAllowed: boolean,
    SiteCount: nullable(number),
    PerformanceGuaranteeAmount: nullable(number),
    ServiceMode: nullable(string),
    ServiceWindow: nullable(string),
    BackToBackScope: nullable(string),
    PaymentMode: nullable(string),
    PaymentFrequency: nullable(string),
    IsPmRequired: boolean,
    IsStandByFullUnitRequired: boolean,
    IsStandByImprestStockRequired: boolean,
    IsPreAmcNeeded: boolean,
    IsSez: boolean,
    IsPerformanceGuaranteeRequired: boolean,
    PmFrequency: nullable(string),
    SalesContactPerson: nullable(string),
    CallExpiryDate: nullable(string),
    CallStopDate: nullable(string),
    CallStopReason: nullable(string),
    CreatedOn: string,
    CreatedBy: string,
    UpdatedOn: nullable(string),
    UpdatedBy: nullable(string),
    EffectiveFrom: string,
    EffectiveTo: string
});

export interface ContractVersion {
    ContractVersions: SelectedContractVersion[];
    TotalRows: number;
}

export const contractversionDecoder: Decoder<ContractVersion> = object({
    ContractVersions: array(selectedcontractVersionDecoder),
    TotalRows: number
});