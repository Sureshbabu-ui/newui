CREATE OR ALTER PROCEDURE [dbo].[role_count] 
    @Search VARCHAR(50) = NULL,
    @TotalRows INT OUTPUT
AS 
BEGIN 
    SET NOCOUNT ON;
    SELECT
        @TotalRows = COUNT(Id)
    FROM [Role]
    WHERE
        (@Search IS NULL OR 
        [Name] LIKE '%' + @Search + '%') AND
		IsDeleted = 0 ;
END 
