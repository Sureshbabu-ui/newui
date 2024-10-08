CREATE OR ALTER PROCEDURE [dbo].[assignee_avilability_check_list]
    @AssigneeId VARCHAR(128)
AS
BEGIN 
    SET NOCOUNT ON;
    SELECT  
		SRA.Id,
        SRA.StartsFrom,
		SR.CustomerReportedIssue,
		SR.WorkOrderNumber,
		UI.FullName AS Assignee
    FROM ServiceRequestAssignee SRA
	LEFT JOIN ServiceRequest SR ON SRA.ServiceRequestId = SR.Id
	LEFT JOIN UserInfo UI ON UI.Id = SRA.AssigneeId
    WHERE 
		SRA.AssigneeId IN (SELECT VALUE FROM STRING_SPLIT(@AssigneeId, ',')) AND
		SRA.EndsOn IS NULL
	ORDER BY SRA.StartsFrom DESC
END