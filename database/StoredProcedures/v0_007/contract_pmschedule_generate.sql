CREATE OR ALTER  PROCEDURE [dbo].[contract_pmschedule_generate]
	@StartDate DATE,
	@EndDate DATE,
	@PmFrequency INT,
	@ContractId INT,
	@TenantOfficeId INT
AS
BEGIN 
	SET NOCOUNT ON;
		DECLARE @PmFrequencyCode VARCHAR(8);
	 	DECLARE @PmIntervalMonths INT 
		DECLARE @TotalMonths INT;
		DECLARE @IntervalCount INT;
		DECLARE @PeriodFrom DATE = @StartDate
		DECLARE @PeriodTo DATE
		DECLARE @CurrentDate DATETIME = GETUTCDATE()
		DECLARE @Year INT = YEAR(@CurrentDate)
		DECLARE @Month INT = MONTH(@CurrentDate)
		DECLARE @FyStartMonth INT;
		DECLARE @DocumentNumber VARCHAR(32);

		SELECT @FyStartMonth = CONVERT(INT, AppValue) FROM AppSetting WHERE AppKey = 'FyStartMonth';

		IF @Month < @FyStartMonth
		SET @Year = @Year - 1
		SET @Year=@Year%100;
		SET @Year = CONVERT(NVARCHAR(2), @Year)+ CONVERT(NVARCHAR(2),@Year + 1)

		SELECT @PmFrequencyCode = Code FROM MasterEntityData WHERE Id = @PmFrequency

		SET @PmIntervalMonths = CASE 
							 WHEN @PmFrequencyCode = 'PMF_OIYR' THEN 12
							 WHEN @PmFrequencyCode = 'PMF_FTYR' THEN 3
							 WHEN @PmFrequencyCode = 'PMF_TTYR' THEN 6
							 ELSE 0
						   END

		SET @TotalMonths = DATEDIFF(MONTH, @StartDate, @EndDate);

		SET @IntervalCount = @TotalMonths /@PmIntervalMonths;

		WHILE @IntervalCount > 0
		BEGIN
			EXEC [dbo].[documentnumberformat_get_nextnumber]
			@DocumentTypeCode = 'DCT_PMSN',
			@TenantOfficeId = @TenantOfficeId,
			@Year = @Year,
			@DocumentNumber = @DocumentNumber OUTPUT;

			SET @PeriodTo = DATEADD(DAY, -1, DATEADD(MONTH, @PmIntervalMonths, @PeriodFrom));

				INSERT INTO ContractPmSchedule(
					ContractId,
					PmScheduleNumber,
					PmDueDate,
					PeriodFrom,
					PeriodTo,
					CreatedOn
				)
				VALUES (
					@ContractId,
					@DocumentNumber,
					@PeriodFrom,
					@PeriodFrom,
					@PeriodTo,
					GETUTCDATE()
				);

				SET @PeriodFrom = DATEADD(MONTH, @PmIntervalMonths, @PeriodFrom)

			SET @IntervalCount = @IntervalCount - 1;
		END 
END