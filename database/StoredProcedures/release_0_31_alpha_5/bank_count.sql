CREATE OR ALTER   PROCEDURE [dbo].[bank_count] 
    @Search VARCHAR(50) = NULL,
    @TotalRows INT OUTPUT 
AS
BEGIN
    SET NOCOUNT ON;
    SELECT 
		@TotalRows = COUNT(Bank.Id) 
    FROM Bank 
    WHERE
        @Search IS NULL OR
        (BankName LIKE '%' + @Search + '%' OR 
        BankCode LIKE '%' + @Search + '%')
END;

