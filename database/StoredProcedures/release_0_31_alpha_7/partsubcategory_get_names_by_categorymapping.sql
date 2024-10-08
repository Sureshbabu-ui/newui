CREATE OR ALTER   PROCEDURE [dbo].[partsubcategory_get_names_by_categorymapping]
@PartProductCategoryToPartCategoryMappingId INT
AS
BEGIN 
	SET NOCOUNT ON;
	SELECT 
		PSC.Id As Id,
		PSC.[Name],
		PPCM.Id As PartProductCategoryToPartCategoryMappingId
		FROM PartSubCategory PSC
		LEFT JOIN  PartProductCategoryToPartCategoryMapping PPCM ON PPCM.Id = PSC.PartProductCategoryToPartCategoryMappingId
	WHERE 
		PSC.PartProductCategoryToPartCategoryMappingId = @PartProductCategoryToPartCategoryMappingId 
	ORDER BY PSC.[Name] ASC;

END 
