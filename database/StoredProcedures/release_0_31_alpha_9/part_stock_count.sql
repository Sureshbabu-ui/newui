CREATE OR ALTER PROCEDURE [dbo].[part_stock_count] 
	@Page INT = 1,
    @PerPage INT = 10,
    @Search VARCHAR(50) = NULL,
	@TenantRegionId INT = NULL,
	@TenantOfficeId INT = NULL,
	@PartType INT = NULL,
	@Make INT = NULL,
	@ProductCategory INT = NULL,
	@PartCategory INT = NULL,
    @SubCategory INT = NULL,
	@StockRoom INT = NULL,
	@TotalRows INT OUTPUT
AS 
BEGIN 
	SET NOCOUNT ON;
	
	SELECT
		@TotalRows = COUNT(P.Id)
	 FROM Part P
		LEFT JOIN AssetProductCategory APC ON APC.Id = P.PartProductCategoryId
		LEFT JOIN PartCategory PC ON PC.Id = P.PartCategoryId
		LEFT JOIN PartSubCategory PSC ON PSC.Id = P.PartSubCategoryId
		LEFT JOIN Make ON Make.Id = P.MakeId
    WHERE 
          (@ProductCategory IS NULL OR P.PartProductCategoryId = @ProductCategory) AND
          (@PartCategory IS NULL OR P.PartCategoryId = @PartCategory) AND
          (@SubCategory IS NULL OR P.PartSubCategoryId = @SubCategory) AND
          (@Make IS NULL OR P.MakeId = @Make) AND
		  (@Search IS NULL OR P.[Description] LIKE '%' + @Search + '%' OR P.PartCode LIKE '%' + @Search + '%') 
END