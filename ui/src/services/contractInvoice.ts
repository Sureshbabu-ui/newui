import { Err, Ok, Result } from "@hqoss/monads";
import { ContractInvoiceCreateResult, ContractInvoicePendingReasonAdd, ContractInvoicePendingReasonCreateResult, ContractInvoiceSharedResult, ContractInvoiceViewDetails, ContractInvoiceWithDetailCreate, InvoiceInContractList, ShareInvoiceDetail, contractInvoiceCreateResultDecoder, contractInvoicePendingReasonResultDecoder, contractInvoiceSharedResultDecoder, contractInvoiceViewDetailsDecoder, invoiceInContractListDecoder, shareInvoiceDetailDecoder } from "../types/contractInvoice";
import { GenericErrors, genericErrorsDecoder } from "../types/error";
import { guard, object } from "decoders";
import axios from "axios";
import { ShareInvoice } from "../components/Pages/ContractSubMenu/ContractInvoiceSchedule/ContractInvoiceShare/ContractInvoiceShare.slice";
import settings from "../config/settings";
import { setupInterceptorsTo } from "../interceptor";

axios.defaults.baseURL = settings.baseApiUrl;
setupInterceptorsTo(axios) 

export const createContractInvoice = async (contractInvoice: ContractInvoiceWithDetailCreate): Promise<Result<ContractInvoiceCreateResult, GenericErrors>> => {
  try {
    const { data } = await axios.post('contractinvoice/create', contractInvoice);
    return Ok(guard(object({ data: contractInvoiceCreateResultDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}

export const getContractInvoiceDetails = async (contractInvoiceId: string): Promise<ContractInvoiceViewDetails> => {
  const url = `contractinvoice/get/details?ContractInvoiceId=${contractInvoiceId}`;
  return guard(contractInvoiceViewDetailsDecoder)((await axios.get(url)).data.data);
}

export const getFilteredInvoicesByContract = async (ContractId: number | string): Promise<InvoiceInContractList> => {
  return guard(invoiceInContractListDecoder)((await axios.get(`contractinvoice/get/all/by/contract?ContractId=${ContractId}`)).data.data);
}

export const getFilteredInvoicesByCustomer = async (CustomerInfoId: number | string): Promise<InvoiceInContractList> => {
  return guard(invoiceInContractListDecoder)((await axios.get(`contractinvoice/get/all/by/customer?CustomerInfoId=${CustomerInfoId}`)).data.data);
}

export const addContractInvoicePendingReason = async (contractInvoice: ContractInvoicePendingReasonAdd): Promise<Result<ContractInvoicePendingReasonCreateResult, GenericErrors>> => {
  try {
    console.log(contractInvoice, "service")
    const { data } = await axios.post('contractinvoice/add/pendingreason', contractInvoice);
    return Ok(guard(object({ data: contractInvoicePendingReasonResultDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}

export const downloadContractInvoice=async(ContractInvoiceId: string) =>{
  const url = `contractinvoice/generatepdf?ContractInvoiceId=${ContractInvoiceId}`;
  return await axios.get(url, {
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json',
    }
  });
}

export const getAllMailIdList = async (contractInvoiceId: string): Promise<ShareInvoiceDetail> => {
  const url = `contractinvoice/share/info?ContractInvoiceId=${contractInvoiceId}`;
  return guard(shareInvoiceDetailDecoder)((await axios.get(url)).data.data);
}

export const ShareInvoiceDetails = async (contractInvoice: ShareInvoice): Promise<Result<ContractInvoiceSharedResult, GenericErrors>> => {
  try {
    const { data } = await axios.post('contractinvoice/share', contractInvoice);
    return Ok(guard(object({ data: contractInvoiceSharedResultDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}
