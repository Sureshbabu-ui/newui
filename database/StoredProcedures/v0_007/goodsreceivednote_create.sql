CREATE OR ALTER   PROCEDURE [dbo].[goodsreceivednote_create]
    @TransactionTypeCode VARCHAR(8),
    @TransactionId INT,
    @ReferenceNumber VARCHAR(32) = NULL,
	@ReferenceDate DATE = NULL,
    @SourceLocationId INT,
    @SourceEngineerId INT,
	@SourceVendorId INT,
    @CreatedBy INT,
    @Remarks VARCHAR(1024),
    @GoodsReceivedNoteId INT OUTPUT
AS
BEGIN 
    SET NOCOUNT ON;
	BEGIN TRANSACTION
	DECLARE @TransactionTypeId INT;
	DECLARE @CurrentDate DATETIME = GETUTCDATE();
    DECLARE @Year INT = YEAR(@CurrentDate);
    DECLARE @Month INT = MONTH(@CurrentDate);
    DECLARE @AppValue VARCHAR(1024);
	DECLARE @TenantOfficeId INT;
	DECLARE @FyStartMonth INT;

	SELECT @FyStartMonth = CONVERT(INT, AppValue) FROM AppSetting WHERE AppKey = 'FyStartMonth';
	IF @Month < @FyStartMonth
    SET @Year = @Year - 1
    SET @Year = @Year % 100
	SET @Year = CONVERT(NVARCHAR(2), @Year)+ CONVERT(NVARCHAR(2),@Year + 1)

	SELECT @TenantOfficeId = TenantOfficeId FROM UserInfo  WHERE Id = @CreatedBy
	SELECT @TransactionTypeId = Id FROM GrnTransactionType WHERE TransactionTypeCode = @TransactionTypeCode

	DECLARE @GRNNumber VARCHAR(19)
	EXEC dbo.documentnumberformat_get_nextnumber
			@DocumentTypeCode = 'DCT_GRN',
			@Year = @Year,
			@TenantOfficeId = @TenantOfficeId,
			@DocumentNumber = @GRNNumber OUTPUT

    INSERT INTO GoodsReceivedNote(
		GrnNumber,
        GrnDate,
        TransactionId,
        TransactionTypeId,
        ReferenceNumber,
		ReferenceDate,
		ReceivedLocationId,
        ReceivedById,
		SourceVendorId,
		SourceLocationId,
		SourceEngineerId,
		CreatedBy,
		CreatedOn
        ) 
	VALUES (
	    @GRNNumber,
        GETUTCDATE(),
        @TransactionId,
		@TransactionTypeId,
		@ReferenceNumber,
		@ReferenceDate,
        @TenantOfficeId,
		@CreatedBy,
        @SourceVendorId,
		@SourceLocationId,
		@SourceEngineerId,
		@CreatedBy,
		GETUTCDATE()
		)

	SET @GoodsReceivedNoteId = SCOPE_IDENTITY();

	COMMIT TRANSACTION
END
