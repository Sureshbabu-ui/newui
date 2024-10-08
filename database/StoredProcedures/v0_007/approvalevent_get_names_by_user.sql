CREATE OR ALTER PROCEDURE [dbo].[approvalevent_get_names_by_user] 
   @LoggedUserId INT
AS
BEGIN
	SELECT 
		DISTINCT AE.Id,
		AE.EventName,
		AE.EventCode
	FROM ApprovalEvent AE 
	INNER JOIN EventCondition EC ON EC.ApprovalEventId = AE.Id AND EC.IsActive = 1 
	INNER JOIN ApprovalWorkflow AWF ON EC.ApprovalWorkflowId= AWF.Id AND AWF.IsActive = 1
	INNER JOIN ApprovalWorkflowDetail AWFD ON AWFD.ApprovalWorkflowId = AWF.Id
	LEFT JOIN UserRole UR ON UR.RoleId = AWFD.ApproverRoleId AND UR.UserId = @LoggedUserId
	LEFT JOIN UserInfo UI ON UI.Id = UR.UserId 

	WHERE 
		AE.IsActive=1
	ORDER BY AE.Id ASC;
END