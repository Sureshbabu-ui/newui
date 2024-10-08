import axios from "axios";
import { guard, object } from "decoders";
import { BulkPreAmcPendingUpdate, EngineerDetailsArray, MultipleAssignedEngineerExistingSchedule, MultipleAssignedEngineerExistingScheduleDecoder, MultiplePreAmcPenidngCount, PreAmcEngineerScheduledResponse, PreAmcPendingSiteList, PreAmcScheduledEngineersDetailsArray, PreAmcScheduledResponse, PreAmcScheduledResponseDecoder, bulkPreAmcPendingUpdateDecoder, engineerDetailsDecoderDecoderArray, multiplePreAmcPenidngCountDecoder, preAmcEngineerScheduledResponseDecoder, preAmcPendingSiteListDecoder, preAmcScheduledEngineersDetailsArrayDecoder } from "../types/contractPreAmc";
import { AssignEngineer } from "../components/Pages/ContractSubMenu/PreAMC/PreAMCAssignEngineer.Slice";
import { Err, Ok, Result } from "@hqoss/monads";
import { GenericErrors, genericErrorsDecoder } from "../types/error";
import { PreAmcScheduleDetailsArray, preAmcScheduleDetailsDecoderArray } from "../types/contractPreAmc";
import { Schedule } from "../components/Pages/ContractSubMenu/PreAMC/PreAMCManagement.slice";
import settings from "../config/settings";
import { setupInterceptorsTo } from "../interceptor";

axios.defaults.baseURL = settings.baseApiUrl;
setupInterceptorsTo(axios)

export async function GetContractPreAmcSchedule(ContractId: string, CustomerSiteId: number): Promise<PreAmcScheduleDetailsArray> {
  const url = `contract/preamc/inspection/schedule/list?ContractId=${ContractId}&CustomerSiteId=${CustomerSiteId}`
  return guard(preAmcScheduleDetailsDecoderArray)((await axios.get(url)).data.data);
}

export async function contractPreAmcSchedule(scheduledDetails: Schedule): Promise<Result<PreAmcScheduledResponse, GenericErrors>> {
  try {
    const { data } = await axios.post('contract/preamc/inspection/schedule', scheduledDetails);
    return Ok(guard(object({ data: PreAmcScheduledResponseDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}

export async function getServiceEngineers(): Promise<EngineerDetailsArray> {
  return guard(engineerDetailsDecoderDecoderArray)((await axios.get(`contract/preamc/inspection/service/engineer/list`)).data.data);
}

export async function contractPreAmcAssignEngineer(scheduledDetails: AssignEngineer): Promise<Result<PreAmcEngineerScheduledResponse, GenericErrors>> {
  try {
    const { data } = await axios.post('contract/preamc/inspection/assign/engineer', scheduledDetails);
    return Ok(guard(object({ data: preAmcEngineerScheduledResponseDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}

export async function GetContractPreAmcScheduledEngineers(ContractId: string, PreAmcScheduleId: string): Promise<PreAmcScheduledEngineersDetailsArray> {
  const url = `contract/preamc/inspection/assigned/engineer/list?ContractId=${ContractId}&PreAmcScheduleId=${PreAmcScheduleId}`
  return guard(preAmcScheduledEngineersDetailsArrayDecoder)((await axios.get(url)).data.data);
}

export async function getAssignedEngineerSchedule(EngineerId: string): Promise<MultipleAssignedEngineerExistingSchedule> {
  return guard(MultipleAssignedEngineerExistingScheduleDecoder)(
    (await axios.get(`contract/preamc/inspection/schedule/exist/check?EngineerId=${EngineerId}`)).data.data
  );
}

export async function getPreAMCPendingCount(): Promise<MultiplePreAmcPenidngCount> {
  return guard(multiplePreAmcPenidngCountDecoder)((await axios.get(`contract/preamc/pending/count`)).data.data);
}

export async function getAllPreAmcPendingSiteList(search?: string | null, index?: number, CustomerId?: number | null, ContractId?: number | null): Promise<PreAmcPendingSiteList> {
  let url = `contract/preamc/pendingsites/list?Page=${index}`;
  if (search) {
    url += `&Search=${search}`;
  }
  if (CustomerId) {
    url += `&CustomerId=${CustomerId}`;
  }
  if (ContractId) {
    url += `&ContractId=${ContractId}`;
  }
  return guard(preAmcPendingSiteListDecoder)((await axios.get(url)).data.data);
}

export const BulkPreAmcPendingAssetUpdate = async (AssetDetails): Promise<Result<BulkPreAmcPendingUpdate, GenericErrors>> => {
  try {
    const { data } = await axios.post('contract/asset/bulk/preamcupdate', AssetDetails);
    return Ok(guard(object({ data: bulkPreAmcPendingUpdateDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}