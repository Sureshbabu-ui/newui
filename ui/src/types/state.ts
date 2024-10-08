import { array, boolean, Decoder, number, object, string } from 'decoders';

export interface StateDetails {
  Id: number;
  Name: string;
}

export const stateDetailsDecoder: Decoder<StateDetails> = object({
  Id: number,
  Name: string, 
});

export interface States {
  States: StateDetails[];
}

export const stateDecoder: Decoder<States> = object({
  States: array(stateDetailsDecoder),
});

export interface StateDetailsSelect {  
  value: any,
  label: any
}

export interface StatesSelect {
  States: StateDetailsSelect[];
}

export interface StatesList {
  Id: number;
  Name: string;
  CountryId: number,
  Code:string;
  GstStateName:string;
  GstStateCode:string;
}

export const StateListDecoder: Decoder<StatesList> = object({
  Id: number,
  Name: string,
  CountryId: number,
  Code:string,
  GstStateName:string,
  GstStateCode:string,
});

export interface MultipleStates {
  States: StatesList[];
  totalRows: number;
  PerPage: number;
}

export const multipleStateDecoder: Decoder<MultipleStates> = object({
  States: array(StateListDecoder),
  totalRows: number,
  PerPage: number
});

export interface StateCreate {
  CountryId: number;
  Name: string;
  Code: string;
  GstStateName: string;
  GstStateCode: string;
}

export interface StateEdit {
  Id:number;
  CountryId: number;
  Name: string;
  Code: string;
  GstStateName: string;
  GstStateCode: string;
}

export interface StateCreateResult {
  IsStateCreated: boolean;
}

export const stateCreateResultDecoder: Decoder<StateCreateResult> = object({
  IsStateCreated: boolean,
});

export interface StateUpdateResult {
  IsStateUpdated: boolean;
}

export const stateUpdateResultDecoder: Decoder<StateUpdateResult> = object({
  IsStateUpdated: boolean,
});

export interface StateDeleted {
  IsDeleted: Boolean;
}

export const stateDeletedDecoder: Decoder<StateDeleted> = object({
  IsDeleted: boolean,
});