CREATE OR ALTER PROCEDURE [dbo].[salesregisterheader_get_responsepending_invoicenos] 
    @InvoiceNos NVARCHAR(MAX) OUTPUT
AS 
BEGIN 
    SET NOCOUNT ON;
 
    DECLARE @TempInvoiceNos NVARCHAR(MAX);
 
    SELECT @TempInvoiceNos = COALESCE(@TempInvoiceNos + ',', '') + Invoiceno
    FROM SalesRegisterHeader AS H
    WHERE NOT EXISTS (
        SELECT 1
        FROM SalesRegisterReturnResponse AS R
        WHERE R.Invoiceno = H.Invoiceno
    );
 
    SET @InvoiceNos = @TempInvoiceNos;
END;