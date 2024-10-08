CREATE OR ALTER PROCEDURE [dbo].[servicerequestassignee_list] 
	@ServiceRequestId INT
AS
BEGIN 
	SET NOCOUNT ON;
	SELECT
		SRA.Id,
		SRA.CreatedOn,
		Assignee.FullName AS AssigneeName,
		SRA.AcceptedOn,
		SRA.StartsFrom,
		SEV.StartsOn AS VisitStartDate,
		AssignedBy.FullName AS AssignedBy,
		SEV.EndsOn AS VisitCloseDate,
		SRA.AssigneeId,
		SRA.IsDeleted,
		SRA.EndsOn
	FROM
		ServiceRequestAssignee SRA
		LEFT JOIN serviceEngineerVisit SEV ON SEV.ServiceRequestAssignmentId = SRA.Id
		LEFT JOIN UserInfo AssignedBy ON AssignedBy.Id = SRA.CreatedBy
		LEFT JOIN UserInfo Assignee ON Assignee.Id = SRA.AssigneeId
	WHERE 
		SRA.ServiceRequestId = @ServiceRequestId
	ORDER BY
		SRA.Id DESC 
END
