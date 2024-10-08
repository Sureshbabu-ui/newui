CREATE OR ALTER PROCEDURE [dbo].[part_count]
    @Search     VARCHAR(50) = NULL,
    @SearchWith VARCHAR(50) = NULL,
    @TotalRows  INT OUTPUT
AS 
BEGIN 
    SET NOCOUNT ON;
        SELECT 
        @TotalRows = COUNT(Part.Id)  
    FROM 
        Part
        LEFT JOIN UserInfo AS CU ON CU.Id = Part.CreatedBy
        LEFT JOIN UserInfo AS UU ON UU.Id = Part.UpdatedBy
        LEFT JOIN PartCategory AS PC ON PC.Id = Part.PartCategoryId
		LEFT JOIN PartSubCategory AS PSC ON PSC.Id = Part.PartSubCategoryId
        LEFT JOIN Make AS M ON M.Id = Part.MakeId
        LEFT JOIN PartProductCategory PPC ON PPC.Id=Part.PartProductCategoryId
	WHERE (@SearchWith IS NULL) OR 
		  (
				@SearchWith = 'PartCode' AND Part.PartCode LIKE '%' + @Search + '%' OR 
				@SearchWith = 'OemPartNumber' AND Part.OemPartNumber LIKE '%' + @Search + '%' OR 			
				@SearchWith = 'MakeName' AND M.[Name] LIKE '%' + @Search + '%' OR 					
				@SearchWith = 'HsnCode' AND Part.HsnCode LIKE '%' + @Search + '%' OR 
				@SearchWith = 'PartName' AND Part.PartName LIKE '%' + @Search + '%' OR
				@SearchWith = 'ProductCategoryName' AND PPC.CategoryName LIKE '%' + @Search + '%' OR
				@SearchWith = 'Description' AND Part.Description LIKE '%' + @Search + '%' OR
				@SearchWith = 'PartCategoryName' AND PC.Name LIKE '%' + @Search + '%' OR
				@SearchWith = 'PartSubCategoryName' AND PSC.Name LIKE '%' + @Search + '%' 
		  )
END