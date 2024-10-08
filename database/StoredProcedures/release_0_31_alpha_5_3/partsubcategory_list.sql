CREATE OR ALTER  PROCEDURE [dbo].[partsubcategory_list]
    @Page			INT=1,
    @PerPage   		INT=10,
    @Search			VARCHAR(50)=NULL
AS 
BEGIN 
	SET NOCOUNT ON;
	IF @Page < 1
		SET @Page = 1;
	SELECT
		PSC.Id,
		PSC.Code,
		PSC.[Name],
		PC.[Name] AS PartCategory,
		PPC.CategoryName AS ProductCategory,
		PSC.IsActive
	FROM PartSubCategory PSC
	INNER JOIN PartProductCategoryToPartCategoryMapping PPCM ON PPCM.Id = PSC.PartProductCategoryToPartCategoryMappingId
	INNER JOIN PartCategory PC ON PPCM.PartCategoryId = PC.Id
	INNER JOIN PartProductCategory PPC ON PPC.Id = PPCM.PartProductCategoryId
	WHERE
        (ISNULL(@Search, '') = '' OR 
		PSC.Code LIKE '%' + @Search + '%' OR 
		PSC.[Name] LIKE '%' + @Search + '%')
    ORDER BY PSC.Id DESC 
        OFFSET (@Page-1)*@PerPage ROWS FETCH NEXT  @PerPage ROWS ONLY
END