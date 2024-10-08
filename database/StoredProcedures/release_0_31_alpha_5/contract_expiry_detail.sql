CREATE OR ALTER  PROCEDURE [dbo].[contract_expiry_detail]
	@ContractId INT
AS
BEGIN
	SET NOCOUNT ON;
	SELECT 
	   CallExpiryDate,
	   EndDate,
	   DATEDIFF(day, EndDate, CallExpiryDate) AS AdditionalDays
	FROM [Contract]
	WHERE
		[Contract].Id = @ContractId
END