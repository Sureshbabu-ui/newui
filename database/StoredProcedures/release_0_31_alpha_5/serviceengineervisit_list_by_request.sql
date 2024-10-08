CREATE OR ALTER PROCEDURE [dbo].[serviceengineervisit_list_by_request]
	@ServiceRequestId INT
AS
BEGIN 
    SET NOCOUNT ON;
    SELECT 
        SIV.Id,
		SIV.StartsOn,
		SIV.EndsOn,
		SIV.EngineerNote,
		SIV.IsRemoteSupport,
		Assignee.FullName AS AssignedEngineer	     
	FROM serviceEngineerVisit  AS SIV
	INNER JOIN ServiceRequestAssignee  AS SRA ON SIV.ServiceRequestAssignmentId=SRA.Id
	INNER JOIN UserInfo  AS Assignee ON Assignee.Id = SRA.AssigneeId
	LEFT JOIN MasterEntityData AS TravelMode ON TravelMode.Id = SIV.TravelModeId
	WHERE SRA.ServiceRequestId = @ServiceRequestId		
    ORDER BY 
		SIV.Id Desc
END