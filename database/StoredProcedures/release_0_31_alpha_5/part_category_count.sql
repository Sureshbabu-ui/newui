CREATE OR ALTER   PROCEDURE [dbo].[part_category_count] 
	@Search VARCHAR(50) = NULL,
	@SearchWith  VARCHAR(50) = NULL,
	@TotalRows INT OUTPUT
AS
BEGIN 
    SET NOCOUNT ON;
	SELECT
		@TotalRows = COUNT(PartCategory.Id)
	FROM PartCategory
	JOIN PartProductCategoryToPartCategoryMapping PPCM ON PPCM.PartCategoryId = PartCategory.Id
	JOIN PartProductCategory ON PartProductCategory.Id = PPCM.PartProductCategoryId
	WHERE
        (ISNULL(@Search, '') = '' OR 
		PartCategory.Code LIKE '%' + @Search + '%' OR 
		PartCategory.[Name] LIKE '%' + @Search + '%') AND
        (ISNULL(@SearchWith, '') = '' OR 
		PartProductCategory.Id = @SearchWith)
END  