CREATE OR ALTER    PROCEDURE [dbo].[contract_asset_details]
	@AssetId INT
AS
BEGIN 
	SET NOCOUNT ON;
	SELECT 
		CA.Id,
		Asset.AssetProductCategoryId AS ProductCategoryId,
		Asset.ProductMakeId,
		Asset.ProductModelId AS ProductModelNumber,
		Asset.ProductSerialNumber,
		Asset.MspAssetId ,
		Asset.CustomerAssetId,
		CA.ContractId,
		CA.IsPreAmcCompleted,
		Asset.WarrantyEndDate,
		C.EndDate,
		C.ContractNumber,
		C.CustomerInfoId,
		T.Id AS TenantOfficeId,
		T.OfficeName AS [Location],
		A.[Name] AS AgreementType,
		SM.[Name] AS ServiceMode,
		C.CallExpiryDate,
		C.CallStopDate,
		C.CallStopReason,
		Asset.CustomerSiteId,
		CS.PrimaryContactName AS CustomerContactName,
		CS.SiteName AS CustomerSiteName,
		CS.PrimaryContactEmail As CustomerContactEmail,
		CS.[Address] AS CustomerContactAddress,
		CI.NameOnPrint AS CustomerName,
		CST.Code AS ContractStatus,
		CASE 
		WHEN CallStopDate < CONVERT(DATE, GETUTCDATE())  THEN 'true' ELSE 'false'
		END AS IsCallStopped
	FROM ContractAssetDetail CA
		LEFT JOIN Asset ON Asset.Id = CA.AssetId
		LEFT JOIN [Contract] C ON CA.ContractId=C.Id
		LEFT JOIN TenantOffice T ON T.Id=C.TenantOfficeId
		LEFT JOIN MasterEntityData A ON C.AgreementTypeId = A.Id
		LEFT JOIN MasterEntityData SM ON C.ServiceModeId = SM.Id
		LEFT JOIN CustomerSite CS ON CS.Id=Asset.CustomerSiteId
		LEFT JOIN CustomerInfo CI ON CI.Id = C.CustomerInfoId
		LEFT JOIN MasterEntityData CST ON C.ContractStatusId= CST.Id
	WHERE
		CA.Id = @AssetId AND CA.IsActive = 1
END