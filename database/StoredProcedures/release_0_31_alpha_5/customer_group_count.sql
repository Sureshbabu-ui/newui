CREATE OR ALTER PROCEDURE [dbo].[customer_group_count] 
    @Search VARCHAR(50) = NULL,
    @TotalRows INT OUTPUT
AS
BEGIN 
    SET NOCOUNT ON;
    SELECT 
        @TotalRows = COUNT(Id)
    FROM CustomerGroup 
    WHERE
        (@Search IS NULL OR 
        GroupName LIKE '%' + @Search + '%' OR 
        GroupCode LIKE '%' + @Search + '%');
END 
