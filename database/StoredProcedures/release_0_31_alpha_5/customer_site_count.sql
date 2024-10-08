CREATE OR ALTER PROCEDURE [dbo].[customer_site_count]
    @CustomerId INT,
    @Search VARCHAR(50) = NULL,
    @TotalRows INT OUTPUT
AS
BEGIN 
    SET NOCOUNT ON;
    SELECT 
        @TotalRows = COUNT(CustomerSite.Id)
    FROM CustomerSite
    WHERE
        CustomerSite.IsDeleted = 0 AND
        CustomerSite.CustomerId = @CustomerId AND
        (@Search IS NULL OR 
        CustomerSite.SiteName LIKE '%' + @Search + '%');
END
