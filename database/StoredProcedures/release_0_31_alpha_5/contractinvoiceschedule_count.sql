CREATE OR ALTER PROCEDURE [dbo].[contractinvoiceschedule_count]
    @ContractId INT,
    @TotalRows INT OUTPUT
AS 
BEGIN 
    SET NOCOUNT ON;
    SELECT 
        @TotalRows = COUNT(Id)
    FROM ContractInvoiceSchedule 
    WHERE  
        ContractId = @ContractId
END 

