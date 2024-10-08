CREATE OR ALTER PROCEDURE [dbo].[invoicereconciliation_count]
    @Search VARCHAR(50) = NULL,
    @TotalRows INT OUTPUT
AS
BEGIN 
    SET NOCOUNT ON;
    SELECT 
        @TotalRows = COUNT(Id)
    FROM  InvoiceReconciliation 
    WHERE (@Search IS NULL OR 
          WriteOffAmountRemarks LIKE '%' + @Search + '%');
END
