CREATE OR ALTER PROCEDURE [dbo].[contractmanpower_summary_count]
    @ContractId INT,
    @Search VARCHAR(50) = NULL,
    @TotalRows INT OUTPUT
AS 
BEGIN 
    SET NOCOUNT ON;
    SELECT 
        @TotalRows = COUNT(CMS.Id) 
    FROM ContractManPower CMS
    LEFT JOIN CustomerSite ON CustomerSite.Id = CMS.CustomerSiteId
    LEFT JOIN TenantOfficeInfo ON CMS.TenantOfficeInfoId = TenantOfficeInfo.TenantOfficeId
    LEFT JOIN TenantOffice ON TenantOffice.Id = CMS.TenantOfficeInfoId    
    WHERE 
        CMS.ContractId = @ContractId AND
        (@Search IS NULL OR 
        CustomerSite.SiteName LIKE '%' + @Search + '%' OR 
        TenantOffice.OfficeName LIKE '%' + @Search + '%');
END
