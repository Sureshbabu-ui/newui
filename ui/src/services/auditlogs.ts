import axios from 'axios';
import { AuditLog} from '../types/auditlogs';
import settings from "../config/settings";
import { setupInterceptorsTo } from "../interceptor";
import { getBrowserTimeZone } from '../helpers/formats';

axios.defaults.baseURL = settings.baseApiUrl;
setupInterceptorsTo(axios) 

export const submitAuditLogs = async (auditlog:AuditLog) => {
  const { TableName, StartDate, EndDate, Action } = auditlog;
  let url = `auditlog/download/list?&TimeZone=${getBrowserTimeZone()}`;
  if (TableName) {
    url += `&TableName=${TableName}`
  }
  if (StartDate) {
    url += `&StartDate=${StartDate}`
  }
  if (EndDate) {
    url += `&EndDate=${EndDate}`
  }
  if (Action) {
    url += `&Action=${Action}`
  }
  return await axios.get(url, {
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json',
    }
  });
}
