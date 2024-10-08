CREATE OR ALTER PROCEDURE [dbo].[servicerequest_callcentre_calldetails]
    @ServiceRequestId INT
AS
BEGIN
SET NOCOUNT ON;
	DECLARE @IsInterim BIT
	DECLARE @AssetId BIT
	SELECT @IsInterim = IsInterimCaseId FROM ServiceRequest WHERE Id = @ServiceRequestId
	SELECT @AssetId = ContractAssetId FROM ServiceRequest WHERE Id = @ServiceRequestId
	IF(@IsInterim = 0 OR @AssetId IS NOT NULL)
	BEGIN
		SELECT 
			SR.Id,
			SR.WorkOrderNumber,
			SR.CaseId,
			SR.CaseReportedOn,
			SR.CaseReportedCustomerEmployeeName,
			SR.CustomerReportedIssue,
			SR.CallcenterRemarks,
			SR.IncidentId,
			SR.CreatedOn,
			SR.OptedForRemoteSupport,
			SR.CustomerServiceAddress,
			SR.Diagnosis,
			SR.MspProvidedSolution,
			SR.ClosureRemarks,
			SR.ClosedOn,
			SR.HoursSpent,
			SR.EndUserName,
			SR.EndUserEmail,
			SR.EndUserPhone,
			SR.RepairReason,
			CreatedBy.FullName AS CreatedBy,
			STUFF(
				(SELECT ', ' + UI.FullName
						FROM UserInfo UI			
						LEFT JOIN ServiceRequestAssignee SRA ON SRA.ServiceRequestId = SR.Id AND SRA.EndsOn IS NULL AND SRA.IsDeleted = 0
						WHERE UI.Id = SRA.AssigneeId
						FOR XML PATH(''), TYPE
			).value('.', 'NVARCHAR(MAX)'), 1, 2, '') AS AssignedBy,
			RSNOR.[Name] AS RemoteSupportNotOptedReason,
			CallSource.[Name] As CallSource,
			CallStatus.[Name] AS CallStatus,
			CallType.[Name] AS CallType,
			CustomerContactType.[Name] AS CustomerContactType,
			CustomerInfo.[Name] AS CustomerName,
			CS.[Address] AS SiteAddress,
			Customer.CustomerCode,
			Product.ModelName,
			PC.CategoryName,
			Asset.ProductSerialNumber,
			M.[Name] AS Make,
			[Contract].ContractNumber,
			ClosedBy.FullName AS ClosedBy,
			CAD.ResponseTimeInHours,
			CAD.ResolutionTimeInHours,
			CAD.StandByTimeInHours
		FROM 
			ServiceRequest SR
			LEFT JOIN Contract ON Contract.Id = SR.ContractId
			LEFT JOIN CustomerInfo ON CustomerInfo.Id = SR.CustomerInfoId
			LEFT JOIN Customer ON Customer.Id = CustomerInfo.CustomerId
			LEFT JOIN ContractAssetDetail CAD ON CAD.Id = SR.ContractAssetId AND CAD.IsActive = 1
			INNER JOIN Asset ON Asset.Id = CAD.AssetId 
			LEFT JOIN CustomerSite CS ON CS.Id = Asset.CustomerSiteId
			LEFT JOIN MasterEntityData CallStatus ON SR.CaseStatusId = CallStatus.Id
			LEFT JOIN MasterEntityData CallType ON SR.CallTypeId = CallType.Id
			LEFT JOIN MasterEntityData CallSource ON SR.CallSourceId = CallSource.Id
			LEFT JOIN MasterEntityData CustomerContactType ON CustomerContactType.Id = CustomerContactTypeId 
			LEFT JOIN MasterEntityData RSNOR ON SR.RemoteSupportNotOptedReason = RSNOR.Id
			LEFT JOIN Product ON Product.Id = Asset.ProductModelId
			LEFT JOIN AssetProductCategory PC ON PC.Id = Asset.AssetProductCategoryId
			LEFT JOIN Make AS M ON M.Id = Asset.ProductMakeId
			LEFT JOIN UserInfo AS CreatedBy ON CreatedBy.Id = SR.CreatedBy
			LEFT JOIN UserInfo AS ClosedBy ON ClosedBy.Id = SR.ClosedBy
		WHERE
		    SR.Id = @ServiceRequestId
	END
	ELSE
	BEGIN
		SELECT 
			SR.Id,
			SR.WorkOrderNumber,
			SR.CaseId,
			SR.CaseReportedOn,
			SR.CaseReportedCustomerEmployeeName,
			SR.CustomerReportedIssue,
			SR.CallcenterRemarks,
			SR.IncidentId,
			SR.CreatedOn,
			SR.OptedForRemoteSupport,
			RSNOR.[Name] AS RemoteSupportNotOptedReason,
			STUFF(
				(SELECT ', ' + UI.FullName
						FROM UserInfo UI			
						LEFT JOIN ServiceRequestAssignee SRA ON SRA.ServiceRequestId = SR.Id AND SRA.EndsOn IS NULL AND SRA.IsDeleted = 0
						WHERE UI.Id = SRA.AssigneeId
						FOR XML PATH(''), TYPE
			).value('.', 'NVARCHAR(MAX)'), 1, 2, '') AS AssignedBy,			
			CreatedBy.FullName AS CreatedBy,
			CallSource.[Name] As CallSource,
			CallStatus.[Name] AS CallStatus,
			CustomerInfo.[Name] AS CustomerName,
			CS.[Address] AS SiteAddress,
			Customer.CustomerCode,
			SR.CustomerServiceAddress,
			Product.ModelName,
			PC.CategoryName,
			CAD.ProductSerialNumber,
			M.[Name] AS Make,
			[Contract].ContractNumber,
			SR.Diagnosis,
			SR.MspProvidedSolution,
			SR.ClosureRemarks,
			ClosedBy.FullName AS ClosedBy,
			SR.ClosedOn,
			SR.HoursSpent,
			CAD.ReviewRemarks AS InterimReviewRemarks,
			InterimStatus.[Name] AS InterimStatus,
			CAD.ReviewedOn AS InterimReviewedOn,
			ReviewedBy.FullName AS ReviewedBy,
			AD.ResponseTimeInHours,
			AD.ResolutionTimeInHours,
			AD.StandByTimeInHours
		FROM 
			ServiceRequest AS SR
			LEFT JOIN Contract ON Contract.Id = SR.ContractId
			LEFT JOIN CustomerInfo ON CustomerInfo.Id = SR.CustomerInfoId
			LEFT JOIN Customer ON Customer.Id = CustomerInfo.CustomerId
			LEFT JOIN ContractInterimAsset CAD ON CAD.Id = SR.ContractInterimAssetId
			LEFT JOIN ContractAssetDetail AS AD ON AD.Id = SR.ContractAssetId AND AD.IsActive = 1
			LEFT JOIN CustomerSite AS CS ON CS.Id = CAD.CustomerSiteId
			LEFT JOIN MasterEntityData AS CallStatus ON SR.CaseStatusId = CallStatus.Id
			LEFT JOIN MasterEntityData AS CallSource ON SR.CallSourceId = CallSource.Id
			LEFT JOIN MasterEntityData AS InterimStatus ON CAD.InterimAssetStatusId = InterimStatus.Id
			LEFT JOIN Product ON Product.Id = CAD.ProductModelId
			LEFT JOIN AssetProductCategory AS PC ON PC.Id = CAD.AssetProductCategoryId
			LEFT JOIN Make AS M ON M.Id = CAD.ProductMakeId
			LEFT JOIN UserInfo AS CreatedBy ON CreatedBy.Id = SR.CreatedBy
			LEFT JOIN UserInfo AS ClosedBy ON ClosedBy.Id = SR.ClosedBy
			LEFT JOIN UserInfo AS ReviewedBy ON ReviewedBy.Id = CAD.ReviewedBy
			LEFT JOIN MasterEntityData AS RSNOR ON SR.RemoteSupportNotOptedReason = RSNOR.Id
		WHERE
			SR.Id = @ServiceRequestId
	END
END