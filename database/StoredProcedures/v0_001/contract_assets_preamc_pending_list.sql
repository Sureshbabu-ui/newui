CREATE OR ALTER   PROCEDURE [dbo].[contract_assets_preamc_pending_list] 
	@ContractId INT,
	@Page INT = 1,
	@PerPage INT = 10,
	@Search VARCHAR(50) = NULL
AS 
BEGIN 
	SET NOCOUNT ON;
	IF @Page < 1
	SET
		@Page = 1;
	SELECT
		CAD.Id,
		CAD.IsActive,
		A.CustomerSiteId,
		T.OfficeName AS [Location],
		A.MspAssetId,
		PC.CategoryName,
		M.[Name] AS ProductMake,
		P.ModelName,
		A.ProductSerialNumber,
		A.WarrantyEndDate,
		CS.SiteName AS CustomerSiteName,
		MED.[Name] AssetAddedMode,
		PC.CategoryName AS AssetProductCategoryName
	FROM ContractAssetDetail CAD
		LEFT JOIN Asset A ON A.Id = CAD.AssetId
		LEFT JOIN TenantOffice T ON T.Id = A.TenantOfficeId
		LEFT JOIN CustomerSite CS ON A.CustomerSiteId = CS.Id
		LEFT JOIN AssetProductCategory PC ON A.AssetProductCategoryId = PC.Id
		LEFT JOIN Make M ON A.ProductMakeId = M.Id
		LEFT JOIN Product P ON A.ProductModelId = P.Id
		INNER JOIN MasterEntityData MED ON MED.Id = CAD.AssetAddModeId
	WHERE
		CAD.ContractId = @ContractId AND
		CAD.IsPreAmcCompleted = 0 AND 
		(@Search IS NULL OR 
		CS.SiteName LIKE '%' + @Search + '%' OR 
		A.ProductSerialNumber LIKE '%' + @Search + '%')
	ORDER BY
		CAD.Id DESC OFFSET (@Page -1) * @PerPage ROWS FETCH NEXT @PerPage ROWS ONLY
END 