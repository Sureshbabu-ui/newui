import axios from "axios";
import settings from "../config/settings";
import { guard, object } from "decoders";
import { Err, Ok, Result } from '@hqoss/monads';
import { GenericErrors, genericErrorsDecoder } from "../types/error";
import { BankBranchCreate, BankBranchCreateResult, BankBranchDeleted, BankBranchInfo, BankBranchList, BankBranchUpdateResult, BranchInBankDetail, BranchInBankList, SelectedBankBranch, bankBranchDeletedDecoder, bankBranchListDecoder, branchInBankDetailDecoder, branchInBankListDecoder, createBankBranchDecoder, createBankBranchUpdateDecoder, selectedBankBranchDecoder } from "../types/bankBranch";
import { setupInterceptorsTo } from "../interceptor";

axios.defaults.baseURL = settings.baseApiUrl;
setupInterceptorsTo(axios) 

export const getBankBranchList = async (search?: string, index?: number): Promise<BankBranchList> => {
  let url = `bankbranch/list?Page=${index}`;
  if (search) {
    url += `&Search=${search}`;
  }
  return guard(bankBranchListDecoder)((await axios.get(url)).data.data);
}

export const bankBranchCreate = async (division: BankBranchCreate): Promise<Result<BankBranchCreateResult, GenericErrors>> => {
  try {
    const { data } = await axios.post('bankbranch/create', division);
    return Ok(guard(object({ data: createBankBranchDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}

export const bankBranchEdit = async (bankbranch: BankBranchInfo): Promise<Result<BankBranchUpdateResult, GenericErrors>> => {
  try {
    const { data } = await axios.put('bankbranch/update', bankbranch);
    return Ok(guard(object({ data: createBankBranchUpdateDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}

export const getFilteredBankBranchesByBank = async (BankId: number | string): Promise<BranchInBankList> => {
  return guard(branchInBankListDecoder)((await axios.get(`bankbranch/get/all/in/bank?BankId=${BankId}`)).data.data);
}

export async function getBankBranchDetails(Id: string): Promise<SelectedBankBranch> {
  return guard(selectedBankBranchDecoder)((await axios.get(`bankbranch/details?BankBranchInfoId=${Id}`)).data.data);
}

export const getBankBranchNames = async (): Promise<BranchInBankList> => {
  return guard(branchInBankListDecoder)((await axios.get(`bankbranch/get/branchnames`)).data.data);
}

export async function deleteBankBranch(Id: number): Promise<Result<BankBranchDeleted, GenericErrors>> {
  try {
    const { data } = await axios.put(`bankbranch/delete?Id=${Id}`);
    return Ok(guard(object({ data: bankBranchDeletedDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}