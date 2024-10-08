CREATE OR ALTER PROCEDURE [dbo].[contract_customers_list]
AS
BEGIN
    SET NOCOUNT ON;
    SELECT
      CI.Id,
      CI.[Name],
	  CI.BilledToAddress,
	  C.CustomerCode
    FROM CustomerInfo CI
	LEFT JOIN Customer C ON CI.CustomerId=C.Id
	WHERE 
        CI.EffectiveTo IS NULL
END
