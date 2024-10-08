CREATE OR ALTER   PROCEDURE [dbo].[assetproductcategorypartcategorymapping_get_names]
	@AssetProductCategoryId VARCHAR(32)
AS
BEGIN 
	SET NOCOUNT ON;
	SELECT 
		PartCategoryId As Id,
		PartCategory.[Name],
		PPCM.Id As PartProductCategoryToPartCategoryMappingId
	 FROM PartProductCategoryToPartCategoryMapping PPCM
	 INNER JOIN PartCategory ON PartCategory.Id=PPCM.PartCategoryId
     INNER JOIN AssetProductCategory ON AssetProductCategory.PartProductCategoryId=PPCM.PartProductCategoryId
	WHERE 
		AssetProductCategory.Id = @AssetProductCategoryId  AND 
		PPCM.IsActive=1
	ORDER BY PartCategory.[Name] ASC;

END 
