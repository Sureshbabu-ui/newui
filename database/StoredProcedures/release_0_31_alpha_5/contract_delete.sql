CREATE OR ALTER PROCEDURE [dbo].[contract_delete]
	@ContractId INT
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;
	BEGIN TRANSACTION
	DELETE FROM 
		ContractAssetDetail
	WHERE
		ContractId = @ContractId

	DELETE FROM 
		ContractAssetSummary
	WHERE
		ContractId = @ContractId
	DELETE FROM 
		ContractInvoicePrerequisite
	WHERE 
		ContractId = @ContractId

	DELETE FROM 
		PreAmcInspectionSchedule
	WHERE
		ContractId = @ContractId

	DELETE FROM 
		ContractCustomerSite
	WHERE
		ContractId = @ContractId

	DELETE FROM 
		ContractDocument
	WHERE
		ContractId = @ContractId

	DELETE FROM 
		ContractBankGuarantee
	WHERE
		ContractId = @ContractId

	DELETE FROM 
		ContractManPower
	WHERE
		ContractId = @ContractId

	DELETE FROM 
		ContractManpowerAllocation
	WHERE
		ContractId = @ContractId

	DELETE FROM 
		ContractHistory
	WHERE
		ContractId = @ContractId

	DELETE FROM 
		Contract
	WHERE
		Id = @ContractId
COMMIT TRANSACTION;
END;