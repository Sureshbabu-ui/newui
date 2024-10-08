CREATE OR ALTER   PROCEDURE [dbo].[contract_invoice_schedule_generate]
	@ContractId INT,
	@CreatedBy INT
AS
BEGIN
    SET NOCOUNT ON;
	DECLARE @PaymentModeAdvanced INT 
	DECLARE @TotalScheduleNumber INT;
	DECLARE @ContractValue DECIMAL(16, 2);
	DECLARE @StartDate Date;
	DECLARE @EndDate Date;
	DECLARE @ContractEndDate Date;
	DECLARE @ContractStartDate Date;
	DECLARE @RrPerDay DECIMAL(16, 2);
	DECLARE @TotalRrValue DECIMAL(16, 2);
	DECLARE @ScheduledInvoiceDate Date;
	DECLARE @ScheduledInvoiceAmount DECIMAL(16, 2);
	DECLARE @CurrentScheduleNumber INT = 1;
	DECLARE @PaymentFrequency INT;
	DECLARE @PaymentMode INT;
	DECLARE @MonthsDifference INT

	-- Payment Mode Id

	 SELECT @PaymentModeAdvanced = Id FROM MasterEntityData WHERE Code ='PMD_ADVN'

	--Getting Start Date, End Date, Contract Value , Payment Frequency

	SELECT 
		@StartDate = StartDate,
		@EndDate = EndDate,
		@ContractEndDate = EndDate,
		@ContractStartDate = StartDate,
		@ContractValue = ContractValue,
		@PaymentFrequency =PaymentFrequency.CalendarMonths,
		@PaymentMode =PaymentModeId
	FROM 
		[Contract]
		LEFT JOIN PaymentFrequency ON PaymentFrequency.Id = [Contract].PaymentFrequencyId
	WHERE 
		[Contract].Id = @ContractId

	--Month Difference Calculation
	
	SET @MonthsDifference = DATEDIFF(MONTH, @StartDate, @EndDate)
	IF DATEPART(DAY, @EndDate) > DATEPART(DAY, DATEADD(DAY, -1, @StartDate))
	SET @MonthsDifference = @MonthsDifference + 1

	--Total Schedules

	SET @TotalScheduleNumber = CEILING(CONVERT(DECIMAL(16, 2), @MonthsDifference)/CONVERT(DECIMAL(16, 2),@PaymentFrequency))

	--RrPer Day Calculation 
	
	SET @RrPerDay = ROUND(@ContractValue / (DATEDIFF(DAY, @StartDate, @EndDate)+1),0);

	--Scheduled Invoice Amount Calculation

	SET @ScheduledInvoiceAmount = (ROUND((@ContractValue/ @TotalScheduleNumber),0))

	--While loop insertion based on schedule number

    WHILE @CurrentScheduleNumber <= @TotalScheduleNumber
    BEGIN	
		-- Final Insertion OR NOT Condition
		IF(@CurrentScheduleNumber = @TotalScheduleNumber)
		BEGIN
			SET	@TotalRrValue = (@ContractValue - (@RrPerDay * (DATEDIFF(DAY, @ContractStartDate, @EndDate) + 1)))
			SET @EndDate = @ContractEndDate
			SET @ScheduledInvoiceAmount = (@ContractValue - (@ScheduledInvoiceAmount*(@TotalScheduleNumber-1)))
			SET @ScheduledInvoiceDate = CASE WHEN @PaymentMode = @PaymentModeAdvanced THEN @StartDate ELSE DATEADD(DAY, 1, @ContractEndDate) END 
		END
		ELSE
		BEGIN
			SET @EndDate = DATEADD(DAY, -1,DATEADD(MONTH, @PaymentFrequency, @StartDate))
			SET @ScheduledInvoiceDate = CASE WHEN @PaymentMode = @PaymentModeAdvanced THEN @StartDate ELSE DATEADD(MONTH, @PaymentFrequency, @StartDate) END 
			SET	@TotalRrValue = ROUND(@RrPerDay * (DATEDIFF(DAY, @StartDate, @EndDate) + 1),0)
		END		
			-- Contract Invoice Schedule Details Insertion

			INSERT INTO ContractInvoiceSchedule 
				(ContractId,
				ScheduleNumber,
				StartDate,
				EndDate,
				RrPerDay,
				TotalRrValue,
				ScheduledInvoiceDate,
				ScheduledInvoiceAmount,
				CreatedBy,
				CreatedOn)
			VALUES 
				(@ContractId,
			    @CurrentScheduleNumber,
				@StartDate,
				@EndDate,
				@RrPerDay,
				@TotalRrValue,
				@ScheduledInvoiceDate,
				@ScheduledInvoiceAmount,
				@CreatedBy,
				GETUTCDATE())
			SET @CurrentScheduleNumber = @CurrentScheduleNumber + 1;

			SET @StartDate = DATEADD(MONTH , @PaymentFrequency , @StartDate);
    END
END;