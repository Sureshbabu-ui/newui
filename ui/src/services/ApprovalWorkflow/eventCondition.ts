import axios from "axios";
import { createEventConditionUpdateResponseDecoder, EventConditionCreate, EventConditionCreateResponseData, eventConditionCreateResponseDataDecoder, EventConditionEdit, EventConditionListDetail, EventConditionListView, eventConditionListViewDecoder, EventConditionSort, EventConditionSortResult, eventConditionSortResultDecoder, EventConditionUpdateResponse } from "../../types/ApprovalWorkflow/eventCondition";
import settings from "../../config/settings";
import { setupInterceptorsTo } from "../../interceptor";
import { guard, object } from "decoders";
import { GenericErrors, genericErrorsDecoder } from "../../types/error";
import { Err, Ok, Result } from "@hqoss/monads";

axios.defaults.baseURL = settings.baseApiUrl;
setupInterceptorsTo(axios)

export const getEventConditionListView = async (EventId: string, search?: string|null): Promise<EventConditionListView> => {
  let url = `eventcondition/list/${EventId}`;
  if (search) {
    url += `?Search=${search}`;
  }
  return guard(eventConditionListViewDecoder)((await axios.get(url)).data.data);
}

export const createEventCondition = async (eventCondition: EventConditionCreate): Promise<Result<EventConditionCreateResponseData, GenericErrors>> => {
  try {
    const { data } = await axios.post('eventcondition/create', eventCondition);
    return Ok(guard(object({ data: eventConditionCreateResponseDataDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}

export const sortEventCondition = async (EventId:string,eventCondition: EventConditionListDetail[]): Promise<Result<EventConditionSortResult, GenericErrors>> => {
  try {
    const { data } = await axios.post(`eventcondition/sort/${EventId}`, eventCondition);
    return Ok(guard(object({ data: eventConditionSortResultDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}

export const editEventCondition = async (EventConditionId:string|null,eventCondition: EventConditionEdit): Promise<Result<EventConditionUpdateResponse, GenericErrors>> => {
  try {
    const { data } = await axios.put(`eventcondition/${EventConditionId}`, eventCondition);
    return Ok(guard(object({ data: createEventConditionUpdateResponseDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}