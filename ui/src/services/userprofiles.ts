
import { guard, object } from 'decoders';
import { SelectedProfile, SelectedProfileStatus, selectedUserDetailsDecoder, selectedUserStatusDecoder } from '../types/userprofile';
import axios from 'axios';
import settings from "../config/settings";
import { setupInterceptorsTo } from "../interceptor";

axios.defaults.baseURL = settings.baseApiUrl;
setupInterceptorsTo(axios) 

export async function getClickedProfileDetails(userId: string): Promise<SelectedProfile> {
  return guard(selectedUserDetailsDecoder)((await axios.get(`user/get/details?UserId=${userId}`)).data.data);
}

export async function getProfileDetails(): Promise<SelectedProfile> {
  return guard(selectedUserDetailsDecoder)((await axios.get(`user/profile/details`)).data.data);
}
export async function getClickedUserStatus(userId: string): Promise<SelectedProfileStatus> {
  return guard(selectedUserStatusDecoder)((await axios.get(`user/status?UserId=${userId}`)).data.data);
}