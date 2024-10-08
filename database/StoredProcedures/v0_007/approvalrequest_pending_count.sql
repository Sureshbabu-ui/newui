CREATE OR ALTER PROCEDURE [dbo].[approvalrequest_pending_count] 
    @ApprovalEventCode VARCHAR(32) = NULL,
    @TotalRows    INT OUTPUT,
	@LoggedUserId INT
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
        LEFT JOIN TenantOffice ON TenantOffice.Id = UserInfo.TenantOfficeId
        INNER JOIN MasterEntityData AS UserCategory ON UserInfo.UserCategoryId = UserCategory.Id
    WHERE
        UserInfo.Id = @LoggedUserId;

    SELECT 
        @TotalRows = COUNT(AR.Id)
    FROM ApprovalRequest AR
	INNER JOIN ApprovalRequestDetail ARD ON ARD.ApprovalRequestId =AR.Id
	INNER JOIN EventCondition EC ON EC.Id = AR.EventConditionId
	INNER JOIN ApprovalEvent AE ON AE.Id = AR.ApprovalEventId
	INNER JOIN MasterEntityData RS ON RS.Id = AR.ReviewStatusId
	LEFT JOIN UserRole UR ON UR.RoleId = ARD.RoleId AND UR.UserId =@LoggedUserId
	LEFT JOIN UserInfo UI ON UI.Id = UR.UserId 
	INNER JOIN TenantOffice ON TenantOffice.Id = AR.TenantOfficeId
    INNER JOIN TenantRegion ON TenantRegion.Id = TenantOffice.RegionId
    WHERE 
        (@ApprovalEventCode IS NULL OR 
		AE.EventCode = @ApprovalEventCode) AND
		AR.IsCompleted =0 AND
	    RS.Code NOT IN ('ARS_APRV', 'ARS_DRFT','ARS_CAND') AND
		(
            @UserCategory = 'UCT_FRHO'
            OR (@UserCategory = 'UCT_CPTV' AND @UserOfficeId = AR.TenantOfficeId)
            OR (@UserCategory = 'UCT_FRRO' AND TenantRegion.Id = @UserRegionId)
        ) AND
    (
        ARD.ApproverUserId IS NULL OR 
        ARD.ApproverUserId = @LoggedUserId
    )


END