CREATE OR ALTER  PROCEDURE [dbo].[contract_contractnumber_check]
	 @ContractId INT
AS
BEGIN 
	SET NOCOUNT ON;
	SELECT 
		ContractNumber 
	FROM [Contract] 
	WHERE 
		Id = @ContractId
END 