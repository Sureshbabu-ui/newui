CREATE OR ALTER PROCEDURE [dbo].[part_list_by_partproductcategory]
    @Page            INT = 1,
    @PerPage         INT = 3000,
    @Search          VARCHAR(50) = NULL,
    @SearchWith      VARCHAR(50) = NULL,
    @ProductCategoryId INT = NULL,
	@MakeId INT = NULL,
	@PartCategoryId INT = NULL,
	@PartSubCategoryId INT = NULL
AS
BEGIN 
    SET NOCOUNT ON;
    IF @Page < 1
        SET @Page = 1;

    SELECT 
        Part.Id,
        Part.PartCode,
		Part.GstRate,
        Part.PartName,
        Part.HsnCode,
        Part.OemPartNumber,
        Part.[Description]
    FROM 
        PartProductCategory PPC
		LEFT JOIN Part ON Part.PartProductCategoryId = PPC.Id
		LEFT JOIN PartCategory PC ON PC.Id = Part.PartCategoryId
		LEFT JOIN PartSubCategory PSC ON PSC.Id = Part.PartSubCategoryId
		LEFT JOIN  Make AS M ON M.Id = Part.MakeId
    WHERE ((@PartSubCategoryId IS NULL OR PSC.Id = @PartSubCategoryId) AND (@PartCategoryId IS NULL OR PC.Id = @PartCategoryId) AND (@MakeId IS NULL OR M.Id = @MakeId) AND (@ProductCategoryId IS NULL OR PPC.Id = @ProductCategoryId)) AND 
			( (@SearchWith IS NULL) OR 
				  (
					@SearchWith = 'PartCode' AND Part.PartCode LIKE '%' + @Search + '%' OR 
					@SearchWith = 'OemPartNumber' AND Part.OemPartNumber LIKE '%' + @Search + '%' OR 
					@SearchWith = 'Description' AND Part.[Description] LIKE '%' + @Search + '%' OR 
					@SearchWith = 'MakeName' AND M.[Name] LIKE '%' + @Search + '%' OR 
					@SearchWith = 'PartCategoryName' AND PC.[Name] LIKE '%' + @Search + '%' OR 
					@SearchWith = 'HsnCode' AND Part.HsnCode LIKE '%' + @Search + '%' OR 
					@SearchWith = 'PartName' AND Part.PartName LIKE '%' + @Search + '%'
				  )
            )
    ORDER BY Part.CreatedOn DESC  OFFSET (@Page - 1) * @PerPage ROWS FETCH NEXT @PerPage ROWS ONLY;
END