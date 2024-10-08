CREATE OR ALTER PROCEDURE [dbo].[servicerequest_list_by_assignee]
    @UserId   INT,
    @JobStatus INT
AS
BEGIN 
    SET NOCOUNT ON; 
    SELECT 
	    SR.Id,
		SR.CustomerReportedIssue,
		CASE WHEN (SR.CustomerServiceAddress = '' ) THEN CS.Address+' '+City.Name ELSE SR.CustomerServiceAddress END AS CustomerSiteAddress,
        SR.WorkOrderNumber,
		SR.WorkOrderCreatedOn,
		SR.OptedForRemoteSupport,		
		CASE WHEN (SR.EndUserName = '' ) THEN CS.PrimaryContactName ELSE SR.EndUserName END AS EndUserName,
		CASE WHEN (SR.EndUserPhone = '' ) THEN  CS.PrimaryContactPhone ELSE SR.EndUserPhone END AS EndUserPhone,
		Status.[Name] As CaseStatus,
		CI.[Name] AS CustomerName,
		CAD.ResolutionTimeInHours,
		M.[Name] AS ProductMake,
		P.ModelName,
		SRA.CreatedOn AS AssignedOn,
	    SRA.StartsFrom ScheduledOn
    FROM ServiceRequest SR
	    LEFT JOIN ContractAssetDetail AS CAD ON CAD.Id = SR.ContractAssetId AND CAD.IsActive = 1
		LEFT JOIN Asset A ON A.Id = CAD.AssetId
		LEFT JOIN CustomerInfo CI on CI.Id= SR.CustomerInfoId
		LEFT JOIN CustomerSite CS on CS.Id= A.CustomerSiteId
		LEFT JOIN City ON City.Id=A.CustomerSiteId
		INNER JOIN MasterEntityData AS Status ON Status.Id=SR.CaseStatusId
		LEFT JOIN Make M ON A.ProductMakeId = M.Id
	    LEFT JOIN Product P ON A.ProductModelId = P.Id
	    INNER  JOIN ServiceRequestAssignee AS SRA ON SRA.ServiceRequestId=SR.Id AND 
        SRA.EndsOn IS NULL AND 
        SRA.AssigneeId = @UserId AND 
        IsAssigneeAccepted = @JobStatus;
END