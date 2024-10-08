CREATE OR ALTER PROCEDURE [dbo].[invoice_get_all_by_contract]
    @ContractId int
AS
BEGIN 
    SET NOCOUNT ON;
    SELECT 
        I.Id,
        I.InvoiceNumber,
		I.CollectionDueDate,
		ISNULL(TotalDeductions.PaidAmount, 0) PaidAmount,
	    I.InvoiceAmount+Sgst+Cgst+Igst-DeductionAmount - ISNULL(TotalDeductions.PaidAmount, 0) PendingAmount
    FROM Invoice I
    LEFT JOIN ContractInvoice CI ON CI.InvoiceId = I.Id
    LEFT JOIN (
        SELECT 
            InvoiceReceipt.InvoiceId, 
            SUM(InvoiceReceipt.Amount) PaidAmount
        FROM 
            InvoiceReceipt
        GROUP BY 
            InvoiceReceipt.InvoiceId)
     AS TotalDeductions ON TotalDeductions.InvoiceId = I.Id
    WHERE 
        CI.ContractId = @ContractId AND 
		( I.InvoiceAmount+Sgst+Cgst+Igst-DeductionAmount - ISNULL(TotalDeductions.PaidAmount, 0))>0
		ORDER BY I.CreatedOn
END
