CREATE OR ALTER PROCEDURE [dbo].[service_request_interim_details] 
	@ServiceRequestId INT 
AS 
BEGIN
SET NOCOUNT ON;

SELECT
	SR.Id,
	SR.CaseId,
	CASE
		WHEN SR.IsInterimCaseAssetApprovalNeeded = 1 AND
				SR.InterimCaseAssetApprovedOn IS NULL AND
				SR.ContractAssetId IS NOT NULL
		THEN CAST(1 AS BIT)
		ELSE CAST(0 AS BIT)
	END AS IsPreAmcApprovalNeeded,
	CA.IsPreAmcCompleted,
	CA.PreAmcCompletedDate,
	CA.PreAmcCompletedBy,
	SR.ContractAssetId,
	SR.CustomerReportedIssue,
	SR.CaseReportedOn,
	CI.[Name] AS CustomerName,
	CS.SiteName AS CustomerSiteName,
	CS.[Address] AS CustomerSiteAddress,
	CS.PrimaryContactName AS CustomerContactName,
	CS.PrimaryContactEmail AS CustomerContactEmail,
	A.ProductSerialNumber AS AssetSerialNumber,
	PC.CategoryName,
	M.[Name] AS Make,
	P.ModelName,
	C.EndDate,
	C.ContractNumber,
	T.OfficeName AS [Location],
	AgreementType.[Name] AS AgreementType,
	ServiceMode.[Name] AS ServiceMode,
	C.CallExpiryDate,
	C.CallStopDate,
	C.CallStopReason
FROM
	ServiceRequest AS SR
	LEFT JOIN [Contract] AS C ON SR.ContractId = C.Id
	LEFT JOIN TenantOffice T ON T.Id = C.TenantOfficeId
	LEFT JOIN CustomerInfo CI ON CI.Id = SR.CustomerInfoId
	LEFT JOIN ContractAssetDetail CA ON CA.Id = SR.ContractAssetId
	LEFT JOIN Asset A ON A.Id = CA.AssetId
	LEFT JOIN AssetProductCategory PC ON PC.Id = A.AssetProductCategoryId
	LEFT JOIN Make M ON M.Id = A.ProductMakeId
	LEFT JOIN Product P ON P.Id = A.ProductModelId
	LEFT JOIN CustomerSite CS ON CS.Id = A.CustomerSiteId
	LEFT JOIN MasterEntityData AgreementType ON C.AgreementTypeId = AgreementType.Id
	LEFT JOIN MasterEntityData ServiceMode ON C.ServiceModeId = ServiceMode.Id
WHERE
	SR.Id = @ServiceRequestId
END