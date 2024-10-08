CREATE OR ALTER   PROCEDURE [dbo].[assetproductcategory_count]
    @Search VARCHAR(50) = NULL,
    @TotalRows INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT 
        @TotalRows = COUNT(APC.Id) 
    FROM AssetProductCategory APC
    WHERE 
        APC.IsDeleted = 0 AND
        (@Search IS NULL OR 
        (APC.CategoryName LIKE '%' + @Search + '%') OR
        (APC.Code LIKE '%' + @Search + '%'));
END