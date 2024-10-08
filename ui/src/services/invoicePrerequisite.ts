import axios from "axios";
import { InvoicePrerequisiteCreate, InvoicePrerequisiteCreateResult, InvoicePrerequisiteDeleted, InvoicePrerequisiteList, InvoicePrerequisiteUpdate, InvoicePrerequisiteUpdateResult, InvoicePrerequisites, createInvoicePrerequisiteDecoder, invoicePrerequisiteDeletedDecoder, invoicePrerequisiteListDecoder, invoicePrerequisitesDecoder, updateInvoicePrerequisiteDecoder } from "../types/invoicePrerequisite";
import { guard, object } from "decoders";
import settings from "../config/settings";
import { GenericErrors, genericErrorsDecoder } from "../types/error";
import { Err, Ok, Result } from "@hqoss/monads";
import { setupInterceptorsTo } from "../interceptor";

axios.defaults.baseURL = settings.baseApiUrl;
setupInterceptorsTo(axios) 

export const getInvoicePrerequisiteDetails=async(): Promise<InvoicePrerequisites>=> {
    return guard(invoicePrerequisitesDecoder)((await axios.get(`invoiceprerequisite/get/all`)).data.data);
}

export const getInvoicePrerequisiteList = async (search?: string, index?: number): Promise<InvoicePrerequisiteList> => {
    let url = `invoiceprerequisite/list?Page=${index}`;
    if (search) {
      url += `&Search=${search}`;
    }
    return guard(invoicePrerequisiteListDecoder)((await axios.get(url)).data.data);
} 

export const createInvoicePrerequisite = async (invoicePrerequisite: InvoicePrerequisiteCreate): Promise<Result<InvoicePrerequisiteCreateResult, GenericErrors>> => {
    try {
      const { data } = await axios.post('invoiceprerequisite/create', invoicePrerequisite);
      return Ok(guard(object({ data: createInvoicePrerequisiteDecoder}))(data).data);
    } catch ({ response: { data } }) {
      return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
    }
  }

export async function updateInvoicePrerequisite(invoicePrerequisite: InvoicePrerequisiteUpdate): Promise<Result<InvoicePrerequisiteUpdateResult, GenericErrors>> {  
  try {
    const { data } = await axios.put('invoiceprerequisite/update', invoicePrerequisite);
    
    return Ok(guard(object({ data: updateInvoicePrerequisiteDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}

export async function deleteInvoicePrerequisite(Id: number): Promise<Result<InvoicePrerequisiteDeleted, GenericErrors>> {
  try {
    const { data } = await axios.put(`invoiceprerequisite/delete?Id=${Id}`);
    return Ok(guard(object({ data: invoicePrerequisiteDeletedDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}