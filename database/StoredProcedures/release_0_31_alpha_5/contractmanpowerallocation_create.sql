CREATE OR ALTER   PROCEDURE [dbo].[contractmanpowerallocation_create]
	@ContractId INT,
	@CustomerSiteId INT,
	@EmployeeId INT,
	@CustomerAgreedAmount DECIMAL(16,2),
	@BudgetedAmount DECIMAL(16,2),
	@StartDate DATE,
	@EndDate DATE,
	@Remarks VARCHAR(128),
	@CreatedBy INT,
	@IsManpowerAllocated INT OUTPUT
AS
BEGIN 
    SET NOCOUNT ON;
	DECLARE @LastInsertedId NVARCHAR(10);
	DECLARE @MarginAmount DECIMAL(16,2);
	DECLARE @ManpowerAllocationStatusId INT;
    SELECT @ManpowerAllocationStatusId = Id FROM MasterEntityData WHERE Code = 'MPR_ACTV'
	SET @MarginAmount = @CustomerAgreedAmount - @BudgetedAmount;

    INSERT INTO  ContractManpowerAllocation
              (ContractId,
              CustomerSiteId,
			  EmployeeId,
			  CustomerAgreedAmount,
			  BudgetedAmount,
			  StartDate,
			  EndDate,
			  MarginAmount,
			  AllocationStatusId,
			  Remarks,
              CreatedBy,
              CreatedOn,
			  IsDeleted)
    VALUES
            (@ContractId,
            @CustomerSiteId,
            @EmployeeId,
			@CustomerAgreedAmount,
			@BudgetedAmount,
			@StartDate,
			@EndDate,
			@MarginAmount,
			@ManpowerAllocationStatusId,
			@Remarks,
            @CreatedBy,
            GETUTCDATE(),
			0)
    SET @LastInsertedId = 'SELECT SCOPE_IDENTITY()'
    IF (@LastInsertedId IS NOT NULL)
        SET @IsManpowerAllocated = 1
    ELSE
        SET @IsManpowerAllocated = 0
END