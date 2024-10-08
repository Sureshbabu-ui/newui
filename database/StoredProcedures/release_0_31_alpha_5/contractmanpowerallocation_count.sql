CREATE OR ALTER PROCEDURE [dbo].[contractmanpowerallocation_count]
    @ContractId INT,
    @Search VARCHAR(50) = NULL,
    @TotalRows INT OUTPUT
AS 
BEGIN 
    SET NOCOUNT ON;

    SELECT 
        @TotalRows = COUNT(CMA.Id) 
    FROM ContractManpowerAllocation CMA
    LEFT JOIN UserInfo Employee ON CMA.EmployeeId = Employee.Id
    LEFT JOIN CustomerSite CS ON CMA.CustomerSiteId = CS.Id   
    WHERE  
        CMA.ContractId = @ContractId AND
        (@Search IS NULL OR
        Employee.FullName LIKE '%' + @Search + '%' OR
        CS.SiteName LIKE '%' + @Search + '%');
END
