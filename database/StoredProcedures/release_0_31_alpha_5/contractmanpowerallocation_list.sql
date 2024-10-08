CREATE OR ALTER PROCEDURE [dbo].[contractmanpowerallocation_list]
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
        CMA.Id,
        CMA.ContractId,
        CustomerSite.SiteName AS CustomerSite,
        ManpowerAllocationStatus.[Name] AS AllocationStatus,
        UserInfo.FullName AS EmployeeName,
        CMA.StartDate,
        CMA.EndDate,
        CMA.CustomerAgreedAmount,
        CMA.BudgetedAmount,
        CMA.MarginAmount,
        CMA.Remarks
    FROM ContractManpowerAllocation CMA
    LEFT JOIN MasterEntityData ManpowerAllocationStatus ON ManpowerAllocationStatus.Id = CMA.AllocationStatusId 
    LEFT JOIN CustomerSite ON CustomerSite.Id = CMA.CustomerSiteId
    LEFT JOIN CustomerInfo ON CMA.CustomerSiteId = CustomerInfo.CustomerId 
    LEFT JOIN UserInfo ON CMA.EmployeeId = UserInfo.Id 
    WHERE
        CMA.ContractId = @ContractId AND
        (@Search IS NULL OR
        CustomerSite.SiteName LIKE '%' + @Search + '%' OR
        UserInfo.FullName LIKE '%' + @Search + '%')
    ORDER BY
        CMA.Id DESC
    OFFSET (@Page - 1) * @PerPage ROWS FETCH NEXT @PerPage ROWS ONLY;
END
