CREATE OR ALTER PROCEDURE [dbo].[approvalrequest_pending_list]
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
		ARD.Id ApprovalRequestDetailId,
        AR.Content,
        AE.EventCode EventCode,
        AE.EventName EventName,
        ReviewStatus.Code AS ReviewStatus,
		ReviewStatus.[Name] ReviewStatusName,
        CU.FullName AS CreatedUserName, 
		AR.CreatedBy,
		AR.CreatedOn,
		ARD.RoleId
    FROM ApprovalRequest AR
	INNER JOIN ApprovalRequestDetail ARD ON ARD.ApprovalRequestId =AR.Id
	LEFT JOIN UserRole UR ON UR.RoleId = ARD.RoleId AND UR.UserId = @LoggedUserId
	LEFT JOIN UserInfo UI ON UI.Id = UR.UserId 
	INNER JOIN TenantOffice ON TenantOffice.Id = AR.TenantOfficeId
    INNER JOIN TenantRegion ON TenantRegion.Id = TenantOffice.RegionId
	INNER JOIN EventCondition EC ON EC.Id = AR.EventConditionId
	INNER JOIN ApprovalEvent AE ON AE.Id = AR.ApprovalEventId
    LEFT JOIN UserInfo CU ON AR.CreatedBy = CU.Id 
    LEFT JOIN UserInfo RU ON ARD.ReviewedBy = RU.Id 
    INNER JOIN MasterEntityData ReviewStatus ON  ReviewStatus.Id = ARD.ReviewStatusId
    WHERE
	(@ApprovalEventCode IS NULL OR 
      AE.EventCode = @ApprovalEventCode) AND
	  (ReviewStatus.Code NOT IN ('ARS_APRV' , 'ARS_DRFT','ARS_CAND')) AND
		AR.IsCompleted = 0 AND
		(
            @UserCategory = 'UCT_FRHO'
            OR (@UserCategory = 'UCT_CPTV' AND @UserOfficeId = AR.TenantOfficeId)
            OR (@UserCategory = 'UCT_FRRO' AND TenantRegion.Id = @UserRegionId)
        ) AND
    (
        ARD.ApproverUserId IS NULL OR 
        ARD.ApproverUserId = @LoggedUserId
    )

    ORDER BY AR.Id DESC 
    OFFSET (@Page - 1) * @PerPage ROWS FETCH NEXT @PerPage ROWS ONLY;
END