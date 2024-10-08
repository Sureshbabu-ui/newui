CREATE OR ALTER PROCEDURE [dbo].[contractmanpowerallocation_update]
	@Id INT,
	@ContractId INT,
	@CustomerSiteId INT,
	@EmployeeId INT,
	@CustomerAgreedAmount DECIMAL(16,2),
	@BudgetedAmount DECIMAL(16,2),
	@AllocationStatusId INT,
	@StartDate DATE,
	@EndDate DATE,
	@Remarks VARCHAR(128),
	@ModifiedBy INT
AS 
BEGIN 
	SET NOCOUNT ON;
	DECLARE @MarginAmount DECIMAL(16,2);
	SET @MarginAmount = @CustomerAgreedAmount - @BudgetedAmount;
	UPDATE ContractManpowerAllocation
	SET
		ContractId = @ContractId,
		CustomerSiteId = @CustomerSiteId,
		EmployeeId  = @EmployeeId,
		StartDate=@StartDate,
		EndDate=@EndDate,
		AllocationStatusId=@AllocationStatusId,
		CustomerAgreedAmount=@CustomerAgreedAmount,
		BudgetedAmount=@BudgetedAmount,
		MarginAmount=@MarginAmount,
		Remarks=@Remarks,
		ModifiedBy = @ModifiedBy,
		ModifiedOn = GETDATE()
	WHERE 
       	Id = @Id   
END 
