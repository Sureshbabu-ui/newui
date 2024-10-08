CREATE OR ALTER PROCEDURE [dbo].[servicerequest_details_for_engineer]
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
		CASE WHEN A.WarrantyEndDate >= GETDATE() THEN 1 ELSE 0 END AS IsUnderWarranty,
		CA.ResolutionTimeInHours,
		CA.ResponseTimeInHours,
		CA.StandByTimeInHours,
		CA.IsEnterpriseProduct,
		CA.IsVipProduct,
		A.ProductSerialNumber,
		SRA.Id ServiceRequestAssignmentId,
		M.[Name] ProductMake,
		P.ModelName,
		PC.CategoryName,
		SRA.IsAssigneeAccepted  IsAccepted,
		SRA.CreatedOn AssignedOn,
		SRA.StartsFrom ScheduledOn,
		SEV.Id ServiceEngineerVisitId,
		SEV.StartsOn AS VisitStartsOn
	FROM ServiceRequest SR
		LEFT JOIN CustomerInfo CI ON CI.Id= SR.CustomerInfoId
		LEFT JOIN ContractAssetDetail CA ON CA.Id = SR.ContractAssetId
		LEFT JOIN Asset A ON A.Id = CA.AssetId
		LEFT JOIN CustomerSite CS on CS.Id= A.CustomerSiteId
		LEFT JOIN ServiceRequestAssignee SRA ON SRA.ServiceRequestId= SR.Id
		LEFT JOIN Make M ON A.ProductMakeId = M.Id
	    LEFT JOIN AssetProductCategory PC ON PC.Id=A.AssetProductCategoryId
	    LEFT JOIN Product P ON A.ProductModelId = P.Id
		LEFT JOIN ServiceEngineerVisit AS SEV ON SEV.ServiceRequestAssignmentId= SRA.Id AND
		SEV.EndsOn IS NULL
	WHERE
		SR.Id = @ServiceRequestId AND CA.IsActive = 1 AND
	    SRA.EndsOn IS NULL AND
		SRA.AssigneeId =@LoggedUserId
END