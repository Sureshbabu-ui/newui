import { Err, Ok, Result } from '@hqoss/monads';
import axios from 'axios';
import {  guard, object } from 'decoders';
import { BankDetails } from '../components/Pages/BankManagement/BankApprovalRequestCreate/BankApprovalRequestCreate.slice';
import settings from '../config/settings';
import {
  ApprovedBankDetails,
  approvedBankDetailsDecoder,
  ApproveBank,
  approveBankDecoder,
  RejectBank,
  rejectBankDecoder,
  createBankDecoder,
  CreateBank,
  ApprovedBankNameList,
  approvedBankNameListDecoder,
  ApprovalRequestChange,
  approvalRequestChangeDecoder,
  EditBankResponse,
  editBankResponseDecoder,
  BankDeleted,
  bankDeletedDecoder,
  BankPendingDetailWithReview,
  bankPendingDetailWithReviewDecoder,
} from '../types/bankManagement';
import { GenericErrors, genericErrorsDecoder } from '../types/error';
import { ApprovalDeleted, approvalDeletedDecoder, PendingApprovalEditResponse, pendingApprovalEditResponseDecoder, PendingApprovalsDetailList, pendingApprovalsDetailListDecoder } from '../types/pendingApproval';
import { BankEditDetails } from '../components/Pages/BankManagement/BankEdit/BankEdit.slice';
import { BankApprovalEditDetail } from '../types/bankApproval';
import { setupInterceptorsTo } from "../interceptor";
axios.defaults.baseURL = settings.baseApiUrl;

export const createBankApprovalRequest=async( bankApprovalRequestDetails: BankDetails): Promise<Result<CreateBank, GenericErrors>> =>{
  try {
    const { data } = await axios.post('approvalrequest/bank', bankApprovalRequestDetails);
    return Ok(guard(object({ data: createBankDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}

export async function editBank(bankDetails: BankEditDetails): Promise<Result<EditBankResponse, GenericErrors>> {
  try {
    const { data } = await axios.put('bank/edit', bankDetails);
    return Ok(guard(object({ data: editBankResponseDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}

export async function getBankApprovalRequests(index: number): Promise<PendingApprovalsDetailList>  {
  var url = `approvalrequest/bank/pending?Page=${index}`; 
  return guard(pendingApprovalsDetailListDecoder)((await axios.get(url)).data.data);
}

export async function disableApprovalRequest(Id: number): Promise<Result<ApprovalDeleted, GenericErrors>> {
  try {
    const { data } = await axios.post('approvalrequests/disable', { Id });
    return Ok(guard(object({ data: approvalDeletedDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}

export async function approveBank(
  ApprovalRequestDetailId: number|null,
  FetchTime: string | null,
  ReviewComment: string|null,
  ReviewStatus: string,
): Promise<Result<ApproveBank, GenericErrors>> {
  try {
    const { data } = await axios.post('approvalrequest/bank/approve', {
      ApprovalRequestDetailId,
      FetchTime,
      ReviewComment,
      ReviewStatus,
    });
    return Ok(guard(object({ data: approveBankDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}

export async function getApprovedBankList(index: number, search: string): Promise<ApprovedBankDetails> {
  var url = `bank/list?Page=${index}`;
  if (search) {
    url += `&Search=${search}`;
  }
  return guard(approvedBankDetailsDecoder)((await axios.get(url)).data.data);
}

export async function rejectApprovalRequest(ApprovalRequestDetailId: number, ReviewComment: string|null): Promise<Result<RejectBank, GenericErrors>> {
  try {
    
    const { data } = await axios.put('approvalrequests/reject', { ApprovalRequestDetailId, ReviewComment });
    return Ok(guard(object({ data: rejectBankDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}
export async function approvalRequestChange(ApprovalRequestDetailId: number, ReviewComment: string|null, ReviewStatus: string): Promise<Result<ApprovalRequestChange, GenericErrors>> {
  try {
    const { data } = await axios.put('approvalrequests/requestchange', { ApprovalRequestDetailId, ReviewComment:ReviewComment, ReviewStatus });
    return Ok(guard(object({ data: approvalRequestChangeDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}

export async function getApprovedBankNameList(): Promise<ApprovedBankNameList> {
  var url = `bank/names`;
  return guard(approvedBankNameListDecoder)((await axios.get(url)).data.data);
}

export async function deleteBank(Id: number): Promise<Result<BankDeleted, GenericErrors>> {
  try {
    const { data } = await axios.put(`bank/delete?Id=${Id}`);
    return Ok(guard(object({ data: bankDeletedDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}

export async function getBankPendingViewDetail(Id: number | string|null): Promise<BankPendingDetailWithReview> {
  return guard(bankPendingDetailWithReviewDecoder)((await axios.get(`bank/pending/${Id}`)).data.data);
}

export async function editPendingBankApproval(BankDetail: BankApprovalEditDetail, Id?: number | null): Promise<Result<PendingApprovalEditResponse, GenericErrors>> {
  try {
    const { data } = await axios.put(`approvalrequest/bank/${Id}`, BankDetail);
    return Ok(guard(object({ data: pendingApprovalEditResponseDecoder}))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  } 
}