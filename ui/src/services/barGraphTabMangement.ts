import axios from "axios";
import { CollectionBarGraphDetails, ContractBarGraphDetails, InvoicePendingBarGraphDetails, InvoicePendingBarGraphDetailsDecoder, collectionBarGraphDetailsDecoder, contractBarGraphDetailsDecoder } from "../types/barGraphTabMangement";
import { guard } from "decoders";
import settings from "../config/settings";
import { setupInterceptorsTo } from "../interceptor";

axios.defaults.baseURL = settings.baseApiUrl;
setupInterceptorsTo(axios) 


export async function getContractBarGraphDetails(StartDate: string, EndDate: string, RegionId?: number | null): Promise<ContractBarGraphDetails> {

    let url = `contract/get/bargraphdetails?StartDate=${StartDate}&EndDate=${EndDate}`;
    if (RegionId) {
        url += `&RegionId=${RegionId}`;
    }
    return guard(contractBarGraphDetailsDecoder)((await axios.get(url)).data.data);
}

export async function getCollectionMadeBarGraphDetails(StartDate: string, EndDate: string, RegionId?: number | null): Promise<CollectionBarGraphDetails> {

    let url = `receipt/get/collectionmade/bargraphdetails?StartDate=${StartDate}&EndDate=${EndDate}`;
    if (RegionId) {
        url += `&RegionId=${RegionId}`;
    }
    return guard(collectionBarGraphDetailsDecoder)((await axios.get(url)).data.data);
}

export async function getCollectionPendingBarGraphDetails(StartDate: string, EndDate: string, RegionId?: number | null): Promise<CollectionBarGraphDetails> {

    let url = `receipt/get/collectionpending/bargraphdetails?StartDate=${StartDate}&EndDate=${EndDate}`;
    if (RegionId) {
        url += `&RegionId=${RegionId}`;
    }
    return guard(collectionBarGraphDetailsDecoder)((await axios.get(url)).data.data);
}  

export async function getInvoicePendingBarGraphDetails(StartDate: string, EndDate: string, RegionId?: number | null): Promise<InvoicePendingBarGraphDetails> {

    let url = `contractinvoice/pending/bargraphdetails?StartDate=${StartDate}&EndDate=${EndDate}`;
    if (RegionId) {
        url += `&RegionId=${RegionId}`;
    }
    return guard(InvoicePendingBarGraphDetailsDecoder)((await axios.get(url)).data.data);
}  