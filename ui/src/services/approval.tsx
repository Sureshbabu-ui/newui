import { Err, Ok, Result } from '@hqoss/monads';
import axios from 'axios';
import { guard, object } from 'decoders';
import { GenericErrors, genericErrorsDecoder } from '../types/error';
import {
  ApprovalRequestDetailWithReview,
  approvalRequestDetailWithReviewDecoder,
  PartApprovalDetail,
  partApprovalDetailDecoder,
  PendingApprovalEditResponse,
  pendingApprovalEditResponseDecoder,
  PendingApprovalsDetailList,
  pendingApprovalsDetailListDecoder,
  SelectedPendingApprovalDetail,
  selectedPendingApprovalDetailDecoder,
  UserApprovalDetailWithReview,
  userApprovalDetailWithReviewDecoder,
} from '../types/pendingApproval';
import { SelectedBusinessUnits, selectedBusinessUnitsDecoder } from '../types/user';
import settings from "../config/settings";
import { setupInterceptorsTo } from "../interceptor";
import { CustomerApprovalDetailWithReview, customerApprovalDetailWithReviewDecoder } from '../types/customerpendingapproval';

axios.defaults.baseURL = settings.baseApiUrl;
setupInterceptorsTo(axios)

export async function getAllApprovalRequests(index: number, tableName: string | null): Promise<PendingApprovalsDetailList> {
  var url = `approvalrequests/get/all?Page=${index}`;
  if (tableName) {
    url += `&TableName=${tableName}`
  }
  return guard(pendingApprovalsDetailListDecoder)((await axios.get(url)).data.data);
}

export async function getClickedPendingDetails(Id: number | string, tableName: string): Promise<SelectedPendingApprovalDetail> {
  return guard(selectedPendingApprovalDetailDecoder)((await axios.get(`approvalrequests/get/details?ApprovalRequestId=${Id}&TableName=${tableName}`)).data.data);
}

export async function getClickedBankPendingDetails(Id: number | string, tableName: string | null): Promise<ApprovalRequestDetailWithReview> {
  return guard(approvalRequestDetailWithReviewDecoder)((await axios.get(`approvalrequest/bank/${Id}?TableName=${tableName}`)).data.data);
}

export async function editPendingApproval(ContentParsed: Object, Id?: number | string): Promise<Result<PendingApprovalEditResponse, GenericErrors>> {
  try {
    const { data } = await axios.put('approvalrequests/update', { ContentParsed, Id });
    return Ok(guard(object({ data: pendingApprovalEditResponseDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}

export async function getClickedPartPendingDetails(Id: number | string, tableName?: string | null): Promise<PartApprovalDetail> {
  return guard(partApprovalDetailDecoder)((await axios.get(`approvalrequests/get/part/details?ApprovalRequestId=${Id}&TableName=${tableName}`)).data.data);
}

export async function getClickedUserApprovalDetails(Id: number | string): Promise<UserApprovalDetailWithReview> {
  return guard(userApprovalDetailWithReviewDecoder)((await axios.get(`approvalrequest/user/${Id}`)).data.data);
}

export async function getPendingUserBusinessUnits(Id: number): Promise<SelectedBusinessUnits> {
  return guard(selectedBusinessUnitsDecoder)((await axios.get(`approvalrequests/selected/businessunits?ApprovalRequestId=${Id}`)).data.data);
}

export async function getCustomerApprovalDetails(Id: number): Promise<CustomerApprovalDetailWithReview> {
  return guard(customerApprovalDetailWithReviewDecoder)((await axios.get(`approvalrequest/customer/${Id}`)).data.data);
}