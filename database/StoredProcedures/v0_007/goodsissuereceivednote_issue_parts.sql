CREATE OR ALTER   PROCEDURE [dbo].[goodsissuereceivednote_issue_parts] 
    @PartIndentDemandId INT,
	@DeliveryChallanId INT = NULL, 
    @Remarks VARCHAR(128),
    @ModifiedBy INT
AS 
BEGIN
    SET NOCOUNT ON;

	DECLARE @CurrentDate DATETIME = GETUTCDATE();
    DECLARE @Year INT = YEAR(@CurrentDate);
    DECLARE @Month INT = MONTH(@CurrentDate);
    DECLARE @AppValue VARCHAR(1024);
	DECLARE @FyStartMonth INT;

	SELECT @FyStartMonth = CONVERT(INT, AppValue) FROM AppSetting WHERE AppKey = 'FyStartMonth';

	IF @Month < @FyStartMonth
    SET @Year = @Year - 1
    SET @Year = @Year % 100
	SET @Year = CONVERT(NVARCHAR(2), @Year)+ CONVERT(NVARCHAR(2),@Year + 1)

	DECLARE @TenantOfficeId INT = (SELECT TenantOfficeId FROM PartIndentDemand WHERE Id = @PartIndentDemandId);

	DECLARE @GINNumber VARCHAR(19)
	EXEC dbo.documentnumberformat_get_nextnumber
			@DocumentTypeCode = 'DCT_GIN',
			@Year = @Year,
			@TenantOfficeId = @TenantOfficeId,
			@DocumentNumber = @GINNumber OUTPUT

	-- Update GoodsIssuedReceivedNote table
	UPDATE GoodsIssuedReceivedNote 
	SET GinDate = GETUTCDATE(),
	GinNumber =  @GINNumber,
	DeliveryChallanId = @DeliveryChallanId,
	Remarks = @Remarks,
	ModifiedBy = @ModifiedBy,
	ModifiedOn = GETUTCDATE()
	WHERE PartIndentDemandId = @PartIndentDemandId
END


