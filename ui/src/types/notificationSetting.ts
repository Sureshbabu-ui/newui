import { Decoder, array, boolean, number, object, string } from "decoders";
import { BusinessEventDetail } from "./businessEvent";
import { GroupDetail } from "./group";

export interface NotificationList {
  Id: number;
  RoleId: number;
  Name: string;
  BusinessEventId: number;
  Email: boolean;
}

export const NotificationListDecoder: Decoder<NotificationList> = object({
  Id: number,
  RoleId: number,
  Name: string,
  BusinessEventId: number,
  Email: boolean,
});

export interface NotificationListResponse {
  NotificationList: NotificationList[],
}

export const NotificationListResponseDecoder: Decoder<NotificationListResponse> = object({
  NotificationList: array(NotificationListDecoder),
});

export interface NotificationEdit {
  GroupId: number,
  BusinessEventId: number,
  App: boolean;
  Email: boolean;
  Push: boolean;
  Sms: boolean;
}

export interface NotificationUpdateResult {
  IsNotificationUpdated: boolean;
}

export const notificationUpdateResultDecoder: Decoder<NotificationUpdateResult> = object({
  IsNotificationUpdated: boolean,
});

export interface NotificationSelectTitleDetails {
  value: any,
  label: any
}

export interface NotificationSelectTitle {
  NotificationTitles: NotificationSelectTitleDetails[];
}