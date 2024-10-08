CREATE OR ALTER PROCEDURE [dbo].[contract_assets_get_customer_site_id]
	 @ContractId INT
 AS
 BEGIN 
	SET NOCOUNT ON;
	SELECT 
		CS.Id,
		CS.SiteName,
		CS.TenantOfficeId
	FROM CustomerSite CS
	LEFT JOIN ContractCustomerSite CCS ON CustomerSiteId = CS.Id
	WHERE
		CCS.ContractId=@ContractId
END