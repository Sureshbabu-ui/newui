import { Err, Ok, Result } from '@hqoss/monads';
import axios from 'axios';
import { guard, object } from 'decoders';
import { GenericErrors, genericErrorsDecoder } from '../types/error';
import { setupInterceptorsTo } from '../interceptor';
import { MultipleVendorBankAccountDetails, VendorBankAccountCreateResponse, VendorBankAccountCreation, VendorBankAccountDeleteResponse, VendorBankAccountEdit, VendorBankAccountEditDetails, VendorBankAccountEditResponse, multipleVendorBankAccountDetailsDecoder, vendorBankAccountCreateResponseDecoder, vendorBankAccountDeleteResponseDecoder, vendorBankAccountEditDetailsDecoder, vendorBankAccountEditResponseDecoder } from '../types/vendorBankAccount';
import settings from "../config/settings";

setupInterceptorsTo(axios)
axios.defaults.baseURL = settings.baseApiUrl;

export async function createVendorBankAccount(vendorBankAccount: VendorBankAccountCreation): Promise<Result<VendorBankAccountCreateResponse, GenericErrors>> {
  try {
    const { data } = await axios.post("vendor/bankaccount/create", vendorBankAccount);
    return Ok(guard(object({ data: vendorBankAccountCreateResponseDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}

export async function editVendorBankAccount(vendorBankAccount: VendorBankAccountEdit): Promise<Result<VendorBankAccountEditResponse, GenericErrors>> {
  try {
    const { data } = await axios.post("vendor/bankaccount/update", vendorBankAccount);
    return Ok(guard(object({ data: vendorBankAccountEditResponseDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}

export async function getVendorBankAccountList(index: number, vendorId: string): Promise<MultipleVendorBankAccountDetails> {
  var url = `vendor/bankaccount/list?Page=${index}&vendorId=${vendorId}`;
  return guard(multipleVendorBankAccountDetailsDecoder)((await axios.get(url)).data.data);
}

export async function getVendorBankAccountEditDetails(Id: number): Promise<VendorBankAccountEditDetails> {
  return guard(vendorBankAccountEditDetailsDecoder)((await axios.get(`vendor/bankaccount/details?Id=${Id}`)).data.data);
}

export async function deleteVendorBankAccount(Id: number): Promise<Result<VendorBankAccountDeleteResponse, GenericErrors>> {
  try {
    const { data } = await axios.post(`vendor/bankaccount/delete?Id=${Id}`);
    return Ok(guard(object({ data: vendorBankAccountDeleteResponseDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}