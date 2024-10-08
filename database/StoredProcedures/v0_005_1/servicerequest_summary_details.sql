CREATE OR ALTER    PROCEDURE [dbo].[servicerequest_summary_details] 
	@ServiceRequestId INT
AS
BEGIN
	SET NOCOUNT ON;
	SELECT
	ServiceRequest.Id,
	ServiceRequest.WorkOrderNumber,
	ServiceRequest.CustomerReportedIssue,
	ServiceRequest.CallcenterRemarks,
	ServiceRequest.MspProvidedSolution,
	ServiceRequest.CaseReportedOn,
	ServiceRequest.ClosedBy,
	ServiceRequest.IncidentId,
	CallStatus.[Name] AS CallStatus,
	CallType.[Name] AS CallType,
	[Contract].StartDate AS ContractStartDate,
	[Contract].EndDate AS ContractEndDate,
	[Contract].ContractNumber,
	CustomerSite.SiteName,
	CustomerSite.[Address]  AS SiteAddress,
	[State].[Name] AS CustomerSiteState,
	City.[Name] AS CustomerSiteCity,
	CustomerSite.Pincode AS CustomerSitePincode,
	SiteCreatedBy.FullName AS SiteCreatedBy,
	ContractAssetDetail.ResponseTimeInHours,
	ContractAssetDetail.ResolutionTimeInHours,
	ContractAssetDetail.StandByTimeInHours,
	CustomerInfo.[Name] CustomerName,
	AssetProductCategory.CategoryName AS AssetProductCategory,
	Product.ModelName AS ModelNo,
	Make.[Name] Make,
	Asset.ProductSerialNumber As Serialno,
	ContractAssetDetail.IsVipProduct AS VipAsset,
	ProductSupportType.[Name] AS WarrantyType ,
	ServiceRequest.ClosedOn AS CallClosedDateTime ,
	ServiceRequest.CreatedOn AS CallloggedDateTime ,
	ServiceWindow.Name  As ServiceWindow,
	(STUFF((select distinct ', ' + PC.Name
			  FROM ContractAssetProductCategoryPartNotCovered PNC
			  LEFT JOIN PartCategory PC ON PNC.PartCategoryId = PC.Id
			  LEFT JOIN ContractAssetSummary ON ContractAssetSummary.AssetProductCategoryId=PNC.AssetProductCategoryId
			  WHERE PNC.ContractId = Contract.Id
				AND	ContractAssetSummary.AssetProductCategoryId=PNC.AssetProductCategoryId
					AND PNC.IsDeleted = 0
			  for xml path(''), TYPE).value('(./text())[1]', 'NVARCHAR(MAX)'),1,1,'')
			) AS PartCategoryNames,
	CustomerInfo.BilledToAddress,
	CustomerCity.Name AS CustomerCity,
	CustomerState.Name AS CustomerState,
	CustomerInfo.BilledToPincode,
	CustomerInfo.PrimaryContactEmail,
	CustomerInfo.PrimaryContactName,
	CustomerInfo.PrimaryContactPhone,
	ServiceRequestAssignee.CreatedOn AS EngAssignDateTime,
	Engineer.FullName As Engineer
	FROM ServiceRequest
		LEFT JOIN Contract ON Contract.Id = ServiceRequest.ContractId
		LEFT JOIN CustomerInfo ON CustomerInfo.Id = ServiceRequest.CustomerInfoId
		LEFT JOIN CustomerSite ON CustomerSite.Id = ServiceRequest.CustomerSiteId
		LEFT JOIN ContractAssetDetail ON ContractAssetDetail.Id = ServiceRequest.ContractAssetId AND ContractAssetDetail.IsActive = 1
		LEFT JOIN Asset ON Asset.Id = ContractAssetDetail.AssetId
		LEFT JOIN AssetProductCategory ON Asset.AssetProductCategoryId = AssetProductCategory.Id
		LEFT JOIN Product ON Asset.ProductModelId = Product.Id
		LEFT JOIN Make on Asset.ProductMakeId = Make.Id
		LEFT JOIN UserInfo AS SiteCreatedBy on ServiceRequest.CreatedBy=SiteCreatedBy.Id
		LEFT JOIN MasterEntityData AS CallStatus ON ServiceRequest.CaseStatusId = CallStatus.Id
		LEFT JOIN MasterEntityData AS CallType ON ServiceRequest.CallTypeId = CallType.Id
		LEFT JOIN MasterEntityData AS ProductSupportType ON ContractAssetDetail.ProductSupportTypeId = ProductSupportType.Id
		LEFT JOIN MasterEntityData AS ServiceWindow ON Contract.ServiceWindowId = ServiceWindow.Id
		LEFT JOIN State ON CustomerSite.StateId = State.Id
		LEFT JOIN City ON CustomerSite.CityId = City.Id
		LEFT JOIN State AS CustomerState ON CustomerInfo.BilledToStateId = CustomerState.Id
		LEFT JOIN City AS CustomerCity ON CustomerInfo.BilledToCityId = CustomerCity.Id
		LEFT JOIN ServiceRequestAssignee ON ServiceRequestAssignee.ServiceRequestId = ServiceRequest.Id 
				AND ServiceRequestAssignee.EndsOn IS NULL
		LEFT JOIN UserInfo AS Engineer ON ServiceRequestAssignee.AssigneeId = Engineer.Id 
				AND ServiceRequestAssignee.EndsOn IS NULL
	WHERE
		ServiceRequest.Id = @ServiceRequestId
		AND ServiceRequest.ContractId = Contract.Id
END