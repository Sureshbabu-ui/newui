import axios from 'axios';
import { guard } from 'decoders';
import { multipleExistedEmployeeDecoder, MultipleExistedEmployees } from '../types/createdemployee';
import { Engineers, engineersDecoder} from '../types/employee';
import settings from "../config/settings";
import { setupInterceptorsTo } from "../interceptor";

axios.defaults.baseURL = settings.baseApiUrl;
setupInterceptorsTo(axios) 

export async function getServiceEngineers(): Promise<Engineers> {
  return guard(engineersDecoder)((await axios.get(`contract/manpower/list/service-engineers`)).data.data);
}

export async function getManPowerList(search?: string, index?: number, id?: string): Promise<MultipleExistedEmployees> {
  let url = `contract/manpower/list?Page=${index}&ContractId=${id}`;
  if (search) {
    url += `&Search=${search}`;
  }
  return guard(multipleExistedEmployeeDecoder)((await axios.get(url)).data.data);
}