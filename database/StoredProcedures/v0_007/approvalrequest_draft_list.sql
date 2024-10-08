CREATE OR ALTER  PROCEDURE [dbo].[approvalrequest_draft_list]
    @ApprovalEventCode VARCHAR(32) = NULL,
    @Page INT = 1,
    @PerPage INT = 10,
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
        INNER JOIN TenantOffice ON TenantOffice.Id = UserInfo.TenantOfficeId
        INNER JOIN MasterEntityData AS UserCategory ON UserInfo.UserCategoryId = UserCategory.Id
    WHERE
        UserInfo.Id = @LoggedUserId;

    IF @Page < 1
    SET @Page = 1;
    SELECT 
        AR.Id ApprovalRequestId, 
        AR.Content,
        AE.EventCode EventCode,
        AE.EventName EventName,
        ReviewStatus.Code AS ReviewStatus,
		ReviewStatus.[Name] ReviewStatusName,
        UI.FullName AS CreatedUserName,
		AR.CreatedBy,
		AR.CreatedOn
    FROM ApprovalRequest AR
	INNER JOIN ApprovalEvent AE ON AE.Id = AR.ApprovalEventId
	INNER JOIN UserInfo UI ON UI.Id = AR.CreatedBy
	INNER JOIN TenantOffice ON TenantOffice.Id = AR.TenantOfficeId
    INNER JOIN TenantRegion ON TenantRegion.Id = TenantOffice.RegionId
    INNER JOIN MasterEntityData ReviewStatus ON  ReviewStatus.Id = AR.ReviewStatusId
    WHERE
	(@ApprovalEventCode IS NULL OR 
      AE.EventCode = @ApprovalEventCode) AND
	  (AR.ReviewStatusId = @ReviewStatusId) AND
		AR.IsCompleted = 0 AND
		(
            @UserCategory = 'UCT_FRHO'
            OR (@UserCategory = 'UCT_CPTV' AND @UserOfficeId = AR.TenantOfficeId)
            OR (@UserCategory = 'UCT_FRRO' AND TenantRegion.Id = @UserRegionId)
        )
    ORDER BY AR.Id DESC 
    OFFSET (@Page - 1) * @PerPage ROWS FETCH NEXT @PerPage ROWS ONLY;
END