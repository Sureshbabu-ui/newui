import axios from "axios";
import { guard } from "decoders";
import { ContractInvoicePrerequisites, contractInvoicePrerequisitesDecoder } from "../types/contractInvoicePrerequisite";
import settings from "../config/settings";
import { setupInterceptorsTo } from "../interceptor";

axios.defaults.baseURL = settings.baseApiUrl;
setupInterceptorsTo(axios) 

export const getContractInvoicePrerequisite=async(ContractId: string): Promise<ContractInvoicePrerequisites>=> {
    return guard(contractInvoicePrerequisitesDecoder)((await axios.get(`contractinvoiceprerequisite/get/all?ContractId=${ContractId}`)).data.data);
} 