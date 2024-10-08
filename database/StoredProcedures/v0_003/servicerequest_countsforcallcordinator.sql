CREATE OR ALTER PROCEDURE [dbo].[servicerequest_countsforcallcordinator] 
	@UserId INT,
	@StatusCode VARCHAR(128),
	@TotalCalls INT OUTPUT,
	@NewCalls INT OUTPUT,
	@VisitClosed INT OUTPUT,
	@CallResolved INT OUTPUT,
	@EngAccepted INT OUTPUT,
	@EngNotAccepted INT OUTPUT,
	@VisitStarted INT OUTPUT,
	@OnsiteClosed INT OUTPUT,
	@RemotelyClosed INT OUTPUT
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

	IF @StatusCode = 'UNASSIGNED'
	BEGIN
		-- New call counts
		SELECT 
			@NewCalls = ISNULL(COUNT(SR.Id),0)
		FROM 
			ServiceRequest AS SR
			LEFT JOIN ContractAssetDetail AS CAD ON CAD.Id = SR.ContractAssetId AND CAD.IsActive = 1
			INNER JOIN Asset A ON A.Id = CAD.AssetId 
			LEFT JOIN TenantOffice ON TenantOffice.Id = A.TenantOfficeId
			LEFT JOIN TenantRegion ON TenantRegion.Id = TenantOffice.RegionId
			LEFT JOIN MasterEntityData AS CallStatus ON SR.CaseStatusId = CallStatus.Id
		WHERE
			SR.IsInterimCaseId = 0 AND SR.WorkOrderNumber IS NOT NULL AND SR.ServiceRequestAssignmentId IS NULL AND (CallStatus.Code IN ('SRS_PNDG')) AND
			(@UserCategory = 'UCT_FRHO' OR
			(@UserCategory = 'UCT_CPTV' AND @UserOfficeId = A.TenantOfficeId) OR
			(@UserCategory = 'UCT_FRRO' AND TenantRegion.Id = @UserRegionId))

	    -- ENG Visit CLosed Call Count
		SELECT 
			 @VisitClosed = ISNULL(COUNT(DISTINCT(SEV.ServiceRequestAssignmentId)),0)
		FROM 
			ServiceRequest AS SR
			INNER JOIN ServiceRequestAssignee AS SRA ON SRA.ServiceRequestId = SR.Id AND SRA.IsDeleted = 0 AND SRA.IsAssigneeAccepted = 1 
			INNER JOIN serviceEngineerVisit AS SEV ON SEV.ServiceRequestAssignmentId = SRA.Id AND SEV.EndsOn IS NOT NULL
			LEFT JOIN ContractAssetDetail AS CAD ON CAD.Id = SR.ContractAssetId AND CAD.IsActive = 1
			INNER JOIN Asset A ON A.Id = CAD.AssetId 
			LEFT JOIN TenantOffice ON TenantOffice.Id = A.TenantOfficeId
			LEFT JOIN TenantRegion ON TenantRegion.Id = TenantOffice.RegionId
			LEFT JOIN MasterEntityData AS CallStatus ON SR.CaseStatusId = CallStatus.Id
		WHERE
			SR.IsInterimCaseId = 0 AND SR.WorkOrderNumber IS NOT NULL AND SR.ResolvedOn IS NULL AND SR.ServiceRequestAssignmentId IS NULL AND (CallStatus.Code NOT IN ('SRS_CLSD','SRS_RCLD')) AND
			(@UserCategory = 'UCT_FRHO' OR
			(@UserCategory = 'UCT_CPTV' AND @UserOfficeId = A.TenantOfficeId) OR
			(@UserCategory = 'UCT_FRRO' AND TenantRegion.Id = @UserRegionId))

		-- Resolved Call Count
		SELECT 
			@CallResolved = ISNULL(COUNT(SR.Id),0)
		FROM 
			ServiceRequest AS SR
			LEFT JOIN ContractAssetDetail AS CAD ON CAD.Id = SR.ContractAssetId AND CAD.IsActive = 1
			INNER JOIN Asset A ON A.Id = CAD.AssetId 
			LEFT JOIN TenantOffice ON TenantOffice.Id = A.TenantOfficeId 
			LEFT JOIN TenantRegion ON TenantRegion.Id = TenantOffice.RegionId
			LEFT JOIN MasterEntityData AS CallStatus ON SR.CaseStatusId = CallStatus.Id
		WHERE
			SR.IsInterimCaseId = 0 AND SR.WorkOrderNumber IS NOT NULL AND SR.ServiceRequestAssignmentId IS NULL AND SR.ResolvedOn IS NOT NULL AND (CallStatus.Code NOT IN ('SRS_CLSD','SRS_RCLD')) AND
			(@UserCategory = 'UCT_FRHO' OR
			(@UserCategory = 'UCT_CPTV' AND @UserOfficeId = A.TenantOfficeId) OR
			(@UserCategory = 'UCT_FRRO' AND TenantRegion.Id = @UserRegionId))

		-- Total UnAssigned Calls Count
		SET @TotalCalls = @NewCalls + @VisitClosed
	END
	ELSE IF @StatusCode = 'ASSIGNED'
	BEGIN
		-- ENG Accepted Call Count
		SELECT 
			 @EngAccepted = ISNULL(COUNT(DISTINCT(SRA.ServiceRequestId)),0)
		FROM 
			ServiceRequest AS SR
			INNER JOIN ServiceRequestAssignee AS SRA ON SRA.ServiceRequestId = SR.Id AND SRA.IsDeleted = 0 AND SRA.IsAssigneeAccepted = 1 AND SRA.EndsOn IS NULL
			LEFT JOIN ContractAssetDetail AS CAD ON CAD.Id = SR.ContractAssetId AND CAD.IsActive = 1
			INNER JOIN Asset A ON A.Id = CAD.AssetId 
			LEFT JOIN TenantOffice ON TenantOffice.Id = A.TenantOfficeId
			LEFT JOIN TenantRegion ON TenantRegion.Id = TenantOffice.RegionId
			LEFT JOIN MasterEntityData AS CallStatus ON SR.CaseStatusId = CallStatus.Id
		WHERE
			SR.IsInterimCaseId = 0 AND SR.ServiceRequestAssignmentId IS NOT NULL AND (CallStatus.Code NOT IN ('SRS_CLSD','SRS_RCLD')) AND
			(@UserCategory = 'UCT_FRHO' OR
			(@UserCategory = 'UCT_CPTV' AND @UserOfficeId = A.TenantOfficeId) OR
			(@UserCategory = 'UCT_FRRO' AND TenantRegion.Id = @UserRegionId))
	
		-- ENG yet to Accepted Call Count
		SELECT 
			 @EngNotAccepted = ISNULL(COUNT(DISTINCT(SRA.ServiceRequestId)),0)
		FROM 
			ServiceRequest AS SR
			INNER JOIN ServiceRequestAssignee AS SRA ON SRA.ServiceRequestId = SR.Id AND SRA.IsDeleted = 0 AND SRA.IsAssigneeAccepted = 0 AND SRA.EndsOn IS NULL
			LEFT JOIN ContractAssetDetail AS CAD ON CAD.Id = SR.ContractAssetId AND CAD.IsActive = 1
			INNER JOIN Asset A ON A.Id = CAD.AssetId 
			LEFT JOIN TenantOffice ON TenantOffice.Id = A.TenantOfficeId
			LEFT JOIN TenantRegion ON TenantRegion.Id = TenantOffice.RegionId
			LEFT JOIN MasterEntityData AS CallStatus ON SR.CaseStatusId = CallStatus.Id
		WHERE
			SR.IsInterimCaseId = 0 AND SR.ServiceRequestAssignmentId IS NOT NULL AND (CallStatus.Code NOT IN ('SRS_CLSD','SRS_RCLD')) AND
			(@UserCategory = 'UCT_FRHO' OR
			(@UserCategory = 'UCT_CPTV' AND @UserOfficeId = A.TenantOfficeId) OR
			(@UserCategory = 'UCT_FRRO' AND TenantRegion.Id = @UserRegionId))

		-- ENG Visit started Call Count
		SELECT 
			 @VisitStarted = ISNULL(COUNT(DISTINCT(SEV.ServiceRequestAssignmentId)),0)
		FROM 
			ServiceRequest AS SR
			INNER JOIN ServiceRequestAssignee AS SRA ON SRA.ServiceRequestId = SR.Id AND SRA.IsDeleted = 0 AND SRA.IsAssigneeAccepted = 1 AND SRA.EndsOn IS NULL
			INNER JOIN serviceEngineerVisit AS SEV ON SEV.ServiceRequestAssignmentId = SRA.Id AND SEV.EndsOn IS NULL
			LEFT JOIN ContractAssetDetail AS CAD ON CAD.Id = SR.ContractAssetId AND CAD.IsActive = 1
			INNER JOIN Asset A ON A.Id = CAD.AssetId 
			LEFT JOIN TenantOffice ON TenantOffice.Id = A.TenantOfficeId
			LEFT JOIN TenantRegion ON TenantRegion.Id = TenantOffice.RegionId
			LEFT JOIN MasterEntityData AS CallStatus ON SR.CaseStatusId = CallStatus.Id
		WHERE
			SR.IsInterimCaseId = 0 AND SR.ServiceRequestAssignmentId IS NOT NULL AND (CallStatus.Code NOT IN ('SRS_CLSD','SRS_RCLD')) AND
			(@UserCategory = 'UCT_FRHO' OR
			(@UserCategory = 'UCT_CPTV' AND @UserOfficeId = A.TenantOfficeId) OR
			(@UserCategory = 'UCT_FRRO' AND TenantRegion.Id = @UserRegionId))

		-- Total Assigned Calls Count 
		SET	@TotalCalls = @EngAccepted + @EngNotAccepted
	END
	ELSE IF @StatusCode = 'CLOSED'
	BEGIN

		-- Total Remotely Closed Calls Count 
		SELECT 
			@RemotelyClosed = ISNULL(COUNT(SR.Id),0)
		FROM 
			ServiceRequest AS SR
			LEFT JOIN ContractAssetDetail AS CAD ON CAD.Id = SR.ContractAssetId AND CAD.IsActive = 1
			INNER JOIN Asset A ON A.Id = CAD.AssetId 
			LEFT JOIN TenantOffice ON TenantOffice.Id = A.TenantOfficeId
			LEFT JOIN TenantRegion ON TenantRegion.Id = TenantOffice.RegionId
			LEFT JOIN MasterEntityData AS CallStatus ON SR.CaseStatusId = CallStatus.Id
		WHERE
			SR.IsInterimCaseId = 0 AND (CallStatus.Code = 'SRS_RCLD') AND
			(@UserCategory = 'UCT_FRHO' OR
			(@UserCategory = 'UCT_CPTV' AND @UserOfficeId = A.TenantOfficeId) OR
			(@UserCategory = 'UCT_FRRO' AND TenantRegion.Id = @UserRegionId))

		-- Total Onsite Closed Calls Count 
		SELECT 
			@OnsiteClosed = ISNULL(COUNT(SR.Id),0)
		FROM 
			ServiceRequest AS SR
			LEFT JOIN ContractAssetDetail AS CAD ON CAD.Id = SR.ContractAssetId AND CAD.IsActive = 1
			INNER JOIN Asset A ON A.Id = CAD.AssetId 
			LEFT JOIN TenantOffice ON TenantOffice.Id = A.TenantOfficeId
			LEFT JOIN TenantRegion ON TenantRegion.Id = TenantOffice.RegionId
			LEFT JOIN MasterEntityData AS CallStatus ON SR.CaseStatusId = CallStatus.Id
		WHERE
			SR.IsInterimCaseId = 0 AND (CallStatus.Code = 'SRS_CLSD') AND
			(@UserCategory = 'UCT_FRHO' OR
			(@UserCategory = 'UCT_CPTV' AND @UserOfficeId = A.TenantOfficeId) OR
			(@UserCategory = 'UCT_FRRO' AND TenantRegion.Id = @UserRegionId))
		-- Total Closed Calls Count 
		SET	@TotalCalls = @RemotelyClosed + @OnsiteClosed
	END
END