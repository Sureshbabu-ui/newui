import { Decoder, array, number, object, string, dict } from "decoders";

export interface LookupList {
    Id: number;
    Code: string;
    Name: string;
}

export interface MultipleLookupDetails {
    [key: string]: LookupList[];
}

export const lookupDetailsDecoder: Decoder<LookupList> = object({
    Id: number,
    Code: string,
    Name: string,
});

export const multipleLookupDetailsDecoder: Decoder<MultipleLookupDetails> = dict(array(lookupDetailsDecoder));
