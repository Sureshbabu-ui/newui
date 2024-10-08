import axios from "axios";
import {  ApprovalWorkflowCreate, ApprovalWorkflowCreateResponseData, ApprovalWorkflowEdit, ApprovalWorkflowList, ApprovalWorkflowSelect, ApprovalWorkflowUpdateResult,  approvalWorkflowCreateResponseDataDecoder,  approvalWorkflowListDecoder, approvalWorkflowSelectDecoder,  createApprovalWorkflowUpdateDecoder } from "../types/approvalWorkflow";
import { guard, object } from "decoders";
import { GenericErrors, genericErrorsDecoder } from "../types/error";
import { Err, Ok, Result } from "@hqoss/monads";
import settings from "../config/settings";
import { setupInterceptorsTo } from "../interceptor";

axios.defaults.baseURL = settings.baseApiUrl;
setupInterceptorsTo(axios) 

export const getApprovalWorkflowList = async (search?: string): Promise<ApprovalWorkflowList> => {
  let url = `approvalworkflow/list`;
  if (search) {
    url += `?Search=${search}`; 
  } 
  return guard(approvalWorkflowListDecoder)((await axios.get(url)).data.data);
}

  export const approvalWorkflowEdit = async (approvalworkflow: ApprovalWorkflowEdit): Promise<Result<ApprovalWorkflowUpdateResult, GenericErrors>> => {
    try {
      const { data } = await axios.put('approvalworkflow/update', approvalworkflow);
      return Ok(guard(object({ data: createApprovalWorkflowUpdateDecoder }))(data).data);
    } catch ({ response: { data } }) {
      return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
    }
  }
  
  export const createApprovalWorkflow = async (approvalWorkflowDetail: ApprovalWorkflowCreate): Promise<Result<ApprovalWorkflowCreateResponseData, GenericErrors>> => {
    try {
      const { data } = await axios.post('approvalworkflow/create', approvalWorkflowDetail);
      return Ok(guard(object({ data: approvalWorkflowCreateResponseDataDecoder }))(data).data);
    } catch ({ response: { data } }) {
      return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
    }
  }
  
    export async function getApprovalWorkflowNames(): Promise<ApprovalWorkflowSelect> {
    return guard(approvalWorkflowSelectDecoder)((await axios.get(`approvalworkflow/get/names`)).data.data);
  }