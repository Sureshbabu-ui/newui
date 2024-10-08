CREATE OR ALTER PROCEDURE [dbo].[invoice_get_all_by_customer]
    @CustomerInfoId INT
AS
BEGIN 
    SET NOCOUNT ON;
    SELECT 
        I.Id,
		[Contract].ContractNumber,
		I.InvoiceNumber,
		I.CollectionDueDate,
		ISNULL(TotalDeductions.PaidAmount, 0) AS PaidAmount,
	    I.InvoiceAmount+Sgst+Cgst+Igst-DeductionAmount - ISNULL(TotalDeductions.PaidAmount, 0) AS PendingAmount
    FROM  Invoice I
    LEFT JOIN ContractInvoice ON ContractInvoice.InvoiceId = I.Id 
	LEFT JOIN [Contract] ON Contract.Id=ContractInvoice.ContractId
	LEFT JOIN CustomerInfo ON CustomerInfo.Id= [Contract].CustomerInfoId 
	LEFT JOIN Customer ON Customer.Id=CustomerInfo.CustomerId 
    LEFT JOIN 
        (SELECT 
            InvoiceReceipt.InvoiceId, 
            SUM(InvoiceReceipt.Amount) AS PaidAmount
        FROM 
            InvoiceReceipt 
			WHERE InvoiceReceipt.IsActive = 1
        GROUP BY 
            InvoiceReceipt.InvoiceId)
    AS TotalDeductions ON TotalDeductions.InvoiceId = I.Id
WHERE 
    Customer.Id=(select CustomerInfo.CustomerId from CustomerInfo where Id=@CustomerInfoId) AND
	(I.InvoiceAmount+Sgst+Cgst+Igst-DeductionAmount - ISNULL(TotalDeductions.PaidAmount, 0))>0
ORDER BY I.CreatedOn
END