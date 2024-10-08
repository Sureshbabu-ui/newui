CREATE OR ALTER PROCEDURE [dbo].[customer_contract_list]
	@CustomerId INT
AS
BEGIN 
	SET NOCOUNT ON;
	DECLARE @ContractStatusId INT;
	DECLARE @Id INT;
	SELECT @ContractStatusId = Id FROM MasterEntityData WHERE Code = 'CTS_APRV'
	SELECT @Id = CustomerId FROM CustomerInfo WHERE Id = @CustomerId 
	SELECT 
		Id,
		ContractNumber
	FROM [Contract]
	WHERE
		CustomerId = @Id AND 
		ContractStatusId = @ContractStatusId AND 
		EndDate >= GETUTCDATE() AND
		IsDeleted = 0
END