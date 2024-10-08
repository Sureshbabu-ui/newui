CREATE OR ALTER PROCEDURE [dbo].[grntransactiontype_transactiontypes]
AS
BEGIN 
	SET NOCOUNT ON;
	SELECT 
		GTT.Id,
		GTT.TransactionType,
		GTT.TransactionTypeCode
	FROM GrnTransactionType GTT
END