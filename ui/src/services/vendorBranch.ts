import { Err, Ok, Result } from '@hqoss/monads';
import axios from 'axios';
import { guard, object } from 'decoders';
import { GenericErrors, genericErrorsDecoder } from '../types/error';
import { setupInterceptorsTo } from '../interceptor';
import { VendorBranchCreation, VendorBranchEdit, VendorBranchCreateResponse, vendorBranchCreateResponseDecoder, VendorBranchEditResponse, vendorBranchEditResponseDecoder, multipleVendorBranchDetailsDecoder, MultipleVendorBranchDetails, VendorBranchEditDetails, vendorBranchEditDetailsDecoder, VendorBranchDeleteResponse, vendorBranchDeleteResponseDecoder, VendorSearchForFilter, BranchInVendorList, branchInVendorListDecoder } from '../types/vendorBranch';
import settings from "../config/settings";

setupInterceptorsTo(axios)
axios.defaults.baseURL = settings.baseApiUrl;

export async function createVendorBranch(vendorBranch: VendorBranchCreation): Promise<Result<VendorBranchCreateResponse, GenericErrors>> {
  try {
    const { data } = await axios.post("vendorbranch/create", vendorBranch);
    return Ok(guard(object({ data: vendorBranchCreateResponseDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}

export async function editVendorBranch(vendorBranch: VendorBranchEdit): Promise<Result<VendorBranchEditResponse, GenericErrors>> {
  try {
    const { data } = await axios.post("vendorbranch/update", vendorBranch);
    return Ok(guard(object({ data: vendorBranchEditResponseDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}

export async function getVendorBranchList(index: number, searchWith: string, vendorId: string): Promise<MultipleVendorBranchDetails> {
  var url = `vendorbranch/list?Page=${index}&vendorId=${vendorId}`;
  if (searchWith) {
    url += `&Search=${searchWith}`;
  }
  return guard(multipleVendorBranchDetailsDecoder)((await axios.get(url)).data.data);
}

export async function getVendorBranchEditDetails(Id: number): Promise<VendorBranchEditDetails> {
  return guard(vendorBranchEditDetailsDecoder)((await axios.get(`vendorbranch/details?Id=${Id}`)).data.data);
}

export async function deleteVendorBranch(Id: number): Promise<Result<VendorBranchDeleteResponse, GenericErrors>> {
  try {
    const { data } = await axios.post(`vendorbranch/delete?Id=${Id}`);
    return Ok(guard(object({ data: vendorBranchDeleteResponseDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}

export const getVendorBranchNames = async (VendorId: string): Promise<BranchInVendorList> => {
  return guard(branchInVendorListDecoder)((await axios.get(`vendorbranch/get/branchnames?VendorId=${VendorId}`)).data.data);
}