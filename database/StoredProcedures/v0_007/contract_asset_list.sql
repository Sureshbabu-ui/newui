CREATE OR ALTER     PROCEDURE [dbo].[contract_asset_list]
	@ContractId INT,
	@AssetFilters NVARCHAR(MAX) = NULL,
	@Page INT = 1,
	@PerPage INT = 10,
	@Search VARCHAR(50) = NULL
AS 
BEGIN 
	SET NOCOUNT ON;

	DECLARE 
    @TenantRegionId INT,
    @TenantOfficeId INT,
    @PreAmcStatus BIT,
	@AssetProductCategoryId INT

	SELECT 
    @TenantRegionId = JSON_VALUE(@AssetFilters, '$.TenantRegionId'),
    @TenantOfficeId = JSON_VALUE(@AssetFilters, '$.TenantOfficeId'),
    @PreAmcStatus = JSON_VALUE(@AssetFilters, '$.PreAmcStatus'),
	@AssetProductCategoryId=JSON_VALUE(@AssetFilters,'$.AssetProductCategoryId')

	IF @Page < 1
	SET
		@Page = 1;
	SELECT
		CAD.Id,
		CAD.IsPreAmcCompleted,
		CAD.IsActive,
		A.CustomerSiteId,
		T.OfficeName AS [Location],
		AssetProductCategory.CategoryName,
		Make.[Name] AS ProductMake,
		Product.ModelName,
		A.ProductSerialNumber,
		A.WarrantyEndDate,
		CustomerSite.SiteName AS CustomerSiteName,
		MED.[Name] AssetAddedMode
	FROM ContractAssetDetail CAD WITH (NOLOCK)
		LEFT JOIN Asset A ON A.Id = CAD.AssetId
		LEFT JOIN TenantOffice T ON T.Id = A.TenantOfficeId
        LEFT JOIN TenantRegion ON TenantRegion.Id = T.RegionId
		LEFT JOIN CustomerSite ON A.CustomerSiteId = CustomerSite.Id
		LEFT JOIN AssetProductCategory ON A.AssetProductCategoryId = AssetProductCategory.Id
		LEFT JOIN Make ON A.ProductMakeId = Make.Id
		LEFT JOIN Product ON A.ProductModelId = Product.Id
		INNER JOIN MasterEntityData MED ON MED.Id = CAD.AssetAddModeId
	WHERE
		CAD.ContractId = @ContractId AND
		(@AssetFilters IS NULL OR (@TenantRegionId IS  NULL OR TenantRegion.Id = @TenantRegionId)
		AND (@TenantOfficeId IS NULL OR T.Id = @TenantOfficeId) 
		AND (@AssetProductCategoryId IS NULL OR  A.AssetProductCategoryId = @AssetProductCategoryId) 

		AND
		(
			(@PreAmcStatus IS NULL) OR 
			(@PreAmcStatus = 1 AND CAD.IsPreAmcCompleted = 1) OR 
			(@PreAmcStatus = 0 AND CAD.IsPreAmcCompleted = 0) 
		)) AND
		(@Search IS NULL OR 
		CustomerSite.SiteName LIKE + @Search + '%' OR 
		A.ProductSerialNumber LIKE + @Search + '%' 
		)
	ORDER BY
		CAD.Id DESC OFFSET (@Page -1) * @PerPage ROWS FETCH NEXT @PerPage ROWS ONLY
END 
