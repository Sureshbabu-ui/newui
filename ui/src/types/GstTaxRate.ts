import { Decoder, array, boolean, nullable, number, object, string } from "decoders";

export interface GstTaxRateListDetail {
    Id: number | null;
    TenantServiceCode: string | null;
    TenantServiceName: string | null;
    ServiceAccountCode: string | null;
    ServiceAccountDescription: string | null;
    Cgst: number | null;
    Sgst: number | null;
    Igst: number | null;
    IsActive: Boolean ;
    CreatedBy: string | null;
}

export const GstTaxRateListDetailDecoder: Decoder<GstTaxRateListDetail> = object({
    Id: number,
    TenantServiceCode: string,
    TenantServiceName: string,
    ServiceAccountCode: string,
    ServiceAccountDescription: nullable(string),
    Cgst: nullable(number),
    Sgst: nullable(number),
    Igst: nullable(number),
    IsActive: boolean,
    CreatedBy: string
});

export interface GstTaxRateList {
    GstRateList: GstTaxRateListDetail[]
}

export const GstTaxRateListDecoder: Decoder<GstTaxRateList> = object({
    GstRateList: array(GstTaxRateListDetailDecoder)
  })
  
//  Edit
export interface GstTaxRateEdit {
    Id:number | null;
    TenantServiceName: string|null;
    ServiceAccountDescription: string|null;
    Cgst:null|number;
    Sgst:null|number;
    Igst:null|number
    IsActive: Boolean;
}

export interface GstTaxRateEditResponse {
    IsGstUpdated: Boolean;
}

export const editDecoder: Decoder<GstTaxRateEditResponse> = object({
    IsGstUpdated: boolean,
});
