CREATE OR ALTER PROCEDURE [dbo].[approvalrequest_draft_count] 
    @ApprovalEventCode    VARCHAR(32),
    @TotalRows    INT OUTPUT,
	@LoggedUserId INT
AS 
BEGIN 
    SET NOCOUNT ON;

	DECLARE @UserCategory VARCHAR(64);
    DECLARE @UserOfficeId INT;
    DECLARE @UserRegionId INT;
	DECLARE @ReviewStatusId INT = (SELECT Id FROM MasterEntityData WHERE Code = 'ARS_DRFT');

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
	INNER JOIN ApprovalEvent AE ON AE.Id = AR.ApprovalEventId
	INNER JOIN MasterEntityData RS ON RS.Id = AR.ReviewStatusId
	INNER JOIN TenantOffice ON TenantOffice.Id = AR.TenantOfficeId
    INNER JOIN TenantRegion ON TenantRegion.Id = TenantOffice.RegionId
    WHERE 
        (@ApprovalEventCode IS NULL OR 
		AE.EventCode = @ApprovalEventCode) AND
		AR.IsCompleted =0 AND
	   (AR.ReviewStatusId = @ReviewStatusId) AND
		(
            @UserCategory = 'UCT_FRHO'
            OR (@UserCategory = 'UCT_CPTV' AND @UserOfficeId = AR.TenantOfficeId)
            OR (@UserCategory = 'UCT_FRRO' AND TenantRegion.Id = @UserRegionId)
        )
END