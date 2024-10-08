CREATE OR ALTER PROCEDURE [dbo].[servicerequest_previouscall_detail]
	@ServiceRequestId	INT,
	@LoggedUserId INT
AS
BEGIN 
	SET NOCOUNT ON;
	SELECT 
		SR.Id,
		SR.CaseId,
		SR.WorkOrderNumber,
		SR.CustomerReportedIssue,
		SR.CallcenterRemarks,
		SR.IncidentId,
		SR.OptedForRemoteSupport,
		SR.CaseReportedCustomerEmployeeName,
		SR.CaseReportedOn,
		CS.SiteName AS CustomerSiteName,
		CS.[Address] AS CustomerSiteAddress,
		CI.[Name] AS CustomerName,
		CI.PrimaryContactName,
		CI.PrimaryContactEmail,
		CI.PrimaryContactPhone,
		CASE WHEN Asset.WarrantyEndDate >= GETDATE() THEN 1 ELSE 0 END AS IsUnderWarranty,
		CA.ResolutionTimeInHours,
		CA.ResponseTimeInHours,
		CA.StandByTimeInHours,
		CA.IsEnterpriseProduct,
		CA.IsVipProduct,
		Asset.ProductSerialNumber,
		SRA.Id AS ServiceRequestAssignmentId,
		M.[Name] AS ProductMake,
		P.ModelName,
		PC.CategoryName,
		SRA.IsAssigneeAccepted AS IsAccepted,
		SRA.CreatedOn AS AssignedOn,
		SEV.Id AS ServiceEngineerVisitId,
		SEV.StartsOn AS VisitStartsOn
	FROM ServiceRequest SR
		LEFT JOIN CustomerInfo CI on CI.Id= SR.CustomerInfoId
		LEFT JOIN ContractAssetDetail CA on CA.Id=SR.ContractAssetId AND CA.IsActive = 1
		INNER JOIN Asset ON Asset.Id = CA.AssetId 
		LEFT JOIN CustomerSite CS on CS.Id= Asset.CustomerSiteId
		LEFT JOIN ServiceRequestAssignee SRA on SRA.ServiceRequestId= SR.Id
		LEFT JOIN Make M ON Asset.ProductMakeId = M.Id
	    LEFT JOIN AssetProductCategory PC ON PC.Id=Asset.AssetProductCategoryId
	    LEFT JOIN Product P ON Asset.ProductModelId = P.Id
		LEFT JOIN ServiceEngineerVisit AS SEV ON SEV.ServiceRequestAssignmentId= SRA.Id AND
		SEV.EndsOn IS NULL
	WHERE
		SR.Id = @ServiceRequestId AND
	    SRA.EndsOn IS NOT NULL AND
		SRA.AssigneeId =@LoggedUserId
END