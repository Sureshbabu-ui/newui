CREATE OR ALTER PROCEDURE [dbo].[contract_customer_site_count]
    @ContractId INT,
    @Search VARCHAR(50) = NULL,
    @TotalRows INT OUTPUT
AS
BEGIN 
    SET NOCOUNT ON;
    SELECT
        @TotalRows = COUNT(CCS.Id)
    FROM ContractCustomerSite CCS
    LEFT JOIN CustomerSite ON CustomerSite.Id = CCS.CustomerSiteId AND 
              CCS.IsDeleted = 0
WHERE
    CCS.ContractId = @ContractId AND
    (@Search IS NULL OR CustomerSite.SiteName LIKE '%' + @Search + '%')
END 
