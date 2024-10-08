import { Err, Ok, Result } from '@hqoss/monads';
import axios from 'axios';
import { guard, object } from 'decoders';
import { GenericErrors, genericErrorsDecoder } from '../types/error';
import { Engineers, engineersDecoder } from '../types/employee';
import { ContractManpowerAllocation, ContractManpowerAllocationList, ManPowerAllocationEditResponse, ManPowerAllocationResponse, ManpowerAllocationCreate, ManpowerAllocationDetails, contractManpowerAllocationDecoder, contractManpowerAllocationListDecoder, createManPowerAllocationDecoder, manPowerAllocationEditDecoder } from '../types/contractmanpowerallocation';
import settings from "../config/settings";
import { setupInterceptorsTo } from "../interceptor";

axios.defaults.baseURL = settings.baseApiUrl;
setupInterceptorsTo(axios) 

export async function manpowerAllocationCreate(allocation: ManpowerAllocationCreate): Promise<Result<ManPowerAllocationResponse, GenericErrors>> {
  try {
    const { data } = await axios.post("contract/manpowerallocation/create", allocation);
    return Ok(guard(object({ data: createManPowerAllocationDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}

export async function editManpowerAllocation(manpower: ManpowerAllocationDetails): Promise<Result<ManPowerAllocationEditResponse, GenericErrors>> {
    try {
      const { data } = await axios.put('contract/manpowerallocation/update', manpower);
      return Ok(guard(object({ data: manPowerAllocationEditDecoder }))(data).data);
    } catch ({ response: { data } }) {
      return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
    }
  }

  export async function getServiceEngineers(): Promise<Engineers> {
    return guard(engineersDecoder)((await axios.get(`contract/manpower/list/service-engineers`)).data.data);
  }

export async function getSelectedManpowerAllocation(Id: string): Promise<ContractManpowerAllocation> {
  return guard(contractManpowerAllocationDecoder)((await axios.get(`contract/manpowerallocation/details?AllocationId=${Id}`)).data.data);
}
  
  export async function getManPowerAllocationList(search?: string, index?: number, id?: string): Promise<ContractManpowerAllocationList> {
    let url = `contract/manpowerallocation/list?Page=${index}&ContractId=${id}`;
    if (search) {
      url += `&Search=${search}`;
    }
    return guard(contractManpowerAllocationListDecoder)((await axios.get(url)).data.data);
  }