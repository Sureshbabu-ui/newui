import { Decoder, array, object,number,string } from "decoders";
import { Select } from "./contract";

export interface BookingDetailReport {
    DateFrom: string;
    DateTo: string;
    TenantRegionId:number;
    CustomerId:number;
    TenantOfficeId:number;
    AgreementTypeId:number;
    ContractStatusId:number;
  }

  export interface TenantRegion {
    Id: number;
    RegionName: string;
  }
  export const tenantregionDecoder: Decoder<TenantRegion> = object({
    Id: number,
    RegionName: string
  });

  export interface RegionNames {
    RegionNames: TenantRegion[];
}

export const regionNamesNamesDecoder: Decoder<RegionNames> = object({
    RegionNames: array(tenantregionDecoder),
});