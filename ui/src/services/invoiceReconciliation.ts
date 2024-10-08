import axios from "axios";
import { InvoiceReconciliationList, InvoiceReconciliationTaxFileUpload, InvoiceReconciliationTaxUploadResult, invoiceReconciliationListDecoder, invoiceReconciliationTaxUploadResultDecoder } from "../types/invoiceReconciliation";
import settings from "../config/settings";
import { setupInterceptorsTo } from "../interceptor";
import { guard,object } from "decoders";
import { GenericErrors, genericErrorsDecoder } from "../types/error";
import { Err, Ok, Result } from "@hqoss/monads";

axios.defaults.baseURL = settings.baseApiUrl;
setupInterceptorsTo(axios) 
export const getInvoiceReconciliationList = async (search?: string, index?: number): Promise<InvoiceReconciliationList> => {
    let url = `invoicereconciliation/list?Page=${index}`;
    if (search) {
      url += `&Search=${search}`;
    }
    return guard(invoiceReconciliationListDecoder)((await axios.get(url)).data.data);
} 

export const uploadInvoiceReconciliationTaxFile = async (CollectionDocument: InvoiceReconciliationTaxFileUpload): Promise<Result<InvoiceReconciliationTaxUploadResult, GenericErrors>> => {
  try {
    const formData = new FormData();
    formData.append("CollectionFile", CollectionDocument.CollectionFile ?? '');
    formData.append("TaxType", String(CollectionDocument.TaxType));

    let endpoint = "";
    if (CollectionDocument.TaxType === "TDS") {
      endpoint = 'invoicereconciliation/tds/upload';
    } else if (CollectionDocument.TaxType === "GSTTDS") {
      endpoint = 'invoicereconciliation/gsttds/upload';
    } else {
      // Handle invalid TaxType
      return Promise.reject({ message: "Invalid TaxType" });
    }

    const { data } = await axios.post(endpoint, formData);
    return Ok(guard(object({ data: invoiceReconciliationTaxUploadResultDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  } 
}
