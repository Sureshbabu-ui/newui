CREATE OR ALTER   PROCEDURE [dbo].[contractmanpowerallocation_details]
	@AllocationId	INT
AS
BEGIN
	SELECT
		Id,
		ContractId,
		CustomerSiteId,
		AllocationStatusId,
		CustomerAgreedAmount,
		BudgetedAmount,
		EmployeeId,
		StartDate,
		EndDate,
		CustomerAgreedAmount,
		Remarks
	FROM ContractManpowerAllocation 
	WHERE
		Id = @AllocationId	
END