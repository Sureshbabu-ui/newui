CREATE OR ALTER PROCEDURE [dbo].[contract_callstatus_detail]
  @ContractId INT
AS
BEGIN
	SET NOCOUNT ON;
	SELECT 
	   Id,
	   CallExpiryDate,
	   CallStopDate,
	   CallStopReason
	FROM [Contract]
	WHERE
		Id = @ContractId
END