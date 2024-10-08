CREATE OR ALTER PROCEDURE [dbo].[approvalrequest_details]
	@ApprovalRequestDetailId	INT,
	@ApprovalWorkflowCode VARCHAR(16),
	@LoggedUserId INT

AS
BEGIN 
	SET NOCOUNT ON;

	DECLARE @ApprovalRequestId INT = (SELECT ApprovalRequestId FROM ApprovalRequestDetail WHERE Id= @ApprovalRequestDetailId)

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
		GETUTCDATE() AS 'FetchTime',
		AR.Id ApprovalRequestId,
		ARD.Id ApprovalRequestDetailId,
		AR.CaseId,
		AR.Content,
		AE.EventCode TableName, 
		RS.Code ReviewStatus,
		RS.Name ReviewStatusName,
		AR.CreatedOn,
		AR.CreatedBy,
		CU.FullName AS CreatedUserName
	FROM ApprovalRequestDetail ARD
	INNER JOIN ApprovalRequest AR ON AR.Id= ARD.ApprovalRequestId
	INNER JOIN EventCondition EC ON EC.Id = AR.EventConditionId
	INNER JOIN ApprovalEvent AE ON AE.Id = EC.ApprovalEventId
	INNER JOIN ApprovalWorkflow AWF ON AWF.Id = EC.ApprovalWorkflowId
	LEFT JOIN UserInfo CU ON AR.CreatedBy=CU.Id 
	LEFT JOIN MasterEntityData RS ON  RS.Id = AR.ReviewStatusId
	INNER JOIN TenantOffice ON TenantOffice.Id = AR.TenantOfficeId
    INNER JOIN TenantRegion ON TenantRegion.Id = TenantOffice.RegionId
	WHERE 
		ARD.Id = @ApprovalRequestDetailId AND
			(
            @UserCategory = 'UCT_FRHO'
            OR (@UserCategory = 'UCT_CPTV' AND @UserOfficeId = AR.TenantOfficeId)
            OR (@UserCategory = 'UCT_FRRO' AND TenantRegion.Id = @UserRegionId)
        )

	SELECT 
		ARD.Id,
		ARD.Sequence,
		ARD.ReviewedOn, 
		RS.Code ReviewStatusCode,
		RS.Name ReviewStatusName,
		ARD.ReviewComment,
        RU.FullName AS ReviewedBy
	FROM ApprovalRequestDetail ARD
	LEFT JOIN ApprovalRequest AR ON AR.Id =ARD.ApprovalRequestId
	LEFT JOIN UserInfo RU ON ARD.ReviewedBy=RU.Id
	LEFT JOIN MasterEntityData RS ON  RS.Id = ARD.ReviewStatusId
	WHERE 
		AR.CaseId = (SELECT CaseId FROM ApprovalRequest WHERE Id =@ApprovalRequestId) AND
		ARD.ReviewedOn IS NOT NULL 
END