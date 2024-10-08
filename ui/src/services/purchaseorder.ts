import { Err, Ok, Result } from "@hqoss/monads";
import axios from "axios";
import { guard, object } from "decoders";
import { GenericErrors, genericErrorsDecoder } from "../types/error";
import { CreatePOResponse, CreatePurchaseOrder, ListPurchaseOrders, ListPurchaseOrdersDecoder, LocationWisePurchaseOrdersList, PurchaseOrdersList, RequestForPurchaseOrder, RequestPOResponse, createPoResponseDecoder, locationWisePurchaseOrdersListDecoder, purchaseOrderDetails, purchaseOrderDetailsDecoder, purchaseOrdersListDecoder, requestPoResponseDecoder } from "../types/purchaseorder";
import { CWHLocationNames, CWHLocationNamesDecoder, UserTenantOfficeNameInfo, userTenantOfficeInfoNameDecoder } from "../types/user";
import { CreateImprestPurchaseOrder } from "../components/Pages/Inventory/ImprestPurchaseOrder/CreateImprestPurchaseOrder/CreateImprestPurhaseOrder.slice";
import { CreateBulkPurchaseOrder } from "../components/Pages/Inventory/PartIndentRequest/PartIndentDemand/PartIndentDemandListCWH/CreateBulkPO/CreateBulkPO.slice";
import settings from "../config/settings";
import { setupInterceptorsTo } from "../interceptor";

axios.defaults.baseURL = settings.baseApiUrl;
setupInterceptorsTo(axios) 

export async function RequestPOForIndentDemand(requestpodetails: RequestForPurchaseOrder): Promise<Result<RequestPOResponse, GenericErrors>> {
    try {
        const { data } = await axios.put('partindentdemand/requestpo', requestpodetails);
        return Ok(guard(object({ data: requestPoResponseDecoder }))(data).data);
    } catch ({ response: { data } }) {
        return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
    }
}

export async function CreatePOForIndentDemand(createpodetail: CreatePurchaseOrder): Promise<Result<CreatePOResponse, GenericErrors>> {
    try {
        const { data } = await axios.post('purchaseorder/create', createpodetail);
        return Ok(guard(object({ data: createPoResponseDecoder }))(data).data);
    } catch ({ response: { data } }) {
        return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
    }
}

export const downloadPurchaseOrder = async (PoId: number) => {
    const url = `purchaseorder/generatepdf?PoId=${PoId}`;
    return await axios.get(url, {
        responseType: 'blob',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}

export const getLocationWisePurchaseOrders = async (search?: string, index?: number): Promise<LocationWisePurchaseOrdersList> => {
    let url = `purchaseorder/locationwise/list?Page=${index}`;
    if (search) {
        url += `&Search=${search}`;
    }
    return guard(locationWisePurchaseOrdersListDecoder)((await axios.get(url)).data.data);
}

export async function getUserTenantOfficeNameWithCwh(): Promise<CWHLocationNames> {
    return guard(CWHLocationNamesDecoder)((await axios.get(`purchaseorder/cwh/tenantoffice/list`)).data.data);
}

export const getPurchaseOrders = async (search?: string, index?: number): Promise<ListPurchaseOrders> => {
    let url = `purchaseorder/list?Page=${index}`;
    if (search) {
        url += `&Search=${search}`;
    }
    return guard(ListPurchaseOrdersDecoder)((await axios.get(url)).data.data);
}

export const getPurchaseOrderDetails = async (Id: number): Promise<purchaseOrderDetails> => {
    return guard(purchaseOrderDetailsDecoder)((await axios.get(`purchaseorder/details?PoId=${Id}`)).data.data);
}

export async function ImprestPurchaseOrderCreate(createimprestpo: CreateImprestPurchaseOrder): Promise<Result<CreatePOResponse, GenericErrors>> {
    try {
        const { data } = await axios.post('purchaseorder/imprest/create', createimprestpo);
        return Ok(guard(object({ data: createPoResponseDecoder }))(data).data);
    } catch ({ response: { data } }) {
        return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
    }
}

export async function BulkPurchaseOrderCreate(createimprestpo: CreateBulkPurchaseOrder): Promise<Result<CreatePOResponse, GenericErrors>> {
    try {
        const { data } = await axios.post('purchaseorder/Bulk/create', createimprestpo);
        return Ok(guard(object({ data: createPoResponseDecoder }))(data).data);
    } catch ({ response: { data } }) {
        return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
    }
}