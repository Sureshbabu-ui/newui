CREATE OR ALTER    PROCEDURE [dbo].[part_count_by_servicerequest]
    @Page            INT = 1,
    @PerPage         INT = 3000,
    @Search          VARCHAR(50) = NULL,
    @SearchWith      VARCHAR(50) = NULL,
    @AssetProductCategoryId INT = NULL,
	@ContractId INT = NULL,
	@PartCategoryId INT = NULL,
	@PartSubCategoryId INT = NULL,
    @TotalRows  INT OUTPUT
AS 
BEGIN 

    DECLARE @SQL NVARCHAR(MAX);
    SET NOCOUNT ON;
    
	SELECT	
		@TotalRows=COUNT(Part.Id) 	
 FROM 
        AssetProductCategory APC
		LEFT JOIN Part ON Part.PartProductCategoryId = APC.PartProductCategoryId
		LEFT JOIN UserInfo AS CU ON CU.Id = Part.CreatedBy
        LEFT JOIN UserInfo AS UU ON UU.Id = Part.UpdatedBy
		LEFT JOIN PartCategory PC ON PC.Id = Part.PartCategoryId
		LEFT JOIN PartSubCategory PSC ON PSC.Id = Part.PartSubCategoryId
		LEFT JOIN  Make AS M ON M.Id = Part.MakeId
		INNER JOIN PartProductCategory ON PartProductCategory.Id=Part.PartProductCategoryId
    WHERE (@PartSubCategoryId IS NULL OR PSC.Id = @PartSubCategoryId) AND 
	(@PartCategoryId IS NULL  OR PC.Id = @PartCategoryId)  AND
	( APC.Id = @AssetProductCategoryId) AND 
	( (@SearchWith IS NULL) OR 
				  (
					@SearchWith = 'PartCode' AND Part.PartCode LIKE '%' + @Search + '%' OR 
					@SearchWith = 'OemPartNumber' AND Part.OemPartNumber LIKE '%' + @Search + '%' OR 			
					@SearchWith = 'MakeName' AND M.[Name] LIKE '%' + @Search + '%' OR 					
					@SearchWith = 'HsnCode' AND Part.HsnCode LIKE '%' + @Search + '%' OR 
					@SearchWith = 'PartName' AND Part.PartName LIKE '%' + @Search + '%'
				  )
            )
END



