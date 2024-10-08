CREATE OR ALTER   PROCEDURE [dbo].[partproductcategorypartcategorymapping_get_names]
	@ProductCategoryId VARCHAR(32)
AS
BEGIN 
	SET NOCOUNT ON;
	SELECT 
		PartCategoryId As Id,
		PartCategory.[Name],
		PPCM.Id As PartProductCategoryToPartCategoryMappingId
	 FROM PartProductCategoryToPartCategoryMapping PPCM
	 INNER JOIN PartCategory ON PartCategory.Id=PPCM.PartCategoryId
	 INNER JOIN PartProductCategory ON PartProductCategory.Id=PPCM.PartProductCategoryId
	WHERE 
		PartProductCategory.Id = @ProductCategoryId  AND 
		PPCM.IsActive=1
	ORDER BY PartCategory.[Name] ASC;

END 
