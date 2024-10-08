CREATE OR ALTER PROCEDURE [dbo].[bank_pending_count] 
    @TableName    VARCHAR(16),
	@LoggedUserId INT,
    @TotalRows    INT OUTPUT
AS 
BEGIN 
    SET NOCOUNT ON;
	DECLARE @UserCategory VARCHAR(64);
    DECLARE @UserOfficeId INT;
    DECLARE @UserRegionId INT;

    SELECT
        @UserCategory = UserCategory.Code,
        @UserOfficeId = TenantOfficeId,
        @UserRegionId = RegionId
    FROM UserInfo
        INNER JOIN TenantOffice ON TenantOffice.Id = UserInfo.TenantOfficeId
        INNER JOIN MasterEntityData AS UserCategory ON UserInfo.UserCategoryId = UserCategory.Id
    WHERE
        UserInfo.Id = @LoggedUserId;

    SELECT 
        @TotalRows = COUNT(AR.Id)
    FROM ApprovalRequest AR
	INNER JOIN EventCondition EC ON EC.Id = AR.EventConditionId
	INNER JOIN ApprovalEvent AE ON AE.Id = EC.ApprovalEventId
	INNER JOIN ApprovalWorkflow AWF ON AWF.Id = EC.ApprovalWorkflowId
	INNER JOIN MasterEntityData RS ON RS.Id = AR.ReviewStatusId
	INNER JOIN TenantOffice ON TenantOffice.Id = AR.TenantOfficeId
    INNER JOIN TenantRegion ON TenantRegion.Id = TenantOffice.RegionId
    WHERE 
        (@TableName IS NULL OR 
		AE.EventCode = @TableName) AND
	    RS.Code NOT IN ('ARS_APRV', 'ARS_DRFT') AND
		(
            @UserCategory = 'UCT_FRHO'
            OR (@UserCategory = 'UCT_CPTV' AND @UserOfficeId = AR.TenantOfficeId)
            OR (@UserCategory = 'UCT_FRRO' AND TenantRegion.Id = @UserRegionId)
        ) AND 
		AR.IsCompleted =0
END

