import { array, boolean, Decoder, nullable, number, object, string } from "decoders";

export interface EventConditionMasterListDetail {
  MasterColumnId: number;
  MasterTableId: number;
  ApprovalEventId: number;
  ColumnName: string;
  ColumnDisplayName,
  ColumnSequence: number;
  ValueType:string;
  TableName: string;
  TableSequence: number
  }

  export const eventConditionMasterListDetailDecoder : Decoder<EventConditionMasterListDetail> = object({
  MasterColumnId: number,
  MasterTableId: number,
  ApprovalEventId: number,
  ColumnName: string,
  ColumnDisplayName:string,
  ColumnSequence: number,
  ValueType:string,
  TableName: string,
  TableSequence: number
  });  
  
  export interface EventConditionMasterList{
    EventConditionMasters:EventConditionMasterListDetail[]
  }

  export const eventConditionMasterListDecoder: Decoder<EventConditionMasterList> = object({
    EventConditionMasters: array(eventConditionMasterListDetailDecoder)
  });
