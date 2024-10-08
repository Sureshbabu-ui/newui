CREATE OR ALTER PROCEDURE [dbo].[part_category_list]
    @Page			INT=1,
    @PerPage   		INT=10,
    @Search			VARCHAR(50)=NULL,
    @SearchWith  VARCHAR(50) = NULL
AS 
BEGIN 
	SET NOCOUNT ON;
	IF @Page < 1
		SET @Page = 1;
	SELECT
		PC.Id,
		PC.Code,
		PC.[Name],
		PPCM.PartProductCategoryId,
		PPCM.Id AS MappingId,
		CreatedUser.FullName AS CreatedBy,
		PC.CreatedOn,
		UpdatedUser.FullName AS UpdatedBy,
		PartProductCategory.CategoryName AS ProductCategory,
		PC.UpdatedOn
	FROM PartCategory PC
	LEFT JOIN UserInfo CreatedUser ON CreatedUser.Id=PC.CreatedBy
	LEFT JOIN  UserInfo UpdatedUser On UpdatedUser.Id = PC.UpdatedBy
	JOIN PartProductCategoryToPartCategoryMapping PPCM On PPCM.PartCategoryId = PC.Id
	JOIN PartProductCategory ON PartProductCategory.Id = PPCM.PartProductCategoryId
	WHERE
        (ISNULL(@Search, '') = '' OR 
		PC.Code LIKE '%' + @Search + '%' OR 
		PC.[Name] LIKE '%' + @Search + '%') AND
        (ISNULL(@SearchWith, '') = '' OR 
		PartProductCategory.Id = @SearchWith)
    ORDER BY PC.Id DESC 
        OFFSET (@Page-1)*@PerPage ROWS FETCH NEXT  @PerPage ROWS ONLY
END