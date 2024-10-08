import axios from 'axios';
import { guard, object } from 'decoders';
import { Countries, CountryCreate, CountryCreateResult, CountryDeleted, CountryEdit, CountryUpdateResult, MultipleCountry, countryCreateResultDecoder, countryDecoder, countryDeletedDecoder, countryUpdateResultDecoder, multipleCountryDecoder } from '../types/country';
import { Err, Ok, Result } from '@hqoss/monads';
import { GenericErrors, genericErrorsDecoder } from '../types/error';
import settings from "../config/settings";
import { setupInterceptorsTo } from "../interceptor";

axios.defaults.baseURL = settings.baseApiUrl;
setupInterceptorsTo(axios) 

export const getCountries=async(): Promise<Countries> =>{
  return guard(countryDecoder)((await axios.get(`country/get/all`)).data.data);
}

export const getCountryList = async (SearchWith?: string, index?: number): Promise<MultipleCountry> => {
  let url = `country/list/?Page=${index}`;
  if (SearchWith) {
    url += `&SearchWith=${SearchWith}`;
  }
  return guard(multipleCountryDecoder)((await axios.get(url)).data.data);
}

export const countryCreate = async (country: CountryCreate): Promise<Result<CountryCreateResult, GenericErrors>> => {
  try {
    const { data } = await axios.post('country/create', country);
    return Ok(guard(object({ data: countryCreateResultDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}

export const countryEdit = async (country: CountryEdit): Promise<Result<CountryUpdateResult, GenericErrors>> => {
  try {
    const { data } = await axios.put('country/update', country);
    return Ok(guard(object({ data: countryUpdateResultDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}

export async function deleteCountry(Id: number): Promise<Result<CountryDeleted, GenericErrors>> {
  try {
    const { data } = await axios.put(`country/delete?Id=${Id}`);
    return Ok(guard(object({ data: countryDeletedDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}