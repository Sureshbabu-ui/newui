CREATE OR ALTER PROCEDURE [dbo].[part_stock_list]
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
    @StockRoom INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    IF @Page < 1 SET @Page = 1;
    
	WITH PartStockQuantity_CTE (Id, Quantity) AS 
	(
        SELECT PS.PartId AS Id, COUNT(PS.PartId) AS Quantity
        FROM PartStock PS
			INNER JOIN Part P ON P.Id = PS.PartId
			LEFT JOIN AssetProductCategory APC ON APC.Id = P.PartProductCategoryId
			LEFT JOIN PartCategory PC ON PC.Id = P.PartCategoryId
			LEFT JOIN PartSubCategory PSC ON PSC.Id = P.PartSubCategoryId
			LEFT JOIN Make ON Make.Id = P.MakeId
			LEFT JOIN TenantOffice T ON T.Id = PS.TenantOfficeId
			LEFT JOIN TenantRegion TR ON TR.Id = T.RegionId
			LEFT JOIN StockRoom ON StockRoom.Id = PS.StockRoomId
        WHERE (@TenantOfficeId IS NULL OR PS.TenantOfficeId = @TenantOfficeId) AND
              (@ProductCategory IS NULL OR P.PartProductCategoryId = @ProductCategory) AND
              (@PartCategory IS NULL OR P.PartCategoryId = @PartCategory) AND
              (@SubCategory IS NULL OR P.PartSubCategoryId = @SubCategory) AND
              (@TenantRegionId IS NULL OR T.RegionId = @TenantRegionId) AND
              (@PartType IS NULL OR PS.StockTypeId = @PartType) AND
              (@Make IS NULL OR P.MakeId = @Make) AND
              (@StockRoom IS NULL OR PS.StockRoomId = @StockRoom)
        GROUP BY PS.PartId
    )
    SELECT
        P.Id, P.PartCode, P.[Description] AS PartName, Make.Name AS Make,
        APC.CategoryName AS ProductCategory, PC.Name AS PartCategory,
        PSC.Name AS PartSubCategory,
        CTE.Quantity
    FROM Part P
		LEFT JOIN PartStockQuantity_CTE CTE ON CTE.Id = P.Id
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
    ORDER BY P.Id DESC OFFSET (@Page - 1) * @PerPage ROWS FETCH NEXT @PerPage ROWS ONLY;
END