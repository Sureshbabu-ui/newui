import axios from "axios";
import { TenantOfficeInfo, tenantOfficeInfoDecoder } from "../types/tenantofficeinfo";
import { guard, object } from "decoders";
import { CreateDC, DCResponse, DeliveryChallanInfo, ListOfDeliveryChallan, dcResponseDecoder, deliveryChallanInfoDecoder, listOfDeliveryChallanDecoder } from "../types/deliverychallan";
import { Err, Ok, Result } from "@hqoss/monads";
import { GenericErrors, genericErrorsDecoder } from "../types/error";
import settings from "../config/settings";
import { setupInterceptorsTo } from "../interceptor";

axios.defaults.baseURL = settings.baseApiUrl;
setupInterceptorsTo(axios) 

export async function getDestinationLocationList(): Promise<TenantOfficeInfo> {
    return guard(tenantOfficeInfoDecoder)((await axios.get(`tenantlocation/destination/locations`)).data.data);
}

export async function CreateDeliveryChallan(requestpodetails: CreateDC): Promise<Result<DCResponse, GenericErrors>> {
    try {
        const { data } = await axios.post('deliverychallan/create', requestpodetails);
        return Ok(guard(object({ data: dcResponseDecoder }))(data).data);
    } catch ({ response: { data } }) {
        return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
    }
}

export const getAllDeliveryChallans = async (search?: string, index?: number): Promise<ListOfDeliveryChallan> => {
    let url = `deliverychallan/list?Page=${index}`;
    if (search) {
        url += `&Search=${search}`;
    }
    return guard(listOfDeliveryChallanDecoder)((await axios.get(url)).data.data);
}

export async function getDeliveryChallanDetails(Id: number): Promise<DeliveryChallanInfo> {
    return guard(deliveryChallanInfoDecoder)((await axios.get(`deliverychallan/details?DCId=${Id}`)).data.data);
}