import axios from 'axios';
import { guard, object } from 'decoders';
import { Cities, CityCreate, CityCreateResult, CityDeleted, CityEdit, CityUpdateResult, MultipleCity, cityCreateResultDecoder, cityDecoder, cityDeletedDecoder, cityUpdateResultDecoder, multipleCityDecoder } from '../types/city';
import { Err, Ok, Result } from '@hqoss/monads';
import { GenericErrors, genericErrorsDecoder } from '../types/error';
import settings from "../config/settings";
import { setupInterceptorsTo } from "../interceptor";

axios.defaults.baseURL = settings.baseApiUrl;
setupInterceptorsTo(axios)

export const getFilteredCitiesByState = async (StateId: string): Promise<Cities> => {
  return guard(cityDecoder)((await axios.get(`city/get/all/in/state?StateId=${StateId}`)).data.data);
}

export const getAllCities = async (SearchWith?: string, index?: number, Search?: string): Promise<MultipleCity> => {
  let url = `city/list/?Page=${index}`;
  if (SearchWith) {
    url += `&SearchWith=${SearchWith}`;
  }
  if (Search) {
    url += `&Search=${Search}`;
  }
  return guard(multipleCityDecoder)((await axios.get(url)).data.data);
}

export const cityCreate = async (city: CityCreate): Promise<Result<CityCreateResult, GenericErrors>> => {
  try {
    const { data } = await axios.post('city/create', city);
    return Ok(guard(object({ data: cityCreateResultDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}

export const cityEdit = async (city: CityEdit): Promise<Result<CityUpdateResult, GenericErrors>> => {
  try {
    const { data } = await axios.put('city/update', city);
    return Ok(guard(object({ data: cityUpdateResultDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}

export async function deleteCity(Id: number): Promise<Result<CityDeleted, GenericErrors>> {
  try {
    const { data } = await axios.put(`city/delete?Id=${Id}`);
    return Ok(guard(object({ data: cityDeletedDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}