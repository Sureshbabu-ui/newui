CREATE OR ALTER PROCEDURE [dbo].[contract_invoice_prerequisite_list]
	@ContractId INT
AS
BEGIN 
	SELECT
       Id,
	   IsActive,
	   DocumentName,
	   InvoicePrerequisiteId
	FROM  ContractInvoicePrerequisite
	WHERE
	   ContractId = @ContractId AND
	   IsActive = 1
END 