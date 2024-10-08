import { Decoder, array, number, object, string } from "decoders";

export interface EntityDetails {
    Id: number;
    Name: string;
    Code:string;
  }
export const entityDetailsDecoder: Decoder<EntityDetails> = object({
    Id: number,
    Name: string,
    Code:string
  });

  export interface ValuesInMasterDataByTable {
    MasterData: EntityDetails[];
  }
  
  export const valuesInMasterDataByTableDecoder: Decoder<ValuesInMasterDataByTable> = object({
    MasterData: array(entityDetailsDecoder),
  });

  export interface valuesInMasterDataByTableDetailsSelect {
    value: any,
    label: any,
    code?:any
  }
  
  export interface valuesInMasterDataByTableSelect {
    MasterData: valuesInMasterDataByTableDetailsSelect[];
  }  

  export interface BaseTableName {
    value: any;
    label: any;
  }
    
  export interface BaseTableNameList {
    TableNames: BaseTableName[];
  }
  
  export interface TableName {
    TableName: string;
  }
  
  export const tableNameDecoder: Decoder<TableName> = object({
    TableName: string,
  });
  
  export interface TableNameList {
    TableNames: TableName[];
  }
  
  export const tableNameListDecoder: Decoder<TableNameList> = object({
    TableNames: array(tableNameDecoder),
  });