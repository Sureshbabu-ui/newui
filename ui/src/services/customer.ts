import axios from 'axios';
import { guard, object } from 'decoders';
import {
  ApproveCustomer,
  ClickedCustomerDetails,
  ContractCustomerSiteCount,
  Customer,
  CustomerCodeExist,
  CustomerData,
  CustomerDataDraft,
  CustomerEditResponse,
  CustomerForCreation,
  CustomerNamesByFilter,
  CustomerSiteCreate,
  CustomerSiteListArray,
  CustomerSiteNameArray,
  MultipleCustomerDetails,
  MultipleCustomerSiteDetails,
  MultipleCustomerSites,
  MultipleExistingCustomer,
  MultipleExistingCustomerDecoder,
  SelectedCustomer,
  SelectedCustomerData,
  approveCustomerDecoder,
  contractcustomersitecountDecoder,
  customerCodeExistDecoder,
  customerDataDecoder,
  customerDataDraftDecoder,
  customerDecoder,
  customerEditDecoder,
  customerNamesByFilterDecoder,
  customerSiteListDecoderArray,
  customerSiteNamesDecoderArray,
  multipleCustomerDetailsDecoder,
  multipleCustomerSiteDetailsDecoder,
  multipleCustomerSitesDecoder,
  selectedcustomerDataDecoder,
  selectedcustomerDetailsDecoder,
} from '../types/customer';
import { Err, Ok, Result } from '@hqoss/monads';
import { GenericErrors, genericErrorsDecoder } from '../types/error';
import { selectedCustomeSite } from '../components/Pages/ContractSubMenu/ContractCustomerSite/CustomerSiteCreate.slice';
import {
  ClickedCustomerSiteDetails,
  CustomerSiteDeleted,
  IsCustomerSiteCreated,
  SelectedCustomerSiteData,
  SelectedSiteDetails,
  SiteData,
  SiteDetails,
  SiteDocumentUpload,
  SiteExistCheck,
  UpdateCustomerSiteResponse,
  customerSiteDeletedDecoder,
  isCustomerSiteCreatedDecoder,
  selectedcustomerSiteDataDecoder,
  siteDataDecoder,
  siteExistCheckDecoder,
  updateCustomerSiteResponseDecoder,
} from '../types/customerSite';
import { CustomerDraftList, customerDraftListDecoder } from '../types/customerdraft';
import { PendingApprovalsDetailList, pendingApprovalsDetailListDecoder } from '../types/pendingApproval';
import settings from '../config/settings';
import { setupInterceptorsTo } from '../interceptor';
import { CustomerApprovalDetailWithReview, customerApprovalDetailWithReviewDecoder, ResponseCustomerDeleted, responseCustomerDeletedDecoder } from '../types/customerpendingapproval';

axios.defaults.baseURL = settings.baseApiUrl;
setupInterceptorsTo(axios);

export async function getCustomersList(): Promise<Customer> {
  return guard(customerDecoder)((await axios.get(`customer/get/names`)).data.data);
}

export async function getlocationWiseContractCustomers(TenantOfficeId: string): Promise<Customer> {
  return guard(customerDecoder)(
    (await axios.get(`customer/get/locationwise/names?TenantOfficeId=${TenantOfficeId}`)).data.data
  );
}

export async function getContractCustomerSites(ContractId: string | null | number): Promise<MultipleCustomerSites> {
  return guard(multipleCustomerSitesDecoder)(
    (await axios.get(`contract/customersite/get/all?ContractId=${ContractId}`)).data.data
  );
}

export async function getCustomerApprovalRequests(index: number): Promise<PendingApprovalsDetailList> {
  var url = `approvalrequest/customer/list?Page=${index}`;
  return guard(pendingApprovalsDetailListDecoder)((await axios.get(url)).data.data);
}

export async function getCustomerPendingRequests(index: number): Promise<PendingApprovalsDetailList> {
  var url = `approvalrequest/customer/list?Page=${index}`;
  return guard(pendingApprovalsDetailListDecoder)((await axios.get(url)).data.data);
}

