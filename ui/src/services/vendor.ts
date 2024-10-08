import { Err, Ok, Result } from '@hqoss/monads';
import axios from 'axios';
import { guard, object } from 'decoders';
import { GenericErrors, genericErrorsDecoder } from '../types/error';
import { GstVendorDetails, MultipleVendorDetails, ResponseVendorData, ResponseVendorDeleted, ResponseVendorUpdateData, VendorEdit, VendorEditDetails, VendorForCreation, VendorNames, VendorSearchForFilter, gstVendorDetailsDecoder, multipleVendorDetailsDecoder, responseVendorDataDecoder, responseVendorDeletedDecoder, responseVendorUpdateDataDecoder, selectedVendorDetails, selectedVendorDetailsDecoder, vendorEditDetailsDecoder, vendorNameDecoder } from '../types/vendor';
import { setupInterceptorsTo } from '../interceptor';
import settings from "../config/settings";

setupInterceptorsTo(axios)
axios.defaults.baseURL = settings.baseApiUrl;

export async function createVendor(tenant: VendorForCreation): Promise<Result<ResponseVendorData, GenericErrors>> {
  try {
    const { data } = await axios.post("vendor/create", tenant);
    return Ok(guard(object({ data: responseVendorDataDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}

export async function editVendor(tenant: VendorEdit): Promise<Result<ResponseVendorUpdateData, GenericErrors>> {
  try {
    const { data } = await axios.post("vendor/update", tenant);
    return Ok(guard(object({ data: responseVendorUpdateDataDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}

export async function getVendorList(index: number, searchWith: string, filters?: VendorSearchForFilter): Promise<MultipleVendorDetails> {
  var url = `vendor/list?Page=${index}`;
  if (searchWith && filters) {
    url += `&SearchWith=${searchWith}&Filters=${JSON.stringify(filters)}`;
  }
  return guard(multipleVendorDetailsDecoder)((await axios.get(url)).data.data);
}

export async function getVendorEditDetails(Id: number): Promise<VendorEditDetails> {
  return guard(vendorEditDetailsDecoder)((await axios.get(`vendor/details?VendorId=${Id}`)).data.data);
}

export async function getGstVendorTypes(): Promise<GstVendorDetails> {
  return guard(gstVendorDetailsDecoder)((await axios.get(`vendor/gstvendortypes`)).data.data);
}

export async function getClickedVendorDetails(Id: string): Promise<selectedVendorDetails> {
  return guard(selectedVendorDetailsDecoder)((await axios.get(`vendor/get/selecteddetails?Id=${Id}`)).data.data);
}

export async function deleteVendor(Id: number): Promise<Result<ResponseVendorDeleted, GenericErrors>> {
  try {
    const { data } = await axios.post(`vendor/delete?Id=${Id}`);
    return Ok(guard(object({ data: responseVendorDeletedDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}

export async function getVendorNames(VendorTypeId: number): Promise<VendorNames> {
  return guard(vendorNameDecoder)((await axios.get(`vendor/names?VendorTypeId=${VendorTypeId}`)).data.data);
}