CREATE OR ALTER PROCEDURE [dbo].[asset_details]
	@ContractAssetId INT
AS
BEGIN 
	SET NOCOUNT ON;
	SELECT
		CA.Id,
		A.MspAssetId,
		A.CustomerAssetId,
		PC.CategoryName AS AssetProductCategory,
		M.[Name] AS ProductMake,
		P.ModelName AS ProductModel,
		A.ProductSerialNumber,
		CA.IsEnterpriseProduct,
		CA.IsOutSourcingNeeded,
		VB.[Name] AS VendorBranch,
		CA.ResolutionTimeInHours,
		CA.ResponseTimeInHours,
		CA.StandByTimeInHours,
		CA.IsVipProduct,
		PPAC.[Name] AS ProductCondition,
		CA.IsPreventiveMaintenanceNeeded,
		PMF.[Name] AS PreventiveMaintenanceFrequency,
		PST.[Name] AS ProductSupportType,
		A.WarrantyEndDate,
		CA.AmcEndDate,
		CS.SiteName AS CustomerSite
	FROM ContractAssetDetail CA
		LEFT JOIN Asset A ON A.Id = CA.AssetId
		LEFT JOIN AssetProductCategory PC ON PC.Id = A.AssetProductCategoryId
		LEFT JOIN Make M ON M.Id = A.ProductMakeId
		LEFT JOIN Product P ON P.Id = A.ProductModelId
		LEFT JOIN MasterEntityData PPAC ON CA.ProductConditionId = PPAC.Id
		LEFT JOIN MasterEntityData PST ON PST.Id = CA.ProductSupportTypeId 
		LEFT JOIN MasterEntityData PMF ON PMF.Id = CA.PreventiveMaintenanceFrequencyId  
		LEFT JOIN CustomerSite CS ON CS.Id=A.CustomerSiteId
		LEFT JOIN VendorBranch VB ON VB.Id = CA.OutsourcedVendorBranchId
	WHERE
		CA.Id = @ContractAssetId
END 