import { guard } from "decoders";
import axios from "axios";
import settings from "../../config/settings";
import { setupInterceptorsTo } from "../../interceptor";
import { CollectionMadeResponse, CollectionMadeResponseDecoder, CollectionsOutstandingResponse, CollectionsOutstandingResponseDecoder, ContractDashboardFilter, ContractsBookedResponse, ContractsBookedResponseDecoder, InvoicesPendingResponse, InvoicesPendingResponseDecoder, InvoicesRaisedResponse, InvoicesRaisedResponseDecoder, RevenueRecognitionResponse, RevenueRecognitionResponseDecoder } from "../../types/contracts/contractDashboard";

axios.defaults.baseURL = settings.baseApiUrl;
setupInterceptorsTo(axios)

//1. collection made
export async function getContractDashboardCollectionMade(contractdashboardfilter: ContractDashboardFilter): Promise<CollectionMadeResponse> {
  let url = `contractdashboard/collectionmade?`;

  if (contractdashboardfilter.DateFrom) {
    url += `&DateFrom=${contractdashboardfilter.DateFrom}`
  }
  if (contractdashboardfilter.DateTo) {
    url += `&DateTo=${contractdashboardfilter.DateTo}`
  }
  if (contractdashboardfilter.TenantRegionId) {
    url += `&TenantRegionId=${contractdashboardfilter.TenantRegionId}`
  }
  if (contractdashboardfilter.TenantOfficeId) {
    url += `&TenantOfficeId=${contractdashboardfilter.TenantOfficeId}`
  }

  return guard(CollectionMadeResponseDecoder)((await axios.get(url)).data.data);
}

//2. CollectionsOutstandingResponse
export async function getContractDashboardCollectionsOutstanding(contractdashboardfilter: ContractDashboardFilter): Promise<CollectionsOutstandingResponse> {
  let url = `contractdashboard/collection/outstanding?`;

 if (contractdashboardfilter.DateFrom) {
    url += `&DateFrom=${contractdashboardfilter.DateFrom}`
  }
  if (contractdashboardfilter.DateTo) {
    url += `&DateTo=${contractdashboardfilter.DateTo}`
  }
  if (contractdashboardfilter.TenantRegionId) {
    url += `&TenantRegionId=${contractdashboardfilter.TenantRegionId}`
  }
  if (contractdashboardfilter.TenantOfficeId) {
    url += `&TenantOfficeId=${contractdashboardfilter.TenantOfficeId}`
  }

  return guard(CollectionsOutstandingResponseDecoder)((await axios.get(url)).data.data);
}

//3. contracts booked
export async function getContractDashboardContractsBooked(contractdashboardfilter: ContractDashboardFilter): Promise<ContractsBookedResponse> {
  let url = `contractdashboard/contractsbooked?`;

 if (contractdashboardfilter.DateFrom) {
    url += `&DateFrom=${contractdashboardfilter.DateFrom}`
  }
  if (contractdashboardfilter.DateTo) {
    url += `&DateTo=${contractdashboardfilter.DateTo}`
  }
  if (contractdashboardfilter.TenantRegionId) {
    url += `&TenantRegionId=${contractdashboardfilter.TenantRegionId}`
  }
  if (contractdashboardfilter.TenantOfficeId) {
    url += `&TenantOfficeId=${contractdashboardfilter.TenantOfficeId}`
  }

  return guard(ContractsBookedResponseDecoder)((await axios.get(url)).data.data);
}

//4. Invoices pending
export async function getContractDashboardInvoicesPending(contractdashboardfilter: ContractDashboardFilter): Promise<InvoicesPendingResponse> {
  let url = `contractdashboard/pendinginvoices?`;

 if (contractdashboardfilter.DateFrom) {
    url += `&DateFrom=${contractdashboardfilter.DateFrom}`
  }
  if (contractdashboardfilter.DateTo) {
    url += `&DateTo=${contractdashboardfilter.DateTo}`
  }
  if (contractdashboardfilter.TenantRegionId) {
    url += `&TenantRegionId=${contractdashboardfilter.TenantRegionId}`
  }
  if (contractdashboardfilter.TenantOfficeId) {
    url += `&TenantOfficeId=${contractdashboardfilter.TenantOfficeId}`
  }

  return guard(InvoicesPendingResponseDecoder)((await axios.get(url)).data.data);
}

//5. invoices raised
export async function getContractDashboardInvoicesRaised(contractdashboardfilter: ContractDashboardFilter): Promise<InvoicesRaisedResponse> {
  let url = `contractdashboard/raisedinvoices?`;

 if (contractdashboardfilter.DateFrom) {
    url += `&DateFrom=${contractdashboardfilter.DateFrom}`
  }
  if (contractdashboardfilter.DateTo) {
    url += `&DateTo=${contractdashboardfilter.DateTo}`
  }
  if (contractdashboardfilter.TenantRegionId) {
    url += `&TenantRegionId=${contractdashboardfilter.TenantRegionId}`
  }
  if (contractdashboardfilter.TenantOfficeId) {
    url += `&TenantOfficeId=${contractdashboardfilter.TenantOfficeId}`
  }

  return guard(InvoicesRaisedResponseDecoder)((await axios.get(url)).data.data);
}

//6. revenue recognition
export async function getContractDashboardRevenueRecognition(contractdashboardfilter: ContractDashboardFilter): Promise<RevenueRecognitionResponse> {
  let url = `contractdashboard/revenuerecognition?`;

 if (contractdashboardfilter.DateFrom) {
    url += `&DateFrom=${contractdashboardfilter.DateFrom}`
  }
  if (contractdashboardfilter.DateTo) {
    url += `&DateTo=${contractdashboardfilter.DateTo}`
  }
  if (contractdashboardfilter.TenantRegionId) {
    url += `&TenantRegionId=${contractdashboardfilter.TenantRegionId}`
  }
  if (contractdashboardfilter.TenantOfficeId) {
    url += `&TenantOfficeId=${contractdashboardfilter.TenantOfficeId}`
  }

  return guard(RevenueRecognitionResponseDecoder)((await axios.get(url)).data.data);
}