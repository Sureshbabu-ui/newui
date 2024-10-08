import axios from 'axios';
import { guard, object } from 'decoders';
import { MultipleStates, StateCreate, StateCreateResult, StateDeleted, StateEdit, StateUpdateResult, States, multipleStateDecoder, stateCreateResultDecoder, stateDecoder, stateDeletedDecoder, stateUpdateResultDecoder } from '../types/state';
import { Err, Ok, Result } from '@hqoss/monads';
import { GenericErrors, genericErrorsDecoder } from '../types/error';
import settings from "../config/settings";
import { setupInterceptorsTo } from "../interceptor";

axios.defaults.baseURL = settings.baseApiUrl;
setupInterceptorsTo(axios) 

export const getFilteredStatesByCountry=async(CountryId:string): Promise<States> =>{
  return guard(stateDecoder)((await axios.get(`state/get/all/in/country?CountryId=${CountryId}`)).data.data);
}

export const getAllStates = async (SearchWith?: string, index?: number): Promise<MultipleStates> => {
  let url = `state/list/?Page=${index}`;
  if (SearchWith) {
    url += `&Search=${SearchWith}`;
  }
  return guard(multipleStateDecoder)((await axios.get(url)).data.data);
}

export const stateCreate = async (state: StateCreate): Promise<Result<StateCreateResult, GenericErrors>> => {
  try {
    const { data } = await axios.post('state/create', state);
    return Ok(guard(object({ data: stateCreateResultDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}

export const stateEdit = async (state: StateEdit): Promise<Result<StateUpdateResult, GenericErrors>> => {
  try {
    const { data } = await axios.post('state/update', state);
    return Ok(guard(object({ data: stateUpdateResultDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}

export async function deleteState(Id: number): Promise<Result<StateDeleted, GenericErrors>> {
  try {
    const { data } = await axios.put(`state/delete?Id=${Id}`);
    return Ok(guard(object({ data: stateDeletedDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}