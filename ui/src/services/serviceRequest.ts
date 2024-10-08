import {
  ServiceRequestAssetDetailsList, serviceRequestAssetListDecoder, ServiceRequestForCreation, createDecoder,
  ServiceRequestCreateResult, customerContractsDecoder, CustomerContracts, InterimServiceRequestAssetDetails,
  interimServiceRequestAssetDetailsDecoder, CallClosureResult, callClosureResultDecoder, PreviousTicketList,
  previousTicketListDecoder, InterimRequestReviewed, interimRequestReviewedDecoder, InterimServiceRequestDetails,
  interimServiceRequestDetailsDecoder, GetServiceRequestCallTotalCount
  , getServiceRequestCallTotalCountDecoder,
  ServiceRequestCount,
  serviceRequestCountDecoder,
  ServiceRequestSummaryDetails,
  serviceRequestSummaryDetailsDecoder,
  InterimAssetInfo,
  interimAssetInfoDecoder,
  ServiceRequestEdit,
  ServiceRequestUpdateResult,
  serviceRequestUpdateDecoder,
  ServiceRequestEditDetails,
  serviceRequestEditDetailsDecoder,
  InterimServiceRequestList,
  interimServiceRequestListDecoder,
  AssetExistDetails,
  assetExistDetailsDecoder,
  CallDetailsForSme,
  callDetailsForSmeDecoder
} from "../types/serviceRequest";
import axios from "axios";
import { guard, object } from "decoders";
import settings from "../config/settings";
import { GenericErrors, genericErrorsDecoder } from "../types/error";
import { Err, Ok, Result } from '@hqoss/monads';
import { ModelNames, modelNamesDecoder } from "../types/product";
import { CallServiceRequest } from "../components/Pages/ServiceRequestManagement/CallCordinatorManagement/CallCordinatorView/Submenu/CallClosure/CallClosure.slice";
import { InterimAssetsCreation, InterimPreAmcReviewedAssetsDetails } from "../types/assets";
import { InterimCallApproval, RejectInterimCall } from "../components/Pages/ServiceRequestManagement/InterimRequestManagement/InterimRequestReview/InterimRequestReview.slice";
import { CallCenterServiceRequestDetails, CallCenterServiceRequestList, CallStatusDetails, callCenterServiceRequestDetailsDecoder, callCenterServiceRequestListDecoder, callStatusPdfDetailsDecoder } from "../types/callCentreManagement";
import { InterimSearchFilter } from "../components/Pages/ServiceRequestManagement/InterimRequestManagement/InterimRequestList/FinanceInterimRequestList/FinanceInterimRequestList.slice";
import { AssetDetailsForCallCordinator, CallCordiantorServiceRequestDetails, CallCordinatorServiceRequestCounts, CallCordinatorServiceRequestList, assetDetailsForCallCordinatorDecoder, callCordiantorServiceRequestDetailsDecoder, callCordinatorServiceRequestCountsDecoder, callCordinatorServiceRequestListDecoder } from "../types/callCordinatorManagement";
import { getBrowserTimeZone } from "../helpers/formats";
import { setupInterceptorsTo } from "../interceptor";

axios.defaults.baseURL = settings.baseApiUrl;
setupInterceptorsTo(axios) 

export const getPreviousServiceRequests = async (AssetId?: string | null, ServiceRequestId?: number | null): Promise<PreviousTicketList> => {
  let url = `servicerequest/previous/tickets?`
  if (AssetId && ServiceRequestId) {
    url += `ServiceRequestId=${ServiceRequestId}`;
  } else if (AssetId) {
    url += `AssetId=${AssetId}`;
  }
  return guard(previousTicketListDecoder)((await axios.get(url)).data.data);
}

export const contractAssetExistCheck = async (searchType: string, searchValue: string): Promise<AssetExistDetails> => {
  const url = `contract/asset/exist/check?searchType=${searchType}&searchValue=${searchValue}`;
  return guard(assetExistDetailsDecoder)((await axios.get(url)).data.data);
}

export const getServiceRequestAssetDetails = async (AssetId): Promise<ServiceRequestAssetDetailsList> => {
  const url = `contract/asset/get/details?assetId=${AssetId}`;
  return guard(serviceRequestAssetListDecoder)((await axios.get(url)).data.data);
}

