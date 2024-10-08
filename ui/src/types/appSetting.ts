import { number, Decoder, object, string, array, boolean, } from 'decoders';


export interface AppSettingDetail {
  Id: number | string;
  Appkey: string;
  AppValue: number | string;
}
export const AppSettingDetailDecoder: Decoder<AppSettingDetail> = object({
  Id: number,
  Appkey: string,
  AppValue: string
});

export interface AppSettings {
  AppSettings: AppSettingDetail[];
}

export const AppSettingDecoder: Decoder<AppSettings> = object({
  AppSettings: array(AppSettingDetailDecoder),
});

export interface AppSettingEditResponse {
  isUpdated: Boolean;
}

export const appSettingEditDecoder: Decoder<AppSettingEditResponse> = object({
  isUpdated: boolean,
});

export interface AppKeyValue {
  AppKey: string;
  AppValue: string;
}

export const appKeyValueDecoder: Decoder<AppKeyValue> = object({
  AppKey: string,
  AppValue: string
})

export interface AppSettingAppKeyValues {
  AppKeyValues: AppKeyValue;
}

export const appSettingAppKeyValues: Decoder<AppSettingAppKeyValues> = object({
  AppKeyValues: appKeyValueDecoder,
});

export interface SelectedAppKeyValueDetails {
  Appkey: number | string;
  AppValue: number | string;
}
export const selectedAppKeyValueDetailsDecoder: Decoder<SelectedAppKeyValueDetails> = object({
  Appkey: string,
  AppValue: string
})
