CREATE OR ALTER PROCEDURE [dbo].[stockbin_list] 
    @Page INT = 1,
    @PerPage INT = 5,
    @Search VARCHAR(50) = NULL
AS 
BEGIN 
    SET NOCOUNT ON;
    IF @Page < 1
        SET @Page = 1;

    SELECT
		Id,
        BinName,
        BinCode,
        IsActive
    FROM 	
        StockBin
    WHERE (@Search IS NULL OR BinName LIKE '%' + @Search + '%' OR BinCode LIKE '%' + @Search + '%')
    ORDER BY CreatedOn DESC OFFSET (@Page - 1) * @PerPage ROWS FETCH NEXT @PerPage ROWS ONLY;
END