CREATE OR ALTER PROCEDURE [dbo].[customers_name_list]
AS
BEGIN
    SET NOCOUNT ON;
    SELECT
      C.Id,
      CI.[Name],
	  CI.BilledToAddress,
	  C.CustomerCode
    FROM Customer C
	LEFT JOIN CustomerInfo CI ON CI.CustomerId = C.Id 
	WHERE CI.EffectiveTo IS NULL        
END