export async function editApprovedCustomer(
  customer: ClickedCustomerDetails
): Promise<Result<CustomerData, GenericErrors>> {
  try {
    const { data } = await axios.post('approvalrequests/create/customer/approval', customer);
    return Ok(guard(object({ data: customerDataDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}

export async function approveCustomer(
  ApprovalRequestDetailId: number | null,
  FetchTime: string | null,
  ReviewComment: string | null,
): Promise<Result<ApproveCustomer, GenericErrors>> {
  try {
    const { data } = await axios.post('approvalrequest/customer/approve', { ApprovalRequestDetailId, FetchTime, ReviewComment });
    return Ok(guard(object({ data: approveCustomerDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}

export async function editCustomer(
  region: ClickedCustomerDetails
): Promise<Result<CustomerEditResponse, GenericErrors>> {
  try {
    const { data } = await axios.put('customer/update', region);
    return Ok(guard(object({ data: customerEditDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}

export async function getCustomerList(index: number, search: string): Promise<MultipleCustomerDetails> {
  var url = `customer/list?Page=${index}`;
  if (search) {
    url += `&Search=${search}`;
  }
  return guard(multipleCustomerDetailsDecoder)((await axios.get(url)).data.data);
}

export async function getClickedCustomerDetails(Id: string): Promise<SelectedCustomer> {
  return guard(selectedcustomerDetailsDecoder)((await axios.get(`customer/get/details?CustomerId=${Id}`)).data.data);
}

export async function getCustomerDetails(id: string): Promise<SelectedCustomerData> {
  return guard(selectedcustomerDataDecoder)((await axios.get(`customer/update/details?CustomerId=${id}`)).data.data);
}

export async function checkCustomerCodeExist(customerCode: string): Promise<CustomerCodeExist> {
  return guard(customerCodeExistDecoder)(
    (await axios.get(`customer/customercode/isexist?CustomerCode=${customerCode}`)).data.data
  );
}
export async function checkExistingCustomerNames(customerName: string): Promise<MultipleExistingCustomer> {
  return guard(MultipleExistingCustomerDecoder)(
    (await axios.get(`customer/customername/exist/list?Name=${customerName}`)).data.data
  );
}

export async function createCustomerSite(
  customerSite: CustomerSiteCreate
): Promise<Result<IsCustomerSiteCreated, GenericErrors>> {
  try {
    const { data } = await axios.post('customersite/create', customerSite);
    return Ok(guard(object({ data: isCustomerSiteCreatedDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}

export async function updateCustomerSite(
  sitedetails: ClickedCustomerSiteDetails
): Promise<Result<UpdateCustomerSiteResponse, GenericErrors>> {
  try {
    const { data } = await axios.put('customersite/update', sitedetails);
    return Ok(guard(object({ data: updateCustomerSiteResponseDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}

export async function getCustomerSiteDetails(id: number): Promise<SelectedCustomerSiteData> {
  return guard(selectedcustomerSiteDataDecoder)((await axios.get(`customersite/update/details?Id=${id}`)).data.data);
}

export async function getCustomerSiteList(
  search?: string,
  index?: number,
  id?: number | null
): Promise<MultipleCustomerSiteDetails> {
  let url = `customersite/list?Page=${index}`;
  if (id) {
    url += `&CustomerId=${id}`;
  }
  if (search) {
    url += `&Search=${search}`;
  }
  return guard(multipleCustomerSiteDetailsDecoder)((await axios.get(url)).data.data);
}

export async function getAllCustomerSiteList(search?: string): Promise<CustomerSiteListArray> {
  let url = `customersite/get/all`;
  if (search) {
    url += `?Search=${search}`;
  }
  return guard(customerSiteListDecoderArray)((await axios.get(url)).data.data);
}

export async function createContractCustomerSite(
  customerSite: selectedCustomeSite
): Promise<Result<IsCustomerSiteCreated, GenericErrors>> {
  try {
    const { data } = await axios.post('contract/customersite/create', customerSite);
    return Ok(guard(object({ data: isCustomerSiteCreatedDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}

export async function getContractCustomerSiteList(
  search?: string,
  index?: number,
  id?: string
): Promise<MultipleCustomerSiteDetails> {
  let url = `contract/customersite/list?Page=${index}`;
  if (id) {
    url += `&ContractId=${id}`;
  }
  if (search) {
    url += `&Search=${search}`;
  }
  return guard(multipleCustomerSiteDetailsDecoder)((await axios.get(url)).data.data);
}

export async function uploadSiteDocument(
  ContractId: string | null,
  DocumentFile: File
): Promise<Result<SiteData, GenericErrors>> {
  try {
    const formData = new FormData();
    formData.append('ContractId', ContractId ?? '');
    if (DocumentFile) formData.append('file', DocumentFile);
    const { data } = await axios.post('customersite/bulk/upload/preview', formData);
    return Ok(guard(object({ data: siteDataDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}

export async function uploadSelectedSites(
  CustomerSites: SelectedSiteDetails[],
  ContractId: string
): Promise<Result<IsCustomerSiteCreated, GenericErrors>> {
  try {
    const { data } = await axios.post('customersite/bulk/upload', { CustomerSites, ContractId });
    return Ok(guard(object({ data: isCustomerSiteCreatedDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}

export async function getCustomerSiteNames(Id: number): Promise<CustomerSiteNameArray> {
  return guard(customerSiteNamesDecoderArray)((await axios.get(`customersite/names?CustomerInfoId=${Id}`)).data.data);
}

export async function customerSiteDelete(Id: number): Promise<Result<CustomerSiteDeleted, GenericErrors>> {
  try {
    const { data } = await axios.post('customersite/delete', { Id });
    return Ok(guard(object({ data: customerSiteDeletedDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}

export async function customerActiveSiteCheck(Id: number): Promise<SiteExistCheck> {
  return guard(siteExistCheckDecoder)((await axios.get(`customersite/exist/check?CustomerSiteId=${Id}`)).data.data);
}

export async function getCustomerDraftList(index: number): Promise<CustomerDraftList> {
  var url = `approvalrequest/customer/draftlist?Page=${index}`;
  return guard(customerDraftListDecoder)((await axios.get(url)).data.data);
}

export async function createCustomerApproval(
  customer: CustomerForCreation
): Promise<Result<CustomerData, GenericErrors>> {
  try {
    const { data } = await axios.post('approvalrequest/customer', customer);
    return Ok(guard(object({ data: customerDataDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}

export async function createCustomerDraft(
  customer: CustomerForCreation
): Promise<Result<CustomerDataDraft, GenericErrors>> {
  try {
    const { data } = await axios.post('approvalrequest/customer/draft', customer);
    return Ok(guard(object({ data: customerDataDraftDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}

export async function getContractCustomerSite(Id: number): Promise<ContractCustomerSiteCount> {
  return guard(contractcustomersitecountDecoder)(
    (await axios.get(`contract/customersite/count?ContractId=${Id}`)).data.data
  );
}

export async function getCustomersNames(): Promise<Customer> {
  return guard(customerDecoder)((await axios.get(`customer/names`)).data.data);
}

export async function getCustomerNamesByLocationGroupFilter(
  TenantOfficeId: null | number
): Promise<CustomerNamesByFilter> {
  let url = `customer/get/names/by/locationgroupfilter`;
  const params: string[] = [];
  if (TenantOfficeId) {
    params.push(`TenantOfficeId=${TenantOfficeId}`);
  }

  if (params.length > 0) {
    url += `?${params.join('&')}`;
  }
  return guard(customerNamesByFilterDecoder)((await axios.get(url)).data.data);
}

export async function getCustomerPendingDetails(Id: number | string): Promise<CustomerApprovalDetailWithReview> {
  return guard(customerApprovalDetailWithReviewDecoder)((await axios.get(`approvalrequest/customer/pending/${Id}`)).data.data);
}

export async function DeleteCustomer(Id: number): Promise<Result<ResponseCustomerDeleted, GenericErrors>> {
  try {
    const { data } = await axios.post(`customer/delete?Id=${Id}`);
    return Ok(guard(object({ data: responseCustomerDeletedDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}

export async function DeleteDraftCustomer(Id: number): Promise<Result<ResponseCustomerDeleted, GenericErrors>> {
  try {
    const { data } = await axios.delete(`approvalrequest/customer/${Id}`);
    return Ok(guard(object({ data: responseCustomerDeletedDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}