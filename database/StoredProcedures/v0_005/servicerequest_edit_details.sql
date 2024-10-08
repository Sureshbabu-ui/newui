CREATE OR ALTER PROCEDURE [dbo].[servicerequest_edit_details]
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
			S.Id AS ServiceRequestId,
			S.ContractId,
			S.IncidentId,
			S.TicketNumber,
			S.CaseStatusId,
			S.CustomerReportedIssue,
			S.CaseReportedCustomerEmployeeName,
			S.CaseReportedOn,
			S.EndUserName,
			S.EndUserPhone,
			S.EndUserEmail,
			S.CallTypeId,
			S.RepairReason,
			S.CallcenterRemarks,
			S.OptedForRemoteSupport,
			S.RemoteSupportNotOptedReason,
			S.CustomerContactTypeId,
			S.CallSourceId,
			S.CustomerServiceAddress,
			S.IsInterimCaseId,
			S.CallSeverityLevelId,
			CA.Id As AssetId,
			Asset.AssetProductCategoryId,
			Asset.ProductMakeId,
			Asset.ProductModelId,
			Asset.ProductSerialNumber,
			Asset.MspAssetId ,
			Asset.CustomerAssetId,
			CA.IsPreAmcCompleted,
			Asset.WarrantyEndDate,
			C.EndDate,
			C.ContractNumber,
			T.Id AS TenantOfficeId,
			T.OfficeName AS [Location],
			A.[Name] AS AgreementType,
			SM.[Name] AS ServiceMode,
			C.CallExpiryDate,
			C.CallStopDate,
			C.CallStopReason,
			CS.PrimaryContactName AS CustomerContactName,
			CS.SiteName AS CustomerSiteName,
			CS.PrimaryContactEmail As CustomerContactEmail,
			CS.[Address] AS CustomerContactAddress,
			CI.NameOnPrint AS CustomerName,
			CST.Code AS ContractStatus,
			CASE 
			WHEN CallStopDate < CONVERT(DATE, GETUTCDATE())  THEN 'true' ELSE 'false'
			END AS IsCallStopped
		FROM 
			ServiceRequest AS S
			INNER JOIN ContractAssetDetail CA ON CA.Id = S.ContractAssetId AND CA.IsActive = 1
   			LEFT JOIN Asset ON Asset.Id = CA.AssetId
			LEFT JOIN [Contract] C ON CA.ContractId=C.Id
			LEFT JOIN TenantOffice T ON T.Id=C.TenantOfficeId
			LEFT JOIN MasterEntityData A ON C.AgreementTypeId = A.Id
			LEFT JOIN MasterEntityData SM ON C.ServiceModeId = SM.Id
			LEFT JOIN CustomerSite CS ON CS.Id=Asset.CustomerSiteId
			LEFT JOIN Make M ON M.Id=Asset.ProductMakeId
			LEFT JOIN AssetProductCategory PC ON PC.Id=Asset.AssetProductCategoryId
			LEFT JOIN Product P ON P.Id=Asset.ProductModelId
			LEFT JOIN CustomerInfo CI ON CI.Id = C.CustomerInfoId
			LEFT JOIN MasterEntityData CST ON C.ContractStatusId= CST.Id
		WHERE
			S.Id = @ServiceRequestId 
	END
	ELSE
	BEGIN
		SELECT 
			S.Id AS ServiceRequestId,
			S.ContractId,
			S.IncidentId,
			S.CaseStatusId,
			S.CustomerReportedIssue,
			S.CaseReportedCustomerEmployeeName,
			S.CaseReportedOn,
			S.EndUserName,
			S.EndUserPhone,
			S.EndUserEmail,
			S.CallTypeId,
			S.RepairReason,
			S.CallcenterRemarks,
			S.OptedForRemoteSupport,
			S.RemoteSupportNotOptedReason,
			S.CustomerContactTypeId,
			S.CallSourceId,
			S.CustomerServiceAddress,
			S.CallSeverityLevelId,
			S.IsInterimCaseId,
			CA.Id AS AssetId,
			CA.AssetProductCategoryId,
			CA.ProductMakeId,
			CA.ProductModelId,
			CA.ProductSerialNumber,
			CA.ContractId,
			C.EndDate,
			C.ContractNumber,
			T.Id AS TenantOfficeId,
			T.OfficeName AS [Location],
			A.[Name] AS AgreementType,
			SM.[Name] AS ServiceMode,
			C.CallExpiryDate,
			C.CallStopDate,
			C.CallStopReason,
			CS.PrimaryContactName AS CustomerContactName,
			CS.SiteName AS CustomerSiteName,
			CS.PrimaryContactEmail As CustomerContactEmail,
			CS.[Address] AS CustomerContactAddress,
			CI.NameOnPrint AS CustomerName,
			CST.Code AS ContractStatus,
			CASE 
			WHEN CallStopDate < CONVERT(DATE, GETUTCDATE())  THEN 'true' ELSE 'false'
			END AS IsCallStopped
		FROM 
			ServiceRequest AS S
			LEFT JOIN ContractInterimAsset CA ON CA.Id = S.ContractInterimAssetId
			LEFT JOIN [Contract] C ON CA.ContractId=C.Id
			LEFT JOIN TenantOffice T ON T.Id=C.TenantOfficeId
			LEFT JOIN MasterEntityData A ON C.AgreementTypeId = A.Id
			LEFT JOIN MasterEntityData SM ON C.ServiceModeId = SM.Id
			LEFT JOIN CustomerSite CS ON CS.Id=CA.CustomerSiteId
			LEFT JOIN Make M ON M.Id=CA.ProductMakeId
			LEFT JOIN AssetProductCategory PC ON PC.Id=CA.AssetProductCategoryId
			LEFT JOIN Product P ON P.Id=CA.ProductModelId
			LEFT JOIN CustomerInfo CI ON CI.Id = C.CustomerInfoId
			LEFT JOIN MasterEntityData CST ON C.ContractStatusId= CST.Id
		WHERE
			S.Id =@ServiceRequestId
	END
END