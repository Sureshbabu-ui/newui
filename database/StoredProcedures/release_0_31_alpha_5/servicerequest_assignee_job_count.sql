CREATE OR ALTER PROCEDURE [dbo].[servicerequest_assignee_job_count]
    @UserId INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT
        COUNT(CASE WHEN SRA.IsAssigneeAccepted = 1 THEN 1 ELSE NULL END) AS InProgressJobCount,
        COUNT(CASE WHEN SRA.IsAssigneeAccepted = 0 THEN 1 ELSE NULL END) AS PendingJobCount
    FROM ServiceRequest SR
    LEFT JOIN ServiceRequestAssignee SRA ON SRA.ServiceRequestId = SR.Id
    WHERE 
        SRA.EndsOn IS NULL AND 
        SRA.AssigneeId = @UserId;
END