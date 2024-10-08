CREATE OR ALTER PROCEDURE [dbo].[make_count] 
    @Search VARCHAR(50) = NULL,
    @TotalRows INT OUTPUT
AS 
BEGIN 
    SET NOCOUNT ON;
    SELECT 
        @TotalRows = COUNT(Id) 
    FROM Make
    WHERE 
        IsDeleted = 0 AND
        (@Search IS NULL OR 
        [Name] LIKE '%' + @Search + '%' OR 
        Code LIKE '%' + @Search + '%');
END
