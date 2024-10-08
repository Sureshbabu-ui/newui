CREATE OR ALTER  PROCEDURE [dbo].[contract_getidbycontractnumber]
	 @ContractNumber VARCHAR(32)
AS
BEGIN 
	SET NOCOUNT ON;
	SELECT 
		Id 
	FROM [Contract] 
	WHERE 
		ContractNumber = @ContractNumber
END 