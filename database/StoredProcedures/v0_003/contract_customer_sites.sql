CREATE OR ALTER PROCEDURE [dbo].[contract_customer_sites]
    @ContractId INT
AS
BEGIN 
    SET NOCOUNT ON;
    SELECT
        CS.Id,
        CS.SiteName,
		CS.[Address]
    FROM CustomerSite CS
    JOIN ContractCustomerSite CCS ON CS.Id = CCS.CustomerSiteId
    WHERE
        CCS.ContractId = @ContractId AND
        CS.Id = CCS.CustomerSiteId
    ORDER BY CS.Id DESC
END