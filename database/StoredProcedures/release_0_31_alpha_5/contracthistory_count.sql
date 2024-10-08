CREATE OR ALTER PROCEDURE [dbo].[contracthistory_count]
	@ContractId INT,
    @TotalRows INT OUTPUT
AS 
BEGIN 
	SET NOCOUNT ON;
	SELECT	
		@TotalRows=COUNT(Id) 	
	FROM ContractHistory 
	WHERE 
		ContractId = @ContractId
END 