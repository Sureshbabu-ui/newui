CREATE OR ALTER PROCEDURE [dbo].[servicerequest_previouscalllist_by_assignee]
    @UserId   INT
AS
BEGIN 
    SET NOCOUNT ON; 
    SELECT 
	    SR.Id,
		SR.CustomerReportedIssue,
		CASE WHEN (SR.CustomerServiceAddress = '' ) THEN CS.Address+' '+City.Name ELSE SR.CustomerServiceAddress END AS CustomerSiteAddress,
        SR.WorkOrderNumber,
		SR.WorkOrderCreatedOn,
		Status.[Name] As CaseStatus,
		CI.[Name] AS CustomerName,
		M.[Name] AS ProductMake,
		P.ModelName,
		SRA.CreatedOn AS AssignedOn
    FROM ServiceRequest SR
	    LEFT JOIN ContractAssetDetail AS CAD ON CAD.Id = SR.ContractAssetId AND CAD.IsActive = 1
		INNER JOIN Asset ON Asset.Id = CAD.AssetId 
		LEFT JOIN CustomerInfo CI on CI.Id= SR.CustomerInfoId
		LEFT JOIN CustomerSite CS on CS.Id= Asset.CustomerSiteId
		LEFT JOIN City ON City.Id = Asset.CustomerSiteId
		INNER JOIN MasterEntityData AS Status ON Status.Id=SR.CaseStatusId
		LEFT JOIN Make M ON Asset.ProductMakeId = M.Id
	    LEFT JOIN Product P ON Asset.ProductModelId = P.Id
	    INNER  JOIN ServiceRequestAssignee AS SRA ON SRA.ServiceRequestId=SR.Id AND 
        SRA.EndsOn IS NOT NULL AND 
        SRA.AssigneeId = @UserId ;
END