export const serviceRequestCreate = async (serviceRequest: ServiceRequestForCreation): Promise<Result<ServiceRequestCreateResult, GenericErrors>> => {
  try {
    const { data } = await axios.post('servicerequest/create', serviceRequest);
    return Ok(guard(object({ data: createDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}

export const serviceRequestUpdate = async (serviceRequest: ServiceRequestEdit): Promise<Result<ServiceRequestUpdateResult, GenericErrors>> => {
  try {
    const { data } = await axios.post('servicerequest/update', serviceRequest);
    return Ok(guard(object({ data: serviceRequestUpdateDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}

export const interimCallAssetApprove = async (InterimRequest: InterimAssetsCreation): Promise<Result<InterimRequestReviewed, GenericErrors>> => {
  try {
    const { data } = await axios.post('servicerequest/interim/asset/approve', InterimRequest);
    return Ok(guard(object({ data: interimRequestReviewedDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}

export const  getServiceUpdateRequestDetails = async (ServiceRequestId: string): Promise<ServiceRequestEditDetails> => {
  return guard(serviceRequestEditDetailsDecoder)((await axios.get(`servicerequest/edit/details?Id=${ServiceRequestId}`)).data.data);
}

export const getFilteredContractsByCustomer = async (CustomerId: number | string | null): Promise<CustomerContracts> => {
  return guard(customerContractsDecoder)((await axios.get(`customer/get/all/customercontracts?CustomerId=${CustomerId}`)).data.data);
}

export const getProductModelNames = async (CategoryId: number | string, MakeId: number | string): Promise<ModelNames> => {
  return guard(modelNamesDecoder)((await axios.get(`product/filtered/modelnames?CategoryId=${CategoryId}&MakeId=${MakeId}`)).data.data);
}

export const getInterimServiceRequestAssetDetails = async (ContractId: number): Promise<InterimServiceRequestAssetDetails> => {
  return guard(interimServiceRequestAssetDetailsDecoder)((await axios.get(`servicerequest/get/interim/assetdetails?ContractId=${ContractId}`)).data.data);
}

export const getInterimServiceRequestDetails = async (ServiceRequestId: string): Promise<InterimServiceRequestDetails> => {
  return guard(interimServiceRequestDetailsDecoder)((await axios.get(`servicerequest/get/interim/details?ServiceRequestId=${ServiceRequestId}`)).data.data);
}

export const ServiceRequestClose = async (closure: CallServiceRequest): Promise<Result<CallClosureResult, GenericErrors>> => {
  try {
    const { data } = await axios.put('servicerequest/call/close', closure);
    return Ok(guard(object({ data: callClosureResultDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}

export const getServiceRequestsCallsTotalCount = async (): Promise<GetServiceRequestCallTotalCount> => {
  const url = "servicerequest/calls/count";
  return guard(getServiceRequestCallTotalCountDecoder)((await axios.get(url)).data);
}
export async function getContractServiceRequestCount(Id: string): Promise<ServiceRequestCount> {
  return guard(serviceRequestCountDecoder)((await axios.get(`servicerequest/contract/count?ContractId=${Id}`)).data.data);
}

export const getServiceRequestSummary = async (serviceRequestId: string): Promise<ServiceRequestSummaryDetails> => {
  const url = `servicerequest/get/summary/details?ServiceRequestId=${serviceRequestId}`;
  return guard(serviceRequestSummaryDetailsDecoder)((await axios.get(url)).data.data);
}

export const downloadServiceRequestSummary = async (serviceRequestId: string) => {
  const url = `servicerequest/summary/generatepdf?ServiceRequestId=${serviceRequestId}`;
  return await axios.get(url, {
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json',
    }
  });
}

export const InterimRequestReject = async (reject: RejectInterimCall): Promise<Result<CallClosureResult, GenericErrors>> => {
  try {
    const { data } = await axios.put('servicerequest/interim/reject', reject);
    return Ok(guard(object({ data: callClosureResultDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}

export const getInterimCallAssetDetails = async (ServiceRequestId: string): Promise<InterimAssetInfo> => {
  return guard(interimAssetInfoDecoder)((await axios.get(`servicerequest/get/interim/assetinfo?ServiceRequestId=${ServiceRequestId}`)).data.data);
}

export const interimCallFinanceApprove = async (approve: InterimCallApproval): Promise<Result<InterimRequestReviewed, GenericErrors>> => {
  try {
    const { data } = await axios.post('servicerequest/interim/finance/approve', approve);
    return Ok(guard(object({ data: interimRequestReviewedDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}

// CallCentre Service Request List
export const getCallCentreServiceRequestList = async (search?: string, SearchWith?: string, index?: number, filterWith?: string | null): Promise<CallCenterServiceRequestList> => {
  let url = `servicerequest/callcentre/list?Page=${index}`;
  if (search && SearchWith) {
    url += `&Search=${search}&SearchWith=${SearchWith}`;
  }
  if (filterWith) {
    url += `&filterWith=${filterWith}`
  }
  return guard(callCenterServiceRequestListDecoder)((await axios.get(url)).data.data);
}

// call centre Servicerequest view details
export const getCallCentreCallDetails = async (ServiceRequestId: number): Promise<CallCenterServiceRequestDetails> => {
  return guard(callCenterServiceRequestDetailsDecoder)((await axios.get(`servicerequest/callcentre/calldetails?ServiceRequestId=${ServiceRequestId}`)).data.data);
}

// call cordiantor Servicerequest view details
export const getCallCordinatorCallDetails = async (ServiceRequestId: number): Promise<CallCordiantorServiceRequestDetails> => {
  return guard(callCordiantorServiceRequestDetailsDecoder)((await axios.get(`servicerequest/callcordinator/calldetails?ServiceRequestId=${ServiceRequestId}`)).data.data);
}

// CallCordiantor Service Request List
export const getCallCordinatorServiceRequestList = async (StatusCode: string, index: number, search?: string, SearchWith?: string): Promise<CallCordinatorServiceRequestList> => {
  let url = `servicerequest/callcordinator/list?Page=${index}&StatusCode=${StatusCode}`;
  if (search && SearchWith) {
    url += `&Search=${search}&SearchWith=${SearchWith}`;
  }
  return guard(callCordinatorServiceRequestListDecoder)((await axios.get(url)).data.data);
}

// CallCordiantor Service Request Counts
export async function getCallCordinatorServiceRequestCounts(StatusCode: string): Promise<CallCordinatorServiceRequestCounts> {
  return guard(callCordinatorServiceRequestCountsDecoder)((await axios.get(`servicerequest/countsforcallcordinator?StatusCode=${StatusCode}`)).data.data);
}

//Pre Amc Interim Call List
export const getPreAmcInterimServiceRequestList = async (SearchWith?: string, index?: number, filters?: InterimSearchFilter): Promise<InterimServiceRequestList> => {
  let url = `servicerequest/asset/interim/list?Page=${index}`;
  if (filters && SearchWith) {
    url += `&Filters=${JSON.stringify(filters)}&SearchWith=${SearchWith}`;
  }
  return guard(interimServiceRequestListDecoder)((await axios.get(url)).data.data);
}

//Finance Interim Call List
export const getFinanceInterimServiceRequestList = async (SearchWith?: string, index?: number, filters?: InterimSearchFilter): Promise<InterimServiceRequestList> => {
  let url = `servicerequest/finance/interim/list?Page=${index}`;
  if (filters && SearchWith) {
    url += `&Filters=${JSON.stringify(filters)}&SearchWith=${SearchWith}`;
  }
  return guard(interimServiceRequestListDecoder)((await axios.get(url)).data.data);
}

// Service Request Asset details
export async function getAssetDetailsForCallCordiantor(Id: number): Promise<AssetDetailsForCallCordinator> {
  return guard(assetDetailsForCallCordinatorDecoder)((await axios.get(`servicerequest/assetdetails/forcallcordinator?ServiceRequestId=${Id}`)).data.data);
}

// call status details
export const getCallStatusDetails = async (ServiceRequestId: number): Promise<CallStatusDetails> => {
  return guard(callStatusPdfDetailsDecoder)((await axios.get(`servicerequest/callstatus/reportdetails?ServiceRequestId=${ServiceRequestId}`)).data.data);
}

export const downloadCallStatusReport = async (ServiceRequestId: number) => {
  const url = `servicerequest/generatepdf?ServiceRequestId=${ServiceRequestId}&TimeZone=${getBrowserTimeZone()}`;
  return await axios.get(url, {
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json',
    }
  });
}

export const getCallDetailsForSme = async (SearchWith?: string, Search?: string, index?: number): Promise<CallDetailsForSme> => {
  return guard(callDetailsForSmeDecoder)((await axios.get(`servicerequest/list/forsme?Page=${index}&SearchWith=${SearchWith}&Search=${Search}`)).data.data);
}

// Preamc Pending asset approve
export const preAmcPendingAssetApprove = async (reviewDetails: InterimPreAmcReviewedAssetsDetails): Promise<Result<InterimRequestReviewed, GenericErrors>> => {
  try {
    const { data } = await axios.post('servicerequest/interim/preamcasset/approve', reviewDetails);
    return Ok(guard(object({ data: interimRequestReviewedDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}