CREATE OR ALTER PROCEDURE [dbo].[callcordinator_servicerequest_list]
	@UserId		 INT,
    @Search      VARCHAR(50) = NULL,
    @SearchWith  VARCHAR(50) = NULL,
	@StatusCode VARCHAR(128)
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
			SR.Id,
			SR.WorkOrderNumber,
			SR.CustomerReportedIssue,
			A.ProductSerialNumber,
			CustomerInfo.[Name] AS CustomerName,
			SR.EndUserPhone,
			SR.EndUserName,
			Product.ModelName,
			ISNULL(NULLIF(SR.CustomerServiceAddress, ''), CS.[Address]) AS CustomerServiceAddress,
			CallStatus.[Name] AS [Status],
			CallStatus.Code AS StatusCode,
			STUFF(
				(SELECT ', ' + UI.FullName
						FROM UserInfo UI			
						LEFT JOIN ServiceRequestAssignee SRA ON SRA.ServiceRequestId = SR.Id AND SRA.EndsOn IS NULL AND SRA.IsDeleted = 0
						WHERE UI.Id = SRA.AssigneeId
						FOR XML PATH(''), TYPE
			).value('.', 'NVARCHAR(MAX)'), 1, 2, '') AS Assignee,
			CAD.ResolutionTimeInHours,
			SR.WorkOrderCreatedOn
	FROM 
			ServiceRequest AS SR
			LEFT JOIN CustomerInfo ON CustomerInfo.Id = SR.CustomerInfoId
			LEFT JOIN ContractAssetDetail AS CAD ON CAD.Id = SR.ContractAssetId AND CAD.IsActive = 1
			INNER JOIN Asset A ON A.Id = CAD.AssetId 
			LEFT JOIN CustomerSite AS CS ON CS.Id = SR.CustomerSiteId
			LEFT JOIN MasterEntityData AS CallStatus ON SR.CaseStatusId = CallStatus.Id
			LEFT JOIN Product ON Product.Id = A.ProductModelId
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
			AND			
			((@SearchWith IS NULL OR @SearchWith = '') OR 
			(@SearchWith = 'WorkOrderNumber' AND SR.WorkOrderNumber LIKE '%' +@Search+ '%') OR
			(@SearchWith = 'SerialNumber' AND A.ProductSerialNumber LIKE '%' +@Search+ '%') OR
			(@SearchWith = 'CustomerName' AND CustomerInfo.[Name] LIKE '%' +@Search+ '%') OR
			(@SearchWith = 'EndUserPhone' AND SR.EndUserPhone LIKE '%' +@Search+ '%')) 
		ORDER BY SR.Id DESC
END