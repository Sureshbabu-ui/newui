import axios from 'axios';
import { guard} from 'decoders';
import { ContractVersion, contractversionDecoder } from '../types/contracthistory';
import settings from "../config/settings";
import { setupInterceptorsTo } from "../interceptor";

axios.defaults.baseURL = settings.baseApiUrl;
setupInterceptorsTo(axios) 

export async function getContractVersion(id?: string): Promise<ContractVersion> {
    return guard(contractversionDecoder)((await axios.get(`contracthistory/list?ContractId=${id}`)).data.data)
  }