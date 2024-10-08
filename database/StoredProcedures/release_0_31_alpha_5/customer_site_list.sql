CREATE OR ALTER PROCEDURE [dbo].[customer_site_list]
    @CustomerId INT = NULL,
    @ContractId INT = NULL,
    @Page INT = 1,
    @PerPage INT = 10,
    @Search VARCHAR(50) = NULL
AS 
BEGIN 
    SET NOCOUNT ON;
    IF @Page < 1
        SET @Page = 1;

    SELECT 
        CustomerSite.Id,
        CustomerSite.SiteName,
        CustomerSite.[Address],
        CustomerSite.PrimaryContactName,
        CustomerSite.PrimaryContactPhone,
        CustomerSite.PrimaryContactEmail,
        CustomerSite.IsActive
    FROM CustomerSite
    WHERE
        (@CustomerId IS NULL OR 
        CustomerSite.CustomerId = @CustomerId) AND
        (@Search IS NULL OR 
        CustomerSite.SiteName LIKE '%' + @Search + '%') AND
        CustomerSite.IsDeleted = 0
    ORDER BY 
        CustomerSite.Id DESC 
    OFFSET 
        (@Page - 1) * @PerPage ROWS FETCH NEXT @PerPage ROWS ONLY;
END
