CREATE OR ALTER  PROCEDURE [dbo].[product_list_download]
AS
BEGIN 
    SET NOCOUNT ON;
    SELECT 
        P.Code,
        P.ModelName,
        P.[Description],
		PC.CategoryName AS Category,
        M.[Name] AS Make,
        P.ManufacturingYear,
        P.AmcValue
    FROM  Product P  
	 LEFT JOIN AssetProductCategory PC ON PC.Id = P.AssetProductCategoryId
	 LEFT JOIN Make M ON M.Id = P.MakeId
END