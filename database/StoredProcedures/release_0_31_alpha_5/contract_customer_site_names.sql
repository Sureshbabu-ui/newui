CREATE OR ALTER PROCEDURE [dbo].[contract_customer_site_names]
 @ContractId INT
AS
BEGIN 
SET NOCOUNT ON;
	SELECT 
		CustomerSiteId
	FROM 
		ContractCustomerSite
	WHERE
		ContractId=@ContractId AND
		IsDeleted = 0
END