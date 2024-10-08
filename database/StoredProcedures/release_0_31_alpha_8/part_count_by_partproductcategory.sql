CREATE OR ALTER PROCEDURE [dbo].[part_count_by_partproductcategory]
    @ProductCategoryId INT = NULL,
    @Search     VARCHAR(50) = NULL,
	@SearchWith VARCHAR(50) = NULL,
	@MakeId INT = NULL,
	@PartCategoryId INT = NULL,
	@PartSubCategoryId INT = NULL,
    @TotalRows  INT OUTPUT
AS 
BEGIN 
	SELECT	
		@TotalRows=COUNT(Part.Id) 	
	FROM 
        PartProductCategory PPC
		LEFT JOIN Part ON Part.PartProductCategoryId = PPC.Id
		LEFT JOIN PartCategory PC ON PC.Id = Part.PartCategoryId
		LEFT JOIN PartSubCategory PSC ON PSC.Id = Part.PartSubCategoryId
		LEFT JOIN  Make AS M ON M.Id = Part.MakeId
    WHERE (
			(@PartSubCategoryId IS NULL OR PSC.Id = @PartSubCategoryId) AND 
			(@PartCategoryId IS NULL OR PC.Id = @PartCategoryId) AND 
			(@MakeId IS NULL OR M.Id = @MakeId) AND 
			(@ProductCategoryId IS NULL OR PPC.Id = @ProductCategoryId)) AND 
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
END