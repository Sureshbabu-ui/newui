import axios from "axios";
import { guard, object } from "decoders";
import { Err, Ok, Result } from "@hqoss/monads";
import { GenericErrors, genericErrorsDecoder } from "../types/error";
import { ImprestStock, ImprestStockResponse, imprestStockResponseDecoder } from "../types/impreststock";
import { CreateDC } from "../types/deliverychallan";
import settings from "../config/settings";
import { setupInterceptorsTo } from "../interceptor";

axios.defaults.baseURL = settings.baseApiUrl;
setupInterceptorsTo(axios) 

export async function CreateImprestStockForCustomer(impreststock: ImprestStock,deliveryChallan?:CreateDC): Promise<Result<ImprestStockResponse, GenericErrors>> {
    try {
        const { data } = await axios.post('impreststock/create/for/customer', {impreststock,deliveryChallan});
        return Ok(guard(object({ data: imprestStockResponseDecoder }))(data).data);
    } catch ({ response: { data } }) {
        return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
    }
}