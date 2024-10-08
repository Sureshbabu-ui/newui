import { Decoder, array, number, object, string } from "decoders";

export interface ContractRevenueRecognitionListDetail {
    AmcValue: number;
    ManPowerValue: number;
    OfficeName: string;
}

export const contractRevenueRecognitionListDetailDecoder: Decoder<ContractRevenueRecognitionListDetail> = object({
    AmcValue: number,
    ManPowerValue: number,
    OfficeName: string
});

export interface ContractRevenueRecognitionList {
    RevenueRecognitionList: ContractRevenueRecognitionListDetail[];
}

export const contractRevenueRecognitionListDecoder: Decoder<ContractRevenueRecognitionList> = object({
    RevenueRecognitionList: array(contractRevenueRecognitionListDetailDecoder)
});

export interface ContractRevenueRecognitionFilter {
    StartDate: string | null;
    EndDate: string | null;
}