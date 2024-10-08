import { Err, Ok, Result } from '@hqoss/monads';
import axios from 'axios';
import { guard, object } from 'decoders';
import { GenericErrors, genericErrorsDecoder } from '../types/error';
import { createManPowerDecoder, ManPowerData } from "../types/createdemployee";
import { ManpowerSummaryCreation, manPowerEditDecoder, ManPowerEditResponse, ManPowerEditTemplate, ContractManpowerSummaryList, contractManpowerSummaryListDecoder, SelectedManPowerDetails, selectedManPowerDetailsDecoder } from '../types/manpower';
import settings from "../config/settings";
import { setupInterceptorsTo } from "../interceptor";

axios.defaults.baseURL = settings.baseApiUrl;
setupInterceptorsTo(axios)

export async function createManpowerAllocation(employee: ManpowerSummaryCreation): Promise<Result<ManPowerData, GenericErrors>> {
  try {
    const { data } = await axios.post('contract/manpowersummary/create', employee);
    return Ok(guard(object({ data: createManPowerDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}

export async function editEmployee(manpower: ManPowerEditTemplate): Promise<Result<ManPowerEditResponse, GenericErrors>> {
  try {
    const { data } = await axios.put('contract/manpowersummary/update', manpower);
    return Ok(guard(object({ data: manPowerEditDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}

export async function getSelectedManpowerSummary(Id: string): Promise<SelectedManPowerDetails> {
  return guard(selectedManPowerDetailsDecoder)((await axios.get(`contract/manpowersummary/get/details?ContractManpowerId=${Id}`)).data.data);
}

export async function getManPowerSummaryList(search?: string, index?: number, id?: string): Promise<ContractManpowerSummaryList> {
  let url = `contract/manpowersummary/list?Page=${index}&ContractId=${id}`;
  if (search) {
    url += `&Search=${search}`;
  }
  return guard(contractManpowerSummaryListDecoder)((await axios.get(url)).data.data);
}