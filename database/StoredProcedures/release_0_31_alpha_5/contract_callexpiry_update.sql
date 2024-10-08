CREATE OR ALTER PROCEDURE [dbo].[contract_callexpiry_update] 
    @ContractId INT,
	@UpdatedBy INT,
	@CallExpiryDate DATE
AS
BEGIN
	SET NOCOUNT ON;
	UPDATE [Contract]
	SET
		CallExpiryDate = @CallExpiryDate,
		UpdatedBy = @UpdatedBy,
		UpdatedOn = GETUTCDATE()
	WHERE 
		Id = @ContractId
END