CREATE OR ALTER PROCEDURE [dbo].[callcordinator_servicerequest_count]
	@UserId		 INT,
    @StatusCode VARCHAR(128),
    @TotalRows  INT OUTPUT
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
        UserInfo.Id = @UserId;
	SELECT 
		@TotalRows = COUNT(SR.Id)
	FROM 
		ServiceRequest AS SR
			LEFT JOIN CustomerInfo ON CustomerInfo.Id = SR.CustomerInfoId
			LEFT JOIN CustomerSite AS CS ON CS.Id = SR.CustomerSiteId
			LEFT JOIN MasterEntityData AS CallStatus ON SR.CaseStatusId = CallStatus.Id
			LEFT JOIN ContractAssetDetail AS CAD ON CAD.Id = SR.ContractAssetId AND CAD.IsActive = 1
			INNER JOIN Asset A ON A.Id = CAD.AssetId 
			LEFT JOIN TenantOffice ON TenantOffice.Id = CS.TenantOfficeId
			LEFT JOIN TenantRegion ON TenantRegion.Id = TenantOffice.RegionId
	WHERE
		SR.IsInterimCaseId = 0 AND SR.WorkOrderNumber IS NOT NULL AND
		((@StatusCode = 'UNASSIGNED' AND (CallStatus.Code NOT IN ('SRS_CLSD','SRS_RCLD') AND SR.ServiceRequestAssignmentId IS NULL)) OR
		(@StatusCode = 'ASSIGNED' AND (CallStatus.Code NOT IN ('SRS_CLSD','SRS_RCLD') AND SR.ServiceRequestAssignmentId IS NOT NULL)) OR
		(@StatusCode = 'CLOSED' AND (CallStatus.Code IN ('SRS_CLSD','SRS_RCLD')))) AND
		((@UserCategory = 'UCT_FRHO') OR
        (@UserCategory = 'UCT_CPTV' AND @UserOfficeId = A.TenantOfficeId) OR
        (@UserCategory = 'UCT_FRRO' AND TenantRegion.Id = @UserRegionId))			
END