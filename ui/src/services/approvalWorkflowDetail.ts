import axios from "axios";
 import { ApprovalWorkflowDetailCreate, ApprovalWorkflowDetailCreateResponseData, ApprovalWorkflowDetailEdit, ApprovalWorkflowDetailUpdateResult,  ApprovalWorkflowView, approvalWorkflowDetailCreateResponseDataDecoder, approvalWorkflowViewDecoder, createApprovalWorkflowDetailUpdateDecoder } from "../types/approvalWorkflowDetail";
import { guard, object } from "decoders";
import { GenericErrors, genericErrorsDecoder } from "../types/error";
import { Err, Ok, Result } from "@hqoss/monads";
import settings from "../config/settings";
import { setupInterceptorsTo } from "../interceptor";

axios.defaults.baseURL = settings.baseApiUrl;
setupInterceptorsTo(axios) 

export const getApprovalWorkflowView = async (ApprovalWorkflowId:string,search?: string): Promise<ApprovalWorkflowView> => {
  let url = `approvalworkflow/detail/${ApprovalWorkflowId}`;
    if (search) {
      url += `?Search=${search}`; 
    } 
    return guard(approvalWorkflowViewDecoder)((await axios.get(url)).data.data);
  }

  export const createApprovalWorkflowDetail = async (approvalWorkflowDetail: ApprovalWorkflowDetailCreate): Promise<Result<ApprovalWorkflowDetailCreateResponseData, GenericErrors>> => {
    try {
      const { data } = await axios.post('approvalworkflow/detail/create', approvalWorkflowDetail);
      return Ok(guard(object({ data: approvalWorkflowDetailCreateResponseDataDecoder }))(data).data);
    } catch ({ response: { data } }) {
      return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
    }
  }
  
  export const editApprovalWorkflowDetail = async (approvalWorkflowDetail: ApprovalWorkflowDetailEdit): Promise<Result<ApprovalWorkflowDetailUpdateResult, GenericErrors>> => {
    try {
      const { data } = await axios.post('approvalworkflow/detail/update', approvalWorkflowDetail);
      return Ok(guard(object({ data: createApprovalWorkflowDetailUpdateDecoder }))(data).data);
    } catch ({ response: { data } }) {
      return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
    }
  }