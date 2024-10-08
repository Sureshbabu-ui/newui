CREATE OR ALTER PROCEDURE [dbo].[partproductcategory_count]
    @Search VARCHAR(50) = NULL,
    @TotalRows INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT 
        @TotalRows = COUNT(PPC.Id) 
    FROM PartProductCategory PPC
    WHERE 
        PPC.IsDeleted = 0 AND
        (@Search IS NULL OR 
        (PPC.CategoryName LIKE '%' + @Search + '%') OR
        (PPC.Code LIKE '%' + @Search + '%'));
END