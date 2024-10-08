CREATE OR ALTER PROCEDURE [dbo].[designation_count] 
    @Search VARCHAR(50) = NULL,
    @TotalRows INT OUTPUT
AS 
BEGIN 
    SET NOCOUNT ON;
    SELECT 
        @TotalRows = COUNT(Id)
    FROM Designation
    WHERE
        (@Search IS NULL OR 
        [Name] LIKE '%' + @Search + '%' OR 
        Code LIKE '%' + @Search + '%');
END
