import { Decoder, array, boolean, nullable, number, object, string } from "decoders";

export interface EventDetail {
    EventId: number|null;
    EventGroupName : string|null;
    EventName: string|null;
 }
  
  export const eventDetailDecoder: Decoder<EventDetail> = object({
    EventId: number,
    EventGroupName: string,
    EventName: nullable(string)
  });
  

  export interface EventConditionListDetail {
    Id: number|null;
    Sequence:number;
    ConditionName : string|null;
    ConditionValue : string|null;
    ApprovalWorkflowId:number|null;
    WorkflowName : string|null;
    IsActive :boolean;
 }
  
  export const eventConditionListDetailDecoder: Decoder<EventConditionListDetail> = object({
    Id: number,
    Sequence:number,
    ConditionName: string,
    ConditionValue:nullable(string),
    ApprovalWorkflowId:nullable(number),
    WorkflowName:nullable(string),
    IsActive :boolean, 
  });
  
  export interface EventConditionListView {
    EventConditionList: EventConditionListDetail[];
    EventDetail:EventDetail,
    TotalRows: number;
  }
  
  export const eventConditionListViewDecoder: Decoder<EventConditionListView> = object({  
    EventConditionList: array(eventConditionListDetailDecoder),
    EventDetail:eventDetailDecoder,
    TotalRows: number,
  });

  export interface EventConditionCreate {
    ApprovalEventId: number|null|string;
    ApprovalWorkflowId: null|number,
    ConditionName:null|string,
    ConditionValue:null|string
 }

 export interface EventConditionCreateResponseData {
  IsEventConditionCreated: Boolean;
}

export const eventConditionCreateResponseDataDecoder: Decoder<EventConditionCreateResponseData> = object({
  IsEventConditionCreated: boolean
})

export interface EventConditionEdit {
  EventConditionId: number|null|string;
  ApprovalWorkflowId: null|number,
  ConditionName:null|string,
  ConditionValue:null|string
}

export interface EventConditionUpdateResponse {
  IsEventConditionUpdated: Boolean;
}

export const createEventConditionUpdateResponseDecoder: Decoder<EventConditionUpdateResponse> = object({
  IsEventConditionUpdated: boolean,
});

export interface EventConditionSort {
  EventConditionList: EventConditionListDetail[],
}

export interface EventConditionSortResult {
  IsEventConditionSorted: Boolean;
}

export const eventConditionSortResultDecoder: Decoder<EventConditionSortResult> = object({
  IsEventConditionSorted: boolean,
});