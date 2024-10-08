import { Decoder, array, boolean, date, nullable, number, object, string, iso8601 } from "decoders";

export interface AssigneesList {
    Id: number;
    CreatedOn: string;
    AcceptedOn: string | null;
    AssigneeName: string;
    AssignedBy: string;
    VisitStartDate: string | null;
    VisitCloseDate: string | null;
    EndsOn: string | null;
    AssigneeId: number;
    IsDeleted: Boolean;
    StartsFrom: string;
}

export const assigneesListDecoder: Decoder<AssigneesList> = object({
    Id: number,
    CreatedOn: string,
    AcceptedOn: nullable(string),
    AssigneeName: string,
    AssignedBy: string,
    VisitStartDate: nullable(string),
    VisitCloseDate: nullable(string),
    EndsOn: nullable(string),
    AssigneeId: number,
    IsDeleted: boolean,
    StartsFrom: string
})

export interface ServiceRequestAssignees {
    ServiceRequestAssignees: AssigneesList[]
    TotalRows: number
}

export const ServiceRequestAssigneesDecoder: Decoder<ServiceRequestAssignees> = object({
    ServiceRequestAssignees: array(assigneesListDecoder),
    TotalRows: number,
});

export interface AssignEngineer {
    ServiceRequestId: number | string;
    AssigneeId: number | string;
    StartsFrom: string;
    Remarks: string;
    IsFirstAssignment: boolean;
}

export interface AssignEngineerResult {
    IsEngineerAssigned: Boolean;
}

export const assignEngineerResultDecoder: Decoder<AssignEngineerResult> = object({
    IsEngineerAssigned: boolean,
});

export interface DeleteEngineer {
    Id: number | string;
    DeletedReason: string;
    IsDeleted: Boolean;
}

export interface DeleteEngineerResponse {
    isDeleted: Boolean;
}

export const deleteEngineerDecoder: Decoder<DeleteEngineerResponse> = object({
    isDeleted: boolean,
});

export interface EngineersNames {
    Id: number;
    FullName: string;
    RoleId: number;
}

export const engineersnamesDecoder: Decoder<EngineersNames> = object({
    Id: number,
    FullName: string,
    RoleId: number
});

export interface EngineersNamesList {
    EngineersNames: EngineersNames[];
}

export const engineersnameslistDecoder: Decoder<EngineersNamesList> = object({
    EngineersNames: array(engineersnamesDecoder),
});

export interface ExistingAssigneeShedules {
    Id: number,
    StartsFrom: string;
    CustomerReportedIssue: string;
    WorkOrderNumber: string;
    Assignee: string;
}

export const existshedulesDecoder: Decoder<ExistingAssigneeShedules> = object({
    Id: number,
    StartsFrom: string,
    CustomerReportedIssue: string,
    WorkOrderNumber: string,
    Assignee: string
});

export interface MultipleExistingAssigneeShedules {
    ExistingShedules: ExistingAssigneeShedules[]
}

export const MultipleExistingAssigneeShedulesDecoder: Decoder<MultipleExistingAssigneeShedules> = object({
    ExistingShedules: array(existshedulesDecoder)
})

// 
export interface BulkEngineerAssign {
    ServiceRequestId: number | string;
    AssigneeId: number | string;
    StartsFrom: string;
    Remarks: string | null,
    IsChecked: boolean
}
