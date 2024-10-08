CREATE OR ALTER PROCEDURE [dbo].[businessfunction_count] 
    @Search VARCHAR(50) = NULL,
    @TotalRows INT OUTPUT
AS 
BEGIN 
    SET NOCOUNT ON;
    SELECT 
        @TotalRows = COUNT(BF.Id)
    FROM BusinessFunction BF
    LEFT JOIN BusinessModule BM ON BM.Id = BF.BusinessModuleId
    WHERE  
        (@Search IS NULL OR 
        BF.BusinessFunctionName LIKE '%' + @Search + '%' OR 
        BF.BusinessFunctionCode LIKE '%' + @Search + '%' OR
        BM.BusinessModuleName LIKE '%' + @Search + '%');
END
