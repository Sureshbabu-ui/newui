import axios from "axios";
import { guard } from "decoders";
import { PostalCodeList, postalcodeListDecoder } from "../types/postalcode";

export const getPostalCodeList = async (Pincode?: string): Promise<PostalCodeList> => {
    let url = `postalcode/get/filtered/list?`;
    if (Pincode) {
        url += `Pincode=${Pincode}`;
    }
    return guard(postalcodeListDecoder)((await axios.get(url)).data.data);
}