CREATE OR ALTER PROCEDURE [dbo].[partproductcategory_get_names]
AS
BEGIN 
	SET NOCOUNT ON;
	SELECT 
		Id,
		CategoryName 
	FROM PartProductCategory
	WHERE 
		IsActive = 1
	ORDER BY CategoryName ASC;
END 