CREATE OR ALTER PROCEDURE [dbo].[contractinvoicedetail_list]
    @ContractInvoiceId INT
AS
BEGIN 
  SET NOCOUNT ON;   
  SELECT
        Id,
        ContractInvoiceId,
        ServicingAccountingCode,
        ItemDescription,
        Quantity,
        Unit,
        Rate,
        Amount,
        Discount,
        Sgst,
        Cgst,
        Igst,
        NetAmount,
        IsDeleted
	FROM ContractInvoiceDetail
	WHERE
        ContractInvoiceId = @ContractInvoiceId AND
        (IsDeleted = 0 OR 
        IsDeleted IS NULL)     
END