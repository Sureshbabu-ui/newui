import { Err, Ok, Result } from '@hqoss/monads';
import axios from 'axios';
import { guard, object } from 'decoders';
import settings from '../config/settings';
import { GenericErrors, genericErrorsDecoder } from '../types/error';
import { createDecoder, ContractData } from '../types/createdcontract';

import {
  MultipleExistedContracts,
  multipleExistedContractsDecoder,
  ContractDetails,
  selectedcontractDetailsDecoder,
  SelectedContract,
  ContractsCount,
  ContractsCountDecoder,
  SalesUsers,
  salesuserDecoder,
  PoDetails,
  ContractSearchForFilter,
  ContractRenewResponse,
  contractRenewDecoder,
  ContractRenewDetail,
  contractDeletedDecoder,
  ContractDeleted,
  GstRateList,
  gstRateListDecoder,
  ContractPeriod,
  contractPeriodDecoder,
  ContractNamesByFilter,
  contractNamesByFilterDecoder,  
} from '../types/contract';
import { SelectedCustomer, selectedcustomerDetailsDecoder } from '../types/customer';
import {  ContractInvoicePrerequisite } from '../types/contractInvoicePrerequisite';
import { ContractEditDetail, ContractEditResponse, SelectedContractData, contractEditDecoder, selectedContractInfoDecoder, } from '../types/contract';
import { InvoicePrerequisite } from '../types/invoicePrerequisite';
   
axios.defaults.baseURL = settings.baseApiUrl;

/**
 * Get all users list from the database 
 * @param index     number  page number to be loaded from the database
 * @param search    string  search key if the user searched for any names
 * @returns
 */
import { setupInterceptorsTo } from "../interceptor";

axios.defaults.baseURL = settings.baseApiUrl;
setupInterceptorsTo(axios) 

export async function getContractsList(index: number,SearchWith?: string, status?: string, filters?: ContractSearchForFilter): Promise<MultipleExistedContracts> {
  var url = `contract/list?Page=${index}`;
  if (status) {
    url += `&Status=${status}`;
  }
  if (filters&&SearchWith) {
    url += `&Filters=${JSON.stringify(filters)}&SearchWith=${SearchWith}`;
  }
  return guard(multipleExistedContractsDecoder)((await axios.get(url)).data.data);
}

export async function getContractCount(): Promise<ContractsCount> {
  var url = `contract/count`;
  return guard(ContractsCountDecoder)((await axios.get(url)).data.data);
}

export async function createContract(ContractDetails: ContractDetails, ContractInvoicePrerequisite: InvoicePrerequisite[]): Promise<Result<ContractData, GenericErrors>> {
  try {
    const { data } = await axios.post('contract/create', { ContractDetails, ContractInvoicePrerequisite });
    return Ok(guard(object({ data: createDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  } 
}

export async function getGstRates(): Promise<GstRateList> {
  return guard(gstRateListDecoder)((await axios.get(`contract/gstrate`)).data.data);
}

export async function getSalesContractUsers(): Promise<SalesUsers> {
  return guard(salesuserDecoder)((await axios.get(`contract/list/salesusers`)).data.data);
}

export async function getClickedContractDetails(id: any): Promise<SelectedContract> { 
  return guard(selectedcontractDetailsDecoder)((await axios.get(`contract/details?ContractId=${id}`)).data.data);
}

export const getContractCustomerDetails = async (id: string | number): Promise<SelectedCustomer> => {
  return guard(selectedcustomerDetailsDecoder)((await axios.get(`contract/get/customerdetails?ContractId=${id}`)).data.data);
}

export async function getClickedContractInfo(Id: string): Promise<SelectedContractData> {
  return guard(selectedContractInfoDecoder)((await axios.get(`contract/get/edit/details?ContractId=${Id}`)).data.data);
}

export async function updateContract(ContractDetails: ContractEditDetail, ContractInvoicePrerequisite: ContractInvoicePrerequisite[]): Promise<Result<ContractEditResponse, GenericErrors>> {
  try {
    const { data } = await axios.put('contract/update', { ContractDetails, ContractInvoicePrerequisite });
    return Ok(guard(object({ data: contractEditDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}

export const renewContract=async(ContractDetails: ContractRenewDetail, ContractInvoicePrerequisite: ContractInvoicePrerequisite[]): Promise<Result<ContractRenewResponse, GenericErrors>>=> {
  try { 
    const { data } = await axios.post('contract/renew', { ContractDetails, ContractInvoicePrerequisite });
    return Ok(guard(object({ data: contractRenewDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  } 
} 

export async function contractDelete(Id: number): Promise<Result<ContractDeleted, GenericErrors>> {
  try {
      const { data } = await axios.post(`contract/delete?ContractId=${Id}`);
      return Ok(guard(object({ data: contractDeletedDecoder }))(data).data);
  } catch ({ response: { data } }) {
      return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}

export async function getContractPeriod(id: any): Promise<ContractPeriod> {
  return guard(contractPeriodDecoder)((await axios.get(`contract/period?ContractId=${id}`)).data.data);
}

export async function getContractNamesByCustomerFilter(CustomerId:null|number): Promise<ContractNamesByFilter> {
  let url = `contract/filter/by/customer`;
  const params: string[] = [];
  if (CustomerId) {
    params.push(`CustomerId=${CustomerId}`);
  }
  if (params.length > 0) {
    url += `?${params.join('&')}`;
  }
  return guard(contractNamesByFilterDecoder)((await axios.get(url)).data.data);
}