import { Decoder, nullable, object, number, string, array, boolean } from "decoders"

export interface EngineerDetails {
	Id: number
	FullName: string
}

export interface EngineerDetailsArray extends Array<EngineerDetails> { }

export const engineerDetailsDecoder: Decoder<EngineerDetails> = object({
	Id: number,
	FullName: string
})

export const engineerDetailsDecoderDecoderArray: Decoder<EngineerDetailsArray> = array(engineerDetailsDecoder)

export interface PreAmcScheduledResponse {
	IsPreAmcScheduled: Boolean;
}

export const PreAmcScheduledResponseDecoder: Decoder<PreAmcScheduledResponse> = object({
	IsPreAmcScheduled: boolean
});

export interface PreAmcEngineerScheduledResponse {
	IsEngineerScheduled: Boolean;
}

export const preAmcEngineerScheduledResponseDecoder: Decoder<PreAmcEngineerScheduledResponse> = object({
	IsEngineerScheduled: boolean
});

export interface PreAmcScheduledEngineersDetails {
	Id: number,
	EngineerName: string
	PlannedFrom: string
	PlannedTo: string;
	ExecutedFrom: string | null;
	ExecutedTo: string | null;
	AssignedBy: string;
	AssignedOn: string
	ContractCustomerSiteId: number;
}

export interface PreAmcScheduledEngineersDetailsArray extends Array<PreAmcScheduledEngineersDetails> { }

export const preAmcScheduledEngineersDetailsDecoder: Decoder<PreAmcScheduledEngineersDetails> = object({
	Id: number,
	EngineerName: string,
	PlannedFrom: string,
	PlannedTo: string,
	ExecutedFrom: nullable(string),
	ExecutedTo: nullable(string),
	AssignedBy: string,
	AssignedOn: string,
	ContractCustomerSiteId: number,
})

export const preAmcScheduledEngineersDetailsArrayDecoder: Decoder<PreAmcScheduledEngineersDetailsArray> = array(preAmcScheduledEngineersDetailsDecoder)

export interface PreAmcScheduleDetails {
	Id: number | null
	ScheduleNumber: string | null
	StartsOn: string | null;
	EndsOn: string | null;
	ContractCustomerSiteId: number | null
}

export interface PreAmcScheduleDetailsArray extends Array<PreAmcScheduleDetails> { }

export const preAmcScheduleDetailsDecoder: Decoder<PreAmcScheduleDetails> = object({
	Id: nullable(number),
	ScheduleNumber: nullable(string),
	StartsOn: nullable(string),
	EndsOn: nullable(string),
	ContractCustomerSiteId: nullable(number),
})

export const preAmcScheduleDetailsDecoderArray: Decoder<PreAmcScheduleDetailsArray> = array(preAmcScheduleDetailsDecoder)

export interface AssignedEngineerExistingSchedule {
	PlannedFrom: string;
	PlannedTo: string;
	EngineerId: number;
}

export const existshedulesDecoder: Decoder<AssignedEngineerExistingSchedule> = object({
	PlannedFrom: string,
	PlannedTo: string,
	EngineerId: number
});

export interface MultipleAssignedEngineerExistingSchedule {
	ExistingShedules: AssignedEngineerExistingSchedule[]
}

export const MultipleAssignedEngineerExistingScheduleDecoder: Decoder<MultipleAssignedEngineerExistingSchedule> = object({
	ExistingShedules: array(existshedulesDecoder)
})

export interface PreAmcPenidngCount {
	TotalContract: number;
	TotalSite: number;
	PreAmcPendingAssets: number;
}

export const preAmcPendingCountDecoder: Decoder<PreAmcPenidngCount> = object({
	TotalContract: number,
	TotalSite: number,
	PreAmcPendingAssets: number
});

export interface MultiplePreAmcPenidngCount {
	PreAmcPendingCount: PreAmcPenidngCount
}

export const multiplePreAmcPenidngCountDecoder: Decoder<MultiplePreAmcPenidngCount> = object({
	PreAmcPendingCount: preAmcPendingCountDecoder
})

export interface PreAmcPendingSiteDetail {
	Id: number;
	ContractNumber: string;
	CustomerName: string;
	SiteName: string;
	Address: string;
	PrimaryContactName: string;
	PrimaryContactPhone: string;
}

export const preAmcPendingSiteDetailDecoder: Decoder<PreAmcPendingSiteDetail> = object({
	Id: number,
	ContractNumber: string,
	CustomerName: string,
	SiteName: string,
	Address: string,
	PrimaryContactName: string,
	PrimaryContactPhone: string,
});

export interface PreAmcPendingSiteList {
	CustomerSites: PreAmcPendingSiteDetail[];
	TotalRows: number
	PerPage: number
}

export const preAmcPendingSiteListDecoder: Decoder<PreAmcPendingSiteList> = object({
	CustomerSites: array(preAmcPendingSiteDetailDecoder),
	TotalRows: number,
	PerPage: number
});

export interface BulkPreAmcPendingUpdate {
	IsUpdated: Boolean;
}

export const bulkPreAmcPendingUpdateDecoder: Decoder<BulkPreAmcPendingUpdate> = object({
	IsUpdated: boolean,
})  