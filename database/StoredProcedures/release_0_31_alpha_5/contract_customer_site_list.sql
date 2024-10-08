CREATE OR ALTER PROCEDURE [dbo].[contract_customer_site_list]
    @ContractId INT,
    @Page INT = 1,
    @PerPage INT = 10,
    @Search VARCHAR(50) = NULL
AS
BEGIN 
    SET NOCOUNT ON;
    
    IF @Page < 1
        SET @Page = 1;

    SELECT
        CCS.Id,
        CS.SiteName,
        CS.[Address],
        CS.PrimaryContactName,
        CS.PrimaryContactPhone,
        CS.IsActive
    FROM CustomerSite CS
    JOIN ContractCustomerSite CCS ON CS.Id = CCS.CustomerSiteId AND 
        CCS.IsDeleted = 0
    WHERE
        CCS.ContractId = @ContractId AND
        CS.Id = CCS.CustomerSiteId AND
        (@Search IS NULL OR 
        CS.SiteName LIKE '%' + @Search + '%')
    ORDER BY CS.Id DESC
    OFFSET (@Page-1) * @PerPage ROWS
    FETCH NEXT @PerPage ROWS ONLY
END
