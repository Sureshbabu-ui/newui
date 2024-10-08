import axios from 'axios';
import { guard, object } from 'decoders';
import { PaymentFrequencyCreate, PaymentFrequencyCreateResult, PaymentFrequencyDeleted, PaymentFrequencyEdit, PaymentFrequencyList, PaymentFrequencyNames, PaymentFrequencyUpdateResult, createPaymentFrequencyDecoder, paymentFrequencyDeletedDecoder, paymentFrequencyListDecoder, paymentFrequencyNamesDecoder, updatePaymentFrequencyDecoder } from '../types/paymentFrequency';
import { GenericErrors, genericErrorsDecoder } from '../types/error';
import { Err, Ok, Result } from '@hqoss/monads';
import settings from "../config/settings";
import { setupInterceptorsTo } from "../interceptor";

axios.defaults.baseURL = settings.baseApiUrl;
setupInterceptorsTo(axios) 

export const getPaymentFrequencyList = async (search?: string, index?: number): Promise<PaymentFrequencyList> => {
  let url = `paymentfrequency/list?Page=${index}`;
  if (search) {
    url += `&Search=${search}`;
  }
  return guard(paymentFrequencyListDecoder)((await axios.get(url)).data.data);
}

export const getPaymentFrequencyNames = async (): Promise<PaymentFrequencyNames> => {
  return guard(paymentFrequencyNamesDecoder)((await axios.get(`paymentfrequency/get/names`)).data.data);
}
  
export const paymentFrequencyCreate = async (paymentFrequency: PaymentFrequencyCreate): Promise<Result<PaymentFrequencyCreateResult, GenericErrors>> => {
  try {
    const { data } = await axios.post('paymentfrequency/create', paymentFrequency);
    return Ok(guard(object({ data: createPaymentFrequencyDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}

export const paymentFrequencyUpdate = async (paymentFrequency: PaymentFrequencyEdit): Promise<Result<PaymentFrequencyUpdateResult, GenericErrors>> => {
  try {
    const { data } = await axios.put('paymentfrequency/update', paymentFrequency);
    return Ok(guard(object({ data: updatePaymentFrequencyDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}

export async function deletePaymentFrequency(Id: number): Promise<Result<PaymentFrequencyDeleted, GenericErrors>> {
  try {
    const { data } = await axios.put(`paymentfrequency/delete?Id=${Id}`);
    return Ok(guard(object({ data: paymentFrequencyDeletedDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}