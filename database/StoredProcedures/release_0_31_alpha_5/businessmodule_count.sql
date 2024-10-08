CREATE OR ALTER PROCEDURE [dbo].[businessmodule_count] 
    @Search VARCHAR(50) = NULL,
    @TotalRows INT OUTPUT
AS 
BEGIN 
    SET NOCOUNT ON;
    SELECT 
        @TotalRows = COUNT(Id)
    FROM BusinessModule
    WHERE 
        (@Search IS NULL OR 
        BusinessModuleName LIKE '%' + @Search + '%');
END
