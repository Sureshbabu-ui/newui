CREATE OR ALTER PROCEDURE [dbo].[contractmanpower_summary_create]
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
	@CreatedBy INT,
	@IsManpowerSummaryCreated INT OUTPUT
AS
BEGIN 
    SET NOCOUNT ON;
	DECLARE @LastInsertedId NVARCHAR(10);

	DECLARE @BudgetedAmount DECIMAL(16,2);
	SET @BudgetedAmount = @EngineerMonthlyCost * @EngineerCount * @DurationInMonth;

	DECLARE @MarginAmount DECIMAL(16,2);
	SET @MarginAmount = @CustomerAgreedAmount - @BudgetedAmount;

    INSERT INTO ContractManPower
    	(ContractId,
    	CustomerSiteId,
		TenantOfficeInfoId,
		EngineerTypeId,
		EngineerLevelId,
		EngineerMonthlyCost,
		EngineerCount,
		DurationInMonth,
		CustomerAgreedAmount,
		BudgetedAmount,
		MarginAmount,
		Remarks,
    	CreatedBy,
    	CreatedOn)
    VALUES
    	(@ContractId,
    	@CustomerSiteId,
    	@TenantOfficeInfoId,
		@EngineerTypeId,
		@EngineerLevelId,
		@EngineerMonthlyCost,
		@EngineerCount,
		@DurationInMonth,
		@CustomerAgreedAmount,
		@BudgetedAmount,
		@MarginAmount,
		@Remarks,
    	@CreatedBy,
    	GETUTCDATE())

    SET @LastInsertedId = 'SELECT SCOPE_IDENTITY()'
    IF (@LastInsertedId IS NOT NULL)
        SET @IsManpowerSummaryCreated = 1
    ELSE
        SET @IsManpowerSummaryCreated = 0
END 
