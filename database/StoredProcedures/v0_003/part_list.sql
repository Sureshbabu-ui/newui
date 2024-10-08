CREATE OR ALTER PROCEDURE [dbo].[part_list]
    @Page        INT = 1,
    @PerPage     INT = 10,
    @Search      VARCHAR(50) = NULL,
    @SearchWith  VARCHAR(50) = NULL
AS
BEGIN 
    SET NOCOUNT ON;
    IF @Page < 1
    SET @Page = 1;

    SELECT 
        Part.Id,
        Part.PartCode,
        Part.PartName,
        PC.Name AS PartCategoryName,
		PSC.Name AS PartSubCategoryName,
        M.Name AS MakeName,
        Part.HsnCode,
        Part.OemPartNumber,
        Part.Description,
        PPC.CategoryName AS ProductCategoryName,
        CU.FullName as CreatedBy,
        Part.CreatedOn,
        UU.FullName AS UpdatedBy,
        Part.UpdatedOn
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
    ORDER BY Part.CreatedOn DESC  OFFSET (@Page - 1) * @PerPage ROWS FETCH NEXT @PerPage ROWS ONLY;
END