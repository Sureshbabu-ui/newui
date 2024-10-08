CREATE OR ALTER        PROCEDURE [dbo].[contract_getoldcontractnumber] 
    @ContractId INT,
	@OldContractNumber VARCHAR(32) OUTPUT
AS
BEGIN 
    SET NOCOUNT ON;
	DECLARE @OldContractId INT = (SELECT OldContractId FROM Contract WHERE Id = @ContractId)
    
	SELECT
		@OldContractNumber = ContractNumber 
	FROM Contract 
	WHERE Id = @OldContractId
END 

