CREATE OR ALTER PROCEDURE [dbo].[contractinvoice_approve]
	@ContractInvoiceScheduleId INT,
	@CreatedBy INT
AS
BEGIN
	SET NOCOUNT ON;
	UPDATE  ContractInvoiceSchedule 
	SET IsInvoiceApproved=1,
		InvoiceApprovedBy=@CreatedBy 
	WHERE 
		Id=@ContractInvoiceScheduleId
END
