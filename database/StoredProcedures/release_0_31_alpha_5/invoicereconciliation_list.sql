CREATE OR ALTER   PROCEDURE [dbo].[invoicereconciliation_list] 
    @Page INT = 1,
    @PerPage INT = 10,
    @Search VARCHAR(50) = NULL
AS 
BEGIN 
    SET NOCOUNT ON;

    IF @Page < 1
        SET @Page = 1;

    SELECT
        IR.Id,
        IR.CollectedAmount,
        IR.NetInvoiceAmount,
        IR.OutstandingAmount,
        IR.TdsDeductedAmount,
        IR.TdsPaidAmount,
        IR.GstTdsDeductedAmount,
        IR.GstTdsPaidAmount,
        IR.OtherDeductionAmount,
        IR.CustomerExpenseAmount,
        IR.SecurityDepositAmount,
        IR.PenaltyAmount,
        IR.WriteOffAmount,
        I.InvoiceNumber,
        IR.CreatedOn,
		CI.NameOnPrint AS CustomerName
    FROM InvoiceReconciliation IR
    LEFT JOIN Invoice I on I.Id = IR.InvoiceId
	LEFT JOIN ContractInvoice ON ContractInvoice.InvoiceId =I.Id
	LEFT JOIN [Contract] C ON C.Id=ContractInvoice.ContractId
	LEFT JOIN CustomerInfo CI on CI.Id = I.CustomerInfoId
    WHERE
        (@Search IS NULL OR 
        I.InvoiceNumber LIKE '%' + @Search + '%') OR
		(CI.NameOnPrint  LIKE '%' + @Search + '%')
    ORDER BY
        IR.Id DESC
    OFFSET (@Page - 1) * @PerPage ROWS FETCH NEXT @PerPage ROWS ONLY;
END
