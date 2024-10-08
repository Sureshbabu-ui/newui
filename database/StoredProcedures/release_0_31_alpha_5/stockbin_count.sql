CREATE OR ALTER PROCEDURE [dbo].[stockbin_count] 
    @Search VARCHAR(50) = NULL,
    @TotalRows INT OUTPUT
AS 
BEGIN 
    SET NOCOUNT ON;
    SELECT
        @TotalRows = COUNT(Id)
    FROM StockBin
    WHERE
        IsActive = 1 AND
        (@Search IS NULL OR 
        BinName LIKE '%' + @Search + '%' OR 
        BinCode LIKE '%' + @Search + '%')
END 
