CREATE OR ALTER PROCEDURE [dbo].[invoiceprerequisite_count]
    @Search VARCHAR(50) = NULL,
    @TotalRows INT OUTPUT
AS 
BEGIN 
    SET NOCOUNT ON;
    SELECT 
        @TotalRows = COUNT(IPR.Id) 
    FROM InvoicePrerequisite IPR
    WHERE 
        (@Search IS NULL OR 
        (IPR.DocumentName LIKE '%' + @Search + '%' OR 
        IPR.[Description] LIKE '%' + @Search + '%'));
END
