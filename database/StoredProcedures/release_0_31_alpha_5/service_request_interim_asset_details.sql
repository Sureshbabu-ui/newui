CREATE OR ALTER PROCEDURE [dbo].[service_request_interim_asset_details] 
	@ContractId INT 
AS 
BEGIN
SET NOCOUNT ON;

SELECT
	CCS.CustomerSiteId,
	CCS.ContractId,
	C.StartDate,
	C.EndDate,
	C.ContractNumber,
	C.CustomerInfoId,
	T.Id AS TenantOfficeId,
	T.OfficeName AS [Location],
	AgreementType.[Name] AS AgreementType,
	ServiceMode.[Name] AS ServiceMode,
	C.CallExpiryDate,
	C.CallStopDate,
	C.CallStopReason,
	CS.PrimaryContactName AS CustomerContactName,
	CS.SiteName AS CustomerSiteName,
	CS.PrimaryContactEmail As CustomerContactEmail,
	CS.[Address] AS CustomerContactAddress,
	CI.[Name] AS CustomerName
FROM [Contract] C
	LEFT JOIN CustomerInfo CI ON CI.Id = C.CustomerInfoId
	LEFT JOIN ContractCustomerSite CCS ON CCS.ContractId = C.Id
	LEFT JOIN TenantOffice T ON T.Id = C.TenantOfficeId
	LEFT JOIN MasterEntityData AgreementType ON C.AgreementTypeId = AgreementType.Id
	LEFT JOIN MasterEntityData ServiceMode ON C.ServiceModeId = ServiceMode.Id
	LEFT JOIN CustomerSite CS ON CS.Id = CCS.CustomerSiteId
WHERE
	C.Id = @ContractId
END