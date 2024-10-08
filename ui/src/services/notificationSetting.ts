import axios from "axios";
import {  NotificationList, NotificationListResponse, NotificationListResponseDecoder, NotificationUpdateResult, notificationUpdateResultDecoder } from "../types/notificationSetting";
import { Err, Ok, Result } from "@hqoss/monads";
import { guard, object } from "decoders";
import { GenericErrors, genericErrorsDecoder } from "../types/error";
import settings from "../config/settings";
import { setupInterceptorsTo } from "../interceptor";

axios.defaults.baseURL = settings.baseApiUrl;
setupInterceptorsTo(axios) 

export const getEventWiseNotificationList=async(Id:number): Promise<Result<NotificationListResponse,GenericErrors>>=>{
    const { data } = await axios.get(`notificationsetting/get/eventwiselist?BusinessEventId=${Id}`);
   return Ok(guard(object({data:NotificationListResponseDecoder}))(data).data);   
}

export const getRoleWiseNotificationList=async(Id:number): Promise<Result<NotificationListResponse,GenericErrors>>=>{
    const { data } = await axios.get(`notificationsetting/get/rolewiselist?RoleId=${Id}`);
   return Ok(guard(object({data:NotificationListResponseDecoder}))(data).data);   
}

export const updateNotifications = async (NotificationSettings: NotificationList[]): Promise<Result<NotificationUpdateResult, GenericErrors>> => {
    try {
        const { data } = await axios.post('notificationsetting/update', {NotificationSettings:NotificationSettings}); 
        return Ok(guard(object({ data: notificationUpdateResultDecoder}))(data).data);
    } catch ({ response: { data } }) {
        return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
    }
}    