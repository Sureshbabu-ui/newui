CREATE OR ALTER PROCEDURE [dbo].[contractmanpower_summary_update]
	@Id INT,
	@ContractId INT,
	@CustomerSiteId INT,
	@TenantOfficeInfoId INT,
	@EngineerTypeId INT,
	@EngineerLevelId INT,
	@EngineerMonthlyCost DECIMAL(16,2),
	@EngineerCount DECIMAL(8,2),
	@DurationInMonth DECIMAL(8,2),
	@CustomerAgreedAmount DECIMAL(16,2),
	@Remarks VARCHAR(128),
	@ModifiedBy INT
AS 
BEGIN 
	SET NOCOUNT ON;
    DECLARE @BudgetedAmount DECIMAL(16,2);
	SET @BudgetedAmount = @EngineerMonthlyCost * @EngineerCount * @DurationInMonth;

	DECLARE @MarginAmount DECIMAL(16,2);
	SET @MarginAmount = @CustomerAgreedAmount - @BudgetedAmount;
	UPDATE ContractManPower
	SET
		ContractId = @ContractId,
		CustomerSiteId = @CustomerSiteId,
		TenantOfficeInfoId  = @TenantOfficeInfoId,
		EngineerTypeId=@EngineerTypeId,
		EngineerLevelId=@EngineerLevelId,
		EngineerMonthlyCost=@EngineerMonthlyCost,
		EngineerCount=@EngineerCount,
		DurationInMonth=@DurationInMonth,
		CustomerAgreedAmount=@CustomerAgreedAmount,
		BudgetedAmount=@BudgetedAmount,
		MarginAmount=@MarginAmount,
		Remarks=@Remarks,
		ModifiedBy = @ModifiedBy,
		ModifiedOn = GETDATE()
	WHERE 
       	Id = @Id   
END 