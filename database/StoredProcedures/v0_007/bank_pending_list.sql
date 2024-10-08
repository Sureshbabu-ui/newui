﻿CREATE OR ALTER PROCEDURE [dbo].[bank_pending_list]
    @TableName VARCHAR(16) = NULL,
    @Page INT = 1,
	@LoggedUserId INT,
    @PerPage INT = 10
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
        AR.Content,
        AE.EventCode,
        AE.EventName,
        ReviewStatus.Code AS ReviewStatus,
		ReviewStatus.[Name] ReviewStatusName,
        CU.FullName AS CreatedUserName, 
		AR.CreatedBy,
		AR.CreatedOn
    FROM ApprovalRequest AR
	INNER JOIN EventCondition EC ON EC.Id = AR.EventConditionId
	INNER JOIN ApprovalEvent AE ON AE.Id = EC.ApprovalEventId
	INNER JOIN ApprovalWorkflow AWF ON AWF.Id = EC.ApprovalWorkflowId
    LEFT JOIN UserInfo CU ON AR.CreatedBy = CU.Id 
    INNER JOIN MasterEntityData ReviewStatus ON  ReviewStatus.Id = AR.ReviewStatusId
	INNER JOIN TenantOffice ON TenantOffice.Id = AR.TenantOfficeId
    INNER JOIN TenantRegion ON TenantRegion.Id = TenantOffice.RegionId
    WHERE
		(@TableName IS NULL OR 
        AE.EventCode = @TableName) AND
		(ReviewStatus.Code NOT IN ('ARS_APRV' , 'ARS_DRFT'))  AND
		(
            @UserCategory = 'UCT_FRHO'
            OR (@UserCategory = 'UCT_CPTV' AND @UserOfficeId = AR.TenantOfficeId)
            OR (@UserCategory = 'UCT_FRRO' AND TenantRegion.Id = @UserRegionId)
        ) AND 
		AR.IsCompleted =0
    ORDER BY AR.Id DESC 
    OFFSET (@Page - 1) * @PerPage ROWS FETCH NEXT @PerPage ROWS ONLY;
END