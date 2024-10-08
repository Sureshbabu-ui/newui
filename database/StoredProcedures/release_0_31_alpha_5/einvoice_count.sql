CREATE OR ALTER PROCEDURE [dbo].[einvoice_count]
    @Search VARCHAR(50) = NULL,
    @TotalRows INT OUTPUT
AS
BEGIN 
    SET NOCOUNT ON;
    SELECT
        @TotalRows = COUNT(Id)
    FROM SalesRegisterHeader
    WHERE
        (@Search IS NULL OR
        Invoiceno LIKE '%' + @Search + '%')
	  END 

