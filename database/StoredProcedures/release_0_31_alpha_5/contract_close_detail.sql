CREATE OR ALTER PROCEDURE [dbo].[contract_close_detail] 
	@ContractId INT 
AS 
BEGIN
	SET NOCOUNT ON;
	SET XACT_ABORT ON;

	DECLARE @TotalCollection INT DECLARE @TotalInvoiceAmount INT DECLARE @TotalOpenServiceRequest INT DECLARE @PendingBankGuarantee INT DECLARE @EndDate DATE
	SET
		@TotalCollection = ISNULL(
				(SELECT
					SUM(Amount)
				FROM
					InvoiceReceipt AS IR
					LEFT JOIN Invoice ON Invoice.Id = IR.InvoiceId
					LEFT JOIN ContractInvoice AS CI ON CI.InvoiceId = Invoice.Id
					LEFT JOIN Contract ON Contract.Id = CI.ContractId
				WHERE
					Contract.Id = @ContractId),
			0)
	SET
		@TotalOpenServiceRequest = ISNULL(
				(SELECT
					COUNT(SR.Id)
				FROM
					ServiceRequest AS SR
					LEFT JOIN MasterEntityData AS CallStatus ON SR.CaseStatusId = CallStatus.Id
				WHERE
					CallStatus.Code NOT IN ('SRS_RCLD', 'SRS_CLSD')
					AND SR.ContractId = @ContractId),
			0)
	SET
		@PendingBankGuarantee = ISNULL(
		
				(SELECT
					COUNT(CBG.Id)
				FROM
					ContractBankGuarantee AS CBG
					LEFT JOIN MasterEntityData AS GuaranteeStatus ON CBG.GuaranteeStatusId = GuaranteeStatus.Id
				WHERE
					GuaranteeStatus.Code = 'GRS_CLMD'
					AND CBG.ContractId = @ContractId),
			0)
	SET
		@TotalInvoiceAmount = ISNULL(
				(SELECT
					SUM(Invoice.InvoiceAmount+Invoice.Cgst+Invoice.Sgst+Invoice.Igst-Invoice.DeductionAmount)
				FROM
					Invoice
					LEFT JOIN ContractInvoice AS CI ON CI.InvoiceId = Invoice.Id
					LEFT JOIN Contract ON Contract.Id = CI.ContractId
				WHERE
					Contract.Id = @ContractId),
			0)
	SET
		@EndDate =(SELECT
				EndDate
			FROM
				Contract
			WHERE
				Contract.Id = @ContractId)
	SELECT
		@TotalCollection AS TotalCollection,
		@TotalOpenServiceRequest AS TotalOpenServiceRequest,
		@PendingBankGuarantee AS PendingBankGuarantee,
		@TotalInvoiceAmount AS TotalInvoiceAmount,
		@EndDate AS EndDate;
END
