CREATE OR ALTER PROCEDURE [dbo].[assetproductcategory_get_names]
AS
BEGIN 
	SET NOCOUNT ON;
	SELECT 
		Id,
		CategoryName 
	FROM AssetProductCategory
	WHERE 
		IsActive = 1 AND IsDeleted = 0
	ORDER BY CategoryName ASC;
END 