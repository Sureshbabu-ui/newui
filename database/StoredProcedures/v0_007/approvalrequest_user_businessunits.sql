CREATE OR ALTER PROCEDURE [dbo].[approvalrequest_user_businessunits]
    @ApprovalRequestId INT
AS
BEGIN 
    SET NOCOUNT ON;   
	SELECT 
		MED.[Name] AS BusinessUnit, 
		MED.Id AS BusinessUnitId
	FROM 
		ApprovalRequest AR
		INNER JOIN MasterEntityData MED ON MED.Id IN (
			SELECT VALUE 
			FROM STRING_SPLIT(JSON_VALUE(AR.Content, '$.BusinessUnits'), ',')
		)
	WHERE 
		AR.Id = @ApprovalRequestId
END