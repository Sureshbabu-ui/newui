import axios from 'axios';
import { guard, object } from 'decoders';
import {  ContractInvoiceScheduleList, ContractInvoiceSheduleData, IsInvoiceScheduleApproved, IsInvoiceScheduleGenerated, contractInvoiceScheduleListDecoder, contractInvoiceSheduleDataDecoder, isInvoiceScheduleApprovedDecoder, isInvoiceScheduleGeneratedDecoder } from '../types/contractInvoiceSchedule';
import { Err, Ok, Result } from '@hqoss/monads';
import { GenericErrors, genericErrorsDecoder } from '../types/error';
import settings from "../config/settings";
import { setupInterceptorsTo } from "../interceptor";

axios.defaults.baseURL = settings.baseApiUrl;
setupInterceptorsTo(axios) 

export const getContractInvoiceScheduleList = async (ContractId: string): Promise<ContractInvoiceScheduleList> => {
  return guard(contractInvoiceScheduleListDecoder)((await axios.get(`contractinvoiceschedule/list?ContractId=${ContractId}`)).data.data);
}

export async function getContractInvoiceScheduleDetails(ContractInvoiceScheduleId: string): Promise<ContractInvoiceSheduleData> {
  return guard(contractInvoiceSheduleDataDecoder)((await axios.get(`contractinvoiceschedule/get/details?ContractInvoiceScheduleId=${ContractInvoiceScheduleId}`)).data.data);
}

export const ContractInvoiceScheduleGenerate = async (
  ContractId: string
): Promise<Result<IsInvoiceScheduleGenerated, GenericErrors>> => {
  const url = `contractinvoiceschedule/generate?ContractId=${ContractId}`;
  try {
    const { data } = await axios.post(url);
    const decodedResult = guard(isInvoiceScheduleGeneratedDecoder)(data.data);
    return Ok(decodedResult);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}

export const approveContractInvoiceSchedule = async (ContractInvoiceScheduleId: number): Promise<IsInvoiceScheduleApproved> => {
  const url = `contractinvoiceschedule/approve?ContractInvoiceScheduleId=${ContractInvoiceScheduleId}`;
  const { data } = await axios.get(url);
  return guard(isInvoiceScheduleApprovedDecoder)(data.data);
} 