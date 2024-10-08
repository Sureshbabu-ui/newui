import axios from 'axios';
import { guard, object } from 'decoders';
import {  LocatioSettingEditResponse, locationSettingDetails, locationSettingDetailsResponse, locationSettingDetailsResponseDecoder, locationSettingEditDecoder } from '../types/locationSetting';
import { Err, Ok, Result } from '@hqoss/monads';
import { GenericErrors, genericErrorsDecoder } from '../types/error';
import settings from "../config/settings";
import { setupInterceptorsTo } from "../interceptor";

axios.defaults.baseURL = settings.baseApiUrl;
setupInterceptorsTo(axios) 

export const getLocationSetting=async(Id:number): Promise<Result<locationSettingDetailsResponse,GenericErrors>>=>{
    const { data } = await axios.get(`locationsetting/details?LocationId=${Id}`);
   return Ok(guard(object({data:locationSettingDetailsResponseDecoder}))(data).data);
}

export const editLocationSetting=async(locationSetting: locationSettingDetails): Promise<Result<LocatioSettingEditResponse, GenericErrors>> =>{
    try {
      const { data } = await axios.put('locationsetting/update', locationSetting);
      return Ok(guard(object({ data: locationSettingEditDecoder}))(data).data);
    } catch ({ response: { data } }) {
      return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
    }
  }