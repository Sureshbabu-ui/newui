CREATE OR ALTER PROCEDURE [dbo].[approvalrequest_name_exist_list]
    @CustomerName VARCHAR(64) = NULL,
    @ApprovalEventCode VARCHAR(32),
    @Count INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
	DECLARE @ApporvalEventId INT = (SELECT Id FROM ApprovalEvent WHERE EventCode = @ApprovalEventCode )
    SELECT @Count = COUNT(*)
    FROM ApprovalRequest AR
		INNER JOIN MasterEntityData MED ON MED.Id = AR.ReviewStatusId
		INNER JOIN EventCondition EV ON EV.ApprovalEventId = @ApporvalEventId
    WHERE 
		(MED.Code != 'ARS_APRV' AND MED.Code != 'ARS_RJTD') AND 
		JSON_VALUE(AR.Content, '$.Name') LIKE '%' + @CustomerName + '%';
END