import { Decoder, array, nullable, number, object, string } from "decoders";

export interface PmScheduleList {
    Id: number;
    PmScheduleNumber: string;
    PmDueDate: null | string;
    PeriodFrom: null | string;
    PeriodTo: null | string;
    AssetCount: null | number;
}

export const pmScheduleListDecoder: Decoder<PmScheduleList> = object({
    Id: number,
    PmScheduleNumber: string,
    PmDueDate: nullable(string),
    PeriodTo: nullable(string),
    PeriodFrom: nullable(string),
    AssetCount: nullable(number),
});

export interface PmScheduleListDetail {
    PmSchedules: PmScheduleList[],
}

export const pmScheduleListDetailDecoder: Decoder<PmScheduleListDetail> = object({
    PmSchedules: array(pmScheduleListDecoder),
});

export interface PmScheduleDetail {
    Id: number;
    PmScheduleNumber: string;
    ProductSerialNumber: string;
    PmDate: string | null
    PmEngineer: string | null
    PmVendorBranch: string | null
    PmNote: string | null;
}

export const pmScheduleDetailDecoder: Decoder<PmScheduleDetail> = object({
    Id: number,
    PmScheduleNumber: string,
    ProductSerialNumber: string,
    PmDate: nullable(string),
    PmEngineer: nullable(string),
    PmVendorBranch: nullable(string),
    PmNote: nullable(string)
});

export interface PmScheduleView {
    PmScheduleDetails: PmScheduleDetail[],
}

export const pmScheduleViewDecoder: Decoder<PmScheduleView> = object({
    PmScheduleDetails: array(pmScheduleDetailDecoder),
});