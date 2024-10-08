import { number, Decoder, nullable, object, string, boolean, array } from 'decoders';

export interface ContractInvoicePrerequisite {
    Id?: number | null | string,
    IsActive: Boolean,
    InvoicePrerequisiteId: number,
    DocumentName?: string | null 
}

export const contractInvoicePrerequisiteDecoder: Decoder<ContractInvoicePrerequisite> = object({
    Id: nullable(number),
    IsActive: boolean,
    InvoicePrerequisiteId: number,
    DocumentName: nullable(string)
})

export interface ContractInvoicePrerequisites {
    ContractInvoicePrerequisites: ContractInvoicePrerequisite[];
}

export const contractInvoicePrerequisitesDecoder: Decoder<ContractInvoicePrerequisites> = object({
    ContractInvoicePrerequisites: array(contractInvoicePrerequisiteDecoder),
});