import { guard, object } from 'decoders';
import axios from 'axios';
import { Err, Ok, Result } from '@hqoss/monads';
import { GenericErrors, genericErrorsDecoder } from '../types/error';
import {  AppSettingAppKeyValues, AppSettingDecoder, AppSettingDetail, AppSettingEditResponse, AppSettings,  SelectedAppKeyValueDetails,  appSettingAppKeyValues,  appSettingEditDecoder } from '../types/appSetting';
import settings from "../config/settings";
import { setupInterceptorsTo } from "../interceptor";

axios.defaults.baseURL = settings.baseApiUrl;
setupInterceptorsTo(axios) 

export async function getAppSettingDetails(): Promise<AppSettings> {
  return guard(AppSettingDecoder)((await axios.get(`appsetting/list`)).data.data);
}
export const updateAppSetting = async (appSetting: SelectedAppKeyValueDetails): Promise<Result<AppSettingEditResponse, GenericErrors>> => {
  try {
    const { data } = await axios.put('appsetting/update', appSetting);
    return Ok(guard(object({ data: appSettingEditDecoder }))(data).data);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}

export async function getAppKeyValues(AppKeyName: string): Promise<AppSettingAppKeyValues> {
  let url = `appsetting/get/details`
  if (AppKeyName) {
    url += `?AppKeyName=${AppKeyName}`
  }
  return guard(appSettingAppKeyValues)((await axios.get(url)).data.data);
}