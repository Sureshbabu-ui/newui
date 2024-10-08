import { InvoiceCollectionView, InvoiceScheduleList, InvoiceSearchForFilter, invoiceCollectionViewDecoder, invoiceScheduleListDecoder } from "../types/invoice";
import { setupInterceptorsTo } from "../interceptor";
import axios from "axios";
import settings from "../config/settings";
import { guard } from "decoders";

axios.defaults.baseURL = settings.baseApiUrl;
setupInterceptorsTo(axios)

export const getInvoiceScheduleList = async (index:number,SearchWith?: string, filters?: InvoiceSearchForFilter): Promise<InvoiceScheduleList> => {
  let url = `invoice/list?Page=${index}`;
  if (filters&&SearchWith) { 
    url += `&Filters=${JSON.stringify(filters)}&SearchWith=${SearchWith}`;
  }
    return guard(invoiceScheduleListDecoder)((await axios.get(url)).data.data);
  }
  
  export const getInvoiceCollectionDetail = async (ReceiptId: string): Promise<InvoiceCollectionView> => {
    const url = `invoice/collection/detail?InvoiceId=${ReceiptId}`;
   return guard(invoiceCollectionViewDecoder)((await axios.get(url)).data.data); 
  }