import axios from "axios";
import settings from "../config/settings";
import { guard, object } from "decoders";
import { setupInterceptorsTo } from "../interceptor";
import { createDecoder, editDecoder, FutureUpdateDeleted, FutureUpdateDeletedDecoder, FutureUpdateEdit, FutureUpdateEditResponse, futureUpdateListDecoder, FutureUpdatesCreate, FutureUpdatesCreateResponse, FutureUpdatesList, OldContractDetail, oldContractDetailDecoder } from "../types/futureupdates";
import { GenericErrors, genericErrorsDecoder } from "../types/error";
import { Err, Ok, Result } from "@hqoss/monads";

axios.defaults.baseURL = settings.baseApiUrl;
setupInterceptorsTo(axios)

export const getFutureUpdateList = async ( ContractId: number,search?: string): Promise<FutureUpdatesList> => {
    let url = `futureupdates/list?`;
    if (search) {
        url += `&Search=${search}`;
    }
    if (ContractId) {
        url += `&ContractId=${ContractId}`;
    }
    return guard(futureUpdateListDecoder)((await axios.get(url)).data.data);
}
export const futureUpdateCreate = async (futureupdate: FutureUpdatesCreate): Promise<Result<FutureUpdatesCreateResponse, GenericErrors>> => {
    try {
        const { data } = await axios.post('futureupdates/create', futureupdate);
        return Ok(guard(object({ data: createDecoder }))(data).data);
    } catch ({ response: { data } }) {
        return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
    }
}
export async function getOldContractDetails(Id: number): Promise<OldContractDetail> {
    return guard(oldContractDetailDecoder)((await axios.get(`futureupdates/oldcontractdetails?ContractId=${Id}`)).data.data);
}
export const futureUpdateEdit = async (role: FutureUpdateEdit): Promise<Result<FutureUpdateEditResponse, GenericErrors>> => {
    try {
        const { data } = await axios.put('futureupdates/update', role);
        return Ok(guard(object({ data: editDecoder }))(data).data);
    } catch ({ response: { data } }) {
        return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
    }
}
export async function deleteFutureUpdate(Id: number): Promise<Result<FutureUpdateDeleted, GenericErrors>> {
    try {
      const { data } = await axios.put(`futureupdates/delete?Id=${Id}`);
      return Ok(guard(object({ data: FutureUpdateDeletedDecoder }))(data).data);
    } catch ({ response: { data } }) {
      return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
    }
  }
