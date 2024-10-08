CREATE OR ALTER PROCEDURE [dbo].[contract_get_period]
    @ContractId INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT   
        StartDate,
	    EndDate
    FROM [Contract] 
    WHERE 
        Id = @ContractId
END