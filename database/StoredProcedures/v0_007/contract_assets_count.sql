CREATE OR ALTER PROCEDURE [dbo].[contract_assets_count]
	@ContractId INT,
	@Search VARCHAR(50) = NULL,
	@AssetFilters NVARCHAR(MAX) = NULL,
	@TotalRows INT OUTPUT
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

	SELECT 
		@TotalRows = COUNT(A.Id)
	FROM CustomerSite
	LEFT JOIN Asset A ON A.CustomerSiteId = CustomerSite.Id
	LEFT JOIN TenantOffice T ON T.Id = A.TenantOfficeId
    LEFT JOIN TenantRegion ON TenantRegion.Id = T.RegionId
	LEFT JOIN ContractAssetDetail CAD ON CAD.AssetId = A.Id
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
END
