CREATE OR ALTER PROCEDURE [dbo].[contract_close] 
    @ContractId INT,
	@ClosedBy INT
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;
	DECLARE @TotalCollection INT
	DECLARE @TotalInvoiceAmount INT
	DECLARE @TotalOpenServiceRequest INT
	DECLARE @PendingBankGuarantee INT

	SET @TotalCollection = (SELECT SUM(Amount) FROM InvoiceReceipt  AS IR
	LEFT JOIN Invoice ON Invoice.Id=IR.InvoiceId
	LEFT JOIN ContractInvoice AS CI ON CI.InvoiceId=Invoice.Id
	LEFT JOIN [Contract] ON [Contract].Id=CI.ContractId
	WHERE  
		[Contract].Id=@ContractId)

	SET @TotalOpenServiceRequest=(SELECT COUNT(SR.Id) FROM ServiceRequest AS SR
    INNER JOIN MasterEntityData AS CallStatus ON SR.CaseStatusId = CallStatus.Id
	WHERE 
		CallStatus.Code NOT IN ('SRS_RCLD', 'SRS_CLSD') AND 
		SR.ContractId=@ContractId)

	SET @PendingBankGuarantee =(SELECT COUNT(CBG.Id) FROM ContractBankGuarantee AS CBG
	 LEFT JOIN  MasterEntityData AS GuaranteeStatus ON CBG.GuaranteeStatusId = GuaranteeStatus.Id
	 WHERE 
		GuaranteeStatus.Code ='GRS_CLMD' AND 
		CBG.ContractId=@ContractId)

	SET @TotalInvoiceAmount = (SELECT SUM(Invoice.InvoiceAmount) FROM Invoice
	LEFT JOIN ContractInvoice AS CI ON CI.InvoiceId=Invoice.Id
	LEFT JOIN [Contract] ON [Contract].Id=CI.ContractId
	WHERE  
		[Contract].Id=@ContractId)
	
         UPDATE
            [Contract]
        SET
          [Contract].ContractStatusId=72
        WHERE
            Id = @ContractId;
END
