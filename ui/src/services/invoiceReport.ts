import axios from "axios";
import { BillingDetailReportFilter, InvoiceCollectionReportFilter, OutstandingPaymentReportFilter, RevenueDueReportFilter } from "../types/invoiceReport";
import settings from "../config/settings";
import { setupInterceptorsTo } from "../interceptor";

axios.defaults.baseURL = settings.baseApiUrl;
setupInterceptorsTo(axios) 

export const downloadInvoiceCollectionReport = async (CollectionReportFilter: InvoiceCollectionReportFilter) => {
    let url = 'report/invoice/collection?';
    
    const queryParams = Object.entries(CollectionReportFilter)
      .filter(([key, value]) => value !== undefined)
      .map(([key, value]) =>  value?`${key}=${value}`:'');

    url += queryParams.join('&');
  
    return await axios.get(url, {
      responseType: 'blob',
      headers: {
        'Content-Type': 'application/json',
      }
    });
  }

  export const downloadOutstandingPaymentReport = async (PaymentReportFilter: OutstandingPaymentReportFilter) => {
    let url = 'report/invoice/outstandingpayment?';
    
    const queryParams = Object.entries(PaymentReportFilter)
      .filter(([key, value]) => value !== undefined)
      .map(([key, value]) =>  value?`${key}=${value}`:'');

    url += queryParams.join('&');
  
    return await axios.get(url, {
      responseType: 'blob',
      headers: {
        'Content-Type': 'application/json',
      }
    });
  }

  export const downloadRevenueDueReport = async (DueReportFilter: RevenueDueReportFilter) => {
    let url = 'report/invoice/revenuedue?';
    
    const queryParams = Object.entries(DueReportFilter)
      .filter(([key, value]) => value !== undefined)
      .map(([key, value]) =>  value?`${key}=${value}`:'');

    url += queryParams.join('&');
  
    return await axios.get(url, {
      responseType: 'blob',
      headers: {
        'Content-Type': 'application/json',
      }
    });
  }
   
  export const downloadBillingDetailReport = async (BillingReportFilter: BillingDetailReportFilter) => {
    let url = 'report/invoice/billingdetail?';
    
    const queryParams = Object.entries(BillingReportFilter)
      .filter(([key, value]) => value !== undefined)
      .map(([key, value]) =>  value?`${key}=${value}`:'');

    url += queryParams.join('&');
  
    return await axios.get(url, {
      responseType: 'blob',
      headers: {
        'Content-Type': 'application/json',
      }
    });
  }
   