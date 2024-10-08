CREATE OR ALTER PROCEDURE [dbo].[invoicereceipt_list]
    @ReceiptId	INT
AS
BEGIN 
    SET NOCOUNT ON;
	SELECT
        IR.Id,
        IR.Amount AS ReceiptAmount,
        Invoice.InvoiceNumber,
	    (Invoice.InvoiceAmount + Invoice.Sgst +Invoice.Cgst +Invoice.Igst -Invoice.DeductionAmount) AS InvoiceAmount,
	    CI.Id AS InvoiceId
    FROM InvoiceReceipt IR
    INNER JOIN Receipt R ON R.Id=IR.ReceiptId
    INNER JOIN Invoice ON Invoice.Id=IR.InvoiceId
	LEFT JOIN ContractInvoice CI ON CI.InvoiceId=Invoice.Id
	WHERE
        R.Id = @ReceiptId
END