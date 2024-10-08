CREATE OR ALTER PROCEDURE [dbo].[contract_preamc_inspection_schedule]
	@CreatedBy INT,
	@ContractId INT,
	@CustomerSiteId INT,
	@StartsOn DATETIME,
	@EndsOn DATETIME,
	@IsPreAmcScheduled INT OUTPUT
AS
BEGIN 
	SET NOCOUNT ON;
	DECLARE @CurrentDate DATETIME = GETUTCDATE()
	DECLARE @LastInsertedId NVARCHAR(10);
	DECLARE @Year INT = YEAR(@CurrentDate)
	DECLARE @Month INT = MONTH(@CurrentDate)
	DECLARE @FyStartMonth INT;
	DECLARE @DocumentNumber VARCHAR(32);
	DECLARE @TenantOfficeId INT;

	SELECT 
		@TenantOfficeId = TenantOfficeId 
	FROM 
		ContractCustomerSite CCS
	INNER JOIN CustomerSite CS ON CS.Id = CCS.CustomerSiteId
	WHERE
		CCS.Id = @CustomerSiteId

	SELECT @FyStartMonth = CONVERT(INT, AppValue) FROM AppSetting WHERE AppKey = 'FyStartMonth';

	IF @Month < @FyStartMonth
	SET @Year = @Year - 1
	SET @Year=@Year%100;
	SET @Year = CONVERT(NVARCHAR(2), @Year)+ CONVERT(NVARCHAR(2),@Year + 1)

	EXEC [dbo].[documentnumberformat_get_nextnumber]
	@DocumentTypeCode = 'DCT_PAMC',
	@TenantOfficeId = @TenantOfficeId,
	@Year = @Year,
	@DocumentNumber = @DocumentNumber OUTPUT;

	INSERT INTO PreAmcInspectionSchedule
		(ContractId,
		ScheduleNumber,
		ContractCustomerSiteId,
		StartsOn,
		EndsOn,
		CreatedBy,
		CreatedOn)
	VALUES
		 (@ContractId,
		 @DocumentNumber,
		 @CustomerSiteId,
		 @StartsOn,
		 @EndsOn,
		 @CreatedBy,
		 SYSUTCDATETIME())

	 SET @LastInsertedId = 'SELECT SCOPE_IDENTITY()'
 IF (@LastInsertedId IS NOT NULL)
	 SET @IsPreAmcScheduled = 1
 ELSE
	 SET @IsPreAmcScheduled = 0
END 