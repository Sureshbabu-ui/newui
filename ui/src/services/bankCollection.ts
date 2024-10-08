import axios from "axios";
import { BankCollectionApproveDetail, BankCollectionClaimCancelDetail, BankCollectionClaimCancelResponseData, BankCollectionDashboardDetail, BankCollectionDetailWithReceiptList, BankCollectionDocumentUpload, BankCollectionIgnoreResult, BankCollectionList, BankCollectionProcessResponseData, BankCollectionUploadResult, ChequeCollectionDocumentUpload, bankCollectionClaimCancelResponseDataDecoder, bankCollectionDashboardDetailDecoder, bankCollectionDetailWithReceiptListDecoder, bankCollectionIgnoreResultDecoder, bankCollectionListDecoder, bankCollectionProcessResponseDataDecoder, bankCollectionUploadResultDecoder } from "../types/bankCollection";
import { guard, object } from "decoders";
import settings from "../config/settings";
import { GenericErrors, genericErrorsDecoder } from "../types/error";
import { Err, Ok, Result } from "@hqoss/monads";
import { setupInterceptorsTo } from "../interceptor";
import { InvoiceReceiptDetailCreate } from "../types/receipt";

axios.defaults.baseURL = settings.baseApiUrl;
setupInterceptorsTo(axios) 

export const getBankCollectionList = async (BankCollectionStatus:string,search?: string, index?: number): Promise<BankCollectionList> => {
  let url = `bankcollection/list?BankCollectionStatus=${BankCollectionStatus}&Page=${index}`;
  if (search) {
    url += `&Search=${search}`; 
  } 
  return guard(bankCollectionListDecoder)((await axios.get(url)).data.data);
}
 
export const uploadBankCollectionFile=async(CollectionDocument: BankCollectionDocumentUpload): Promise<Result<BankCollectionUploadResult, GenericErrors>>=> {
  try { 
    const formData = new FormData()
    formData.append("TenantBankAccountId",String(CollectionDocument.TenantBankAccountId))
    formData.append("BankCollectionFile", CollectionDocument.BankCollectionFile??'') 
    const { data } = await axios.post('bankcollection/upload', formData); 
    return Ok(guard(object({ data: bankCollectionUploadResultDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
} 

export  const processCollection=async(BankCollection: BankCollectionApproveDetail, InvoiceReceiptDetails: InvoiceReceiptDetailCreate[]): Promise<Result<BankCollectionProcessResponseData, GenericErrors>>=> {
  try {
    const { data } = await axios.post("bankcollection/process", { BankCollection, InvoiceReceiptDetails });
    return Ok(guard(object({ data: bankCollectionProcessResponseDataDecoder }))(data).data);  
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}

export const getBankCollectionDashboardDetail = async (): Promise<BankCollectionDashboardDetail> => {
  return guard(bankCollectionDashboardDetailDecoder)((await axios.get(`bankcollection/get/dashboard/detail`)).data.data);
}  

export  const ignoreBankCollection=async(BankCollectionId :number|string): Promise<Result<BankCollectionIgnoreResult, GenericErrors>>=> {
  try {
    const { data } = await axios.put(`bankcollection/${BankCollectionId}/ignore`);
    return Ok(guard(object({ data: bankCollectionIgnoreResultDecoder }))(data).data);  
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  } 
} 

export const uploadChequeCollectionFile=async(CollectionDocument: ChequeCollectionDocumentUpload): Promise<Result<BankCollectionUploadResult, GenericErrors>>=> {
  try { 
    const formData = new FormData()
    formData.append("TenantBankAccountId",String(CollectionDocument.TenantBankAccountId))
    formData.append("ChequeCollectionFile", CollectionDocument.ChequeCollectionFile??'') 
    console.log( CollectionDocument,"eds ")
    const { data } = await axios.post('bankcollection/chequeupload', formData); 
    return Ok(guard(object({ data: bankCollectionUploadResultDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
} 

export  const cancelCollectionClaim=async(CollectionCancelData: BankCollectionClaimCancelDetail): Promise<Result<BankCollectionClaimCancelResponseData, GenericErrors>>=> {
  try {
    const { data } = await axios.post("bankcollection/cancel/claim", CollectionCancelData);
    return Ok(guard(object({ data: bankCollectionClaimCancelResponseDataDecoder }))(data).data);  
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}

export const getBankCollectionDetail = async (BankCollectionId: number|null): Promise<BankCollectionDetailWithReceiptList> => {
  const url = `bankcollection/get/details?BankCollectionId=${BankCollectionId}`;
 return guard(bankCollectionDetailWithReceiptListDecoder)((await axios.get(url)).data.data); 
}