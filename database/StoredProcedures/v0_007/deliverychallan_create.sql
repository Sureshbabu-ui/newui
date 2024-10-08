CREATE OR ALTER   PROCEDURE [dbo].[deliverychallan_create] 
	@PartStockData NVARCHAR(MAX),
    @DcTypeId INT,
    @DestinationTenantOfficeId INT = NULL,
	@DestinationCustomerSiteId INT = NULL,
    @DestinationEmployeeId INT = NULL,
    @DestinationVendorId INT = NULL,
    @LogisticsVendorId INT = NULL,
    @LogisticsReceiptNumber VARCHAR(16) = NULL,
    @LogisticsReceiptDate DATE = NULL,
    @ModeOfTransport INT = NULL,
    @TrackingId VARCHAR(16) = NULL,
	@PartIndentDemandNumber VARCHAR(16) = NULL,
	@CreatedBy INT,
	@DeliveryChallanId INT OUTPUT
AS 
BEGIN
    SET NOCOUNT ON;
	SET XACT_ABORT ON; 

	DECLARE @CurrentDate DATETIME = GETUTCDATE();
    DECLARE @Year INT = YEAR(@CurrentDate);
    DECLARE @Month INT = MONTH(@CurrentDate);
    DECLARE @AppValue VARCHAR(1024);
	DECLARE @FyStartMonth INT;
	DECLARE @TenantOfficeId INT;
	DECLARE @StockRoomId INT;
	
	SET @StockRoomId = (SELECT Id FROM StockRoom WHERE RoomCode = 'S015');

	SELECT @TenantOfficeId = TenantOfficeId FROM UserInfo WHERE Id = @CreatedBy;
	SELECT @FyStartMonth = CONVERT(INT, AppValue) FROM AppSetting WHERE AppKey = 'FyStartMonth';

	IF @Month < @FyStartMonth
    SET @Year = @Year - 1
    SET @Year = @Year % 100
	SET @Year = CONVERT(NVARCHAR(2), @Year)+ CONVERT(NVARCHAR(2),@Year + 1)

    BEGIN TRANSACTION;

	DECLARE @DCNumber VARCHAR(17)
	EXEC dbo.documentnumberformat_get_nextnumber
			@DocumentTypeCode = 'DCT_DC', 
			@TenantOfficeId = @TenantOfficeId,
			@Year = @Year,
			@DocumentNumber = @DCNumber OUTPUT

    INSERT INTO DeliveryChallan(
		    DcNumber,
			DcDate,
			DcTypeId,
			SourceTenantOfficeId,
			DestinationTenantOfficeId,
			DestinationEmployeeId,
			DestinationVendorId,
			DestinationCustomerSiteId,
			IssuedEmployeeId,
			LogisticsVendorId,
			LogisticsReceiptNumber,
			LogisticsReceiptDate,
			ModeOfTransport,
			TrackingId,
			CreatedBy,
			CreatedOn
        )
	VALUES(
		@DCNumber,
		GETUTCDATE(),
		@DcTypeId,
        @TenantOfficeId,
		@DestinationTenantOfficeId,
		@DestinationEmployeeId,
		@DestinationVendorId,
		@DestinationCustomerSiteId,
		@CreatedBy,
		@LogisticsVendorId,
		@LogisticsReceiptNumber,
		@LogisticsReceiptDate,
		@ModeOfTransport,
		@TrackingId,
		@CreatedBy,
        GETUTCDATE()
	)
    
	DECLARE @DCId INT = SCOPE_IDENTITY();

    INSERT INTO DeliveryChallanDetail 
	(
		DeliveryChallanId,
		PartIndentDemandNumber,
		PartStockId
	)
	SELECT
		@DCId,
		@PartIndentDemandNumber,
		StockList.VALUE AS PartStockId
	FROM OPENJSON(@PartStockData) AS StockList;
	
	UPDATE PartStock 
	SET StockRoomId = @StockRoomId
	FROM OPENJSON(@PartStockData) WITH (Id INT '$') AS StockList
	WHERE PartStock.Id = StockList.Id;

    COMMIT TRANSACTION;
	
	SET @DeliveryChallanId = @DCId;
END
