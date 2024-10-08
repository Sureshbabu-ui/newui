CREATE OR ALTER PROCEDURE [dbo].[serviceengineervisit_and_closure_details]
    @ServiceRequestId INT
AS
BEGIN
SET NOCOUNT ON;
	
	SELECT 
		UI.FullName ServiceEngineer,
		UI.EmployeeCode,
		SRA.CreatedOn AssignedOn,
		SRA.StartsFrom ScheduledOn,
		SRA.AcceptedOn,
		SEV.StartsOn AS VisitStartsOn,
		SEV.EndsOn AS VisitEndsOn,
		SEV.EngineerNote AS Remarks,
		MED.Name AS CallStatus
	FROM
		ServiceRequest SR
		LEFT JOIN ServiceRequestAssignee SRA ON SRA.ServiceRequestId = @ServiceRequestId
		LEFT JOIN serviceEngineerVisit SEV ON SEV.ServiceRequestAssignmentId = SRA.Id
		LEFT JOIN MasterEntityData MED ON MED.Id = SR.CaseStatusId
		LEFT JOIN UserInfo UI ON UI.Id = SRA.AssigneeId
	WHERE
		    SR.Id = @ServiceRequestId 
END