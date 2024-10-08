import { Decoder, array, nullable, number, object, string } from "decoders";

export interface callStopExpiryCount {
    Id: number
    CallStopDate: string | null;
    ContractNumber: string | null;
    CustomerName: string | null;
}

export const callStopExpiryCountDecoder: Decoder<callStopExpiryCount> = object({
    CallStopDate: nullable(string),
    ContractNumber: nullable(string),
    CustomerName: nullable(string),
    Id: number
});

export interface callStopExpiryCounts {
    ExpiringCallsCount: callStopExpiryCount[];
}

export const callStopExpiryCountsDecoder: Decoder<callStopExpiryCounts> = object({
    ExpiringCallsCount: array(callStopExpiryCountDecoder),
});

export interface CallStopCount {
    TotalCallStopped: number | null
    Tonightcallstop: number | null
}

export const CallStopCountDecoder: Decoder<CallStopCount> = object({
    TotalCallStopped: nullable(number),
    Tonightcallstop: nullable(number),
});