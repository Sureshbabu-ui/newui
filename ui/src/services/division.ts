import axios from "axios";
import settings from "../config/settings";
import { DivisionList, divisionListDecoder, DivisionCreate, DivisionCreateResult, createDecoder, GetDivisions, getDivisionsDecoder, DivisionEdit, DivisionEditResult, editDivisionDecoder, DivisionDeleted, divisionDeletedDecoder } from "../types/division";
import { guard, object } from "decoders";
import { Err, Ok, Result } from '@hqoss/monads';
import { GenericErrors, genericErrorsDecoder } from "../types/error";
import { setupInterceptorsTo } from "../interceptor";

axios.defaults.baseURL = settings.baseApiUrl;
setupInterceptorsTo(axios) 

export const getDivisionList = async (search?: string, index?: number): Promise<DivisionList> => {
  let url = `division/list?Page=${index}`;
  if (search) {
    url += `&Search=${search}`;
  }
  return guard(divisionListDecoder)((await axios.get(url)).data.data);
}

export const divisionCreate = async (division: DivisionCreate): Promise<Result<DivisionCreateResult, GenericErrors>> => {
  try {
    const { data } = await axios.post('division/create', division);
    return Ok(guard(object({ data: createDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}

export const divisionEdit = async (division: DivisionEdit): Promise<Result<DivisionEditResult, GenericErrors>> => {
  try {
    const { data } = await axios.put('division/update', division);
    return Ok(guard(object({ data: editDivisionDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}

export async function getDivisionNames(): Promise<GetDivisions> {
  return guard(getDivisionsDecoder)((await axios.get(`division/get/names`)).data.data);
}

export async function deleteDivision(Id: number): Promise<Result<DivisionDeleted, GenericErrors>> {
  try {
    const { data } = await axios.put(`division/delete?Id=${Id}`);
    return Ok(guard(object({ data: divisionDeletedDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}