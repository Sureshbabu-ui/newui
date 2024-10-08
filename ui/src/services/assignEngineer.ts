import { Err, Ok, Result } from "@hqoss/monads";
import { GenericErrors, genericErrorsDecoder } from "../types/error";
import axios from "axios";
import { guard, object } from "decoders";
import { AssignEngineer, AssignEngineerResult, BulkEngineerAssign, DeleteEngineer, EngineersNamesList, MultipleExistingAssigneeShedules, MultipleExistingAssigneeShedulesDecoder, ServiceRequestAssignees, ServiceRequestAssigneesDecoder, assignEngineerResultDecoder, engineersnameslistDecoder } from "../types/assignEngineer";
import settings from "../config/settings";
import { setupInterceptorsTo } from "../interceptor";

axios.defaults.baseURL = settings.baseApiUrl;
setupInterceptorsTo(axios) 

export const BulkEngineersAssign = async (assignengineer: BulkEngineerAssign[]): Promise<Result<AssignEngineerResult, GenericErrors>> => {
  try {
    const { data } = await axios.post('servicerequestassignee/create', assignengineer);
    return Ok(guard(object({ data: assignEngineerResultDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}

export const AssignEngineersCreate = async (assignengineer: AssignEngineer): Promise<Result<AssignEngineerResult, GenericErrors>> => {
  try {
    const { data } = await axios.post('servicerequestassignee/create', [assignengineer]);
    return Ok(guard(object({ data: assignEngineerResultDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}

export const AssignEngineerForCall = async (assignengineer: AssignEngineer): Promise<Result<AssignEngineerResult, GenericErrors>> => {
  try {
    const { data } = await axios.post('servicerequestassignee/assign/engineer', assignengineer);
    return Ok(guard(object({ data: assignEngineerResultDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}

export async function checkShedulesExists(startsfrom: string, AssigneeId: string): Promise<MultipleExistingAssigneeShedules> {
  return guard(MultipleExistingAssigneeShedulesDecoder)(
    (await axios.get(`servicerequestassignee/assignee/avilability?StartsFrom=${startsfrom}&AssigneeId=${AssigneeId}`)).data.data
  );
}

export async function deleteAssignee(engineer: DeleteEngineer): Promise<{ IsDeleted: Boolean }> {
  const { data } = await axios.post('servicerequestassignee/delete', { Id: engineer.Id, IsDeleted: !engineer.IsDeleted, DeletedReason: engineer.DeletedReason });
  return data.data.isInserted;
}

export const assigneesList = async (Id: number): Promise<ServiceRequestAssignees> => {
  const url = `servicerequestassignee/list?ServiceRequestId=${Id}`;
  return guard(ServiceRequestAssigneesDecoder)((await axios.get(url)).data.data);
}

export async function getEngineersNames(): Promise<EngineersNamesList> {
  return guard(engineersnameslistDecoder)((await axios.get(`servicerequestassignee/engineers/names`)).data.data);
}