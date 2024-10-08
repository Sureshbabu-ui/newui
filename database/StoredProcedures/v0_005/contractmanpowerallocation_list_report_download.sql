CREATE OR ALTER PROCEDURE [dbo].[contractmanpowerallocation_list_report_download]
	@TimeZone VARCHAR(64),
	@ContractId INT
AS
BEGIN
    SET NOCOUNT ON;
	DECLARE @DateFormat VARCHAR(16) = 'dd-MM-yyyy';

	SELECT 
		CS.SiteName,
		UI.FullName AS Employee,
		Format(CMA.StartDate,@DateFormat) StartDate,
		Format(CMA.EndDate,@DateFormat) EndDate,
		C.ContractNumber,
		CMA.CustomerAgreedAmount,
		CMA.BudgetedAmount,
		CMA.MarginAmount,
		MAS.[Name] AS AlloctionStatus
    FROM ContractManpowerAllocation CMA
		LEFT JOIN [Contract] C ON C.Id = CMA.ContractId
		LEFT JOIN CustomerSite CS ON CS.Id = CMA.CustomerSiteId
		LEFT JOIN UserInfo UI ON UI.Id = CMA.EmployeeId
		LEFT JOIN MasterEntityData MAS ON MAS.Id = CMA.AllocationStatusId
	WHERE (@ContractId IS NULL OR CMA.ContractId = @ContractId) AND CMA.IsDeleted = 0
	ORDER BY CMA.CreatedOn DESC
END