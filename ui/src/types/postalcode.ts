import { array, Decoder, number, object, string } from "decoders";

export interface PostalCodeDetails {
    Id: number;
    Pincode: string;
    CountryId: number;
    StateId: number;
    CityId: number;
}

export const postalcodeDetailsDecoder: Decoder<PostalCodeDetails> = object({
    Id: number ,
    Pincode: string ,
    CountryId: number ,
    StateId: number ,
    CityId: number ,
})

export interface PostalCodeList {
    PostalCodeList: PostalCodeDetails[]
}

export const postalcodeListDecoder: Decoder<PostalCodeList> = object({
    PostalCodeList: array(postalcodeDetailsDecoder)
});