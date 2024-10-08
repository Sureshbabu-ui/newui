import {  number, Decoder, nullable, object, string } from 'decoders';

export interface AuditLogData {
    TableName: string |null,
      StartDate: string |null,
      EndDate:string |null,
      Action: string |null,
  }
  
  export const auditLogDataDecoder: Decoder<AuditLogData> = object({
    TableName: nullable(string),
    StartDate: nullable(string),
    EndDate: nullable(string),
    Action: nullable(string),
  });

  export interface AuditLog {
    TableName: string |null,
      StartDate: string |null,
      EndDate:string |null,
      Action: string |null,
  }